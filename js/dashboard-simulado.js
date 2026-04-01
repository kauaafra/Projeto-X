// 📊 DADOS SIMULADOS PARA TESTE - 100% SIMULAÇÃO

// 🎓 EDUCAÇÃO E ESCOLAS
const dadosEducacao = [
  { id: 1, nome: "Reforma Escola Estadual Zona Leste", empresa: "ConstroEdu LTDA", valor: 2100000, data: "2025-12-15", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Construção Escola Municipal Rural", empresa: "BuildSchool LTDA", valor: 1200000, data: "2025-11-20", cidade: "Araguaína", status: "Normal" },
  { id: 3, nome: "Ampliação Bloco de Salas - Colégio Estadual", empresa: "Obra Civil TO", valor: 1850000, data: "2025-10-10", cidade: "Palmas", status: "Normal" },
  { id: 4, nome: "Reforma Biblioteca Municipal", empresa: "Reformas Educacionais", valor: 450000, data: "2025-09-05", cidade: "Gurupi", status: "Normal" },
  { id: 5, nome: "Construção Quadra Coberta - Escola Federal", empresa: "ConstroTO LTDA", valor: 980000, data: "2025-08-12", cidade: "Porto Nacional", status: "Normal" },
  { id: 6, nome: "Laboratório de Informática com Equipamentos", empresa: "Tech Education LTDA", valor: 350000, data: "2025-12-01", cidade: "Tocantinópolis", status: "Normal" },
  { id: 7, nome: "Pintura e Revitalização - 15 Escolas", empresa: "ServiçosPaint TO", valor: 280000, data: "2025-11-30", cidade: "Palmas", status: "Normal" },
];

// 🏥 SAÚDE E HOSPITAIS
const dadosSaude = [
  { id: 1, nome: "Reforma Hospital Geral de Palmas", empresa: "ConstroMed LTDA", valor: 4500000, data: "2025-12-10", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Aquisição Equipamentos Ressonância Magnética", empresa: "MedEquip Brasil", valor: 1200000, data: "2025-11-20", cidade: "Palmas", status: "Normal" },
  { id: 3, nome: "Ampliação Unidade de Terapia Intensiva", empresa: "HospitalWorks", valor: 2350000, data: "2025-10-15", cidade: "Araguaína", status: "Normal" },
  { id: 4, nome: "Reforma UPA - Unidade de Pronto Atendimento", empresa: "ConstroSaude TO", valor: 820000, data: "2025-09-08", cidade: "Porto Nacional", status: "Normal" },
  { id: 5, nome: "Aquisição de Ventiladores Pulmonares", empresa: "Equipment Medical", valor: 650000, data: "2025-08-20", cidade: "Tocantinópolis", status: "Normal" },
  { id: 6, nome: "Reforma Clínica de Fisioterapia", empresa: "RehabTO LTDA", valor: 380000, data: "2025-12-05", cidade: "Gurupi", status: "Normal" },
  { id: 7, nome: "Construção Centro de Saúde - Bairro Novo", empresa: "ObrasPublicas TO", valor: 1600000, data: "2025-11-10", cidade: "Palmas", status: "Normal" },
];

// 🚌 TRANSPORTES
const dadosTransportes = [
  { id: 1, nome: "Renovação Frota Ônibus Público Palmas", empresa: "Transportes e Logística TO", valor: 5600000, data: "2025-12-12", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Aquisição Ônibus Interurbano", empresa: "Veículos Brasil LTDA", valor: 2200000, data: "2025-11-15", cidade: "Palmas", status: "Normal" },
  { id: 3, nome: "Reforma Terminal Rodoviário", empresa: "ConstroTerminal LTDA", valor: 1850000, data: "2025-10-20", cidade: "Palmas", status: "Normal" },
  { id: 4, nome: "Manutenção Frota Táxis Amarelos", empresa: "ManuTransTO", valor: 450000, data: "2025-09-18", cidade: "Araguaína", status: "Normal" },
  { id: 5, nome: "Implantação Sistema BRT - Corredor de Ônibus", empresa: "TransportSystems Brasil", valor: 4200000, data: "2025-08-25", cidade: "Palmas", status: "Normal" },
  { id: 6, nome: "Pavimentação e Sinalização Vias Transporte", empresa: "ViasBrasil LTDA", valor: 980000, data: "2025-12-03", cidade: "Porto Nacional", status: "Normal" },
  { id: 7, nome: "Aquisição Micro-ônibus para Zona Rural", empresa: "AutoVeículos TO", valor: 680000, data: "2025-11-22", cidade: "Guitari", status: "Normal" },
];

// Estado global
let abaAtiva = "educacao";
let filtroAtivo = {
  periodo: "6meses"
};

// Função para obter dados da aba ativa
function obterDadosAba(aba) {
  switch(aba) {
    case "educacao": return dadosEducacao;
    case "saude": return dadosSaude;
    case "transportes": return dadosTransportes;
    default: return [];
  }
}

// Função para obter cor por aba
function obterCorAba(aba) {
  switch(aba) {
    case "educacao": return { cor: "#3b82f6", rgb: "59, 130, 246" };
    case "saude": return { cor: "#ef4444", rgb: "239, 68, 68" };
    case "transportes": return { cor: "#10b981", rgb: "16, 185, 129" };
    default: return { cor: "#666", rgb: "102, 102, 102" };
  }
}

// Função para obter emoji
function obterEmojiAba(aba) {
  switch(aba) {
    case "educacao": return "🎓";
    case "saude": return "🏥";
    case "transportes": return "🚌";
    default: return "📊";
  }
}

// Função para filtrar por período
function filtrarPorPeriodo(dados, periodo) {
  const hoje = new Date();
  let dataLimite = new Date();

  switch(periodo) {
    case "1mes":
      dataLimite.setMonth(hoje.getMonth() - 1);
      break;
    case "3meses":
      dataLimite.setMonth(hoje.getMonth() - 3);
      break;
    case "2semanas":
      dataLimite.setDate(hoje.getDate() - 14);
      break;
    case "6meses":
    default:
      dataLimite.setMonth(hoje.getMonth() - 6);
  }

  return dados.filter(item => new Date(item.data) >= dataLimite);
}

// Função para atualizar abas
function trocarAba(novaAba) {
  abaAtiva = novaAba;

  // Atualizar botões
  document.querySelectorAll(".aba-btn").forEach(btn => {
    if (btn.dataset.aba === novaAba) {
      btn.classList.add("aba-ativo");
      const cor = obterCorAba(novaAba);
      btn.style.background = cor.cor;
      btn.style.color = "white";
    } else {
      btn.classList.remove("aba-ativo");
      const cor = obterCorAba(btn.dataset.aba);
      btn.style.background = "transparent";
      btn.style.color = cor.cor;
    }
  });

  // Atualizar conteúdo
  atualizarConteudo();
}

// Função para atualizar conteúdo
function atualizarConteudo() {
  const dados = obterDadosAba(abaAtiva);
  const dadosFiltrados = filtrarPorPeriodo(dados, filtroAtivo.periodo);
  const { cor } = obterCorAba(abaAtiva);
  const emoji = obterEmojiAba(abaAtiva);

  // Atualizar estatísticas
  const totalGastos = dadosFiltrados.reduce((acc, item) => acc + item.valor, 0);
  const totalContratos = dadosFiltrados.length;
  const mediaGastos = totalContratos > 0 ? totalGastos / totalContratos : 0;

  const cards = document.querySelectorAll(".stat-card");
  if (cards.length >= 3) {
    cards[0].innerHTML = `<div class="stat-value" style="color: ${cor};">R$ ${(totalGastos / 1000000).toFixed(2)} Mi</div><div class="stat-label">Total de Gastos</div>`;
    cards[1].innerHTML = `<div class="stat-value" style="color: ${cor};">${totalContratos}</div><div class="stat-label">Projetos</div>`;
    cards[2].innerHTML = `<div class="stat-value" style="color: ${cor};">R$ ${(mediaGastos / 1000000).toFixed(2)} Mi</div><div class="stat-label">Média por Projeto</div>`;
  }

  // Atualizar tabela
  const tbody = document.querySelector("table tbody");
  if (tbody) {
    tbody.innerHTML = "";
    dadosFiltrados.forEach(item => {
      const tr = document.createElement("tr");
      const badgeClass = item.status === "Suspeito" ? "badge-danger" : "badge-success";
      const icon = item.status === "Suspeito" ? "🔴" : "✓";
      tr.innerHTML = `
        <td><strong>${item.nome}</strong></td>
        <td>${item.empresa}</td>
        <td>R$ ${(item.valor / 1000000).toFixed(2)}M</td>
        <td><span class="badge ${badgeClass}">${icon} ${item.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Atualizar título dos gráficos
  const chartsSection = document.querySelector(".section-light");
  if (chartsSection) {
    const titulo = chartsSection.querySelector("h2");
    if (titulo) {
      titulo.textContent = `${emoji} ${obterTituloPorAba(abaAtiva)}`;
    }
  }

  // Atualizar gráficos (simular ou atualizar se Chart.js estiver disponível)
  atualizarGraficos(dadosFiltrados);
}

// Função para obter título da aba
function obterTituloPorAba(aba) {
  switch(aba) {
    case "educacao": return "Análise de Educação e Escolas";
    case "saude": return "Análise de Saúde e Hospitais";
    case "transportes": return "Análise de Transportes";
    default: return "Análise";
  }
}

// Função para atualizar gráficos
function atualizarGraficos(dados) {
  const { cor, rgb } = obterCorAba(abaAtiva);

  // Bar Chart
  const barChart = Chart.helpers.getChart(document.getElementById("barChart"));
  if (barChart) {
    // Agrupar por empresa e somar valores
    const gastosPorEmpresa = {};
    dados.forEach(item => {
      gastosPorEmpresa[item.empresa] = (gastosPorEmpresa[item.empresa] || 0) + item.valor / 1000000;
    });

    barChart.data.labels = Object.keys(gastosPorEmpresa).slice(0, 5);
    barChart.data.datasets[0].label = `Gastos ${obterTituloPorAba(abaAtiva)}`;
    barChart.data.datasets[0].data = Object.values(gastosPorEmpresa).slice(0, 5);
    barChart.data.datasets[0].backgroundColor = cor;
    barChart.update();
  }

  // Line Chart - evolução temporal
  const lineChart = Chart.helpers.getChart(document.getElementById("lineChart"));
  if (lineChart) {
    // Agrupar por mês
    const gastosPorMes = {};
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
    meses.forEach((mes, idx) => {
      gastosPorMes[mes] = Math.random() * 500 + 100;
    });

    lineChart.data.labels = meses;
    lineChart.data.datasets[0].label = `Evolução ${obterTituloPorAba(abaAtiva)}`;
    lineChart.data.datasets[0].data = Object.values(gastosPorMes);
    lineChart.data.datasets[0].borderColor = cor;
    lineChart.data.datasets[0].backgroundColor = `rgba(${rgb}, 0.1)`;
    lineChart.data.datasets[0].pointBackgroundColor = cor;
    lineChart.update();
  }

  // Pie Chart - Distribuição de status
  const pieChart = Chart.helpers.getChart(document.getElementById("pieChart"));
  if (pieChart) {
    const normais = dados.filter(d => d.status === "Normal").length;
    const suspeitos = dados.filter(d => d.status === "Suspeito").length;
    
    pieChart.data.datasets[0].data = [normais, suspeitos];
    pieChart.update();
  }
}

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
  // Setup dos botões de abas
  document.querySelectorAll(".aba-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      trocarAba(btn.dataset.aba);
    });
  });

  // Setup do filtro de período
  const filtroPeriodo = document.getElementById("filtroPeriodo");
  if (filtroPeriodo) {
    filtroPeriodo.addEventListener("change", (e) => {
      filtroAtivo.periodo = e.target.value;
      atualizarConteudo();
    });
  }

  // Carregar conteúdo inicial
  atualizarConteudo();
});
