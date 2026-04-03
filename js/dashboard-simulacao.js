let chartBar;
let chartLine;
let chartPie;

const AREA_MAP = {
  saude: "Saúde",
  educacao: "Educação",
  transporte: "Transporte"
};

const PERIODOS = ["último mês", "2 semanas", "3 meses", "6 meses"];

const filtros = {
  estado: "Tocantins",
  area: "saude",
  periodo: "6 meses"
};

function chartDisponivel() {
  return typeof window.Chart !== "undefined";
}

function areaSelecionadaLabel() {
  return AREA_MAP[filtros.area] || "";
}

function filtrarDados() {
  const contratos = window.CONTRATOS_GOVSCAN || [];
  return contratos.filter((c) => {
    const okEstado = c.estado === filtros.estado;
    const okArea = c.area === areaSelecionadaLabel();
    const okPeriodo = c.periodo === filtros.periodo;
    return okEstado && okArea && okPeriodo;
  });
}

function calcularMetricas(dados) {
  const total = dados.reduce((acc, c) => acc + c.valor, 0);
  const media = dados.length ? total / dados.length : 0;
  const alertas = dados.filter((c) => c.risco === "ALTO" || c.risco === "ATENÇÃO" || c.anomalia || c.suspeita).length;
  return { total, media, qtd: dados.length, alertas };
}

function atualizarCards(m) {
  const cards = document.querySelectorAll(".stat-card");
  if (cards.length < 3) return;

  cards[0].innerHTML = `<div class="stat-value" style="color: #3b82f6;">R$ ${(m.total / 1000000).toFixed(2)} Mi</div><div class="stat-label">Total de Gastos Analisados</div>`;
  cards[1].innerHTML = `<div class="stat-value" style="color: #10b981;">${m.qtd}</div><div class="stat-label">Contratos Processados</div>`;
  cards[2].innerHTML = `<div class="stat-value" style="color: #f97316;">${m.alertas}</div><div class="stat-label">Alertas Gerados</div>`;
}

