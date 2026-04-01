// Importar dados quando estiver disponível
let dadosInfraestrutura = [];

// Variáveis de estado dos filtros
let filtrosAtivos = {
  estado: "tocantins",
  infraestrutura: "todos",
  periodo: "6meses"
};

// Mapa de tipos de infraestrutura
const tiposInfraestrutura = {
  todos: "Todos os Tipos",
  educacao: "Educação e Escolas",
  saude: "Saúde e Hospitais",
  transportes: "Transportes"
};

// Função para obter a data limite baseada no período
function obterDataLimite(periodo) {
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

  return dataLimite;
}

// Função para filtrar dados
function filtrarDados() {
  const dataLimite = obterDataLimite(filtrosAtivos.periodo);

  return dadosInfraestrutura.filter(item => {
    // Filtrar por infraestrutura
    const passaInfraestrutura = filtrosAtivos.infraestrutura === "todos" || item.tipo === filtrosAtivos.infraestrutura;

    // Filtrar por período
    const dataItem = new Date(item.data);
    const passaPeriodo = dataItem >= dataLimite;

    return passaInfraestrutura && passaPeriodo;
  });
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
  const dadosFiltrados = filtrarDados();

  const totalGastos = dadosFiltrados.reduce((acc, item) => acc + item.valor, 0);
  const totalContratos = dadosFiltrados.length;
  const mediaGastos = totalContratos > 0 ? totalGastos / totalContratos : 0;

  // Atualizar os cards de estatísticas
  const cards = document.querySelectorAll(".stat-card");
  if (cards.length >= 3) {
    cards[0].innerHTML = `<div class="stat-value" style="color: #3b82f6;">R$ ${(totalGastos / 1000000).toFixed(2)} Mi</div><div class="stat-label">Total de Gastos Analisados</div>`;
    cards[1].innerHTML = `<div class="stat-value" style="color: #10b981;">${totalContratos}</div><div class="stat-label">Contratos Processados</div>`;
    cards[2].innerHTML = `<div class="stat-value" style="color: #f97316;">R$ ${(mediaGastos / 1000000).toFixed(2)} Mi</div><div class="stat-label">Média por Contrato</div>`;
  }
}

// Função para atualizar gráficos
function atualizarGraficos() {
  const dadosFiltrados = filtrarDados();

  // Agrupar por tipo de infraestrutura
  const gastosPorTipo = {};
  Object.keys(tiposInfraestrutura).forEach(tipo => {
    if (tipo !== "todos") {
      gastosPorTipo[tiposInfraestrutura[tipo]] = 0;
    }
  });

  dadosFiltrados.forEach(item => {
    const tipo = tiposInfraestrutura[item.tipo];
    gastosPorTipo[tipo] = (gastosPorTipo[tipo] || 0) + item.valor / 1000000;
  });

  // Atualizar Bar Chart
  const barChart = Chart.helpers.getChart(document.getElementById("barChart"));
  if (barChart) {
    barChart.data.labels = Object.keys(gastosPorTipo);
    barChart.data.datasets[0].data = Object.values(gastosPorTipo);
    barChart.update();
  }
}

// Função para atualizar tabela
function atualizarTabela() {
  const dadosFiltrados = filtrarDados();
  const tbody = document.querySelector("table tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  dadosFiltrados.slice(0, 5).forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.descricao}</strong></td>
      <td>${item.empresa}</td>
      <td>R$ ${(item.valor / 1000000).toFixed(2)}M</td>
      <td><span class="badge badge-success">✓ Regular</span></td>
    `;
    tbody.appendChild(tr);
  });

  if (dadosFiltrados.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align: center; color: #999;">Nenhum contrato encontrado para os filtros selecionados</td>`;
    tbody.appendChild(tr);
  }
}

// Função para aplicar filtros
function aplicarFiltros() {
  atualizarEstatisticas();
  atualizarGraficos();
  atualizarTabela();
}

// Event listeners dos filtros
document.addEventListener("DOMContentLoaded", function() {
  // Aguardar dados serem carregados do APIs
  if (window.buscarTodosDados) {
    window.buscarTodosDados().then(dados => {
      dadosInfraestrutura = dados;
      aplicarFiltrosIniciais();
    });
  } else {
    // Fallback se apis.js não carregou
    console.warn("⚠️ APIs não carregadas, usando dados padrão");
    aplicarFiltrosIniciais();
  }
});

function aplicarFiltrosIniciais() {
  const filtroEstado = document.getElementById("filtroEstado");
  const filtroInfraestrutura = document.getElementById("filtroInfraestrutura");
  const filtroPeriodo = document.getElementById("filtroPeriodo");

  if (filtroEstado) {
    filtroEstado.addEventListener("change", (e) => {
      filtrosAtivos.estado = e.target.value;
      aplicarFiltros();
    });
  }

  if (filtroInfraestrutura) {
    filtroInfraestrutura.addEventListener("change", (e) => {
      filtrosAtivos.infraestrutura = e.target.value;
      aplicarFiltros();
    });
  }

  if (filtroPeriodo) {
    filtroPeriodo.addEventListener("change", (e) => {
      filtrosAtivos.periodo = e.target.value;
      aplicarFiltros();
    });
  }

  // Aplicar filtros iniciais
  aplicarFiltros();
}
