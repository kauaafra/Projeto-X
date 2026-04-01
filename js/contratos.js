let contratos = [];

function mapearStatus(risco) {
  if (risco === "ALTO") return "🔴 Risco Alto";
  if (risco === "ATENÇÃO") return "🟡 Atenção";
  if (risco === "BAIXO") return "🔵 Baixo";
  return "🟢 Normal";
}

function buscarDados() {
  if (window.recalcularClassificacaoContratos) {
    window.recalcularClassificacaoContratos();
  }
  const base = window.CONTRATOS_GOVSCAN || [];
  contratos = base.filter((c) => c.estado === "Tocantins");
  mostrarNaTela(contratos);
}

function mostrarNaTela(dados) {
  const container = document.getElementById("resultado");
  if (!container) return;

  container.innerHTML = "";

  dados.forEach((item) => {
    const desvio = ((item.valor - item.media) / item.media) * 100;
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${item.area} - ${item.nome}</h3>
      <p><strong>Empresa:</strong> ${item.empresa}</p>
      <p><strong>Valor:</strong> R$ ${item.valor.toLocaleString("pt-BR")}</p>
      <p><strong>Média da área:</strong> R$ ${item.media.toLocaleString("pt-BR")}</p>
      <p><strong>Desvio:</strong> ${desvio.toFixed(1)}%</p>
      <p><strong>Status:</strong> ${mapearStatus(item.risco)}</p>
    `;
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", buscarDados);
