// 📊 DADOS SIMULADOS PARA TESTE - COM SELECKS DE FILTRO

// 🎓 EDUCAÇÃO E ESCOLAS
const dadosEducacao = [
  { id: 1, nome: "Reforma Escola Estadual Zona Leste", empresa: "ConstroEdu LTDA", valor: 2100000, data: "2025-12-15", cidade: "Palmas", status: "Suspeito" },
  { id: 2, nome: "Construção Escola Municipal Rural", empresa: "BuildSchool LTDA", valor: 1200000, data: "2025-11-20", cidade: "Araguaína", status: "Normal" },
  { id: 3, nome: "Ampliação Bloco de Salas - Colégio Estadual", empresa: "Obra Civil TO", valor: 1850000, data: "2025-10-10", cidade: "Palmas", status: "Normal" },
  { id: 4, nome: "Reforma Biblioteca Municipal", empresa: "Reformas Educacionais", valor: 450000, data: "2025-09-05", cidade: "Gurupi", status: "Normal" },
  { id: 5, nome: "Construção Quadra Coberta - Escola Federal", empresa: "ConstroTO LTDA", valor: 980000, data: "2025-08-12", cidade: "Porto Nacional", status: "Normal" },
  { id: 6, nome: "Laboratório de Informática com Equipamentos", empresa: "Tech Education LTDA", valor: 350000, data: "2025-12-01", cidade: "Tocantinópolis", status: "Normal" },
  { id: 7, nome: "Pintura e Revitalização - 15 Escolas", empresa: "ServiçosPaint TO", valor: 280000, data: "2025-11-30", cidade: "Palmas", status: "Normal" },
  { id: 8, nome: "Reforma Escola Integral Zona Norte", empresa: "ConstroEdu LTDA", valor: 1650000, data: "2025-12-10", cidade: "Palmas", status: "Normal" },
  { id: 9, nome: "Construção Pré-escola Araguaína", empresa: "BuildSchool LTDA", valor: 850000, data: "2025-11-05", cidade: "Araguaína", status: "Normal" },
  { id: 10, nome: "Aquisição Carteiras e Mobiliário Escolar", empresa: "MóvelTO LTDA", valor: 420000, data: "2025-10-22", cidade: "Palmas", status: "Normal" },
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
  { id: 8, nome: "Ampliação Farmácia do Hospital Estadual", empresa: "ConstroMed LTDA", valor: 520000, data: "2025-12-08", cidade: "Palmas", status: "Normal" },
  { id: 9, nome: "Aquisição Cama Hospitalar e Monitores", empresa: "MedEquip Brasil", valor: 380000, data: "2025-11-18", cidade: "Araguaína", status: "Normal" },
  { id: 10, nome: "Reforma Bloco Cirúrgico", empresa: "HospitalWorks", valor: 2100000, data: "2025-10-28", cidade: "Palmas", status: "Normal" },
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
  { id: 8, nome: "Reforma Estação de Transporte", empresa: "ConstroTerminal LTDA", valor: 1200000, data: "2025-12-01", cidade: "Araguaína", status: "Normal" },
  { id: 9, nome: "Aquisição Ônibus Escolar", empresa: "Veículos Brasil LTDA", valor: 3200000, data: "2025-11-12", cidade: "Palmas", status: "Normal" },
  { id: 10, nome: "Manutenção e Reparação de Vias", empresa: "ViasBrasil LTDA", valor: 750000, data: "2025-10-18", cidade: "Tocantinópolis", status: "Normal" },
];

// Estado global
let filtrosAtivos = {
  infraestrutura: "educacao",
  periodo: "6meses"
};

// Função para obter dados da infraestrutura
function obterDados(infraestrutura) {
  switch(infraestrutura) {
    case "educacao": return dadosEducacao;
    case "saude": return dadosSaude;
    case "transportes": return dadosTransportes;
    default: return [];
  }
}

// Função para obter cor por infraestrutura
function obterCorInfraestrutura(infraestrutura) {
  switch(infraestrutura) {
    case "educacao": return { cor: "#3b82f6", rgb: "59, 130, 246" };
    case "saude": return { cor: "#ef4444", rgb: "239, 68, 68" };
    case "transportes": return { cor: "#10b981", rgb: "16, 185, 129" };
    default: return { cor: "#666", rgb: "102, 102, 102" };
  }
}

// Função para obtém emoji
function obterEmojiInfraestrutura(infraestrutura) {
  switch(infraestrutura) {
    case "educacao": return "🎓";
    case "saude": return "🏥";
    case "transportes": return "🚌";
    default: return "📊";
  }
}

