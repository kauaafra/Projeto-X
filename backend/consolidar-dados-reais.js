const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INPUT_PADRAO = path.join(ROOT, "data", "contratos-tocantins.json");
const OUT_FRONT = path.join(ROOT, "js", "dados-reais.js");
const OUT_BENCHMARK = path.join(ROOT, "data", "benchmark-tocantins.json");

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizarNumero(valor) {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : 0;
  const texto = String(valor || "")
    .replace(/R\$\s*/gi, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : 0;
}

function normalizarCategoria(valor) {
  const n = normalizarTexto(valor);
  if (n.includes("saude") || n.includes("hospital") || n.includes("medic")) return "Saude";
  if (n.includes("educ") || n.includes("escola") || n.includes("creche")) return "Educacao";
  if (n.includes("transporte") || n.includes("rodovia") || n.includes("via") || n.includes("paviment")) return "Transporte";
  return "Transporte";
}

function mediana(valores) {
  if (!valores.length) return 0;
  const v = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(v.length / 2);
  if (v.length % 2 === 0) return (v[meio - 1] + v[meio]) / 2;
  return v[meio];
}

function quantil(valores, q) {
  if (!valores.length) return 0;
  const v = [...valores].sort((a, b) => a - b);
  const pos = (v.length - 1) * q;
  const base = Math.floor(pos);
  const resto = pos - base;
  if (v[base + 1] !== undefined) return v[base] + resto * (v[base + 1] - v[base]);
  return v[base];
}

function desvioPadrao(valores) {
  if (!valores.length) return 0;
  const media = valores.reduce((acc, n) => acc + n, 0) / valores.length;
  const variancia = valores.reduce((acc, n) => {
    const delta = n - media;
    return acc + (delta * delta);
  }, 0) / valores.length;
  return Math.sqrt(variancia);
}

function prepararRegistros(registrosBrutos) {
  return registrosBrutos
    .map((r, i) => {
      const valor = normalizarNumero(r.valor);
      const valorReferencia = normalizarNumero(r.valor_referencia || r.media || valor);
      const dataAssinatura = String(r.data_assinatura || r.data || "").slice(0, 10);

      return {
        id: r.id || `TO-${String(i + 1).padStart(5, "0")}`,
        objeto: String(r.objeto || r.nome || `Contrato ${i + 1}`),
        categoria: normalizarCategoria(r.categoria || r.area || r.tipo),
        empresa: String(r.empresa || r.fornecedor || "Empresa nao informada"),
        cnpj: String(r.cnpj || ""),
        valor,
        valor_referencia: valorReferencia,
        data_assinatura: dataAssinatura,
        orgao: String(r.orgao || ""),
        municipio: String(r.municipio || ""),
        fonte: String(r.fonte || "desconhecida")
      };
    })
    .filter((r) => r.valor > 0 && r.empresa !== "Empresa nao informada");
}

function gerarBenchmark(registros) {
  const grupos = {};
  registros.forEach((r) => {
    if (!grupos[r.categoria]) grupos[r.categoria] = [];
    grupos[r.categoria].push(r.valor);
  });

  const benchmark = {};
  Object.keys(grupos).forEach((categoria) => {
    const valores = grupos[categoria];
    benchmark[categoria] = {
      quantidade: valores.length,
      mediana: Number(mediana(valores).toFixed(2)),
      q1: Number(quantil(valores, 0.25).toFixed(2)),
      q3: Number(quantil(valores, 0.75).toFixed(2)),
      desvio_padrao: Number(desvioPadrao(valores).toFixed(2)),
      media: Number((valores.reduce((acc, n) => acc + n, 0) / valores.length).toFixed(2))
    };
  });

  return benchmark;
}

function salvarSaidas(registros, benchmark) {
  const meta = {
    origem: "dados_reais_consolidados",
    atualizadoEm: new Date().toISOString(),
    total: registros.length
  };

  const conteudoFront = `window.GOVSCAN_DADOS_REAIS = ${JSON.stringify(registros, null, 2)};\nwindow.GOVSCAN_DADOS_REAIS_META = ${JSON.stringify(meta, null, 2)};\n`;
  fs.writeFileSync(OUT_FRONT, conteudoFront, "utf-8");

  fs.writeFileSync(OUT_BENCHMARK, JSON.stringify({ meta, benchmark }, null, 2), "utf-8");
}

function executar() {
  const input = process.argv[2] ? path.resolve(process.argv[2]) : INPUT_PADRAO;
  if (!fs.existsSync(input)) {
    throw new Error(`Arquivo de entrada nao encontrado: ${input}`);
  }

  const bruto = JSON.parse(fs.readFileSync(input, "utf-8"));
  if (!Array.isArray(bruto)) {
    throw new Error("O arquivo de entrada deve conter um array JSON de contratos.");
  }

  const registros = prepararRegistros(bruto);
  const benchmark = gerarBenchmark(registros);
  salvarSaidas(registros, benchmark);

  console.log(`OK: ${registros.length} contratos consolidados.`);
  console.log(`Arquivo front atualizado: ${OUT_FRONT}`);
  console.log(`Benchmark gerado: ${OUT_BENCHMARK}`);
}

if (require.main === module) {
  try {
    executar();
  } catch (erro) {
    console.error("Falha na consolidacao:", erro.message);
    process.exit(1);
  }
}
