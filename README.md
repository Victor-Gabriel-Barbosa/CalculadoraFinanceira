# 🧮 Calculadora Financeira

Uma calculadora financeira completa no estilo de calculadora física tradicional, desenvolvida com HTML, CSS e JavaScript puro.

## 📋 Funcionalidades

### Variáveis Financeiras
- **PV** (Present Value) - Valor Presente
- **FV** (Future Value) - Valor Futuro  
- **PMT** (Payment) - Pagamento Periódico
- **i** (Interest) - Taxa de Juros por período
- **n** (Number) - Número de períodos

### Operações Especiais
- **CPT** - Calcula automaticamente a variável faltante
- **AC** - Limpa todos os valores (All Clear)
- **CE** - Limpa apenas a entrada atual (Clear Entry)
- **+/-** - Altera o sinal do número
- **%** - Converte para percentual

### Operações Básicas
- Soma, subtração, multiplicação e divisão
- Raiz quadrada e potência
- Entrada decimal
- Backspace para correção

## 🚀 Como Usar

1. **Definir Valores Conhecidos:**
   - Digite um valor numérico
   - Pressione uma das teclas de variável (PV, FV, PMT, i, n)
   - Repita para outras variáveis conhecidas

2. **Calcular Valor Desconhecido:**
   - Após definir pelo menos 4 variáveis
   - Pressione **CPT** para calcular automaticamente a variável faltante

3. **Exemplo Prático:**
   ```
   10000 → PV    (Investimento inicial de R$ 10.000)
   200 → PMT     (Pagamentos mensais de R$ 200)
   12 → n        (12 meses)
   0.8 → i       (Taxa de 0,8% ao mês)
   CPT           (Calcula o FV automaticamente)
   ```

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo com gradientes e sombras
- **JavaScript ES6+** - Lógica da calculadora e cálculos financeiros

## 📐 Fórmulas Matemáticas

A calculadora utiliza as fórmulas clássicas de matemática financeira:

### Valor Futuro (FV)
```
FV = PV × (1 + i)ⁿ + PMT × [(1 + i)ⁿ - 1] / i
```

### Valor Presente (PV)
```
PV = FV / (1 + i)ⁿ - PMT × [(1 + i)ⁿ - 1] / [i × (1 + i)ⁿ]
```

### Pagamento (PMT)
```
PMT = [PV × i × (1 + i)ⁿ + FV × i] / [(1 + i)ⁿ - 1]
```

### Taxa de Juros (i)
Calculada usando método numérico de Newton-Raphson

### Número de Períodos (n)
```
n = ln(1 - FV × i / PMT) / ln(1 + i)
```

## 🎨 Design

- Interface inspirada em calculadoras HP financeiras
- Visual dark theme com elementos em relevo
- Display verde fosforescente para nostalgia
- Botões com feedback tátil (animações de clique)
- Responsivo para dispositivos móveis

## 📱 Responsividade

A calculadora se adapta automaticamente a diferentes tamanhos de tela:
- Desktop: Layout completo com 5 colunas
- Tablet: Layout adaptado
- Mobile: Grid reorganizado para melhor usabilidade

## 🔍 Funcionalidades Avançadas

- **Suporte a Teclado:** Use o teclado numérico e operadores
- **Validação de Entrada:** Verificação de valores válidos
- **Tratamento de Erros:** Mensagens informativas
- **Animações:** Feedback visual durante cálculos
- **Precisão:** Cálculos com até 6 casas decimais

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
