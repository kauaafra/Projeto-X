<!-- DOCUMENTAÇÃO DE INTEGRAÇÃO COM APIs DE TRANSPARÊNCIA -->

# 📊 Sistema de Integração com Portais de Transparência

## ✅ Status da Implementação

Sistema implementado com **fallback inteligente** que funciona em 3 níveis:

### Nível 1️⃣: APIs Reais (quando disponíveis)
- ✔️ Portal da Transparência do Tocantins
- ✔️ Portal da Transparência de Palmas  
- ✔️ Dados.gov.br
- ✔️ Compras.gov.br
- ✔️ Portal da Transparência Federal

### Nível 2️⃣: Dados Simulados Realistas
Se as APIs não responderem, o sistema carrega **dados simulados** baseados em:
- ✔️ Contratos reais do Tocantins
- ✔️ Empresas e CNPJs válidos
- ✔️ Valores de mercado realistas
- ✔️ Datas e períodos atualizados

### Nível 3️⃣: Fallback Simples
Se tudo falhar, mantém um banco mínimo funcionando

---

## 🔗 Arquivos Envolvidos

### `js/apis.js` - Orquestrador de APIs
```javascript
// Carrega dados de múltiplas fontes
buscarTodosDados()      // Executa todas as buscas em paralelo
validarCNPJ(cnpj)      // Valida CNPJ na Receita Federal (simulado)
```

### `js/dashboard.js` - Dashboard com filtros
```javascript
// Usa os dados carregados pelo apis.js
filtrarDados()          // Filtra por período e tipo
atualizarGraficos()     // Atualiza gráficos em tempo real
atualizarTabela()       // Atualiza tabela de contratos
```

### `js/contratos.js` - Análise de contratos (Home)
```javascript
// Análise automática com detecção de anomalias
analisarContratos()     // Identifica valores suspeitos
buscarDados()          // Carrega dados dos portais
```

---

## 🎯 Como Funciona

### 1. **Carregamento de Dados**
```
Page Load
  ↓
js/apis.js carrega
  ↓
Tenta conectar em 5 APIs em paralelo
  ↓
Se sucesso: usa dados reais
Se erro: usa dados simulados
  ↓
window.dadosInfraestrutura fica disponível
  ↓
Dashboard/Contratos usa os dados
```

### 2. **Filtros em Tempo Real**
```
Usuário muda filtro
  ↓
filtrarDados() processa
  ↓
Compara com data limite
  ↓
Atualiza gráficos e tabela
  ↓
Estatísticas são recalculadas
```

### 3. **Validação de Dados**
- CNPJs com máscara validada
- Datas normalizadas
- Valores em formato numérico
- Fontes de dados rastreáveis

---

## 🚀 Adicionando Novos Portais

Para adicionar uma nova API, edite `js/apis.js`:

```javascript
// 1. Criar função para buscar dados
async function buscarDadosNovoPortal() {
  try {
    const response = await fetch("https://api.novo-portal.gov.br/contratos");
    return await response.json();
  } catch (erro) {
    console.warn("Erro:", erro);
    return null;
  }
}

// 2. Adicionar à função buscarTodosDados()
const [novo] = await Promise.all([
  buscarDadosNovoPortal(),
  // ... outras APIs
]);

// 3. Combinar dados
const dadosReais = [
  ...novo || [],
  // ... outros dados
];
```

---

## 📋 Estrutura de Dados Esperada

Cada contrato deve ter:
```javascript
{
  id: 1,                              // Identificador único
  tipo: "vias",                       // Tipo de infraestrutura
  empresa: "Construtora ABC",         // Razão social
  valor: 2500000,                     // Valor em reais
  data: "2025-12-10",                 // YYYY-MM-DD
  descricao: "Pavimentação BR-153",  // Descrição do projeto
  cnpj: "12.345.678/0001-90",        // CNPJ da empresa
  fonte: "Portal da Transparência"    // Origem dos dados
}
```

---

## 🧪 Testando o Sistema

### No Console do Navegador:
```javascript
// Ver dados carregados
console.log(window.dadosInfraestrutura);

// Buscar novamente
await window.buscarTodosDados();

// Validar CNPJ
await window.validarCNPJ("12.345.678/0001-90");
```

### Na Página:
1. Abrir Developer Tools (F12)
2. Ir para aba "Console"
3. Ver logs de carregamento
4. Mudar filtros e verificar atualizações

---

## 🌐 URLs dos Portais Utilizados

| Portal | URL | Status |
|--------|-----|--------|
| 🏢 Transparência Tocantins | https://transparencia.to.gov.br/ | ✔️ Integrado |
| 🏙️ Transparência Palmas | https://transparencia.palmas.to.gov.br/ | ✔️ Integrado |
| 📊 Dados.gov.br | https://dados.gov.br/ | ✔️ Integrado |
| 🛒 Compras.gov.br | https://www.gov.br/compras/pt-br | ✔️ Integrado |
| 🔍 Portal da Transparência | https://portaldatransparencia.gov.br/ | ✔️ Integrado |
| 📋 Receita Federal | https://www.gov.br/receitafederal/pt-br | ⏳ Validação CNPJ |
| ⚖️ Tribunal de Contas | https://www.tcu.gov.br/ | 🔄 Futuro |
| 🏛️ CGU | https://www.gov.br/cgu/ | 🔄 Futuro |

---

## 💡 Próximas Melhorias

- [ ] Autenticação para APIs que requerem token
- [ ] Cache de dados com atualização periódica
- [ ] Integração com Tribunal de Contas
- [ ] Alertas de anomalias automáticos
- [ ] Export de relatórios em PDF
- [ ] Gráficos comparativos entre períodos

---

## ⚠️ Notas Importantes

1. **CORS**: Algumas APIs podem ter restrições CORS. Use um proxy se necessário.
2. **Rate Limiting**: Dados.gov.br pode ter limites de requisições.
3. **Dados Simulados**: Usados para demonstração e testes. Totalmente realistas e baseados em padrões reais.
4. **Atualização**: Implementar cron job para atualizar dados diariamente em produção.

---

## 🔧 Suporte

Para adicionar mais fontes de dados ou resolver problemas,:

1. Verificar console.log() em `js/apis.js`
2. Validar formato de resposta das APIs
3. Testar com dados simulados primeiro
4. Fazer push para API real quando validado

---

**Última atualização**: 2026-04-01  
**Desenvolvedor**: GovScan Team
