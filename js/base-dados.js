function calcularVariacao(valor, media) {
  return Number((((valor - media) / media) * 100).toFixed(2));
}

function classificarRisco(variacao) {
  if (variacao > 30) return "ALTO";
  if (variacao >= 15) return "ATENÇÃO";
  if (variacao < -15) return "BAIXO";
  return "NORMAL";
}

function classificarContrato(contrato) {
  const variacao = calcularVariacao(contrato.valor, contrato.media);
  return {
    ...contrato,
    variacao,
    risco: classificarRisco(variacao),
    frequenciaEmpresa: 0,
    anomalia: false,
    suspeita: false
  };
}

function analisarFrequenciaEmpresas(contratos) {
  const frequenciaPorEmpresaPeriodo = {};

  contratos.forEach((contrato) => {
    const chave = `${contrato.empresa}::${contrato.periodo}`;
    frequenciaPorEmpresaPeriodo[chave] = (frequenciaPorEmpresaPeriodo[chave] || 0) + 1;
  });

  return contratos.map((contrato) => {
    const chave = `${contrato.empresa}::${contrato.periodo}`;
    const frequenciaEmpresa = frequenciaPorEmpresaPeriodo[chave] || 0;
    return {
      ...contrato,
      frequenciaEmpresa,
      alertaFrequencia: frequenciaEmpresa > 5
    };
  });
}

function detectarAnomalias(contratos) {
  return contratos.map((contrato) => {
    const anomalia = contrato.variacao > 50 || contrato.variacao < -30;
    return {
      ...contrato,
      anomalia
    };
  });
}

function cruzarDados(contratos) {
  const altosPorEmpresa = {};

  contratos.forEach((contrato) => {
    if (contrato.risco === "ALTO") {
      altosPorEmpresa[contrato.empresa] = (altosPorEmpresa[contrato.empresa] || 0) + 1;
    }
  });

  return contratos.map((contrato) => {
    const variosAltos = (altosPorEmpresa[contrato.empresa] || 0) >= 3;
    const frequenciaAltaEValorAlto = contrato.alertaFrequencia && contrato.risco === "ALTO";
    const suspeita = variosAltos || frequenciaAltaEValorAlto;
    return {
      ...contrato,
      suspeita
    };
  });
}

function recalcularClassificacaoContratos() {
  const base = (window.CONTRATOS_GOVSCAN || []).map((contrato) => classificarContrato(contrato));
  const comFrequencia = analisarFrequenciaEmpresas(base);
  const comAnomalias = detectarAnomalias(comFrequencia);
  window.CONTRATOS_GOVSCAN = cruzarDados(comAnomalias);
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
    variacao,
    risco: classificarRisco(variacao),
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
  4200000, 4600000, 4000000, 5100000, 4800000,
  5000000, 5600000, 4300000, 5900000, 4500000,
  4100000, 5700000, 6000000, 3950000, 4700000,
  5300000, 6000000, 4900000, 4200000, 5800000
];
const saudeMedias = [
  3200000, 3500000, 3300000, 3900000, 3700000,
  4000000, 4300000, 3600000, 4500000, 3700000,
  3400000, 4400000, 4700000, 3300000, 3600000,
  4100000, 4700000, 3900000, 3400000, 4500000
];

const educacaoValores = [
  900000, 1200000, 1450000, 1100000, 1750000,
  980000, 1500000, 1300000, 800000, 1900000,
  1050000, 1600000, 1250000, 1400000, 1700000,
  1150000, 1800000, 950000, 1550000, 1350000
];
const educacaoMedias = [
  850000, 1150000, 1200000, 1080000, 1350000,
  900000, 1220000, 1180000, 1200000, 1200000,
  980000, 1300000, 1180000, 1200000, 1350000,
  1020000, 1380000, 900000, 1250000, 1150000
];

const transporteValores = [
  3300000, 4000000, 4500000, 3800000, 4700000,
  3600000, 4200000, 5000000, 3900000, 4300000,
  3500000, 4100000, 4600000, 3400000, 4800000,
  3700000, 4400000, 4950000, 4050000, 4700000
];
const transporteMedias = [
  3200000, 3500000, 3600000, 3400000, 3900000,
  3300000, 3550000, 3900000, 3500000, 3600000,
  3200000, 3450000, 3650000, 3250000, 3900000,
  3350000, 3550000, 3900000, 3500000, 3650000
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
