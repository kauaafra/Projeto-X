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
  chartBar = new Chart(document.getElementById("barChart"), {
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

  chartLine = new Chart(document.getElementById("lineChart"), {
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

  chartPie = new Chart(document.getElementById("pieChart"), {
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

  atualizarDashboard();
});
