function calcularVariacao(valor, media) {
  if (!media) return 0;
  return Number((((valor - media) / media) * 100).toFixed(2));
}

function calcularMedia(valores) {
  if (!valores.length) return 0;
  return valores.reduce((acc, valor) => acc + valor, 0) / valores.length;
}

function calcularDesvioPadrao(valores, media) {
  if (valores.length <= 1) return 0;
  const variancia = valores.reduce((acc, valor) => {
    const delta = valor - media;
    return acc + (delta * delta);
  }, 0) / valores.length;
  return Math.sqrt(variancia);
}

function calcularZScore(valor, media, desvioPadrao) {
  if (!desvioPadrao) return 0;
  return Number(((valor - media) / desvioPadrao).toFixed(4));
}

function classificarRisco(zScore) {
  if (zScore > 2) return "ALTO";
  if (zScore > 1) return "ATENÇÃO";
  if (zScore < -1) return "BAIXO";
  return "NORMAL";
}

function classificarContrato(contrato, estatisticaCategoria) {
  if (!estatisticaCategoria || estatisticaCategoria.total < 5) {
    return {
      ...contrato,
      media: contrato.media || 0,
      desvioPadrao: 0,
      zScore: 0,
      variacao: 0,
      risco: "NORMAL",
      frequenciaEmpresa: 0,
      alertaFrequencia: false,
      anomalia: false,
      suspeita: false,
      alertasDetectados: ["Categoria com poucos dados para analise estatistica"]
    };
  }

  const mediaCategoria = estatisticaCategoria.media;
  const desvioPadrao = estatisticaCategoria.desvioPadrao;
  const zScore = calcularZScore(contrato.valor, mediaCategoria, desvioPadrao);
  const variacao = calcularVariacao(contrato.valor, mediaCategoria);

  return {
    ...contrato,
    media: Number(mediaCategoria.toFixed(2)),
    desvioPadrao: Number(desvioPadrao.toFixed(2)),
    zScore,
    variacao,
    risco: classificarRisco(zScore),
    frequenciaEmpresa: 0,
    alertaFrequencia: false,
    anomalia: false,
    suspeita: false,
    alertasDetectados: []
  };
}

function analisarFrequenciaEmpresas(contratos) {
  const frequenciaPorEmpresaCategoria = {};

  contratos.forEach((contrato) => {
    if (contrato.risco !== "ALTO") return;
    const chave = `${contrato.empresa}::${contrato.area}`;
    frequenciaPorEmpresaCategoria[chave] = (frequenciaPorEmpresaCategoria[chave] || 0) + 1;
  });

  return contratos.map((contrato) => {
    const chave = `${contrato.empresa}::${contrato.area}`;
    const frequenciaEmpresa = frequenciaPorEmpresaCategoria[chave] || 0;
    const alertaFrequencia = frequenciaEmpresa >= 2;
    const alertasDetectados = Array.isArray(contrato.alertasDetectados)
      ? [...contrato.alertasDetectados]
      : [];

    if (alertaFrequencia) {
      alertasDetectados.push("Mesma empresa recorrente em alto risco na categoria");
    }

    return {
      ...contrato,
      frequenciaEmpresa,
      alertaFrequencia,
      alertasDetectados
    };
  });
}

function detectarAnomalias(contratos) {
  const contratosPorArea = {};
  const periodosOrdenados = ["2 semanas", "último mês", "3 meses", "6 meses"];
  const ordemPeriodo = periodosOrdenados.reduce((acc, periodo, index) => {
    acc[periodo] = index;
    return acc;
  }, {});

  contratos.forEach((contrato) => {
    if (!contratosPorArea[contrato.area]) contratosPorArea[contrato.area] = [];
    contratosPorArea[contrato.area].push(contrato);
  });

  const idsProximos = new Set();
  const idsCrescimento = new Set();

  Object.values(contratosPorArea).forEach((lista) => {
    const ordenadosPorValor = [...lista].sort((a, b) => a.valor - b.valor);
    for (let i = 1; i < ordenadosPorValor.length; i += 1) {
      const atual = ordenadosPorValor[i];
      const anterior = ordenadosPorValor[i - 1];
      const diffRelativa = Math.abs(atual.valor - anterior.valor) / Math.max(atual.valor, anterior.valor);
      if (diffRelativa <= 0.02) {
        idsProximos.add(atual.id);
        idsProximos.add(anterior.id);
      }
    }

    const mediaPorPeriodo = {};
    lista.forEach((contrato) => {
      if (!mediaPorPeriodo[contrato.periodo]) {
        mediaPorPeriodo[contrato.periodo] = { soma: 0, qtd: 0 };
      }
      mediaPorPeriodo[contrato.periodo].soma += contrato.valor;
      mediaPorPeriodo[contrato.periodo].qtd += 1;
    });

    const periodosComDados = Object.keys(mediaPorPeriodo)
      .sort((a, b) => (ordemPeriodo[a] ?? 999) - (ordemPeriodo[b] ?? 999));

    for (let i = 1; i < periodosComDados.length; i += 1) {
      const anterior = mediaPorPeriodo[periodosComDados[i - 1]];
      const atual = mediaPorPeriodo[periodosComDados[i]];
      const mediaAnterior = anterior.soma / anterior.qtd;
      const mediaAtual = atual.soma / atual.qtd;

      if (mediaAnterior > 0 && mediaAtual > mediaAnterior * 1.6) {
        lista
          .filter((contrato) => contrato.periodo === periodosComDados[i])
          .forEach((contrato) => idsCrescimento.add(contrato.id));
      }
    }
  });

  return contratos.map((contrato) => {
    const proximidadeValor = idsProximos.has(contrato.id);
    const crescimentoRepentino = idsCrescimento.has(contrato.id);
    const anomalia = Math.abs(contrato.zScore || 0) > 2 || proximidadeValor || crescimentoRepentino;
    const alertasDetectados = Array.isArray(contrato.alertasDetectados)
      ? [...contrato.alertasDetectados]
      : [];

    if (proximidadeValor) {
      alertasDetectados.push("Contratos com valores muito proximos na categoria");
    }
    if (crescimentoRepentino) {
      alertasDetectados.push("Crescimento repentino de valores ao longo do tempo");
    }

    return {
      ...contrato,
      proximidadeValor,
      crescimentoRepentino,
      anomalia,
      alertasDetectados
    };
  });
}

