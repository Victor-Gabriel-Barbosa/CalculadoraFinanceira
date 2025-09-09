# 🧮 Calculadora Financeira - Suite Completa

Uma suíte financeira completa e profissional no estilo de calculadoras HP tradicionais, desenvolvida com HTML, CSS e JavaScript puro. Oferece múltiplas ferramentas especializadas para análise financeira, incluindo calculadora principal, amortização SAC e análise de VPL.

## 🌐 Demo Online

**[🔗 Acesse a Calculadora](https://victor-gabriel-barbosa.github.io/CalculadoraFinanceira/)**

Experimente toda a suíte de ferramentas financeiras diretamente no seu navegador através do GitHub Pages.

## ⭐ Características Principais

- 🧮 **Interface Profissional**: Design inspirado nas famosas calculadoras HP financeiras
- 📊 **7 Modos de Cálculo**: Juros Simples, Compostos, Descontos, Capitalização e Taxas Equivalentes
- 🏠 **Calculadora de Amortização SAC**: Tabela completa do Sistema de Amortização Constante
- 📈 **Análise de VPL**: Calculadora de Valor Presente Líquido para análise de investimentos
- 💱 **Múltiplas Moedas**: Suporte a Real (R$), Dólar (US$) e Euro (€)
- ⏱️ **Períodos Flexíveis**: Cálculos por dia, mês ou ano com conversão automática
- ⌨️ **Entrada Completa**: Teclado físico, clique e função colar (Ctrl+V)
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 📋 Ferramentas da Suíte Financeira

### 🧮 Calculadora Financeira Principal

Calculadora multimodo com interface HP-style para cálculos financeiros essenciais.

#### 🔢 Variáveis Financeiras

- **PV** (Present Value) - Valor Presente/Atual
- **FV** (Future Value) - Valor Futuro/Montante
- **J** (Interest Amount) - Valor dos Juros
- **i** (Interest Rate) - Taxa de Juros por período
- **n** (Number of Periods) - Número de períodos

#### 📊 Modos de Cálculo Disponíveis

1. **Juros Simples** - Capitalização linear para operações de curto prazo
2. **Juros Compostos** - Capitalização composta para investimentos de longo prazo
3. **Desconto Racional** - Desconto calculado sobre o valor atual (por dentro)
4. **Desconto Comercial** - Desconto calculado sobre o valor nominal (por fora)
5. **Taxa Desconto Comercial** - Cálculo específico de taxas para descontos comerciais
6. **Taxa Capitalização** - Análise de taxas de capitalização e rendimento
7. **Taxas Equivalentes** - Conversão entre diferentes períodos e regimes de capitalização

### 🏠 Calculadora de Amortização SAC

Ferramenta especializada para calcular tabelas de amortização pelo Sistema de Amortização Constante.

**Funcionalidades:**

- Geração completa da tabela SAC
- Cálculo de prestações decrescentes
- Análise detalhada de juros e amortização
- Valores totais e resumo financeiro

### 📈 Calculadora de VPL (Valor Presente Líquido)

Análise avançada de viabilidade de investimentos e projetos.

**Funcionalidades:**

- Cálculo do Valor Presente Líquido
- Análise de múltiplos fluxos de caixa
- Taxa de desconto personalizável
- Indicadores de viabilidade do investimento

### ⚡ Operações Especiais

- **CPT** - Calcula automaticamente a variável faltante
- **AC** - Limpa todos os valores (All Clear)
- **CE** - Limpa apenas a entrada atual (Clear Entry)
- **+/-** - Altera o sinal do número
- **%** - Converte para percentual
- **√** - Raiz quadrada
- **x²** - Potência ao quadrado
- **←** - Backspace para correção

### 🌍 Recursos Avançados Compartilhados

- **Conversão de Moedas**: Real ↔ Dólar ↔ Euro (taxas demonstrativas)
- **Conversão de Períodos**: Dia ↔ Mês ↔ Ano com cálculos automáticos
- **Seletores Inteligentes**: Aparecem automaticamente quando relevantes
- **Validação Robusta**: Verificação de entrada e tratamento de erros
- **Precisão Financeira**: Cálculos com até 6 casas decimais
- **Navegação Fluida**: Links de acesso rápido entre todas as ferramentas
- **Design Consistente**: Interface unificada em toda a suíte

### 📥 Métodos de Entrada

- **Interface Touch**: Clique nos botões da calculadora
- **Teclado Físico**: Suporte completo a teclas numéricas e operadores
- **Colar (Ctrl+V)**: Cole valores ou expressões matemáticas
  - Números decimais (vírgula ou ponto)
  - Expressões simples (ex: 100+50, 200*0.05, 1000/12)
  - Feedback visual quando algo é colado

## 🚀 Como Usar

### 🧭 Navegação Entre Ferramentas

A suíte oferece três ferramentas principais acessíveis através do rodapé:

- **Calculadora Financeira**: Ferramenta principal com múltiplos modos de cálculo
- **Calculadora de Amortização SAC**: Especializada em sistemas de amortização
- **Calculadora de VPL**: Focada em análise de viabilidade de investimentos

### 1. **Calculadora Financeira Principal**

#### Selecionar Modo de Cálculo

- Use o seletor "Modo" no topo da calculadora
- Escolha entre: Juros Simples, Compostos, Descontos, Capitalização e Taxas Equivalentes

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

### 2. **Calculadora de Amortização SAC**

#### Exemplo: Financiamento Habitacional

```text
Valor do Empréstimo: R$ 200.000,00
Taxa de Juros: 0,8% ao mês
Prazo: 240 meses (20 anos)
Resultado: Tabela SAC completa com prestações decrescentes
```

### 3. **Calculadora de VPL**

#### Exemplo: Análise de Investimento

```text
Investimento Inicial: R$ 100.000,00
Taxa de Desconto: 12% ao ano
Fluxos de Caixa: R$ 30.000 (anos 1-4)
Resultado: VPL = R$ 8.124,49 (Projeto viável)
```

### 5. **Recursos Especiais**

- **Moedas**: Clique no valor PV/FV/J para alterar moeda
- **Períodos**: Clique em i/n para alterar unidade de tempo
- **Colar**: Use Ctrl+V para colar valores ou expressões matemáticas

## 💡 Resumo das Ferramentas Disponíveis

### 🧮 Calculadora Principal

- **Juros Simples e Compostos**: Análise de investimentos e empréstimos
- **Descontos Racional e Comercial**: Cálculo de descontos em títulos
- **Taxas de Capitalização**: Análise de rendimentos
- **Taxas Equivalentes**: Conversão entre diferentes períodos

### 🏠 Amortização SAC

- **Tabela Completa**: Prestações, juros e amortização
- **Sistema Decrescente**: Prestações diminuem ao longo do tempo
- **Análise Total**: Valores totais pagos e economizados

### 📈 Análise VPL

- **Valor Presente Líquido**: Análise de viabilidade de projetos
- **Múltiplos Fluxos**: Suporte a diferentes padrões de entrada/saída
- **Taxa de Desconto**: Configuração personalizada da taxa mínima

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica moderna para múltiplas páginas especializadas
- **CSS3** - Design responsivo com gradientes, animações e temas especializados
- **JavaScript ES6+** - Arquitetura modular com engines especializadas para cada tipo de cálculo
- **Módulos ES6** - Separação completa de responsabilidades em múltiplos arquivos especializados

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

- **Suíte Completa**: Três ferramentas especializadas integradas
- **Arquitetura Modular**: Código organizado em múltiplos módulos ES6 especializados
- **Zero Dependências**: Desenvolvido inteiramente com JavaScript puro
- **Performance Otimizada**: Carregamento rápido e operações fluidas
- **Navegação Intuitiva**: Interface unificada com acesso fácil entre ferramentas
- **Especialização**: Cada ferramenta otimizada para seu tipo específico de cálculo
- **Acessibilidade**: Suporte a navegação por teclado e leitores de tela
- **Código Limpo**: Documentação completa e boas práticas

## 📂 Estrutura do Projeto

```text
CalculadoraFinanceira/
├── index.html                      # Calculadora financeira principal
├── amortizacao.html               # Calculadora de Amortização SAC
├── vpl.html                       # Calculadora de VPL
├── css/
│   ├── style.css                  # Estilos base e design responsivo
│   ├── custom.css                 # Personalizações da interface
│   ├── footer.css                 # Estilos do rodapé
│   ├── amortizacao.css           # Estilos da calculadora SAC
│   └── vpl.css                   # Estilos da calculadora VPL
├── js/
│   ├── script.js                  # Lógica principal da calculadora
│   ├── calculos-financeiros.js   # Engine de cálculos financeiros
│   ├── calculos-amortizacao.js   # Lógica da amortização SAC
│   ├── calculos-vpl.js           # Lógica do VPL
│   ├── calculos-capitalizacao.js # Cálculos de capitalização
│   ├── calculos-taxas.js         # Cálculos de taxas especializadas
│   └── calculos-taxas-equivalentes.js # Conversão de taxas
├── images/
│   └── favicon/                   # Ícones e favicons da aplicação
└── README.md                      # Documentação completa
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

## 🧪 Casos de Teste - Todas as Ferramentas

### Teste 1: Calculadora Financeira - Investimento

```text
Ferramenta: Calculadora Financeira
Modo: Juros Compostos
PV: -1000 (Investimento inicial)
i: 0.5 (Taxa mensal de 0,5%)
n: 24 (24 meses)
CPT → FV: R$ 1.127,16
```

### Teste 2: Calculadora Financeira - Desconto

```text
Ferramenta: Calculadora Financeira
Modo: Desconto Comercial
N: 10000 (Valor nominal)
i: 3.0 (Taxa mensal de 3%)
n: 2 (2 meses)
CPT → D: R$ 600,00
```

### Teste 3: Amortização SAC - Financiamento

```text
Ferramenta: Calculadora de Amortização
Valor: R$ 150.000,00
Taxa: 0,9% ao mês
Prazo: 180 meses
Resultado: Tabela SAC com 180 prestações decrescentes
```

### Teste 4: VPL - Análise de Projeto

```text
Ferramenta: Calculadora de VPL
Investimento: R$ 50.000,00
Taxa de Desconto: 10% ao ano
Fluxos: R$ 15.000 por 4 anos
Resultado: VPL positivo = Projeto viável
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

## 📋 Roadmap - Status e Futuro

### ✅ Funcionalidades Implementadas

- [x] **Calculadora Financeira Principal**: Completa com 7 modos de cálculo
- [x] **Amortização SAC**: Sistema de Amortização Constante implementado
- [x] **Análise VPL**: Valor Presente Líquido para análise de investimentos
- [x] **Taxas Equivalentes**: Conversão entre diferentes períodos
- [x] **Interface Responsiva**: Design adaptativo para todos os dispositivos

### 🚀 Próximas Funcionalidades

- [ ] **Sistema PRICE**: Tabela de amortização com prestações fixas
- [ ] **Análise TIR**: Taxa Interna de Retorno
- [ ] **Gráficos**: Visualização de evolução dos investimentos
- [ ] **Exportação**: PDF e Excel dos cálculos
- [ ] **Histórico**: Salvamento de cálculos anteriores
- [ ] **Calculadora de Bonds**: Análise de títulos de renda fixa
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