// Função para obter nome da infraestrutura
function obterNomeInfraestrutura(infraestrutura) {
  switch(infraestrutura) {
    case "educacao": return "Educação e Escolas";
    case "saude": return "Saúde e Hospitais";
    case "transportes": return "Transportes";
    default: return "Infraestrutura";
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

// Função para atualizar conteúdo
function atualizarConteudo() {
  console.log(`🔄 Puxando dados de ${obterNomeInfraestrutura(filtrosAtivos.infraestrutura)} (${filtrosAtivos.periodo})...`);
  
  // Simular carregamento
  const cards = document.querySelectorAll(".stat-card");
  if (cards.length >= 3) {
    cards[0].innerHTML = `<div class="stat-value" style="color: #999;">⏳ Carregando...</div><div class="stat-label">Total de Gastos</div>`;
    cards[1].innerHTML = `<div class="stat-value" style="color: #999;">⏳ Carregando...</div><div class="stat-label">Projetos</div>`;
    cards[2].innerHTML = `<div class="stat-value" style="color: #999;">⏳ Carregando...</div><div class="stat-label">Média por Projeto</div>`;
  }
  
  // Simular delay da "API"
  setTimeout(() => {
    const dados = obterDados(filtrosAtivos.infraestrutura);
    const dadosFiltrados = filtrarPorPeriodo(dados, filtrosAtivos.periodo);
    const { cor } = obterCorInfraestrutura(filtrosAtivos.infraestrutura);
    const emoji = obterEmojiInfraestrutura(filtrosAtivos.infraestrutura);

    console.log(`✅ ${dadosFiltrados.length} registros encontrados!`);

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
      if (dadosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999; padding: 20px;">Nenhum projeto encontrado neste período</td></tr>`;
      } else {
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
    }

    // Atualizar gráficos
    atualizarGraficos(dadosFiltrados);
    
  }, 600); // Simular delay de 600ms como se fosse buscar dados
}

// Função para atualizar gráficos
function atualizarGraficos(dados) {
  const { cor, rgb } = obterCorInfraestrutura(filtrosAtivos.infraestrutura);

  // Bar Chart - Gastos por empresa
  const barEl = document.getElementById("barChart");
  const barChart = Chart.getChart ? Chart.getChart(barEl) : Chart.helpers?.getChart?.(barEl);
  if (barChart) {
    // Agrupar por empresa e somar valores
    const gastosPorEmpresa = {};
    dados.forEach(item => {
      gastosPorEmpresa[item.empresa] = (gastosPorEmpresa[item.empresa] || 0) + item.valor / 1000000;
    });

    // Ordenar por valor decrescente e pegar top 5
    const empresasOrdenadas = Object.keys(gastosPorEmpresa)
      .sort((a, b) => gastosPorEmpresa[b] - gastosPorEmpresa[a])
      .slice(0, 5);

    const valoresOrdenados = empresasOrdenadas.map(emp => gastosPorEmpresa[emp]);

    barChart.data.labels = empresasOrdenadas;
    barChart.data.datasets[0].label = `Gastos por Empresa - ${obterNomeInfraestrutura(filtrosAtivos.infraestrutura)}`;
    barChart.data.datasets[0].data = valoresOrdenados;
    barChart.data.datasets[0].backgroundColor = [cor, cor, cor, cor, cor];
    barChart.options.plugins.legend.display = false;
    barChart.update();
  }

  // Line Chart - Evolução temporal por mês
  const lineEl = document.getElementById("lineChart");
  const lineChart = Chart.getChart ? Chart.getChart(lineEl) : Chart.helpers?.getChart?.(lineEl);
  if (lineChart) {
    // Agrupar por mês (simulado baseado nos dados reais)
    const gastosPorMes = {
      "Junho": 0,
      "Julho": 0,
      "Agosto": 0,
      "Setembro": 0,
      "Outubro": 0,
      "Novembro": 0,
      "Dezembro": 0
    };

    dados.forEach(item => {
      const data = new Date(item.data);
      const mes = data.toLocaleString('pt-BR', { month: 'long' });
      const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
      if (gastosPorMes.hasOwnProperty(mesCapitalizado)) {
        gastosPorMes[mesCapitalizado] += item.valor / 1000000;
      }
    });

    lineChart.data.labels = Object.keys(gastosPorMes);
    lineChart.data.datasets[0].label = `Evolução de Gastos - ${obterNomeInfraestrutura(filtrosAtivos.infraestrutura)}`;
    lineChart.data.datasets[0].data = Object.values(gastosPorMes);
    lineChart.data.datasets[0].borderColor = cor;
    lineChart.data.datasets[0].backgroundColor = `rgba(${rgb}, 0.1)`;
    lineChart.data.datasets[0].pointBackgroundColor = cor;
    lineChart.data.datasets[0].fill = true;
    lineChart.update();
  }

  // Pie Chart - Distribuição de status
  const pieEl = document.getElementById("pieChart");
  const pieChart = Chart.getChart ? Chart.getChart(pieEl) : Chart.helpers?.getChart?.(pieEl);
  if (pieChart) {
    const normais = dados.filter(d => d.status === "Normal").length;
    const suspeitos = dados.filter(d => d.status === "Suspeito").length;
    
    pieChart.data.labels = ["Regular", "Requer Atenção"];
    pieChart.data.datasets[0].data = [normais, suspeitos];
    pieChart.data.datasets[0].backgroundColor = ['#10b981', '#ef4444'];
    pieChart.update();
  }
}

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
  // Setup dos filtros
  const filtroInfraestrutura = document.getElementById("filtroInfraestrutura");
  const filtroPeriodo = document.getElementById("filtroPeriodo");

  if (filtroInfraestrutura) {
    filtroInfraestrutura.addEventListener("change", (e) => {
      filtrosAtivos.infraestrutura = e.target.value;
      atualizarConteudo();
    });
  }

  if (filtroPeriodo) {
    filtroPeriodo.addEventListener("change", (e) => {
      filtrosAtivos.periodo = e.target.value;
      atualizarConteudo();
    });
  }

  // Carregar conteúdo inicial
  atualizarConteudo();
});