function cruzarDados(contratos) {
  const altosPorEmpresaCategoria = {};

  contratos.forEach((contrato) => {
    if (contrato.risco === "ALTO") {
      const chave = `${contrato.empresa}::${contrato.area}`;
      altosPorEmpresaCategoria[chave] = (altosPorEmpresaCategoria[chave] || 0) + 1;
    }
  });

  return contratos.map((contrato) => {
    const chave = `${contrato.empresa}::${contrato.area}`;
    const variosAltos = (altosPorEmpresaCategoria[chave] || 0) >= 3;
    const frequenciaAltaEValorAlto = contrato.alertaFrequencia && contrato.risco === "ALTO";
    const suspeita = variosAltos || frequenciaAltaEValorAlto || (contrato.anomalia && contrato.risco !== "BAIXO");
    const alertasDetectados = Array.isArray(contrato.alertasDetectados)
      ? [...contrato.alertasDetectados]
      : [];

    if (variosAltos) {
      alertasDetectados.push("Empresa com alta recorrencia de contratos em alto risco");
    }

    return {
      ...contrato,
      suspeita,
      alertasDetectados: Array.from(new Set(alertasDetectados))
    };
  });
}

function recalcularClassificacaoContratos() {
  const origem = window.CONTRATOS_GOVSCAN || [];
  const contratosPorArea = {};

  origem.forEach((contrato) => {
    if (!contratosPorArea[contrato.area]) contratosPorArea[contrato.area] = [];
    contratosPorArea[contrato.area].push(contrato);
  });

  const estatisticasPorArea = {};
  Object.keys(contratosPorArea).forEach((area) => {
    const valores = contratosPorArea[area].map((contrato) => contrato.valor);
    const media = calcularMedia(valores);
    const desvioPadrao = calcularDesvioPadrao(valores, media);
    estatisticasPorArea[area] = {
      total: valores.length,
      media,
      desvioPadrao
    };
  });

  const base = origem.map((contrato) => classificarContrato(contrato, estatisticasPorArea[contrato.area]));
  const comFrequencia = analisarFrequenciaEmpresas(base);
  const comAnomalias = detectarAnomalias(comFrequencia);
  window.CONTRATOS_GOVSCAN = cruzarDados(comAnomalias);

  window.ALERTAS_GOVSCAN = window.CONTRATOS_GOVSCAN
    .filter((c) => (c.alertasDetectados && c.alertasDetectados.length) || c.risco === "ALTO" || c.risco === "ATENÇÃO")
    .map((c) => ({
      id: c.id,
      empresa: c.empresa,
      area: c.area,
      risco: c.risco,
      zScore: c.zScore,
      mediaCategoria: c.media,
      desvioPadraoCategoria: c.desvioPadrao,
      alertas: c.alertasDetectados || []
    }));

  return window.CONTRATOS_GOVSCAN;
}

function criarContrato(id, nome, area, empresa, valor, media, periodo, ordem) {
  const variacao = calcularVariacao(valor, media);
  return {
    id,
    nome,
    area,
    estado: "Tocantins",
    empresa,
    valor,
    media,
    desvioPadrao: 0,
    zScore: 0,
    variacao,
    risco: "NORMAL",
    periodo,
    ordem
  };
}

