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
    
    // Elemento do seletor de taxa
    this.seletorTaxa = document.getElementById('rateSelector');
    
    // Elementos dos outros seletores
    this.seletorPV = document.getElementById('pvSelector');
    this.seletorFV = document.getElementById('fvSelector');
    this.seletorPeriodo = document.getElementById('periodSelector');
    
    // Seletor de modo
    this.seletorModo = document.getElementById('modeSelector');

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
    
    // Período atual da taxa (day, month, year)
    this.periodoTaxa = 'month';
    
    // Tipos de conversão para valores e períodos
    this.tipoMoedaPV = 'real';
    this.tipoMoedaFV = 'real';
    this.tipoPeriodo = 'month';

    // Sistema de cálculos financeiros
    this.calculosFinanceiros = new CalculosFinanceiros();

    // Inicializa eventos
    this.inicializarEventos();
    this.atualizarDisplay();
    this.atualizarIndicadorModo();
    this.atualizarVisibilidadeSeletores();
    this.inicializarSeletorModo();
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
    
    // Seletor de taxa
    this.seletorTaxa.addEventListener('change', (evento) => {
      console.log('Seletor taxa mudou para:', evento.target.value);
      this.alterarPeriodoTaxa();
    });
    
    // Seletor de moeda PV
    this.seletorPV.addEventListener('change', (evento) => {
      console.log('Seletor PV mudou para:', evento.target.value);
      this.alterarMoedaPV();
    });
    
    // Seletor de moeda FV
    this.seletorFV.addEventListener('change', (evento) => {
      console.log('Seletor FV mudou para:', evento.target.value);
      this.alterarMoedaFV();
    });
    
    // Seletor de período
    this.seletorPeriodo.addEventListener('change', (evento) => {
      console.log('Seletor período mudou para:', evento.target.value);
      this.alterarTipoPeriodo();
    });
    
    // Seletor de modo
    this.seletorModo.addEventListener('change', (evento) => {
      console.log('Seletor modo mudou para:', evento.target.value);
      this.alterarModoCalculadora();
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
      log: () => this.logaritmo(),
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

      const resultado = this.calculosFinanceiros.resolverEqFinanceira(variavelFaltante, this.valoresFinanceiros);

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

  // Inicializa o seletor de modo com o valor atual
  inicializarSeletorModo() {
    const modoAtual = this.calculosFinanceiros.getModoCapitalizacao();
    this.seletorModo.value = modoAtual;
  }

  // Altera o modo da calculadora através do seletor
  alterarModoCalculadora() {
    const novoModo = this.seletorModo.value;
    
    // Define o modo no sistema de cálculos
    this.calculosFinanceiros.setModoCapitalizacao(novoModo === 'simples' ? 'simples' : 'composto');
    
    // Atualiza o display de operação
    this.atualizarDisplayOperacao();
    
    // Mostra feedback temporário
    const modoTexto = novoModo === 'simples' ? 'JUROS SIMPLES' : 'JUROS COMPOSTOS';
    this.displayOp.innerHTML = `<span style="color: #f39c12; font-weight: bold;">${modoTexto}</span>`;
    setTimeout(() => {
      this.atualizarDisplayOperacao();
    }, 2000);
  }

  // Alterna entre modo de capitalização simples e composta
  alternarModoCapitalizacao() {
    const modoAnterior = this.calculosFinanceiros.getModoCapitalizacao();
    const novoModo = this.calculosFinanceiros.alternarModoCapitalizacao();
    
    // Atualiza o display de operação
    this.atualizarDisplayOperacao();
    
    // Mostra feedback temporário
    const modoTexto = novoModo.toUpperCase();
    this.displayOp.innerHTML = `<span style="color: #3498db; font-weight: bold;">${modoTexto}</span><span style="color: #e74c3c;"> ALTERADO</span>`;
    setTimeout(() => {
      this.atualizarDisplayOperacao();
    }, 2000);
  }

  // Define uma operação matemática básica (soma, subtração, multiplicação, divisão)
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
    } else this.mostrarErro('Não é possível calcular raiz de número negativo');

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

  // Calcula o logaritmo do valor atual
  logaritmo() {
    const valor = parseFloat(this.entradaAtual);
    if (!isNaN(valor) && valor > 0) {
      const resultado = Math.log10(valor);
      this.displayOp.textContent = `log(${this.formatarNumero(valor)}) = ${this.formatarNumero(resultado)}`;
      this.entradaAtual = resultado.toString();
      this.atualizarDisplay();
      this.novaEntrada = true;
      
      // Limpa o display de operação após 2 segundos
      setTimeout(() => {
        this.displayOp.textContent = '';
      }, 2000);
    } else this.mostrarErro('Logaritmo só é definido para números positivos');
  }

  // Limpa a entrada atual
  limparEntrada() {
    this.entradaAtual = '0';
    this.novaEntrada = true;
    this.atualizarDisplay();
    
    // Se não há operação ativa, limpa o display de operação
    if (!this.operacaoAtual) this.displayOp.textContent = '';
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

    try {
      // Usa a nova classe para conversão
      const conversao = this.calculosFinanceiros.converterTaxaAutomatica(tipoConversao, taxaAtual);
      
      // Atualiza o display
      this.entradaAtual = conversao.resultado.toFixed(6);
      this.novaEntrada = true;
      this.atualizarDisplay();
      
      // Mostra informação da conversão
      this.displayOp.textContent = `${conversao.descricao} (${conversao.modo}) - De: ${conversao.tipoOrigem}`;
    } catch (erro) {
      this.mostrarErro(erro.message);
    }
  }

  // Atualiza o display de operação com modo e operação atual
  atualizarDisplayOperacao() {
    const modoTexto = this.calculosFinanceiros.getModoCapitalizacao().toUpperCase();
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
      const modoTexto = this.calculosFinanceiros.getModoCapitalizacao().toUpperCase();
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
    
    // Mostra os seletores para campos que têm valores definidos
    this.atualizarVisibilidadeSeletores();
  }

  // Atualiza a visibilidade dos seletores baseado nos valores definidos
  atualizarVisibilidadeSeletores() {
    // PV - mostra seletor se há valor definido
    if (this.valoresFinanceiros.pv !== null) this.mostrarSeletorPV();
    else this.seletorPV.style.display = 'none';
    
    // FV - mostra seletor se há valor definido
    if (this.valoresFinanceiros.fv !== null) this.mostrarSeletorFV();
    else this.seletorFV.style.display = 'none';
    
    // i - mostra seletor se há valor definido
    if (this.valoresFinanceiros.i !== null) this.mostrarSeletorTaxa();
    else this.seletorTaxa.style.display = 'none';
    
    // n - mostra seletor se há valor definido
    if (this.valoresFinanceiros.n !== null) this.mostrarSeletorPeriodo();
    else this.seletorPeriodo.style.display = 'none';
  }

  // Mostra o seletor de taxa quando o usuário clica em 'i'
  mostrarSeletorTaxa() {
    this.seletorTaxa.style.display = 'block';
    // Só define o valor se ainda não estiver definido
    if (!this.seletorTaxa.value || this.seletorTaxa.value === '') this.seletorTaxa.value = this.periodoTaxa;
  }

  // Mostra o seletor de moeda PV
  mostrarSeletorPV() {
    this.seletorPV.style.display = 'block';
    // Só define o valor se ainda não estiver definido
    if (!this.seletorPV.value || this.seletorPV.value === '') this.seletorPV.value = this.tipoMoedaPV;
  }

  // Mostra o seletor de moeda FV
  mostrarSeletorFV() {
    this.seletorFV.style.display = 'block';
    // Só define o valor se ainda não estiver definido
    if (!this.seletorFV.value || this.seletorFV.value === '') this.seletorFV.value = this.tipoMoedaFV;
  }

  // Mostra o seletor de período
  mostrarSeletorPeriodo() {
    this.seletorPeriodo.style.display = 'block';
    // Só define o valor se ainda não estiver definido
    if (!this.seletorPeriodo.value || this.seletorPeriodo.value === '') this.seletorPeriodo.value = this.tipoPeriodo;
  }

  // Esconde todos os seletores
  esconderTodosSeletores() {
    this.seletorTaxa.style.display = 'none';
    this.seletorPV.style.display = 'none';
    this.seletorFV.style.display = 'none';
    this.seletorPeriodo.style.display = 'none';
  }

  // Esconde o seletor de taxa
  esconderSeletorTaxa() {
    this.seletorTaxa.style.display = 'none';
  }

  // Altera o período da taxa (dia, mês, ano)
  alterarPeriodoTaxa() {
    const novoperiodo = this.seletorTaxa.value;
    const valorAtualI = this.valoresFinanceiros.i;
    
    // Atualiza a propriedade interna primeiro
    const periodoAnterior = this.periodoTaxa;
    this.periodoTaxa = novoperiodo;
    
    if (valorAtualI !== null) {
      // Converte a taxa atual para o novo período
      const taxaConvertida = this.converterTaxaEntrePeriodos(valorAtualI, periodoAnterior, novoperiodo);
      this.valoresFinanceiros.i = taxaConvertida;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `I(${this.obterNomePeriodo(novoperiodo)}): ${this.formatarNumero(taxaConvertida)}%`;
    }
  }

  // Altera a moeda do PV
  alterarMoedaPV() {
    const novaMoeda = this.seletorPV.value;
    const valorAtualPV = this.valoresFinanceiros.pv;
    
    // Atualiza a propriedade interna primeiro
    const moedaAnterior = this.tipoMoedaPV;
    this.tipoMoedaPV = novaMoeda;
    
    if (valorAtualPV !== null) {
      // Converte o valor para a nova moeda
      const valorConvertido = this.converterMoeda(valorAtualPV, moedaAnterior, novaMoeda);
      this.valoresFinanceiros.pv = valorConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `PV(${this.obterSimboloMoeda(novaMoeda)}): ${this.formatarNumero(valorConvertido)}`;
    }
  }

  // Altera a moeda do FV
  alterarMoedaFV() {
    const novaMoeda = this.seletorFV.value;
    const valorAtualFV = this.valoresFinanceiros.fv;
    
    // Atualiza a propriedade interna primeiro
    const moedaAnterior = this.tipoMoedaFV;
    this.tipoMoedaFV = novaMoeda;
    
    if (valorAtualFV !== null) {
      // Converte o valor para a nova moeda
      const valorConvertido = this.converterMoeda(valorAtualFV, moedaAnterior, novaMoeda);
      this.valoresFinanceiros.fv = valorConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `FV(${this.obterSimboloMoeda(novaMoeda)}): ${this.formatarNumero(valorConvertido)}`;
    }
  }

  // Altera o tipo de período
  alterarTipoPeriodo() {
    const novoPeriodo = this.seletorPeriodo.value;
    const valorAtualN = this.valoresFinanceiros.n;
    
    // Atualiza a propriedade interna primeiro
    const periodoAnterior = this.tipoPeriodo;
    this.tipoPeriodo = novoPeriodo;
    
    if (valorAtualN !== null) {
      // Converte o período para o novo tipo
      const periodoConvertido = this.converterPeriodo(valorAtualN, periodoAnterior, novoPeriodo);
      this.valoresFinanceiros.n = periodoConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `N(${this.obterNomePeriodo(novoPeriodo)}): ${this.formatarNumero(periodoConvertido)}`;
    }
  }

  // Converte taxa entre diferentes períodos
  converterTaxaEntrePeriodos(taxa, periodoOrigem, periodoDestino) {
    if (periodoOrigem === periodoDestino) return taxa;

    // Mapeamento de períodos para número de dias
    const diasPorPeriodo = { day: 1, month: 30, year: 360 };

    // Converte taxa para decimal
    const taxaDecimal = taxa / 100;

    // Calcula fator de conversão
    const diasOrigem = diasPorPeriodo[periodoOrigem];
    const diasDestino = diasPorPeriodo[periodoDestino];

    // Converte taxa para equivalente no novo período (juros compostos)
    const taxaConvertida = Math.pow(1 + taxaDecimal, diasDestino / diasOrigem) - 1;

    return taxaConvertida * 100; // Retorna em porcentagem
  }

  // Retorna o nome do período em português
  obterNomePeriodo(periodo) {
    const nomes = {
      day: 'Dia',
      month: 'Mês',
      year: 'Ano'
    };
    return nomes[periodo] || 'Mês';
  }

  // Converte valores entre moedas (taxas fixas para demonstração)
  converterMoeda(valor, moedaOrigem, moedaDestino) {
    if (moedaOrigem === moedaDestino) return valor;
    
    // Taxas de conversão aproximadas (para demonstração)
    const taxas = {
      real: 1,
      dollar: 5.2,    // 1 USD = 5.2 BRL
      euro: 5.8       // 1 EUR = 5.8 BRL
    };
    
    // Converte para real primeiro, depois para moeda destino
    const valorEmReal = valor * taxas[moedaOrigem];
    return valorEmReal / taxas[moedaDestino];
  }

  // Retorna o símbolo da moeda
  obterSimboloMoeda(moeda) {
    const simbolos = {
      real: 'R$',
      dollar: 'US$',
      euro: '€'
    };
    return simbolos[moeda] || 'R$';
  }

  // Converte períodos entre diferentes unidades
  converterPeriodo(valor, periodoOrigem, periodoDestino) {
    if (periodoOrigem === periodoDestino) return valor;

    const diasPorPeriodo = { day: 1, month: 30, year: 360 };

    // Converte o valor para dias
    const valorEmDias = valor * diasPorPeriodo[periodoOrigem];

    // Converte de dias para o período de destino
    return valorEmDias / diasPorPeriodo[periodoDestino];
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

    // Lista de teclas que devem ser ignoradas pela calculadora
    const teclasIgnoradas = [
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
      'Tab', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta', 'ContextMenu',
      'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ];

    // Se a tecla deve ser ignorada, não interfere
    if (teclasIgnoradas.includes(tecla)) return;

    // Se há modificadores (Ctrl, Alt, etc.) pressionados, também ignora
    if (evento.ctrlKey || evento.altKey || evento.metaKey) return;

    // Números
    if (/[0-9]/.test(tecla)) {
      this.inserirNumero(tecla);
      evento.preventDefault();
      return;
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