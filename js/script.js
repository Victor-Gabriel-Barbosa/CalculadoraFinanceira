/**
 * CALCULADORA FINANCEIRA
 * Sistema completo para cálculos financeiros baseado em juros compostos
 * Suporta cálculo de Valor Presente (PV), Valor Futuro (FV), Taxa de Juros (i) e Número de Períodos (n)
 */
class CalculadoraFinanceira {  
  constructor() {
    // Elementos do DOM
    this.displayPrincipal = document.getElementById('mainDisplay');
    this.displayVariavel = document.getElementById('variableDisplay');
    this.displayOp = document.getElementById('operationDisplay');
    this.valoresStatus = {
      pv: document.getElementById('pvValue'),
      fv: document.getElementById('fvValue'),
      i: document.getElementById('iValue'),
      n: document.getElementById('nValue')
    };

    // Estado da calculadora
    this.entradaAtual = '0';
    this.novaEntrada = true;
    this.ultimaVariavel = null;
    this.mensagemErro = null;
    this.operacaoAtual = null;
    this.operando = undefined;
    this.ultimaOp = null;
    this.btnOpAtivo = null;

    // Valores financeiros
    this.valoresFinanceiros = {
      pv: null,   // Valor Presente
      fv: null,   // Valor Futuro
      i: null,    // Taxa de juros (por período)
      n: null     // Número de períodos
    };

    // Sistema de conversão de taxas
    this.modoCapitalizacao = 'simples'; // 'simples' ou 'composta'

    // Inicializa eventos
    this.inicializarEventos();
    this.atualizarDisplay();
    this.atualizarIndicadorModo();
  }

  // Atualiza o indicador de modo de capitalização
  atualizarIndicadorModo() {
    this.atualizarDisplayOperacao();
  }