function atualizarTabela(dados) {
  const tbody = document.querySelector("table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  dados.forEach((c) => {
    const badgeClass =
      c.risco === "ALTO"
        ? "badge-danger"
        : c.risco === "ATENÇÃO"
          ? "badge-warning"
          : c.risco === "BAIXO"
            ? "badge-info"
            : "badge-success";
    const label =
      c.risco === "ALTO"
        ? "Risco Alto"
        : c.risco === "ATENÇÃO"
          ? "Atenção"
          : c.risco === "BAIXO"
            ? "Baixo"
            : "Normal";
    const tr = document.createElement("tr");
    const observacoes = [];
    if (c.anomalia) observacoes.push("Anomalia");
    if (c.suspeita) observacoes.push("Suspeita");
    if (c.alertaFrequencia) observacoes.push("Frequência alta");
    tr.innerHTML = `
      <td><strong>${c.nome}</strong></td>
      <td>${c.empresa}</td>
      <td>R$ ${c.valor.toLocaleString("pt-BR")}</td>
      <td>
        <span class="badge ${badgeClass}">${label}</span>
        ${observacoes.length ? `<small style="display:block; margin-top:4px; color:#6b7280;">${observacoes.join(" • ")}</small>` : ""}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function atualizarGraficos() {
  if (!chartBar || !chartLine || !chartPie) return;

  const base = (window.CONTRATOS_GOVSCAN || []).filter((c) => c.estado === filtros.estado);
  const dadosFiltrados = filtrarDados();

  // Barras: total gasto por área, respeitando estado e período selecionado.
  const areas = Object.keys(AREA_MAP);
  const valoresArea = areas.map((a) => {
    return base
      .filter((c) => c.area === AREA_MAP[a] && c.periodo === filtros.periodo)
      .reduce((acc, c) => acc + c.valor, 0);
  });

  chartBar.data.labels = areas.map((a) => AREA_MAP[a]);
  chartBar.data.datasets[0].data = valoresArea;
  chartBar.update();

  // Linha: evolução de gastos por período para a área selecionada.
  const seriePorPeriodo = PERIODOS.map((periodo) => {
    return base
      .filter((c) => c.area === areaSelecionadaLabel() && c.periodo === periodo)
      .reduce((acc, c) => acc + c.valor, 0);
  });

  chartLine.data.labels = PERIODOS;
  chartLine.data.datasets[0].data = seriePorPeriodo;
  chartLine.update();

  // Pizza: distribuicao por risco (dados filtrados)
  const alto = dadosFiltrados.filter((c) => c.risco === "ALTO").length;
  const atencao = dadosFiltrados.filter((c) => c.risco === "ATENÇÃO").length;
  const normal = dadosFiltrados.filter((c) => c.risco === "NORMAL").length;
  const baixo = dadosFiltrados.filter((c) => c.risco === "BAIXO").length;
  chartPie.data.labels = ["Alto", "Atenção", "Normal", "Baixo"];
  chartPie.data.datasets[0].data = [alto, atencao, normal, baixo];
  chartPie.update();
}

function areaLabelPorSelecionada(valor) {
  if (valor === "educacao") return "Educação";
  if (valor === "saude") return "Saúde";
  if (valor === "transporte") return "Transporte";
  return "";
}

function atualizarDashboard() {
  if (window.recalcularClassificacaoContratos) {
    window.recalcularClassificacaoContratos();
  }
  const dados = filtrarDados();
  const metricas = calcularMetricas(dados);
  atualizarCards(metricas);
  atualizarTabela(dados);
  atualizarGraficos();
}

function criarGraficos() {
  if (!chartDisponivel()) {
    console.warn("Chart.js indisponivel. Graficos nao serao renderizados.");
    return;
  }

  const barEl = document.getElementById("barChart");
  const lineEl = document.getElementById("lineChart");
  const pieEl = document.getElementById("pieChart");
  if (!barEl || !lineEl || !pieEl) {
    console.warn("Canvas de graficos nao encontrado no DOM.");
    return;
  }

  chartBar = new Chart(barEl, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Gastos por area",
        data: [],
        backgroundColor: ["#ef4444", "#3b82f6", "#10b981"],
        borderRadius: 8
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  chartLine = new Chart(lineEl, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Evolucao simulada",
        data: [],
        borderColor: "#1e40af",
        backgroundColor: "rgba(30, 64, 175, 0.1)",
        fill: true,
        tension: 0.35,
        pointRadius: 5
      }]
    },
    options: { responsive: true }
  });

  chartPie = new Chart(pieEl, {
    type: "pie",
    data: {
      labels: ["Alto", "Atenção", "Normal", "Baixo"],
      datasets: [{
        data: [],
        backgroundColor: ["#ef4444", "#eab308", "#10b981", "#3b82f6"],
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: { responsive: true }
  });
}

function normalizarStatusUpload(status) {
  if (status === "ALTO") return { classe: "badge-danger", texto: "🔴 ALTO RISCO" };
  if (status === "ATENÇÃO") return { classe: "badge-warning", texto: "🟡 ATENÇÃO" };
  if (status === "BAIXO") return { classe: "badge-info", texto: "🔵 ABAIXO DO PADRÃO" };
  return { classe: "badge-success", texto: "🟢 NORMAL" };
}

function normalizarNumero(valor) {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : 0;
  if (valor === null || valor === undefined) return 0;

  const texto = String(valor)
    .replace(/R\$\s*/gi, "")
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");

  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : 0;
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function encontrarChave(obj, aliases) {
  if (!obj || typeof obj !== "object") return null;
  const keys = Object.keys(obj);
  for (const key of keys) {
    const normalizada = normalizarTexto(key);
    if (aliases.some((a) => normalizada === a || normalizada.includes(a))) {
      return key;
    }
  }
  return null;
}

function extrairValorPorAliases(obj, aliases) {
  const chave = encontrarChave(obj, aliases);
  if (!chave) return undefined;
  return obj[chave];
}

function achatarObjetosDeContratos(payload) {
  const resultados = [];

  function visitar(no) {
    if (!no) return;
    if (Array.isArray(no)) {
      no.forEach(visitar);
      return;
    }
    if (typeof no !== "object") return;

    const valor = extrairValorPorAliases(no, ["valor", "preco", "preco_total", "valor_total", "montante", "total"]);
    const empresa = extrairValorPorAliases(no, ["empresa", "fornecedor", "razao_social", "razao", "contratada"]);
    const categoria = extrairValorPorAliases(no, ["categoria", "area", "setor", "tipo", "infraestrutura"]);
    const media = extrairValorPorAliases(no, ["media", "media_categoria", "media_setor", "media_mercado"]);
    const nome = extrairValorPorAliases(no, ["nome", "descricao", "objeto", "contrato", "titulo"]);
    const data = extrairValorPorAliases(no, ["data", "data_contrato", "dt_assinatura", "assinatura"]);

    const temCampoRelevante = [valor, empresa, categoria, media, nome, data].some((v) => v !== undefined && String(v).trim() !== "");
    if (temCampoRelevante) {
      resultados.push({ valor, empresa, categoria, media, nome, data });
    }

    Object.values(no).forEach((v) => {
      if (v && (Array.isArray(v) || typeof v === "object")) visitar(v);
    });
  }

  visitar(payload);
  return resultados;
}

function sanitizarContratoBase(item, index) {
  const valor = normalizarNumero(item.valor);
  const mediaInformada = normalizarNumero(item.media);
  const empresa = String(item.empresa || item.nome || "Empresa não informada").trim();
  const nome = String(item.nome || item.descricao || `Contrato ${index + 1}`).trim();
  const categoriaArquivo = String(item.categoria || item.area || "").trim();

  return {
    id: index + 1,
    empresa: empresa || "Empresa não informada",
    nome: nome || `Contrato ${index + 1}`,
    valor,
    mediaInformada,
    categoriaArquivo,
    data: item.data || ""
  };
}

function obterTrechoPosSeparador(linha) {
  const idx = linha.search(/[:\-]/);
  if (idx < 0) return "";
  return linha.slice(idx + 1).trim();
}

function extrairMoedaLinha(linha) {
  const match = linha.match(/R\$\s*[\d.]+(?:,[\d]{2})?/i);
  return match ? normalizarNumero(match[0]) : 0;
}

function extrairInformacoesPorPalavrasChave(texto) {
  const linhas = String(texto || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const dados = {
    nome: "",
    valor: 0,
    contratante: "",
    contratada: "",
    empresa: "",
    data: "",
    categoriaArquivo: "",
    mediaInformada: 0,
    observacoes: []
  };

  linhas.forEach((linha) => {
    const n = normalizarTexto(linha);

    if (!dados.nome) {
      if (/(^objeto\b|\bobjeto do presente instrumento\b|\bespecificacao\b|\bdescricao\b|\bdescrição\b)/.test(n)) {
        const trecho = obterTrechoPosSeparador(linha) || linha;
        dados.nome = trecho;
      }
    }

    if (!dados.contratante) {
      if (/(\bcontratante\b|\borgao\b|\bórgao\b|\bsecretaria\b|\bprefeitura\b|\bcamara\b|\bcâmara\b)/.test(n)) {
        dados.contratante = obterTrechoPosSeparador(linha) || linha;
      }
    }

    if (!dados.contratada) {
      if (/(\bcontratada\b|\bcontratado\b|\bfornecedor\b|\bempresa\b)/.test(n)) {
        const trecho = obterTrechoPosSeparador(linha) || linha;
        dados.contratada = trecho;
      }
    }

    if (!dados.data) {
      if (/(\bdata\b|\bassinatura\b|\bvigencia\b|\bvigência\b)/.test(n)) {
        const trecho = obterTrechoPosSeparador(linha);
        if (trecho) dados.data = trecho;
      }
    }

    if (!dados.categoriaArquivo) {
      if (/(\beducacao\b|\beducação\b|\bescola\b|\bescolar\b)/.test(n)) dados.categoriaArquivo = "Educação";
      else if (/(\bsaude\b|\bsaúde\b|\bhospital\b|\bupa\b)/.test(n)) dados.categoriaArquivo = "Saúde";
      else if (/(\btransporte\b|\brodovia\b|\bonibus\b|\bônibus\b|\bvia\b)/.test(n)) dados.categoriaArquivo = "Transporte";
    }

    if (!dados.valor) {
      if (/(\bvalor total\b|\bvalor global\b|\bvalor contratado\b|\bvalor\b|\bpreco\b|\bpreço\b)/.test(n)) {
        const v = extrairMoedaLinha(linha);
        if (v) dados.valor = v;
      }
    }

    if (!dados.mediaInformada) {
      if (/(\bmedia\b|\bmédia\b)/.test(n)) {
        const v = extrairMoedaLinha(linha);
        if (v) dados.mediaInformada = v;
      }
    }
  });

  if (!dados.valor) {
    const valoresEncontrados = linhas
      .map((linha) => extrairMoedaLinha(linha))
      .filter((v) => v > 0);
    if (valoresEncontrados.length) {
      dados.valor = Math.max(...valoresEncontrados);
      dados.observacoes.push("Valor inferido pelo maior montante encontrado no documento.");
    }
  }

  if (!dados.nome) {
    const linhaObjeto = linhas.find((linha) => /objeto/i.test(linha));
    if (linhaObjeto) dados.nome = linhaObjeto;
  }

  if (!dados.empresa) {
    dados.empresa = dados.contratada || "Empresa não informada";
  }

  const registros = [];
  if (dados.valor || dados.nome || dados.empresa !== "Empresa não informada") {
    registros.push({
      nome: dados.nome || "Contrato extraído por palavras-chave",
      empresa: dados.empresa,
      contratante: dados.contratante,
      contratada: dados.contratada,
      valor: dados.valor,
      data: dados.data,
      categoria: dados.categoriaArquivo,
      media: dados.mediaInformada,
      observacoes: dados.observacoes.join(" ")
    });
  }

  return {
    campos: dados,
    registros
  };
}

function converterExtracaoParaJson(extraido) {
  return (extraido.registros || []).map((item, index) => sanitizarContratoBase({
    nome: item.nome,
    empresa: item.empresa,
    valor: item.valor,
    data: item.data,
    categoria: item.categoria,
    media: item.media
  }, index));
}

function garantirPdfJsConfigurado() {
  if (!window.pdfjsLib) return false;
  if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  return true;
}

function parseJsonContrato(texto) {
  const dados = JSON.parse(texto);
  const candidatos = achatarObjetosDeContratos(dados);

  if (!candidatos.length) {
    let lista = [];
    if (Array.isArray(dados)) lista = dados;
    else if (dados && typeof dados === "object") lista = [dados];
    return lista
      .map((item, index) => sanitizarContratoBase(item, index))
      .filter((item) => item.valor > 0 || item.empresa !== "Empresa não informada");
  }

  return candidatos
    .map((item, index) => sanitizarContratoBase(item, index))
    .filter((item) => item.valor > 0 || item.empresa !== "Empresa não informada");
}

function tentarExtrairJsonDoTexto(texto) {
  const bruto = texto.trim();
  if (!bruto) return null;

  try {
    return JSON.parse(bruto);
  } catch (_) {
    // Continua para tentativa por bloco.
  }

  const inicioArray = bruto.indexOf("[");
  const fimArray = bruto.lastIndexOf("]");
  if (inicioArray >= 0 && fimArray > inicioArray) {
    const blocoArray = bruto.slice(inicioArray, fimArray + 1);
    try {
      return JSON.parse(blocoArray);
    } catch (_) {
      // Continua.
    }
  }

  const inicioObj = bruto.indexOf("{");
  const fimObj = bruto.lastIndexOf("}");
  if (inicioObj >= 0 && fimObj > inicioObj) {
    const blocoObj = bruto.slice(inicioObj, fimObj + 1);
    try {
      return JSON.parse(blocoObj);
    } catch (_) {
      return null;
    }
  }

  return null;
}

function parseTextoContratoWord(texto) {
  const jsonExtraido = tentarExtrairJsonDoTexto(texto);
  if (jsonExtraido) {
    return parseJsonContrato(JSON.stringify(jsonExtraido));
  }

  const linhasGerais = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // Tenta formato tabular com cabecalho, comum em DOCX com tabela.
  const linhasTabulares = linhasGerais.filter((linha) => /[;\t|]/.test(linha));
  if (linhasTabulares.length >= 2) {
    const separador = linhasTabulares[0].includes(";") ? ";" : linhasTabulares[0].includes("\t") ? "\t" : "|";
    const cabecalho = linhasTabulares[0].split(separador).map((c) => c.trim().toLowerCase());
    const idxEmpresa = cabecalho.findIndex((c) => c.includes("empresa") || c.includes("fornecedor"));
    const idxValor = cabecalho.findIndex((c) => c.includes("valor") || c.includes("preco") || c.includes("preço"));
    const idxCategoria = cabecalho.findIndex((c) => c.includes("categoria") || c.includes("area") || c.includes("setor") || c.includes("tipo"));
    const idxMedia = cabecalho.findIndex((c) => c.includes("media") || c.includes("média"));
    const idxNome = cabecalho.findIndex((c) => c.includes("nome") || c.includes("contrato") || c.includes("descricao") || c.includes("descrição"));
    const idxData = cabecalho.findIndex((c) => c.includes("data"));

    if (idxEmpresa >= 0 && idxValor >= 0) {
      const contratosTabela = linhasTabulares.slice(1).map((linha, index) => {
        const colunas = linha.split(separador).map((c) => c.trim());
        return sanitizarContratoBase({
          id: index + 1,
          empresa: colunas[idxEmpresa] || "Empresa não informada",
          nome: idxNome >= 0 ? (colunas[idxNome] || `Contrato ${index + 1}`) : `Contrato ${index + 1}`,
          valor: normalizarNumero(colunas[idxValor]),
          categoria: idxCategoria >= 0 ? colunas[idxCategoria] || "" : "",
          media: idxMedia >= 0 ? colunas[idxMedia] || "" : "",
          data: idxData >= 0 ? (colunas[idxData] || "") : ""
        }, index);
      }).filter((item) => item.valor > 0 || item.empresa !== "Empresa não informada");

      if (contratosTabela.length) return contratosTabela;
    }
  }

  const blocos = texto
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const contratos = [];
  blocos.forEach((bloco, index) => {
    const linhas = bloco.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const dados = {};

    linhas.forEach((linha) => {
      const partes = linha.split(":");
      if (partes.length < 2) return;
      const chave = partes[0].trim().toLowerCase();
      const valor = partes.slice(1).join(":").trim();
      dados[chave] = valor;
    });

    const empresa = extrairValorPorAliases(dados, ["empresa", "fornecedor", "contratada"]);
    const valor = extrairValorPorAliases(dados, ["valor", "preco", "preço", "montante", "total"]);
    const categoria = extrairValorPorAliases(dados, ["categoria", "area", "setor", "tipo"]);
    const media = extrairValorPorAliases(dados, ["media", "média"]);
    const nome = extrairValorPorAliases(dados, ["nome", "descricao", "descrição", "contrato", "objeto"]);
    const data = extrairValorPorAliases(dados, ["data"]);

    if (!empresa && !valor) return;

    contratos.push(sanitizarContratoBase({
      empresa,
      valor,
      categoria,
      media,
      nome,
      data
    }, index));
  });

  if (contratos.length) return contratos;

  // Fallback por regex para linhas soltas com empresa e valor no mesmo texto.
  const contratosRegex = linhasGerais.map((linha, index) => {
    const matchValor = linha.match(/(R\$\s*[\d.,]+|\d+[\d.,]*)/i);
    if (!matchValor) return null;
    const valor = normalizarNumero(matchValor[0]);
    if (!valor) return null;
    const empresa = linha
      .replace(matchValor[0], "")
      .replace(/[\-:|]/g, " ")
      .trim();

    return sanitizarContratoBase({
      empresa: empresa || "Empresa não informada",
      nome: `Contrato ${index + 1}`,
      valor,
      data: ""
    }, index);
  }).filter(Boolean);

  if (contratosRegex.length) return contratosRegex;

  return contratos;
}

function parseTextoContratoPdf(texto) {
  const extraido = extrairInformacoesPorPalavrasChave(texto);
  const jsonViaChave = converterExtracaoParaJson(extraido);
  if (jsonViaChave.length) {
    window.GOVSCAN_EXTRAIDO_CHAVE = {
      origem: "pdf",
      extraidoEm: new Date().toISOString(),
      campos: extraido.campos,
      registros: extraido.registros
    };
    return jsonViaChave;
  }

  const fallback = parseTextoContratoWord(texto);
  window.GOVSCAN_EXTRAIDO_CHAVE = {
    origem: "pdf",
    extraidoEm: new Date().toISOString(),
    campos: extraido.campos,
    registros: extraido.registros
  };
  return fallback;
}

async function extrairTextoCompletoPdf(arquivo) {
  if (!garantirPdfJsConfigurado()) {
    throw new Error("Biblioteca de leitura PDF não carregada.");
  }

  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  const loadingTask = window.pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const paginas = [];

  for (let numeroPagina = 1; numeroPagina <= pdf.numPages; numeroPagina += 1) {
    const page = await pdf.getPage(numeroPagina);
    const textContent = await page.getTextContent();

    const linhas = [];
    textContent.items.forEach((item) => {
      const y = Math.round(item.transform[5]);
      if (!linhas[y]) linhas[y] = [];
      linhas[y].push(item.str);
    });

    const textoPagina = Object.keys(linhas)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => linhas[y].join(" "))
      .join("\n");

    paginas.push(textoPagina);
  }

  return paginas.join("\n\n");
}

async function extrairContratosDoArquivo(arquivo) {
  const nome = arquivo.name.toLowerCase();

  if (!nome.endsWith(".pdf")) {
    throw new Error("Somente PDF é aceito nesta versão. Envie um arquivo .pdf.");
  }

  if (nome.endsWith(".pdf")) {
    const textoPdf = await extrairTextoCompletoPdf(arquivo);
    return parseTextoContratoPdf(textoPdf);
  }

  throw new Error("Somente PDF é aceito nesta versão. Envie um arquivo .pdf.");
}

function media(valores) {
  if (!valores.length) return 0;
  return valores.reduce((acc, n) => acc + n, 0) / valores.length;
}

function desvioPadrao(valores, valorMedio) {
  if (!valores.length) return 0;
  const variancia = valores.reduce((acc, n) => {
    const delta = n - valorMedio;
    return acc + (delta * delta);
  }, 0) / valores.length;
  return Math.sqrt(variancia);
}

function calcularEstatisticasPorArea(contratos) {
  const grupos = {};
  contratos.forEach((contrato) => {
    if (!grupos[contrato.area]) grupos[contrato.area] = [];
    grupos[contrato.area].push(contrato);
  });

  const estatisticas = {};
  const categoriasIgnoradas = [];
  Object.keys(grupos).forEach((area) => {
    const lista = grupos[area];
    if (lista.length < 2) {
      categoriasIgnoradas.push(area);
      return;
    }
    const valores = lista.map((c) => c.valor);
    const valorMedio = media(valores);
    const dp = desvioPadrao(valores, valorMedio);
    estatisticas[area] = {
      media: valorMedio,
      desvioPadrao: dp,
      total: lista.length
    };
  });

  return { estatisticas, categoriasIgnoradas };
}

function classificarContratosComEstatisticas(contratos, estatisticas) {
  return contratos.map((contrato) => {
    const stats = estatisticas[contrato.area];
    if (!stats) {
      return {
        ...contrato,
        mediaCategoria: 0,
        desvioPadraoCategoria: 0,
        zScore: 0,
        status: "NORMAL",
        justificativa: "Area com menos de 2 registros, sem base estatistica suficiente."
      };
    }

    const zScore = stats.desvioPadrao ? (contrato.valor - stats.media) / stats.desvioPadrao : 0;
    let status = "NORMAL";
    let justificativa = "Valor dentro da faixa esperada para a categoria.";

    if (zScore > 2) {
      status = "ALTO";
      justificativa = "Valor muito acima da media da categoria (possivel sobrepreco).";
    } else if (zScore > 1) {
      status = "ATENÇÃO";
      justificativa = "Valor acima da media e requer verificacao adicional.";
    } else if (zScore < -1) {
      status = "BAIXO";
      justificativa = `Falta R$ ${(stats.media - contrato.valor).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} para atingir a media da categoria.`;
    }

    return {
      ...contrato,
      mediaCategoria: stats.media,
      desvioPadraoCategoria: stats.desvioPadrao,
      zScore,
      status,
      justificativa
    };
  });
}

function classificarPorZScore(contratos) {
  const { estatisticas, categoriasIgnoradas } = calcularEstatisticasPorArea(contratos);
  const classificados = classificarContratosComEstatisticas(contratos, estatisticas);

  const altoRisco = classificados.filter((c) => c.status === "ALTO");
  const empresasAltoPorCategoria = {};
  altoRisco.forEach((c) => {
    const chave = `${c.empresa}::${c.area}`;
    empresasAltoPorCategoria[chave] = (empresasAltoPorCategoria[chave] || 0) + 1;
  });

  const recorrentes = Object.keys(empresasAltoPorCategoria)
    .filter((chave) => empresasAltoPorCategoria[chave] >= 2)
    .map((chave) => {
      const [empresa, categoria] = chave.split("::");
      return `${empresa} (${categoria}) apareceu ${empresasAltoPorCategoria[chave]}x em alto risco.`;
    });

  return {
    classificados,
    estatisticas,
    categoriasIgnoradas,
    recorrentes
  };
}

function renderizarResultadoUpload(resultado) {
  const totalContratosEl = document.getElementById("uploadTotalContratos");
  const totalAlertasEl = document.getElementById("uploadTotalAlertas");
  const categoriasValidasEl = document.getElementById("uploadCategoriasValidas");
  const alertasListaEl = document.getElementById("listaAlertasUpload");
  const bodyEl = document.getElementById("resultadoUploadBody");

  if (!totalContratosEl || !totalAlertasEl || !categoriasValidasEl || !alertasListaEl || !bodyEl) return;

  const alertas = resultado.classificados.filter((c) => c.status === "ATENÇÃO" || c.status === "ALTO");
  totalContratosEl.textContent = String(resultado.classificados.length);
  totalAlertasEl.textContent = String(alertas.length);
  categoriasValidasEl.textContent = String(Object.keys(resultado.estatisticas).length);

  const mensagens = [];
  if (resultado.categoriasIgnoradas.length) {
    mensagens.push(`Categorias ignoradas por baixa amostra: ${resultado.categoriasIgnoradas.join(", ")}.`);
  }
  if (resultado.recorrentes.length) {
    mensagens.push(...resultado.recorrentes);
  }
  if (!mensagens.length) {
    mensagens.push("Nenhum padrao adicional suspeito detectado.");
  }

  alertasListaEl.innerHTML = "";
  mensagens.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    alertasListaEl.appendChild(li);
  });

  bodyEl.innerHTML = "";
  resultado.classificados.forEach((c) => {
    const status = normalizarStatusUpload(c.status);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${c.empresa}</strong></td>
      <td>${c.area}</td>
      <td>R$ ${c.valor.toLocaleString("pt-BR")}</td>
      <td>${c.mediaCategoria ? `R$ ${c.mediaCategoria.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}` : "-"}</td>
      <td>${c.mediaCategoria ? c.zScore.toFixed(2) : "-"}</td>
      <td><span class="badge ${status.classe}">${status.texto}</span></td>
      <td>${c.justificativa}</td>
    `;
    bodyEl.appendChild(tr);
  });
}