function criarBlocoArea(area, nomes, empresas, valores, medias) {
  const periodos = ["último mês", "2 semanas", "3 meses", "6 meses"];
  const contratos = [];
  let idx = 0;

  for (let p = 0; p < periodos.length; p += 1) {
    for (let i = 0; i < 5; i += 1) {
      contratos.push({
        nome: nomes[idx % nomes.length],
        area,
        empresa: empresas[idx % empresas.length],
        valor: valores[idx],
        media: medias[idx],
        periodo: periodos[p],
        ordem: i + 1
      });
      idx += 1;
    }
  }

  return contratos;
}

const nomesSaude = [
  "Aquisição de Equipamentos Hospitalares",
  "Reforma de Unidade Básica de Saúde",
  "Compra de Ambulâncias",
  "Modernização de Hospital Regional",
  "Ampliação de Centro Cirúrgico",
  "Digitalização de Prontuários",
  "Implantação de UTI Móvel",
  "Aquisição de Medicamentos Estratégicos"
];

const nomesEducacao = [
  "Reforma de Escolas Públicas",
  "Aquisição de Tablets Educacionais",
  "Capacitação de Professores",
  "Construção de Creche Municipal",
  "Modernização de Laboratórios",
  "Programa de Transporte Escolar",
  "Ampliação de Bibliotecas",
  "Implantação de Ensino Integral"
];

const nomesTransporte = [
  "Pavimentação de Rodovias",
  "Manutenção de Estradas",
  "Construção de Pontes",
  "Sinalização Urbana",
  "Recapeamento Asfáltico",
  "Ampliação de Terminais",
  "Implantação de Corredor de Ônibus",
  "Requalificação de Vias Urbanas"
];

const empresasSaude = [
  "Saúde Forte Engenharia",
  "Hospitalar Brasil S.A.",
  "VidaPlena Infraestrutura",
  "MediTech Construções",
  "Serviços Clínicos Tocantins"
];

const empresasEducacao = [
  "EducaObras LTDA",
  "Saber & Construir",
  "Ensino Total Engenharia",
  "Creche Nova Brasil",
  "Escola Viva Projetos"
];

const empresasTransporte = [
  "Mobilidade Tocantins",
  "Via Norte Infra",
  "Rodobras Engenharia",
  "Ponte Forte S.A.",
  "Sinaliza Brasil"
];

const saudeValores = [
  780000, 1250000, 1680000, 2340000, 910000,
  1420000, 1860000, 640000, 2590000, 1130000,
  980000, 1740000, 2050000, 720000, 1490000,
  1360000, 2210000, 1190000, 870000, 1920000
];
const saudeMedias = [
  690000, 980000, 1410000, 1780000, 820000,
  1160000, 1520000, 590000, 1710000, 940000,
  860000, 1480000, 1630000, 650000, 1210000,
  1090000, 1760000, 990000, 780000, 1540000
];

const educacaoValores = [
  240000, 380000, 520000, 740000, 460000,
  310000, 690000, 430000, 265000, 820000,
  355000, 610000, 470000, 540000, 760000,
  330000, 880000, 290000, 640000, 510000
];
const educacaoMedias = [
  220000, 340000, 430000, 590000, 390000,
  280000, 520000, 360000, 240000, 610000,
  300000, 500000, 410000, 450000, 620000,
  290000, 670000, 250000, 530000, 420000
];

const transporteValores = [
  1250000, 1840000, 2750000, 1630000, 3220000,
  1480000, 2360000, 4120000, 1710000, 2580000,
  1390000, 2190000, 3010000, 1320000, 3450000,
  1570000, 2440000, 3890000, 2050000, 2960000
];
const transporteMedias = [
  1180000, 1560000, 2140000, 1490000, 2480000,
  1320000, 1890000, 2950000, 1520000, 2030000,
  1260000, 1780000, 2320000, 1210000, 2570000,
  1410000, 1960000, 2790000, 1710000, 2260000
];

const baseBruta = [
  ...criarBlocoArea("Saúde", nomesSaude, empresasSaude, saudeValores, saudeMedias),
  ...criarBlocoArea("Educação", nomesEducacao, empresasEducacao, educacaoValores, educacaoMedias),
  ...criarBlocoArea("Transporte", nomesTransporte, empresasTransporte, transporteValores, transporteMedias)
];

window.CONTRATOS_GOVSCAN = baseBruta.map((c, index) =>
  criarContrato(index + 1, c.nome, c.area, c.empresa, c.valor, c.media, c.periodo, c.ordem)
);

// Recalcula toda a base ao carregar para garantir consistencia da simulacao.
recalcularClassificacaoContratos();

// Exposicao global para uso nas outras telas.
window.classificarContrato = classificarContrato;
window.analisarFrequenciaEmpresas = analisarFrequenciaEmpresas;
window.detectarAnomalias = detectarAnomalias;
window.cruzarDados = cruzarDados;
window.recalcularClassificacaoContratos = recalcularClassificacaoContratos;
