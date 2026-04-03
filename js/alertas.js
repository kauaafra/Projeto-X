document.addEventListener("DOMContentLoaded", () => {
  if (window.recalcularClassificacaoContratos) {
    window.recalcularClassificacaoContratos();
  }
  const contratos = window.CONTRATOS_GOVSCAN || [];

  function nomeArea(area) {
    if (area === "saude") return "Saúde";
    if (area === "educacao") return "Educação";
    if (area === "transporte") return "Transporte";
    return area;
  }

  const alto = contratos.filter((c) => c.risco === "ALTO").length;
  const atencao = contratos.filter((c) => c.risco === "ATENÇÃO").length;
  const totalAlertas = alto + atencao;

  const cards = document.querySelectorAll(".section-light .stat-card");
  if (cards.length >= 3) {
    cards[0].innerHTML = `<div class="stat-value" style="color: #ef4444;">${alto}</div><div class="stat-label">Alertas de Risco Alto</div>`;
    cards[1].innerHTML = `<div class="stat-value" style="color: #eab308;">${atencao}</div><div class="stat-label">Requerem Atenção</div>`;
    cards[2].innerHTML = `<div class="stat-value" style="color: #f97316;">${totalAlertas}</div><div class="stat-label">Total de Alertas</div>`;
  }

  const lista = document.getElementById("lista-alertas");
  if (!lista) return;

  const alertas = contratos.filter((c) => c.risco === "ALTO" || c.risco === "ATENÇÃO");
  lista.innerHTML = "";

  alertas.forEach((c) => {
    const classe =
      c.risco === "ALTO"
        ? "badge-danger"
        : c.risco === "ATENÇÃO"
          ? "badge-warning"
          : c.risco === "BAIXO"
            ? "badge-info"
            : "badge-success";
    const cor = c.risco === "ALTO" ? "#ef4444" : c.risco === "ATENÇÃO" ? "#eab308" : c.risco === "BAIXO" ? "#3b82f6" : "#10b981";
    const desvio = ((c.valor - c.media) / c.media) * 100;
    const faltaParaMedia = Math.max(0, c.media - c.valor);
    const textoDesvio = c.risco === "BAIXO"
      ? `Falta R$ ${faltaParaMedia.toLocaleString("pt-BR")} para atingir a media da area.`
      : `${desvio.toFixed(1)}%`;
    const marcadores = [];
    if (c.anomalia) marcadores.push("Anomalia estatística");
    if (c.suspeita) marcadores.push("Relação suspeita");
    if (c.alertaFrequencia) marcadores.push("Alta frequência");

    const card = document.createElement("div");
    card.className = "card";
    card.style.marginBottom = "24px";
    card.style.borderLeft = `4px solid ${cor}`;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
        <div>
          <h3 style="margin: 0 0 8px 0;">${nomeArea(c.area)} - ${c.nome}</h3>
          <p style="margin: 0; color: var(--neutral-600); font-weight: 500;">Empresa: <strong>${c.empresa}</strong></p>
        </div>
        <span class="badge ${classe}">${c.risco}</span>
      </div>
      <p style="margin-bottom: 20px; color: var(--neutral-600);">Valor do contrato comparado a media simulada da area.</p>
      ${marcadores.length ? `<p style="margin-bottom: 16px; color: #374151;"><strong>Sinais IA:</strong> ${marcadores.join(" • ")}</p>` : ""}
      <div class="grid" style="gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius); text-align: center;">
          <small style="color: var(--neutral-600); font-weight: 500;">Valor do Contrato</small>
          <p style="font-size: 1.3rem; font-weight: 700; color: ${cor}; margin: 8px 0;">R$ ${c.valor.toLocaleString("pt-BR")}</p>
        </div>
        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius); text-align: center;">
          <small style="color: var(--neutral-600); font-weight: 500;">Media da Area</small>
          <p style="font-size: 1.3rem; font-weight: 700; color: #10b981; margin: 8px 0;">R$ ${c.media.toLocaleString("pt-BR")}</p>
        </div>
        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius); text-align: center;">
          <small style="color: var(--neutral-600); font-weight: 500;">Desvio</small>
          <p style="font-size: 1.1rem; font-weight: 700; color: #f97316; margin: 8px 0;">${textoDesvio}</p>
        </div>
      </div>
    `;
    lista.appendChild(card);
  });
});
