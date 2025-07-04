# 🧮 Calculadora Financeira

Uma calculadora financeira completa e profissional no estilo de calculadoras HP tradicionais, desenvolvida com HTML, CSS e JavaScript puro. Suporta múltiplos modos de cálculo financeiro incluindo juros simples, compostos e descontos.

## 🌐 Demo Online

**[🔗 Acesse a Calculadora](https://victor-gabriel-barbosa.github.io/CalculadoraFinanceira/)**

Experimente a calculadora diretamente no seu navegador através do GitHub Pages.

## ⭐ Características Principais

- 🧮 **Interface Profissional**: Design inspirado nas famosas calculadoras HP financeiras
- 📊 **4 Modos de Cálculo**: Juros Simples, Compostos, Desconto Racional e Comercial  
- 💱 **Múltiplas Moedas**: Suporte a Real (R$), Dólar (US$) e Euro (€)
- ⏱️ **Períodos Flexíveis**: Cálculos por dia, mês ou ano com conversão automática
- ⌨️ **Entrada Completa**: Teclado físico, clique e função colar (Ctrl+V)
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 📋 Funcionalidades Detalhadas

### 🔢 Variáveis Financeiras

- **PV** (Present Value) - Valor Presente/Atual
- **FV** (Future Value) - Valor Futuro/Montante
- **J** (Interest Amount) - Valor dos Juros
- **i** (Interest Rate) - Taxa de Juros por período
- **n** (Number of Periods) - Número de períodos

### 📊 Modos de Cálculo Disponíveis

#### 1. **Juros Compostos** (Padrão)

- Capitalização composta para investimentos
- Ideal para análises de longo prazo
- Fórmula: `FV = PV × (1 + i)ⁿ`

#### 2. **Juros Simples**

- Capitalização simples linear
- Útil para operações de curto prazo
- Fórmula: `FV = PV × (1 + i × n)`

#### 3. **Desconto Racional** (Por Dentro)

- Desconto calculado sobre o valor atual
- Mais justo para o devedor
- Variáveis: N (Valor Nominal), Va (Valor Atual), D (Desconto)

#### 4. **Desconto Comercial** (Por Fora)

- Desconto calculado sobre o valor nominal
- Mais comum no mercado financeiro
- Variáveis: N (Valor Nominal), Va (Valor Atual), D (Desconto)

### ⚡ Operações Especiais

- **CPT** - Calcula automaticamente a variável faltante
- **AC** - Limpa todos os valores (All Clear)
- **CE** - Limpa apenas a entrada atual (Clear Entry)
- **+/-** - Altera o sinal do número
- **%** - Converte para percentual
- **√** - Raiz quadrada
- **x²** - Potência ao quadrado
- **←** - Backspace para correção

### 🌍 Recursos Avançados

- **Conversão de Moedas**: Real ↔ Dólar ↔ Euro (taxas demonstrativas)
- **Conversão de Períodos**: Dia ↔ Mês ↔ Ano com cálculos automáticos
- **Seletores Inteligentes**: Aparecem automaticamente quando relevantes
- **Validação Robusta**: Verificação de entrada e tratamento de erros
- **Precisão Financeira**: Cálculos com até 6 casas decimais

### 📥 Métodos de Entrada

- **Interface Touch**: Clique nos botões da calculadora
- **Teclado Físico**: Suporte completo a teclas numéricas e operadores
- **Colar (Ctrl+V)**: Cole valores ou expressões matemáticas
  - Números decimais (vírgula ou ponto)
  - Expressões simples (ex: 100+50, 200*0.05, 1000/12)
  - Feedback visual quando algo é colado

## 🚀 Como Usar

### 1. **Selecionar Modo de Cálculo**

- Use o seletor "Modo" no topo da calculadora
- Escolha entre: Juros Simples, Compostos, Desconto Racional ou Comercial

### 2. **Definir Valores Conhecidos**

- Digite um valor numérico no display
- Pressione uma das teclas de variável (PV, FV, J, i, n)
- Repita para outras variáveis conhecidas (mínimo 3 valores)

### 3. **Calcular Valor Desconhecido**

- Após definir pelo menos 3 variáveis
- Pressione **CPT** para calcular automaticamente a variável faltante

### 4. **Exemplos Práticos**

#### Exemplo 1: Investimento com Juros Compostos

```text
Modo: Juros Compostos
10000 → PV    (Investimento inicial de R$ 10.000)
12 → n        (12 meses)
0.8 → i       (Taxa de 0,8% ao mês)
CPT           (Calcula FV = R$ 11.003,55)
```

#### Exemplo 2: Desconto Comercial

```text
Modo: Desconto Comercial
5000 → N      (Valor nominal de R$ 5.000)
60 → n        (60 dias)
2.5 → i       (Taxa de 2,5% ao mês)
CPT           (Calcula D = R$ 250,00)
```

### 5. **Recursos Especiais**

- **Moedas**: Clique no valor PV/FV/J para alterar moeda
- **Períodos**: Clique em i/n para alterar unidade de tempo
- **Colar**: Use Ctrl+V para colar valores ou expressões matemáticas

## 💡 Tipos de Cálculo Suportados

### Juros Compostos

- Capitalização composta para investimentos
- Ideal para análises de longo prazo
- Fórmula: `FV = PV × (1 + i)ⁿ`

### Juros Simples

- Capitalização simples linear
- Útil para operações de curto prazo
- Fórmula: `FV = PV × (1 + i × n)`

### Desconto Racional (Por Dentro)

- Desconto calculado sobre o valor atual
- Fórmula: `D = N × i × n / (1 + i × n)`

### Desconto Comercial (Por Fora)

- Desconto calculado sobre o valor nominal
- Fórmula: `D = N × i × n`

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica moderna
- **CSS3** - Design responsivo com gradientes e animações
- **JavaScript ES6+** - Lógica modular da calculadora e cálculos financeiros
- **Módulos ES6** - Separação de responsabilidades (script.js + calculos-financeiros.js)

## 📐 Fórmulas Matemáticas Implementadas

### Juros Compostos

#### Valor Futuro (FV)

```text
FV = PV × (1 + i)ⁿ
```

#### Valor Presente (PV)

```text
PV = FV / (1 + i)ⁿ
```

#### Taxa de Juros (i)

```text
i = (FV / PV)^(1/n) - 1
```

#### Número de Períodos (n)

```text
n = ln(FV / PV) / ln(1 + i)
```

### Juros Simples

#### Valor Futuro (FV)

```text
FV = PV × (1 + i × n)
```

#### Juros (J)

```text
J = PV × i × n
```

### Descontos

#### Desconto Racional

```text
D = N × i × n / (1 + i × n)
Va = N - D
```

#### Desconto Comercial

```text
D = N × i × n
Va = N - D
```

## 🎨 Design e Interface

- **Visual Profissional**: Interface inspirada em calculadoras HP financeiras clássicas
- **Dark Theme**: Visual moderno com elementos em relevo e gradientes
- **Display Fosforescente**: Estilo nostálgico com cor verde característica
- **Feedback Tátil**: Animações de clique e transições suaves
- **Tipografia Moderna**: Fontes legíveis e hierarquia visual clara

## 📱 Responsividade Completa

A calculadora se adapta perfeitamente a diferentes dispositivos:

- **Desktop**: Layout completo com teclado financeiro expandido
- **Tablet**: Interface adaptada mantendo funcionalidades
- **Mobile**: Grid reorganizado para melhor usabilidade touch

## 🔍 Funcionalidades Avançadas da Interface

- **Suporte Total a Teclado**: Use números, operadores e atalhos
- **Sistema de Validação**: Verificação inteligente de valores
- **Tratamento de Erros**: Mensagens informativas e recuperação automática
- **Animações Fluidas**: Feedback visual durante operações
- **Precisão Financeira**: Cálculos precisos com até 6 casas decimais
- **Seletores Dinâmicos**: Opções que aparecem conforme necessário

## 🌟 Diferenciais do Projeto

- **Arquitetura Modular**: Código organizado em módulos ES6
- **Zero Dependências**: Desenvolvido com JavaScript puro
- **Performance Otimizada**: Carregamento rápido e operações fluidas
- **Acessibilidade**: Suporte a navegação por teclado e leitores de tela
- **Código Limpo**: Documentação completa e boas práticas

## 📂 Estrutura do Projeto

```text
CalculadoraFinanceira/
├── index.html              # Estrutura principal da aplicação
├── css/
│   └── style.css          # Estilos e design responsivo
├── js/
│   ├── script.js          # Lógica principal da calculadora
│   └── calculos-financeiros.js  # Engine de cálculos financeiros
├── images/
│   └── favicon/           # Ícones e favicons
└── README.md              # Documentação completa
```

## � Executar Localmente

### Opção 1: Servidor HTTP Simples

```bash
# Clone o repositório
git clone https://github.com/victor-gabriel-barbosa/CalculadoraFinanceira.git

# Entre no diretório
cd CalculadoraFinanceira

# Inicie um servidor local (Python)
python -m http.server 8000

# Ou com Node.js
npx serve .

# Acesse http://localhost:8000
```

### Opção 2: Abertura Direta

1. Clone ou baixe o repositório
2. Abra `index.html` diretamente no navegador
3. Comece a usar imediatamente

## 🧪 Casos de Teste

### Teste 1: Investimento Poupança

```text
Modo: Juros Compostos
PV: -1000 (Investimento inicial)
i: 0.5 (Taxa mensal de 0,5%)
n: 24 (24 meses)
CPT → FV: R$ 1.127,16
```

### Teste 2: Financiamento

```text
Modo: Juros Simples  
PV: -15000 (Valor financiado)
i: 1.5 (Taxa mensal de 1,5%)
n: 12 (12 meses)
CPT → FV: R$ 17.700,00
```

### Teste 3: Desconto de Título

```text
Modo: Desconto Comercial
N: 10000 (Valor nominal)
i: 3.0 (Taxa mensal de 3%)
n: 2 (2 meses)
CPT → D: R$ 600,00
```

## 🤝 Como Contribuir

1. **Fork** este repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
4. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
5. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
6. **Abra** um Pull Request

### Áreas para Contribuição

- Novos modos de cálculo financeiro
- Melhorias na interface e UX
- Testes automatizados
- Documentação e exemplos
- Correções de bugs
- Otimizações de performance

## 📋 Roadmap Futuro

- [ ] **Gráficos**: Visualização de evolução dos investimentos
- [ ] **Amortização**: Tabelas SAC e PRICE
- [ ] **Fluxo de Caixa**: Análise VPL e TIR
- [ ] **Exportação**: PDF e Excel dos cálculos
- [ ] **Histórico**: Salvamento de cálculos anteriores
- [ ] **Temas**: Múltiplos esquemas de cores
- [ ] **PWA**: Instalação como app nativo

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autores

### Victor Gabriel Barbosa

- GitHub: [@victor-gabriel-barbosa](https://github.com/victor-gabriel-barbosa)

### Guilherme Epifânio da Silva

- GitHub: [@guilherme-epifânio-da-silva](https://github.com/Guiscoob7)

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no repositório!**