  // Inicializa todos os event listeners dos botões
  inicializarEventos() {
    // Botões numéricos
    document.querySelectorAll('.number-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.inserirNumero(btn.dataset.number);
      });
    });

    // Botões financeiros
    document.querySelectorAll('.financial-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.definirVariavelFinanceira(btn.dataset.function);
      });
    });

    // Botões de operação
    document.querySelectorAll('.operation-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.executarOp(btn.dataset.function);
      });
    });

    // Botões de conversão de taxas
    document.querySelectorAll('.conversion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.converterTaxa(btn.dataset.function);
      });
    });    
    
    // Suporte a teclado
    document.addEventListener('keydown', (evento) => {
      this.manipularTeclado(evento);
    });

    // Suporte a colar (paste)
    document.addEventListener('paste', (evento) => {
      this.manipularColar(evento);
    });
  }

  // Manipula a entrada de números
  inserirNumero(numero) {
    this.limparErro();

    if (this.novaEntrada) {
      this.entradaAtual = numero;
      this.novaEntrada = false;
      
      // Se não há operação ativa, limpa o display de operação
      if (!this.operacaoAtual) this.displayOp.textContent = '';
    } else this.entradaAtual = (this.entradaAtual === '0') ? numero : this.entradaAtual + numero;

    this.atualizarDisplay();
  }

  // Define variável financeira com o valor atual
  definirVariavelFinanceira(variavel) {
    this.limparErro();

    const valor = parseFloat(this.entradaAtual);
    if (isNaN(valor)) {
      this.mostrarErro('Valor inválido');
      return;
    }

    // Remove destaque de outros botões
    document.querySelectorAll('.financial-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Destaca o botão atual
    const btn = document.querySelector(`[data-function="${variavel}"]`);
    if (btn) {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 200);
    }

    this.valoresFinanceiros[variavel] = valor;
    this.ultimaVariavel = variavel;
    this.atualizarDisplayStatus();
    this.displayVariavel.textContent = `${variavel.toUpperCase()}: ${this.formatarNumero(valor)}`;

    this.novaEntrada = true;
  }
  
  // Executa operações especiais
  executarOp(operacao) {
    this.limparErro();

    const operacoes = {
      cpt: () => this.calcularValorFaltante(),
      ac: () => this.limparTudo(),
      ce: () => this.limparEntrada(),
      sinal: () => this.alterarSinal(),
      decimal: () => this.inserirDecimal(),
      limpa: () => this.apagarUltimo(),
      porcento: () => this.converterParaPorcentagem(),
      raiz: () => this.raizQuadrada(),
      potencia: () => this.potencia(),
      igual: () => this.igual(),
      soma: () => this.operacaoBasica('soma'),
      subtrai: () => this.operacaoBasica('subtrai'),
      multiplica: () => this.operacaoBasica('multiplica'),
      divide: () => this.operacaoBasica('divide'),
      'toggle-mode': () => this.alternarModoCapitalizacao(),
    };

    if (operacoes[operacao]) operacoes[operacao]();
    else this.mostrarErro('Operação desconhecida');
  }

  // Calcula o valor financeiro faltante usando CPT
  calcularValorFaltante() {
    // Conta quantas variáveis estão definidas
    const valoresDefinidos = Object.values(this.valoresFinanceiros).filter(v => v !== null);

    if (valoresDefinidos.length < 3) {
      this.mostrarErro('Defina pelo menos 3 variáveis para calcular');
      return;
    }

    if (valoresDefinidos.length === 4) {
      this.mostrarErro('Todas as variáveis já estão definidas');
      return;
    }

    // Identifica qual variável está faltando
    const variavelFaltante = Object.keys(this.valoresFinanceiros).find(chave => this.valoresFinanceiros[chave] === null);

    if (!variavelFaltante) {
      this.mostrarErro('Nenhuma variável para calcular');
      return;
    }

    try {
      this.displayPrincipal.classList.add('calculating');
      this.displayOp.textContent = `Calculando ${variavelFaltante.toUpperCase()}...`;

      const resultado = this.resolverEqFinanceira(variavelFaltante);

      if (resultado === null || isNaN(resultado) || !isFinite(resultado)) {
        this.mostrarErro('Não foi possível calcular com estes valores');
        return;
      }

      this.valoresFinanceiros[variavelFaltante] = resultado;
      this.entradaAtual = resultado.toString();
      this.displayVariavel.textContent = `${variavelFaltante.toUpperCase()}: ${this.formatarNumero(resultado)}`;
      this.displayOp.textContent = `CPT: ${variavelFaltante.toUpperCase()} = ${this.formatarNumero(resultado)}`;
      this.atualizarDisplayStatus();
      this.atualizarDisplay();
      this.novaEntrada = true;

      // Limpa o display de operação após 3 segundos
      setTimeout(() => {
        this.displayOp.textContent = '';
      }, 3000);

    } catch (erro) {
      this.mostrarErro('Erro no cálculo: ' + erro.message);
      this.displayOp.textContent = '';
    } finally {
      setTimeout(() => {
        this.displayPrincipal.classList.remove('calculating');
      }, 500);
    }
  }

  // Resolve a equação financeira para encontrar a variável faltante
  resolverEqFinanceira(variavelFaltante) {
    const { pv, fv, i, n } = this.valoresFinanceiros;

    // Sempre converte taxa de juros de percentual para decimal
    const taxa = i !== null ? i / 100 : null;

    const operacoes = {
      pv: () => this.calcularVP(fv, taxa, n),
      fv: () => this.calcularVF(pv, taxa, n),
      i: () => this.calcularTaxaJuros(pv, fv, n),
      n: () => this.calcularN(pv, fv, taxa),
    };

    if (operacoes[variavelFaltante]) return operacoes[variavelFaltante]();
    else throw new Error('Variável desconhecida');
  }

  /**
   * Calcula Valor Presente (PV)
   * PV = -FV / (1 + i)^n
   */
  calcularVP(fv, i, n) {
    // Caso especial: taxa zero
    if (i === 0) return -(fv || 0);

    const fator = Math.pow(1 + i, n);
    return -(fv || 0) / fator;
  }

  /**
   * Calcula Valor Futuro (FV)
   * FV = -PV * (1 + i)^n
   */
  calcularVF(pv, i, n) {
    // Caso especial: taxa zero
    if (i === 0) return -(pv || 0);

    const fator = Math.pow(1 + i, n);
    return -(pv || 0) * fator;
  }

  // Calcula Taxa de Juros (i) usando método de Newton-Raphson
  calcularTaxaJuros(pv, fv, n) {
    // Validações básicas
    if (n === 0) throw new Error('Número de períodos não pode ser zero');
    if (pv === 0 || fv === 0) throw new Error('PV e FV não podem ser zero');
    if ((pv > 0 && fv > 0) || (pv < 0 && fv < 0)) throw new Error('PV e FV devem ter sinais opostos');

    // Cálculo direto para juros compostos simples: i = (FV/PV)^(1/n) - 1
    const taxa = Math.pow(Math.abs(fv / pv), 1 / n) - 1;
    
    if (isNaN(taxa) || !isFinite(taxa)) throw new Error('Não é possível calcular a taxa com estes valores');
    
    return taxa * 100; // Retorna como percentual
  }

  // Calcula Número de Períodos (n)
  calcularN(pv, fv, i) {
    // Validações básicas
    if (i === 0) throw new Error('Taxa de juros não pode ser zero');
    if (pv === 0 || fv === 0) throw new Error('PV e FV não podem ser zero');
    if ((pv > 0 && fv > 0) || (pv < 0 && fv < 0)) throw new Error('PV e FV devem ter sinais opostos');

    // Cálculo direto: n = ln(FV/PV) / ln(1 + i)
    const numerador = Math.log(Math.abs(fv / pv));
    const denominador = Math.log(1 + i);
    
    if (denominador === 0) throw new Error('Taxa de juros inválida para cálculo de n');
    if (numerador <= 0) throw new Error('Não é possível calcular n com estes valores');
    
    return numerador / denominador;
  }

  // Operações básicas da calculadora
  operacaoBasica(op) {
    // Remove destaque do botão anterior
    if (this.btnOpAtivo) this.btnOpAtivo.classList.remove('active-operation');

    // Se há uma operação pendente, executa primeiro
    if (this.operacaoAtual && this.operando !== undefined && !this.novaEntrada) this.igual();

    // Define nova operação
    this.operacaoAtual = op;
    this.operando = parseFloat(this.entradaAtual);
    this.ultimaOp = this.entradaAtual;
    this.novaEntrada = true;

    // Destaca o botão da operação ativa
    const simbolosOp = {
      soma: '+',
      subtrai: '-', 
      multiplica: 'x',
      divide: '÷'
    };

    // Encontra e destaca o botão
    this.btnOpAtivo = document.querySelector(`[data-function="${op}"]`);
    if (this.btnOpAtivo) this.btnOpAtivo.classList.add('active-operation');

    // Atualiza o display de operação
    this.atualizarDisplayOp(simbolosOp[op] || op);
  }

  // Executa a operação atual e mostra o resultado
  igual() {
    if (this.operacaoAtual && this.operando !== undefined) {
      const atual = parseFloat(this.entradaAtual);
     
      const operacoes = {
        soma: () => this.operando + atual,
        subtrai: () => this.operando - atual,
        multiplica: () => this.operando * atual,
        divide: () => atual !== 0 ? this.operando / atual : 0,
      };

      const resultado = operacoes[this.operacaoAtual]?.();
      if (resultado !== undefined) {
        // Mostra o resultado da operação no display de operação
        const simbolosOp = {
          soma: '+',
          subtrai: '-', 
          multiplica: 'x',
          divide: '÷'
        };
        
        this.displayOp.textContent = `${this.formatarNumero(this.operando)} ${simbolosOp[this.operacaoAtual]} ${this.formatarNumero(atual)} =`;
        
        this.entradaAtual = resultado.toString();
        this.atualizarDisplay();
        this.novaEntrada = true;
        
        // Limpa a operação após exibir o resultado
        setTimeout(() => {
          this.limparOp();
        }, 2000);
      }
    }
  }

  // Insere um ponto decimal na entrada atual
  inserirDecimal() { 
    if (this.novaEntrada) {
      this.entradaAtual = '0.';
      this.novaEntrada = false;
    } else if (!this.entradaAtual.includes('.')) this.entradaAtual += '.';
    this.atualizarDisplay();
  }

  // Altera o sinal do número atual
  alterarSinal() { 
    if (this.entradaAtual !== '0') {
      this.entradaAtual = this.entradaAtual.startsWith('-')
        ? this.entradaAtual.slice(1)
        : '-' + this.entradaAtual;
      this.atualizarDisplay();
    }
  }

  // Remove o último dígito da entrada atual
  apagarUltimo() { 
    if (this.entradaAtual.length > 1) this.entradaAtual = this.entradaAtual.slice(0, -1);
    else {
      this.entradaAtual = '0';
      this.novaEntrada = true;
    }
    this.atualizarDisplay();
  }

  // Converte o valor atual para porcentagem
  converterParaPorcentagem() { 
    const valor = parseFloat(this.entradaAtual);
    if (!isNaN(valor)) {
      this.displayOp.textContent = `${this.formatarNumero(valor)} % = ${this.formatarNumero(valor / 100)}`;
      this.entradaAtual = (valor / 100).toString();
      this.atualizarDisplay();
      
      // Limpa o display de operação após 2 segundos
      setTimeout(() => {
        this.displayOp.textContent = '';
      }, 2000);
    }
  }

  // Calcula raiz quadrada do valor atual
  raizQuadrada() {
    const valor = parseFloat(this.entradaAtual);
    if (!isNaN(valor) && valor >= 0) {
      const resultado = Math.sqrt(valor);
      this.displayOp.textContent = `√${this.formatarNumero(valor)} = ${this.formatarNumero(resultado)}`;
      this.entradaAtual = resultado.toString();
      this.atualizarDisplay();
      this.novaEntrada = true;
      
      // Limpa o display de operação após 2 segundos
      setTimeout(() => {
        this.displayOp.textContent = '';
      }, 2000);
    } else {
      this.mostrarErro('Não é possível calcular raiz de número negativo');
    }
  }

  // Calcula o quadrado do valor atual
  potencia() {
    const valor = parseFloat(this.entradaAtual);
    if (!isNaN(valor)) {
      const resultado = Math.pow(valor, 2);
      this.displayOp.textContent = `${this.formatarNumero(valor)}² = ${this.formatarNumero(resultado)}`;
      this.entradaAtual = resultado.toString();
      this.atualizarDisplay();
      this.novaEntrada = true;
      
      // Limpa o display de operação após 2 segundos
      setTimeout(() => {
        this.displayOp.textContent = '';
      }, 2000);
    }
  }

  // Limpa a entrada atual
  limparEntrada() {
    this.entradaAtual = '0';
    this.novaEntrada = true;
    this.atualizarDisplay();
    
    // Se não há operação ativa, limpa o display de operação
    if (!this.operacaoAtual) this.displayOp.textContent = '';
  }

  // Limpa todos os valores e reinicia a calculadora
  limparTudo() {
    this.entradaAtual = '0';
    this.novaEntrada = true;
    this.ultimaVariavel = null;
    this.valoresFinanceiros = {
      pv: null,
      fv: null,
      i: null,
      n: null
    };
    this.displayVariavel.textContent = '-';
    this.atualizarDisplay();
    this.atualizarDisplayStatus();
    this.limparErro();
    this.limparOp();
  }

  // Alterna entre modo de capitalização simples e composta
  alternarModoCapitalizacao() {
    this.modoCapitalizacao = this.modoCapitalizacao === 'simples' ? 'composta' : 'simples';
    
    // Atualiza o display de operação
    this.atualizarDisplayOperacao();
    
    // Mostra feedback temporário
    const modoTexto = this.modoCapitalizacao.toUpperCase();
    this.displayOp.innerHTML = `<span style="color: #3498db; font-weight: bold;">${modoTexto}</span><span style="color: #e74c3c;"> ALTERADO</span>`;
    setTimeout(() => {
      this.atualizarDisplayOperacao();
    }, 2000);
  }

  // Converte taxas entre dia, mês e ano
  converterTaxa(tipoConversao) {
    this.limparErro();
    
    const taxaAtual = parseFloat(this.entradaAtual);
    if (isNaN(taxaAtual) || taxaAtual < 0) {
      this.mostrarErro('Taxa inválida');
      return;
    }

    // Remove destaque de outros botões de conversão
    document.querySelectorAll('.conversion-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Destaca o botão atual
    const btn = document.querySelector(`[data-function="${tipoConversao}"]`);
    if (btn) {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 1000);
    }

    // Sistema inteligente de conversão baseado na magnitude da taxa
    let resultado;
    let descricao;
    let tipoOrigem = this.detectarTipoTaxa(taxaAtual);

    switch (tipoConversao) {
      case 'taxa-dia':
        resultado = this.converterPara('dia', taxaAtual, tipoOrigem);
        descricao = 'Taxa diária';
        break;
      case 'taxa-mes':
        resultado = this.converterPara('mes', taxaAtual, tipoOrigem);
        descricao = 'Taxa mensal';
        break;
      case 'taxa-ano':
        resultado = this.converterPara('ano', taxaAtual, tipoOrigem);
        descricao = 'Taxa anual';
        break;
      default:
        this.mostrarErro('Tipo de conversão inválido');
        return;
    }

    // Atualiza o display
    this.entradaAtual = resultado.toFixed(6);
    this.novaEntrada = true;
    this.atualizarDisplay();
    
    // Mostra informação da conversão
    this.displayOp.textContent = `${descricao} (${this.modoCapitalizacao}) - De: ${tipoOrigem}`;
  }

  // Detecta o tipo de taxa baseado na magnitude do valor
  detectarTipoTaxa(taxa) {
    if (taxa <= 1) {
      return 'dia';
    } else if (taxa <= 15) {
      return 'mes';
    } else {
      return 'ano';
    }
  }

  // Converte taxa de um período para outro
  converterPara(tipoDestino, taxa, tipoOrigem) {
    // Se já é o tipo desejado, retorna a taxa
    if (tipoOrigem === tipoDestino) {
      return taxa;
    }

    // Primeiro converte para taxa anual
    let taxaAnual;
    switch (tipoOrigem) {
      case 'dia':
        taxaAnual = this.modoCapitalizacao === 'simples' 
          ? taxa * 360 
          : (Math.pow(1 + taxa / 100, 360) - 1) * 100;
        break;
      case 'mes':
        taxaAnual = this.modoCapitalizacao === 'simples' 
          ? taxa * 12 
          : (Math.pow(1 + taxa / 100, 12) - 1) * 100;
        break;
      case 'ano':
        taxaAnual = taxa;
        break;
    }

    // Depois converte da taxa anual para o tipo desejado
    switch (tipoDestino) {
      case 'dia':
        return this.modoCapitalizacao === 'simples' 
          ? taxaAnual / 360 
          : (Math.pow(1 + taxaAnual / 100, 1/360) - 1) * 100;
      case 'mes':
        return this.modoCapitalizacao === 'simples' 
          ? taxaAnual / 12 
          : (Math.pow(1 + taxaAnual / 100, 1/12) - 1) * 100;
      case 'ano':
        return taxaAnual;
      default:
        return taxa;
    }
  }

  // Atualiza o display de operação com modo e operação atual
  atualizarDisplayOperacao() {
    const modoTexto = this.modoCapitalizacao.toUpperCase();
    let operacaoTexto = '';
    
    if (this.operando !== undefined && this.operacaoAtual) {
      const simbolosOp = {
        'soma': '+',
        'subtrai': '-',
        'multiplica': '×',
        'divide': '÷'
      };
      operacaoTexto = `${this.formatarNumero(this.operando)} ${simbolosOp[this.operacaoAtual] || this.operacaoAtual}`;
    }
    
    // Cria o HTML com modo à esquerda e operação à direita
    this.displayOp.innerHTML = `<span style="color: #3498db; font-weight: bold;">${modoTexto}</span><span>${operacaoTexto}</span>`;
  }

  // Atualiza o display de operação
  atualizarDisplayOp(simbolo) {
    if (this.operando !== undefined) {
      const modoTexto = this.modoCapitalizacao.toUpperCase();
      const operacaoTexto = `${this.formatarNumero(this.operando)} ${simbolo}`;
      this.displayOp.innerHTML = `<span style="color: #3498db; font-weight: bold;">${modoTexto}</span><span>${operacaoTexto}</span>`;
    }
  }

  // Limpa a operação atual
  limparOp() {
    this.operacaoAtual = null;
    this.operando = undefined;
    this.ultimaOp = null;
    this.atualizarDisplayOperacao();
    
    // Remove destaque do botão
    if (this.btnOpAtivo) {
      this.btnOpAtivo.classList.remove('active-operation');
      this.btnOpAtivo = null;
    }
  }

  // Atualiza o display principal com o valor atual
  atualizarDisplay() {
    const valor = parseFloat(this.entradaAtual);
    this.displayPrincipal.textContent = isNaN(valor) ? this.entradaAtual : this.formatarNumero(valor);
  }

  // Atualiza o display de status com os valores financeiros
  atualizarDisplayStatus() {
    Object.keys(this.valoresFinanceiros).forEach(chave => {
      const valor = this.valoresFinanceiros[chave];
      this.valoresStatus[chave].textContent = valor !== null ? this.formatarNumero(valor) : '-';
    });
  }

  // Formata números para exibição
  formatarNumero(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';

    // Limita casas decimais para evitar números muito longos
    if (Math.abs(num) < 0.001 && num !== 0) return num.toExponential(2);

    return parseFloat(num.toFixed(6)).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6
    });
  }

  // Gerenciamento de erros
  mostrarErro(mensagem) {
    this.limparErro();
    this.mensagemErro = document.createElement('div');
    this.mensagemErro.className = 'error-message';
    this.mensagemErro.textContent = mensagem;
    document.querySelector('.calculator').appendChild(this.mensagemErro);

    this.displayPrincipal.classList.add('error');

    setTimeout(() => {
      this.limparErro();
    }, 3000);
  }

  // Limpa a mensagem de erro atual
  limparErro() {
    if (this.mensagemErro) {
      this.mensagemErro.remove();
      this.mensagemErro = null;
    }    
    this.displayPrincipal.classList.remove('error');
  }

  // Manipula o evento de colar (paste)
  manipularColar(evento) {
    evento.preventDefault();
    
    // Obtém o texto colado
    const textoColado = (evento.clipboardData || window.clipboardData).getData('text');
    
    // Limpa espaços em branco
    const texto = textoColado.trim();
    
    if (!texto) return;
    
    // Verifica se é apenas um número
    if (this.isNumeroValido(texto)) {
      this.colarNumero(texto);
      return;
    }
    
    // Verifica se é uma expressão matemática simples
    if (this.isExpressaoValida(texto)) {
      this.processarExpressao(texto);
      return;
    }
    
    // Se não for um número ou expressão válida, ignora
    this.mostrarErro('Conteúdo inválido para colar');
  }

  // Verifica se o texto é um número válido
  isNumeroValido(texto) {
    // Remove caracteres de formatação comuns
    const numeroLimpo = texto.replace(/[,\s]/g, '').replace(',', '.');
    return !isNaN(numeroLimpo) && numeroLimpo !== '';
  }

  // Verifica se o texto é uma expressão matemática válida
  isExpressaoValida(texto) {
    // Permite números, operadores básicos, parênteses, pontos e vírgulas
    const regex = /^[\d+\-*/().,\s]+$/;
    return regex.test(texto) && /[+\-*/]/.test(texto);
  }

  // Cola um número no display
  colarNumero(texto) {
    // Substitui vírgula por ponto e remove espaços
    const numeroLimpo = texto.replace(/[,\s]/g, '').replace(',', '.');
    
    // Verifica se é um número válido
    if (!isNaN(numeroLimpo) && numeroLimpo !== '') {
      this.limparErro();
      this.entradaAtual = numeroLimpo;
      this.novaEntrada = false;
      this.atualizarDisplay();
      this.mostrarFeedbackCola();
    }
  }

  // Processa uma expressão matemática simples
  processarExpressao(texto) {
    try {
      // Substitui símbolos comuns por operadores válidos
      let expressao = texto
        .replace(/x/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '.')
        .replace(/\s/g, '');
      
      // Verifica se a expressão é segura (apenas números e operadores básicos)
      if (!/^[\d+\-*/().]+$/.test(expressao)) {
        this.mostrarErro('Expressão inválida');
        return;
      }
      
      // Avalia a expressão
      const resultado = Function('"use strict"; return (' + expressao + ')')();
      
      if (isNaN(resultado) || !isFinite(resultado)) {
        this.mostrarErro('Resultado inválido');
        return;
      }
      
      this.limparErro();
      this.entradaAtual = resultado.toString();
      this.novaEntrada = false;
      this.atualizarDisplay();
      this.mostrarFeedbackCola();
      
    } catch (erro) {
      this.mostrarErro('Erro ao processar expressão');
    }
  }

  // Mostra feedback visual quando algo é colado
  mostrarFeedbackCola() {
    this.displayPrincipal.classList.add('pasted');
    setTimeout(() => {
      this.displayPrincipal.classList.remove('pasted');
    }, 300);
  }

  // Manipula eventos de teclado para entrada de números e operações
  manipularTeclado(evento) {
    const tecla = evento.key;

    // Números
    if (/[0-9]/.test(tecla)) {
      this.inserirNumero(tecla);
      evento.preventDefault();
    }

    // Operações
    const acoesPorTecla = {
      '.': () => this.inserirDecimal(),
      ',': () => this.inserirDecimal(),
      'Enter': () => this.igual(),
      '=': () => this.igual(),
      'Backspace': () => this.apagarUltimo(),
      'Escape': () => this.limparTudo(),
      '+': () => this.operacaoBasica('soma'),
      '-': () => this.operacaoBasica('subtrai'),
      '*': () => this.operacaoBasica('multiplica'),
      '/': () => this.operacaoBasica('divide'),
    };

    if (acoesPorTecla[tecla]) {
      acoesPorTecla[tecla]();
      evento.preventDefault();
    }
  }
}

// Inicializa calculadora quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  const calculadora = new CalculadoraFinanceira();
  
  // Foca na calculadora para permitir eventos de cola
  const elementoCalculadora = document.getElementById('calculator');
  if (elementoCalculadora) elementoCalculadora.focus();
});