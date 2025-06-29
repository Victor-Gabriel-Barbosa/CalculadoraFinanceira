# 🧮 Calculadora Financeira

Uma calculadora financeira completa no estilo de calculadora física tradicional, desenvolvida com HTML, CSS e JavaScript puro.

## 🌐 Demo Online

**[🔗 Acesse a Calculadora](https://victor-gabriel-barbosa.github.io/CalculadoraFinanceira/)**

Experimente a calculadora diretamente no seu navegador através do GitHub Pages.

## 📋 Funcionalidades

### Variáveis Financeiras
- **PV** (Present Value) - Valor Presente
- **FV** (Future Value) - Valor Futuro  
- **i** (Interest) - Taxa de Juros por período
- **n** (Number) - Número de períodos

### Operações Especiais
- **CPT** - Calcula automaticamente a variável faltante
- **AC** - Limpa todos os valores (All Clear)
- **CE** - Limpa apenas a entrada atual (Clear Entry)
- **+/-** - Altera o sinal do número
- **%** - Converte para percentual

### Modos de Cálculo
- **Juros Compostos** - Modo padrão para cálculos financeiros
- **Juros Simples** - Modo alternativo para cálculos simplificados

### Operações Básicas
- Soma, subtração, multiplicação e divisão
- Raiz quadrada e potência
- Logaritmo
- Entrada decimal
- Backspace para correção

### Funcionalidades Avançadas
- **Suporte a Moedas**: Conversão entre Real (R$), Dólar (US$) e Euro (€)
- **Períodos Flexíveis**: Taxas por dia, mês ou ano com conversão automática
- **Conversão de Taxas**: Entre diferentes períodos (dia ↔ mês ↔ ano)

### Entrada de Dados
- **Teclado**: Digite números e operações diretamente
- **Colar (Ctrl+V)**: Cole números ou expressões matemáticas simples
  - Suporte a números decimais (com vírgula ou ponto)
  - Suporte a expressões básicas (ex: 100+50, 200*0.05)
  - Feedback visual quando algo é colado

## 🚀 Como Usar

1. **Definir Valores Conhecidos:**
   - Digite um valor numérico
   - Pressione uma das teclas de variável (PV, FV, i, n)
   - Repita para outras variáveis conhecidas

2. **Calcular Valor Desconhecido:**
   - Após definir pelo menos 3 variáveis
   - Pressione **CPT** para calcular automaticamente a variável faltante

3. **Exemplo Prático:**
   ```
   10000 → PV    (Investimento inicial de R$ 10.000)
   12 → n        (12 meses)
   0.8 → i       (Taxa de 0,8% ao mês)
   CPT           (Calcula o FV automaticamente)
   ```

## 💡 Tipos de Cálculo Suportados

### Juros Compostos (Padrão)
- Cálculo com capitalização composta
- Ideal para investimentos de longo prazo
- Fórmula: FV = PV × (1 + i)ⁿ

### Juros Simples
- Cálculo com capitalização simples
- Útil para operações de curto prazo
- Alternância disponível através do seletor de modo

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo com gradientes e sombras
- **JavaScript ES6+** - Lógica da calculadora e cálculos financeiros

## 📐 Fórmulas Matemáticas

A calculadora utiliza as fórmulas clássicas de matemática financeira simplificadas:

### Valor Futuro (FV)
```
FV = PV × (1 + i)ⁿ
```

### Valor Presente (PV)
```
PV = FV / (1 + i)ⁿ
```

### Taxa de Juros (i)
```
i = (FV / PV)^(1/n) - 1
```

### Número de Períodos (n)
```
n = ln(FV / PV) / ln(1 + i)
```

## 🎨 Design

- Interface inspirada em calculadoras HP financeiras
- Visual dark theme com elementos em relevo
- Display verde fosforescente para nostalgia
- Botões com feedback tátil (animações de clique)
- Responsivo para dispositivos móveis

## 📱 Responsividade

A calculadora se adapta automaticamente a diferentes tamanhos de tela:
- Desktop: Layout completo com teclado financeiro
- Tablet: Layout adaptado
- Mobile: Grid reorganizado para melhor usabilidade

## 🔍 Funcionalidades da Interface

- **Suporte a Teclado:** Use o teclado numérico e operadores
- **Validação de Entrada:** Verificação de valores válidos
- **Tratamento de Erros:** Mensagens informativas
- **Animações:** Feedback visual durante cálculos
- **Precisão:** Cálculos com até 6 casas decimais
- **Seletores Dinâmicos:** Moedas, períodos e taxas configuráveis

## 📝 Como Executar

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Comece a usar imediatamente - não requer instalação

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
