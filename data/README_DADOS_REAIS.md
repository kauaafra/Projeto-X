# Dados Reais do Tocantins

Este projeto usa o arquivo js/dados-reais.js como fonte prioritaria de dados.
Se o arquivo estiver vazio, o sistema usa simulacao automaticamente.

## Passo a passo para substituir simulacao

1. Crie o arquivo data/contratos-tocantins.json com um array de contratos.
2. Use data/contratos-tocantins.template.json como modelo.
3. Execute no terminal:

node backend/consolidar-dados-reais.js

4. O script vai gerar:
- js/dados-reais.js
- data/benchmark-tocantins.json

5. Recarregue as paginas do site.

## Campos esperados por contrato

- id
- objeto (ou nome)
- categoria (Saude, Educacao, Transporte)
- empresa
- cnpj
- valor
- valor_referencia (opcional)
- data_assinatura (YYYY-MM-DD)
- orgao
- municipio
- fonte

## Fontes recomendadas para coletar dados

- PNCP
- Compras.gov.br
- Portal da Transparencia do Estado do Tocantins
- Portais municipais (ex.: Palmas)

## Observacao

Sempre mantenha rastreabilidade de fonte em cada contrato para auditoria.
