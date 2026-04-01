// 📊 SIMULADOR COMPLETO DO DASHBOARD COM EVOLUÇÃO TEMPORAL

// 🎓 EDUCAÇÃO E ESCOLAS
const dadosEducacao = [
  { id: 1, nome: "Reforma Escola Estadual Zona Leste", empresa: "ConstroEdu LTDA", valor: 2100000, data: "2025-12-15", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Construção Escola Municipal Rural", empresa: "BuildSchool LTDA", valor: 1200000, data: "2025-11-20", cidade: "Araguaína", status: "Normal" },
  { id: 3, nome: "Ampliação Bloco de Salas - Colégio Estadual", empresa: "Obra Civil TO", valor: 1850000, data: "2025-10-10", cidade: "Palmas", status: "Normal" },
  { id: 4, nome: "Reforma Biblioteca Municipal", empresa: "Reformas Educacionais", valor: 450000, data: "2025-09-05", cidade: "Gurupi", status: "Normal" },
  { id: 5, nome: "Construção Quadra Coberta - Escola Federal", empresa: "ConstroTO LTDA", valor: 980000, data: "2025-08-12", cidade: "Porto Nacional", status: "Normal" },
];

// 🏥 SAÚDE E HOSPITAIS
const dadosSaude = [
  { id: 1, nome: "Reforma Hospital Geral de Palmas", empresa: "ConstroMed LTDA", valor: 4500000, data: "2025-12-10", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Aquisição Equipamentos Ressonância Magnética", empresa: "MedEquip Brasil", valor: 1200000, data: "2025-11-20", cidade: "Palmas", status: "Normal" },
  { id: 3, nome: "Ampliação Unidade de Terapia Intensiva", empresa: "HospitalWorks", valor: 2350000, data: "2025-10-15", cidade: "Araguaína", status: "Normal" },
  { id: 4, nome: "Reforma UPA - Unidade de Pronto Atendimento", empresa: "ConstroSaude TO", valor: 820000, data: "2025-09-08", cidade: "Porto Nacional", status: "Normal" },
  { id: 5, nome: "Aquisição de Ventiladores Pulmonares", empresa: "Equipment Medical", valor: 650000, data: "2025-08-20", cidade: "Tocantinópolis", status: "Normal" },
];

// 🚌 TRANSPORTES
const dadosTransportes = [
  { id: 1, nome: "Renovação Frota Ônibus Público Palmas", empresa: "Transportes e Logística TO", valor: 5600000, data: "2025-12-12", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Aquisição Ônibus Interurbano", empresa: "Veículos Brasil LTDA", valor: 2200000, data: "2025-11-15", cidade: "Palmas", status: "Normal" },
  { id: 3, nome: "Reforma Terminal Rodoviário", empresa: "ConstroTerminal LTDA", valor: 1850000, data: "2025-10-20", cidade: "Palmas", status: "Normal" },
  { id: 4, nome: "Manutenção Frota Táxis Amarelos", empresa: "ManuTransTO", valor: 450000, data: "2025-09-18", cidade: "Araguaína", status: "Normal" },
  { id: 5, nome: "Implantação Sistema BRT - Corredor de Ônibus", empresa: "TransportSystems Brasil", valor: 4200000, data: "2025-08-25", cidade: "Palmas", status: "Normal" },
];

// 📅 DADOS HISTÓRICOS - Evolução temporal
const dadosHistoricos = {
  "6meses": { 
    educacao: [350, 380, 320, 410, 390, 440],
    saude: [720, 680, 750, 700, 780, 850],
    transportes: [950, 900, 1050, 1000, 1100, 1200]
  },
  "3meses": { 
    educacao: [350, 410, 440],
    saude: [700, 750, 850],
    transportes: [1000, 1100, 1200]
  },
  "1mes": { 
    educacao: [440],
    saude: [850],
    transportes: [1200]
  }
};

const nomeMeses = {
  "6meses": ["Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro"],
  "3meses": ["Outubro", "Novembro", "Dezembro"],
  "1mes": ["Dezembro"]
};

let barChart = null;
let lineChart = null;
let pieChart = null;

let filtrosAtivos = {
  infraestrutura: "educacao",
  periodo: "6meses"
};

// FUNÇÕES UTILITÁRIAS
function obterDados(inf) {
  if (inf === "educacao") return dadosEducacao;
  if (inf === "saude") return dadosSaude;
  if (inf === "transportes") return dadosTransportes;
  return [];
}

function obterCor(inf) {
  if (inf === "educacao") return { cor: "#3b82f6", rgb: "59, 130, 246" };
  if (inf === "saude") return { cor: "#ef4444", rgb: "239, 68, 68" };
  if (inf === "transportes") return { cor: "#10b981", rgb: "16, 185, 129" };
  return { cor: "#666", rgb: "102, 102, 102" };
}

function obterNome(inf) {
  if (inf === "educacao") return "Educação e Escolas";
  if (inf === "saude") return "Saúde e Hospitais";
  if (inf === "transportes") return "Transportes";
  return "Infraestrutura";
}

function filtrarPorPeriodo(dados, periodo) {
  const hoje = new Date();
  let dataLimite = new Date();

  if (periodo === "1mes") dataLimite.setMonth(hoje.getMonth() - 1);
  else if (periodo === "3meses") dataLimite.setMonth(hoje.getMonth() - 3);
  else if (periodo === "2semanas") dataLimite.setDate(hoje.getDate() - 14);
  else dataLimite.setMonth(hoje.getMonth() - 6);

  return dados.filter(item => new Date(item.data) >= dataLimite);
}

// ATUALIZAR DASHBOARD
function atualizarDashboard() {
  console.log(`🔄 Carregando dados de ${obterNome(filtrosAtivos.infraestrutura)}...`);
  
  const cards = document.querySelectorAll(".stat-card");
  cards.forEach(card => {
    card.innerHTML = '<div class="stat-value" style="color: #999;">⏳ Carregando...</div><div class="stat-label">Buscando dados...</div>';
  });

  setTimeout(() => {
    const dados = obterDados(filtrosAtivos.infraestrutura);
    const dadosFiltrados = filtrarPorPeriodo(dados, filtrosAtivos.periodo);
    const { cor, rgb } = obterCor(filtrosAtivos.infraestrutura);

    console.log(`✅ ${dadosFiltrados.length} registros encontrados!`);

    // ATUALIZAR CARDS
    const totalGastos = dadosFiltrados.reduce((a, b) => a + b.valor, 0);
    const media = dadosFiltrados.length > 0 ? totalGastos / dadosFiltrados.length : 0;

    const cardsArray = Array.from(cards);
    if (cardsArray[0]) cardsArray[0].innerHTML = `<div class="stat-value" style="color: ${cor};">R$ ${(totalGastos / 1000000).toFixed(2)} Mi</div><div class="stat-label">Total de Gastos</div>`;
    if (cardsArray[1]) cardsArray[1].innerHTML = `<div class="stat-value" style="color: ${cor};">${dadosFiltrados.length}</div><div class="stat-label">Projetos</div>`;
    if (cardsArray[2]) cardsArray[2].innerHTML = `<div class="stat-value" style="color: ${cor};">R$ ${(media / 1000000).toFixed(2)} Mi</div><div class="stat-label">Média/Projeto</div>`;

    // ATUALIZAR TABELA
    const tbody = document.querySelector("table tbody");
    if (tbody) {
      tbody.innerHTML = "";
      dadosFiltrados.forEach(item => {
        const badge = item.status === "Suspeito" ? "badge-danger" : "badge-success";
        const icon = item.status === "Suspeito" ? "🔴" : "✓";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${item.nome}</strong></td>
          <td>${item.empresa}</td>
          <td>R$ ${(item.valor / 1000000).toFixed(2)}M</td>
          <td><span class="badge ${badge}">${icon} ${item.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }

    // ATUALIZAR GRÁFICOS
    if (barChart) updateBarChart(dadosFiltrados, cor);
    if (lineChart) updateLineChart(cor, rgb);
    if (pieChart) updatePieChart(dadosFiltrados);

  }, 600);
}

function updateBarChart(dados, cor) {
  const gastos = {};
  dados.forEach(item => {
    gastos[item.empresa] = (gastos[item.empresa] || 0) + item.valor / 1000000;
  });

  const empresas = Object.keys(gastos).sort((a, b) => gastos[b] - gastos[a]).slice(0, 5);
  
  barChart.data.labels = empresas;
  barChart.data.datasets[0].data = empresas.map(e => gastos[e]);
  barChart.data.datasets[0].backgroundColor = cor;
  barChart.update();
}

function updateLineChart(cor, rgb) {
  const meses = nomeMeses[filtrosAtivos.periodo];
  const historico = dadosHistoricos[filtrosAtivos.periodo][filtrosAtivos.infraestrutura];
  
  lineChart.data.labels = meses;
  lineChart.data.datasets[0].data = historico;
  lineChart.data.datasets[0].borderColor = cor;
  lineChart.data.datasets[0].backgroundColor = `rgba(${rgb}, 0.1)`;
  lineChart.data.datasets[0].pointBackgroundColor = cor;
  lineChart.update();
}

function updatePieChart(dados) {
  const normal = dados.filter(d => d.status === "Normal").length;
  const suspeito = dados.filter(d => d.status === "Suspeito").length;
  
  pieChart.data.datasets[0].data = [normal, suspeito];
  pieChart.update();
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", function() {
  // Criar gráficos
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: { 
      labels: [], 
      datasets: [{ 
        label: "Gastos por Empresa (Milhões)", 
        data: [], 
        backgroundColor: "#3b82f6", 
        borderRadius: 8 
      }] 
    },
    options: { 
      responsive: true, 
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: { 
      labels: [], 
      datasets: [{ 
        label: "Evolução de Gastos (Milhões)", 
        data: [], 
        fill: true, 
        backgroundColor: "rgba(59, 130, 246, 0.1)", 
        borderColor: "#3b82f6", 
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#3b82f6"
      }] 
    },
    options: { 
      responsive: true, 
      plugins: { legend: { display: true, position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: { 
      labels: ["Regular ✓", "Requer Atenção 🔴"], 
      datasets: [{ 
        data: [], 
        backgroundColor: ["#10b981", "#ef4444"], 
        borderColor: "white", 
        borderWidth: 2 
      }] 
    },
    options: { 
      responsive: true, 
      plugins: { legend: { position: "bottom" } } 
    }
  });

  // Event listeners
  const filtroInfraestrutura = document.getElementById("filtroInfraestrutura");
  const filtroPeriodo = document.getElementById("filtroPeriodo");

  if (filtroInfraestrutura) {
    filtroInfraestrutura.addEventListener("change", (e) => {
      filtrosAtivos.infraestrutura = e.target.value;
      atualizarDashboard();
    });
  }

  if (filtroPeriodo) {
    filtroPeriodo.addEventListener("change", (e) => {
      filtrosAtivos.periodo = e.target.value;
      atualizarDashboard();
    });
  }

  // Carregar inicial
  atualizarDashboard();
});
