/**
 * CALCULADORA FINANCEIRA
 * Sistema completo para cálculos financeiros baseado em juros compostos
 * Suporta cálculo de Valor Presente (PV), Valor Futuro (FV) e Pagamento Periódico (PMT)
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
      pmt: document.getElementById('pmtValue'),
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
      pmt: null,  // Pagamento Periódico
      i: null,    // Taxa de juros (por período)
      n: null     // Número de períodos
    };

    // Inicializa eventos
    this.inicializarEventos();
    this.atualizarDisplay();
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

    // Suporte a teclado
    document.addEventListener('keydown', (evento) => {
      this.manipularTeclado(evento);
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
    };

    if (operacoes[operacao]) operacoes[operacao]();
    else this.mostrarErro('Operação desconhecida');
  }

  // Calcula o valor financeiro faltante usando CPT
  calcularValorFaltante() {
    // Conta quantas variáveis estão definidas
    const valoresDefinidos = Object.values(this.valoresFinanceiros).filter(v => v !== null);

    if (valoresDefinidos.length < 4) {
      this.mostrarErro('Defina pelo menos 4 variáveis para calcular');
      return;
    }

    if (valoresDefinidos.length === 5) {
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
    const { pv, fv, pmt, i, n } = this.valoresFinanceiros;

    // Sempre converte taxa de juros de percentual para decimal
    const taxa = i !== null ? i / 100 : null;

    const operacoes = {
      pv: () => this.calcularVP(fv, pmt, taxa, n),
      fv: () => this.calcularVF(pv, pmt, taxa, n),
      pmt: () => this.calcularPMT(pv, fv, taxa, n),
      i: () => this.calcularTaxaJuros(pv, fv, pmt, n),
      n: () => this.calcularN(pv, fv, pmt, taxa),
    };

    if (operacoes[variavelFaltante]) return operacoes[variavelFaltante]();
    else throw new Error('Variável desconhecida');
  }
  /**
   * Calcula Valor Presente (PV)
   * PV = FV / (1 + i)^n - PMT * [(1 + i)^n - 1] / [i * (1 + i)^n]
   */
  calcularVP(fv, pmt, i, n) {
    if (i === 0) return -((fv || 0) + (pmt || 0) * n);

    const fator = Math.pow(1 + i, n);
    let pv = 0;

    if (fv !== null && fv !== 0) pv += (fv || 0) / fator;

    if (pmt !== null && pmt !== 0) pv += (pmt || 0) * (fator - 1) / (i * fator);

    return -pv; // Retorna negativo conforme convenção financeira
  }
  /**
   * Calcula Valor Futuro (FV)
   * FV = PV * (1 + i)^n + PMT * [(1 + i)^n - 1] / i
   */
  calcularVF(pv, pmt, i, n) {
    if (i === 0) return -((pv || 0) + (pmt || 0) * n);

    const fator = Math.pow(1 + i, n);
    let fv = 0;

    if (pv !== null && pv !== 0) fv += (pv || 0) * fator;

    if (pmt !== null && pmt !== 0) fv += (pmt || 0) * (fator - 1) / i;

    return -fv; // Retorna negativo conforme convenção financeira
  }
  /**
   * Calcula Pagamento (PMT)
   * PMT = [PV * i * (1 + i)^n + FV * i] / [(1 + i)^n - 1]
   */
  calcularPMT(pv, fv, i, n) {
    if (i === 0) return -((pv || 0) + (fv || 0)) / n;

    const fator = Math.pow(1 + i, n);
    const numerador = -(pv || 0) * i * fator - (fv || 0) * i;
    const denominador = fator - 1;

    return numerador / denominador;
  }
  
  // Calcula Taxa de Juros (i) usando método de Newton-Raphson
  calcularTaxaJuros(pv, fv, pmt, n) {
    // Estimativa inicial
    let i = 0.1;
    const maxIteracoes = 100;
    const tolerancia = 1e-10;

    for (let iteracao = 0; iteracao < maxIteracoes; iteracao++) {
      const f = this.funcaoFinanceira(pv, fv, pmt, n, i);
      const df = this.derivadaFuncaoFinanceira(pv, fv, pmt, n, i);

      if (Math.abs(df) < tolerancia) break;

      const novoI = i - f / df;

      if (Math.abs(novoI - i) < tolerancia) return novoI * 100; // Retorna como percentual

      i = novoI;
    }

    return i * 100; // Retorna como percentual
  }

  // Função financeira para cálculo de taxa de juros
  funcaoFinanceira(pv, fv, pmt, n, i) {
    if (Math.abs(i) < 1e-10) return (pv || 0) + (fv || 0) + (pmt || 0) * n;

    const fator = Math.pow(1 + i, n);
    return (pv || 0) * fator + (pmt || 0) * (fator - 1) / i + (fv || 0);
  }

  // Derivada da função financeira
  derivadaFuncaoFinanceira(pv, fv, pmt, n, i) {
    const fator = Math.pow(1 + i, n);
    const derivadaFator = n * Math.pow(1 + i, n - 1);

    let derivada = (pv || 0) * derivadaFator;

    if (Math.abs(i) > 1e-10) {
      const termo1 = (pmt || 0) * derivadaFator / i;
      const termo2 = -(pmt || 0) * (fator - 1) / (i * i);
      derivada += termo1 + termo2;
    } else derivada += (pmt || 0) * n * (n - 1) / 2;

    return derivada;
  }

  // Calcula Número de Períodos (n)
  calcularN(pv, fv, pmt, i) {
    if (i === 0) return -((pv || 0) + (fv || 0)) / (pmt || 0);

    const numerador = Math.log(1 - (fv || 0) * i / (pmt || 0));
    const denominador = Math.log(1 + i);

    if (numerador <= 0 || denominador <= 0) throw new Error('Não é possível calcular n com estes valores');

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
      pmt: null,
      i: null,
      n: null
    };
    this.displayVariavel.textContent = '-';
    this.atualizarDisplay();
    this.atualizarDisplayStatus();
    this.limparErro();
    this.limparOp();
  }

  // Atualiza o display de operação
  atualizarDisplayOp(simbolo) {
    if (this.operando !== undefined) this.displayOp.textContent = `${this.formatarNumero(this.operando)} ${simbolo}`;
  }

  // Limpa a operação atual
  limparOp() {
    this.operacaoAtual = null;
    this.operando = undefined;
    this.ultimaOp = null;
    this.displayOp.textContent = '';
    
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
  new CalculadoraFinanceira();
});