function limparResultadoUpload() {
  const totalContratosEl = document.getElementById("uploadTotalContratos");
  const totalAlertasEl = document.getElementById("uploadTotalAlertas");
  const categoriasValidasEl = document.getElementById("uploadCategoriasValidas");
  const alertasListaEl = document.getElementById("listaAlertasUpload");
  const bodyEl = document.getElementById("resultadoUploadBody");
  const statusEl = document.getElementById("statusAnaliseArquivo");
  const inputEl = document.getElementById("arquivoContratos");
  const areaEl = document.getElementById("areaSelect");

  if (totalContratosEl) totalContratosEl.textContent = "0";
  if (totalAlertasEl) totalAlertasEl.textContent = "0";
  if (categoriasValidasEl) categoriasValidasEl.textContent = "0";
  if (alertasListaEl) alertasListaEl.innerHTML = "<li>Nenhuma análise executada ainda.</li>";
  if (bodyEl) {
    bodyEl.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #6b7280;">Envie um arquivo para iniciar a classificação.</td>
      </tr>
    `;
  }
  if (statusEl) statusEl.textContent = "";
  if (inputEl) inputEl.value = "";
  if (areaEl) areaEl.value = "";
}

async function analisarArquivoSelecionado() {
  const inputEl = document.getElementById("arquivoContratos");
  const areaEl = document.getElementById("areaSelect");
  const statusEl = document.getElementById("statusAnaliseArquivo");
  if (!inputEl || !areaEl || !statusEl) return;

  const arquivo = inputEl.files && inputEl.files[0];
  if (!arquivo) {
    statusEl.textContent = "Selecione um arquivo antes de analisar.";
    return;
  }

  const areaSelecionada = areaEl.value;
  if (!areaSelecionada) {
    statusEl.textContent = "Selecione uma área de infraestrutura antes de analisar.";
    return;
  }

  try {
    statusEl.textContent = "Processando arquivo...";
    const contratosExtraidos = await extrairContratosDoArquivo(arquivo);
    const contratos = contratosExtraidos.map((contrato) => ({
      ...contrato,
      area: areaLabelPorSelecionada(areaSelecionada)
    }));

    if (!contratos.length) {
      statusEl.textContent = "Nao foi possivel identificar contratos no arquivo. Verifique se ha campos como empresa e valor.";
      return;
    }

    const areaLabel = areaLabelPorSelecionada(areaSelecionada);
    const contratosBase = (window.CONTRATOS_GOVSCAN || []).filter((contrato) => contrato.area === areaLabel);
    const { estatisticas, categoriasIgnoradas } = calcularEstatisticasPorArea(contratosBase);
    const contratosClassificados = classificarContratosComEstatisticas(contratos, estatisticas);

    window.GOVSCAN_UPLOAD_ORGANIZADO = {
      arquivo: arquivo.name,
      areaSelecionada: areaLabel,
      extraidoEm: new Date().toISOString(),
      contratosExtraidos: contratosExtraidos,
      contratosNormalizados: contratos,
      contratosClassificados: contratosClassificados
    };

    const resultado = {
      classificados: contratosClassificados,
      estatisticas,
      categoriasIgnoradas,
      recorrentes: []
    };

    const altoRisco = contratosClassificados.filter((c) => c.status === "ALTO");
    const empresasAltoPorCategoria = {};
    altoRisco.forEach((c) => {
      const chave = `${c.empresa}::${c.area}`;
      empresasAltoPorCategoria[chave] = (empresasAltoPorCategoria[chave] || 0) + 1;
    });
    resultado.recorrentes = Object.keys(empresasAltoPorCategoria)
      .filter((chave) => empresasAltoPorCategoria[chave] >= 2)
      .map((chave) => {
        const [empresa, categoria] = chave.split("::");
        return `${empresa} (${categoria}) apareceu ${empresasAltoPorCategoria[chave]}x em alto risco.`;
      });

    renderizarResultadoUpload(resultado);
    statusEl.textContent = `Análise concluída para ${areaLabel}: ${contratos.length} contrato(s) processado(s).`;
  } catch (erro) {
    statusEl.textContent = `Erro ao processar arquivo: ${erro.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  criarGraficos();

  document.getElementById("filtroEstado")?.addEventListener("change", (e) => {
    filtros.estado = e.target.value;
    atualizarDashboard();
  });

  document.getElementById("filtroInfraestrutura")?.addEventListener("change", (e) => {
    filtros.area = e.target.value;
    atualizarDashboard();
  });

  document.getElementById("filtroPeriodo")?.addEventListener("change", (e) => {
    filtros.periodo = e.target.value;
    atualizarDashboard();
  });

  document.getElementById("btnAnalisarArquivo")?.addEventListener("click", analisarArquivoSelecionado);
  document.getElementById("btnLimparAnalise")?.addEventListener("click", limparResultadoUpload);

  atualizarDashboard();
});
