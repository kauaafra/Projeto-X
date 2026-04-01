function formatarMilhoes(valor) {
  return `R$ ${(valor / 1000000).toFixed(2).replace(".", ",")} Mi`;
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.recalcularClassificacaoContratos) {
    window.recalcularClassificacaoContratos();
  }
  const contratos = window.CONTRATOS_GOVSCAN || [];

  const total = contratos.reduce((acc, c) => acc + c.valor, 0);
  const qtd = contratos.length;
  const alertas = contratos.filter((c) => c.risco === "ALTO" || c.risco === "ATENÇÃO").length;

  const cards = document.querySelectorAll(".section-dark .stat-card");
  if (cards.length >= 3) {
    cards[0].innerHTML = `<div class="stat-value" style="color: #4ade80;">${qtd}</div><div class="stat-label">Contratos Analisados</div>`;
    cards[1].innerHTML = `<div class="stat-value" style="color: #facc15;">${formatarMilhoes(total)}</div><div class="stat-label">Total em Gastos Monitorados</div>`;
    cards[2].innerHTML = `<div class="stat-value" style="color: #f87171;">${alertas}</div><div class="stat-label">Alertas Gerados</div>`;
  }
});
