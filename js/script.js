import { CalculosFinanceiros } from './calculos-financeiros.js';

/**
 * CALCULADORA FINANCEIRA
 * Sistema completo para cálculos financeiros baseados em juros simples e compostos
 * Suporta cálculo de Valor Presente (PV), Valor Futuro (FV), Taxa de Juros (i) e Número de Períodos (n)
 */
class CalculadoraFinanceira {  
  constructor() {
    // Elementos do DOM
    this.displayPrincipal = document.getElementById('mainDisplay');
    this.displayVariavel = document.getElementById('variableDisplay');
    this.displayOp = document.getElementById('operationDisplay');
    this.displayModo = document.getElementById('modeDisplay');
    this.valoresStatus = {
      pv: document.getElementById('pvValue'),
      fv: document.getElementById('fvValue'),
      j: document.getElementById('jValue'),
      i: document.getElementById('iValue'),
      n: document.getElementById('nValue'),
      d: document.getElementById('dValue')
    };
    
    // Botões de remoção individual
    this.botoesRemocao = {
      pv: document.getElementById('clearPV'),
      fv: document.getElementById('clearFV'),
      j: document.getElementById('clearJ'),
      i: document.getElementById('clearI'),
      n: document.getElementById('clearN'),
      d: document.getElementById('clearD')
    };
    
    // Elemento do seletor de taxa
    this.seletorTaxa = document.getElementById('rateSelector');
    
    // Elementos dos outros seletores
    this.seletorPV = document.getElementById('pvSelector');
    this.seletorFV = document.getElementById('fvSelector');
    this.seletorJ = document.getElementById('jSelector');
    this.seletorD = document.getElementById('dSelector');
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
      j: null,    // Juros
      i: null,    // Taxa de juros (por período)
      n: null     // Número de períodos
    };
    
    // Valores para desconto (usando nomes diferentes para evitar conflito)
    this.valoresDesconto = {
      N: null,    // Valor Nominal
      Va: null,   // Valor Atual
      i: null,    // Taxa de desconto
      n: null,    // Tempo
      D: null     // Desconto
    };
    
    // Estado atual do modo (para controlar os botões)
    this.modoAtual = 'composto'; // Será atualizado na inicialização
    this.botoesOriginais = null;  // Para guardar os botões originais
    
    // Período atual da taxa (day, month, year)
    this.periodoTaxa = 'month';
    
    // Tipos de conversão para valores e períodos
    this.tipoMoedaPV = 'real';
    this.tipoMoedaFV = 'real';
    this.tipoMoedaJ = 'real';
    this.tipoMoedaD = 'real';
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

  // Inicializa o seletor de modo
  inicializarSeletorModo() {
    // Verifica se o seletor de modo existe
    if (this.seletorModo) {
      // Define o modo inicial baseado no valor do seletor HTML
      this.modoAtual = this.seletorModo.value || 'simples';
      
      // Atualiza o sistema de cálculos com o modo inicial
      this.calculosFinanceiros.setModoCapitalizacao(this.modoAtual);
      
      // Atualiza a interface para refletir o modo inicial
      this.atualizarDisplayOperacao();
    }
  }

  // Inicializa todos os event listeners dos botões
  inicializarEventos() {
    // Botões numéricos
    document.querySelectorAll('.number-btn').forEach(btn => {
      btn.addEventListener('click', () => this.inserirNumero(btn.dataset.number));
    });

    // Botões financeiros
    document.querySelectorAll('.financial-btn').forEach(btn => {
      btn.addEventListener('click', () => this.definirVariavelFinanceira(btn.dataset.function));
    });

    // Botões de operação
    document.querySelectorAll('.operation-btn').forEach(btn => {
      btn.addEventListener('click', () => this.executarOp(btn.dataset.function));
    });

    // Botões de conversão de taxas
    document.querySelectorAll('.conversion-btn').forEach(btn => {
      btn.addEventListener('click', () => this.converterTaxa(btn.dataset.function));
    });    
    
    // Seletor de taxa
    this.seletorTaxa.addEventListener('change', () => this.alterarPeriodoTaxa());
    
    // Seletor de moeda PV
    this.seletorPV.addEventListener('change', () => this.alterarMoedaPV());
    
    // Seletor de moeda FV
    this.seletorFV.addEventListener('change', () => this.alterarMoedaFV());
    
    // Seletor de moeda J
    this.seletorJ.addEventListener('change', () => this.alterarMoedaJ());
    
    // Seletor de moeda D
    this.seletorD.addEventListener('change', () => this.alterarMoedaD());
    
    // Seletor de período
    this.seletorPeriodo.addEventListener('change', () => this.alterarTipoPeriodo());
    
    // Seletor de modo
    this.seletorModo.addEventListener('change', () => this.alterarModoCalculadora());
    
    // Botões de remoção individual
    Object.keys(this.botoesRemocao).forEach(variavel => {
      if (this.botoesRemocao[variavel]) this.botoesRemocao[variavel].addEventListener('click', () => this.removerValorIndividual(variavel));
    });
    
    // Suporte a teclado
    document.addEventListener('keydown', (e) => this.manipularTeclado(e));

    // Suporte a colar (paste)
    document.addEventListener('paste', (e) => this.manipularColar(e));

    // Inicializa o modo baseado no valor do seletor HTML
    this.modoAtual = this.seletorModo.value;
    this.alterarModoCalculadora();
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
    document.querySelectorAll('.financial-btn').forEach(btn => btn.classList.remove('active'));

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

      const resultado = this.calculosFinanceiros.resolverEqFinanceira(variavelFaltante, this.valoresFinanceiros, this.modoAtual);

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
      setTimeout(() => this.displayOp.textContent = '', 3000);
    } catch (erro) {
      this.mostrarErro('Erro no cálculo: ' + erro.message);
      this.displayOp.textContent = '';
    } finally {
      setTimeout(() => this.displayPrincipal.classList.remove('calculating'), 500);
    }
  }

  // Limpa todos os valores e reinicia a calculadora
  limparTudo() {
    this.entradaAtual = '0';
    this.novaEntrada = true;
    this.ultimaVariavel = null;
    
    // Verifica se está em modo de desconto para limpar os valores apropriados
    const ehModoDesconto = this.modoAtual === 'desconto-racional' || this.modoAtual === 'desconto-comercial';
    
    if (ehModoDesconto) {
      this.valoresDesconto = {
        N: null,
        Va: null,
        i: null,
        n: null,
        D: null
      };
      this.atualizarDisplayStatusDesconto();
    } else {
      this.valoresFinanceiros = {
        pv: null,
        fv: null,
        j: null,
        i: null,
        n: null
      };
      this.atualizarDisplayStatus();
    }
    
    this.displayVariavel.textContent = '-';
    this.atualizarDisplay();
    this.limparErro();
    this.limparOp();
  }

  // Altera o modo da calculadora através do seletor
  alterarModoCalculadora() {
    const novoModo = this.seletorModo.value;
    
    // Define o modo no sistema de cálculos
    this.calculosFinanceiros.setModoCapitalizacao(novoModo);

    // Guarda o modo anterior e atualiza o novo
    const modoAnterior = this.modoAtual;
    this.modoAtual = novoModo;

    // Troca os botões se necessário
    this.atualizarBotoesPorModo(modoAnterior, novoModo);

    // Atualiza o display de operação diretamente sem transição
    this.atualizarDisplayOperacao();
  }

  // Alterna entre modo de capitalização simples e composta
  alternarModoCapitalizacao() {
    const novoModo = this.calculosFinanceiros.alternarModoCapitalizacao();
    
    // Atualiza o display de operação diretamente sem transição
    this.atualizarDisplayOperacao();
  }

  // ==================== GESTÃO DE MODOS E BOTÕES ====================

  /**
   * Atualiza os botões baseado no modo selecionado
   * @param {string} modoAnterior - Modo anterior
   * @param {string} novoModo - Novo modo selecionado
   */
  atualizarBotoesPorModo(modoAnterior, novoModo) {
    const ehModoDesconto = (modo) => modo === 'desconto-racional' || modo === 'desconto-comercial';
    
    // Se mudou de modo normal para desconto
    if (!ehModoDesconto(modoAnterior) && ehModoDesconto(novoModo)) {
      this.salvarBotoesOriginais();
      this.criarBotoesDesconto();
      this.limparValoresFinanceiros();
      this.atualizarLabelsParaDesconto();
    }
    // Se mudou de modo desconto para normal
    else if (ehModoDesconto(modoAnterior) && !ehModoDesconto(novoModo)) {
      this.restaurarBotoesOriginais();
      this.limparValoresDesconto();
      this.restaurarLabelsStatus();
    }
    // Se mudou entre modos de desconto atualiza os event listeners
    else if (ehModoDesconto(modoAnterior) && ehModoDesconto(novoModo)) this.atualizarEventListenersDesconto();
  }

  // Salva o HTML dos botões originais
  salvarBotoesOriginais() {
    const primeiraLinha = document.querySelector('.keypad-row:first-child');
    const segundaLinha = document.querySelector('.keypad-row:nth-child(2)');
    if (primeiraLinha && segundaLinha && !this.botoesOriginais) {
      this.botoesOriginais = {
        primeira: primeiraLinha.innerHTML,
        segunda: segundaLinha.innerHTML
      };
    }
  }

  // Cria os botões específicos para modos de desconto
  criarBotoesDesconto() {
    const primeiraLinha = document.querySelector('.keypad-row:first-child');
    const segundaLinha = document.querySelector('.keypad-row:nth-child(2)');
    if (!primeiraLinha || !segundaLinha) return;

    primeiraLinha.innerHTML = `
      <button class="btn financial-btn" data-function="N">N</button>
      <button class="btn financial-btn" data-function="Va">Va</button>
      <button class="btn financial-btn" data-function="i">i</button>
      <button class="btn financial-btn" data-function="n">n</button>
      <button class="btn financial-btn" data-function="D">D</button>
    `;

    segundaLinha.innerHTML = `
      <button class="btn operation-btn" data-function="cpt">CPT</button>
      <button class="btn operation-btn" data-function="ac">AC</button>
      <button class="btn operation-btn" data-function="ce">CE</button>
      <button class="btn operation-btn" data-function="sinal">+/-</button>
      <button class="btn operation-btn" data-function="porcento">%</button>
    `;

    // Atualiza event listeners para os novos botões
    this.atualizarEventListenersDesconto();
  }

  // Restaura os botões originais
  restaurarBotoesOriginais() {
    const primeiraLinha = document.querySelector('.keypad-row:first-child');
    const segundaLinha = document.querySelector('.keypad-row:nth-child(2)');
    if (primeiraLinha && segundaLinha && this.botoesOriginais) {
      primeiraLinha.innerHTML = this.botoesOriginais.primeira;
      segundaLinha.innerHTML = this.botoesOriginais.segunda;
      
      // Reativa os event listeners originais
      this.reativarEventListenersOriginais();
    }
  }

  // Atualiza os event listeners para os botões de desconto
  atualizarEventListenersDesconto() {
    // Remove listeners antigos e adiciona novos para botões financeiros
    document.querySelectorAll('.financial-btn').forEach(btn => {
      // Clona o botão para remover todos os listeners
      const novoBotao = btn.cloneNode(true);
      btn.parentNode.replaceChild(novoBotao, btn);
      
      // Adiciona o novo listener
      novoBotao.addEventListener('click', () => this.definirVariavelDesconto(novoBotao.dataset.function));
    });

    // Atualiza listener do CPT
    const btnCpt = document.querySelector('[data-function="cpt"]');
    if (btnCpt) {
      const novoBtnCpt = btnCpt.cloneNode(true);
      btnCpt.parentNode.replaceChild(novoBtnCpt, btnCpt);
      
      novoBtnCpt.addEventListener('click', () => this.calcularDescontoFaltante());
    }

    // Atualiza listener do AC (botão de limpar tudo)
    const btnAc = document.querySelector('[data-function="ac"]');
    if (btnAc) {
      const novoBtnAc = btnAc.cloneNode(true);
      btnAc.parentNode.replaceChild(novoBtnAc, btnAc);
      
      novoBtnAc.addEventListener('click', () => this.limparTudo());
    }

    // Atualiza listeners para os outros botões de operação (CE, +/-, %)
    const outrosBotoesOperacao = ['ce', 'sinal', 'porcento'];
    outrosBotoesOperacao.forEach(funcao => {
      const btn = document.querySelector(`[data-function="${funcao}"]`);
      if (btn) {
        const novoBotao = btn.cloneNode(true);
        btn.parentNode.replaceChild(novoBotao, btn);
        
        novoBotao.addEventListener('click', () => this.executarOp(novoBotao.dataset.function));
      }
    });
  }

  // Reativa os event listeners originais
  reativarEventListenersOriginais() {
    // Botões financeiros originais
    document.querySelectorAll('.financial-btn').forEach(btn => {
      const novoBotao = btn.cloneNode(true);
      btn.parentNode.replaceChild(novoBotao, btn);
      
      novoBotao.addEventListener('click', () => this.definirVariavelFinanceira(novoBotao.dataset.function));
    });

    // Reativa todos os botões de operação
    document.querySelectorAll('.operation-btn').forEach(btn => {
      const novoBotao = btn.cloneNode(true);
      btn.parentNode.replaceChild(novoBotao, btn);
      
      novoBotao.addEventListener('click', () => this.executarOp(novoBotao.dataset.function));
    });
  }

  /**
   * Define variável de desconto com o valor atual
   * @param {string} variavel - Variável de desconto (N, Va, i, n, D)
   */
  definirVariavelDesconto(variavel) {
    this.limparErro();

    const valor = parseFloat(this.entradaAtual);
    if (isNaN(valor)) {
      this.mostrarErro('Valor inválido');
      return;
    }

    // Remove destaque de outros botões
    document.querySelectorAll('.financial-btn').forEach(btn => {
      btn.classList.remove('active-variable');
    });

    // Destaca o botão atual
    const btn = document.querySelector(`[data-function="${variavel}"]`);
    if (btn) btn.classList.add('active-variable');

    this.valoresDesconto[variavel] = valor;
    this.ultimaVariavel = variavel;
    
    this.atualizarDisplayStatusDesconto();
    
    // Mapeia os nomes para exibição
    const nomesExibicao = {
      N: 'Valor Nominal',
      Va: 'Valor Atual', 
      i: 'Taxa',
      n: 'Tempo',
      D: 'Desconto'
    };
    
    this.displayVariavel.textContent = `${nomesExibicao[variavel]}: ${this.formatarNumero(valor)}`;
    this.novaEntrada = true;
  }

  // Calcula a variável de desconto faltante usando CPT
  calcularDescontoFaltante() {
    // Conta quantas variáveis estão definidas (incluindo D agora)
    const valoresDefinidos = Object.values(this.valoresDesconto).filter(v => v !== null);

    if (valoresDefinidos.length < 3) {
      this.mostrarErro('É necessário definir pelo menos 3 valores para calcular');
      return;
    }

    if (valoresDefinidos.length === 5) {
      this.mostrarErro('Todos os valores já estão definidos');
      return;
    }

    // Identifica qual variável está faltando
    const variavelFaltante = Object.keys(this.valoresDesconto).find(chave => this.valoresDesconto[chave] === null);

    if (!variavelFaltante) {
      this.mostrarErro('Nenhuma variável faltante encontrada');
      return;
    }

    try {
      // Determina o tipo de desconto baseado no modo atual
      const tipoDesconto = this.modoAtual === 'desconto-racional' ? 'racional' : 'comercial';
      
      const resultado = this.calculosFinanceiros.resolverEqDesconto(
        variavelFaltante, 
        this.valoresDesconto, 
        tipoDesconto
      );

      // Extrai o valor calculado baseado na variável
      let valorCalculado;
      // Mapeamento direto entre variáveis e propriedades do resultado
      const mapeamentoResultado = {
        N: 'valorNominal',
        Va: 'valorAtual', 
        i: 'taxa',
        n: 'tempo',
        D: 'desconto'
      };
      
      valorCalculado = resultado[mapeamentoResultado[variavelFaltante]];

      // Atualiza a variável calculada
      this.valoresDesconto[variavelFaltante] = valorCalculado;
      
      // Se D não foi a variável calculada, também atualiza o desconto automaticamente
      if (variavelFaltante !== 'D') {
        this.valoresDesconto.D = resultado.desconto;
      }
      
      this.entradaAtual = valorCalculado.toString();
      
      // Mapeia os nomes para exibição
      const nomesExibicao = {
        N: 'Valor Nominal',
        Va: 'Valor Atual',
        i: 'Taxa',
        n: 'Tempo',
        D: 'Desconto'
      };
      
      this.displayVariavel.textContent = `${nomesExibicao[variavelFaltante]} = ${this.formatarNumero(valorCalculado)}`;
      this.atualizarDisplay();
      this.atualizarDisplayStatusDesconto();
      
      this.novaEntrada = true;
      
    } catch (erro) {
      this.mostrarErro(erro.message);
    } finally {
      // Remove destaque de todos os botões
      document.querySelectorAll('.financial-btn').forEach(btn => btn.classList.remove('active-variable'));
    }
  }

  // Atualiza o display de status com os valores de desconto
  atualizarDisplayStatusDesconto() {
    // Mapeia as variáveis de desconto para os elementos do status
    const mapeamento = {
      N: 'pvValue',    // Usa o espaço do PV para mostrar N
      Va: 'fvValue',   // Usa o espaço do FV para mostrar Va
      i: 'iValue',     // Mantém o i
      n: 'nValue',     // Mantém o n
      D: 'dValue'      // Novo elemento para mostrar o desconto
    };

    // Mapeia para os botões de remoção
    const mapeamentoBotoes = {
      N: 'pv',
      Va: 'fv', 
      i: 'i',
      n: 'n',
      D: 'd'
    };

    Object.keys(mapeamento).forEach(chave => {
      const elemento = document.getElementById(mapeamento[chave]);
      if (elemento) {
        const valor = this.valoresDesconto[chave];
        elemento.textContent = valor !== null ? this.formatarNumero(valor) : '-';
        
        // Atualiza visibilidade do botão de remoção e classe do status-item
        const statusItem = elemento.closest('.status-item');
        const chaveBotao = mapeamentoBotoes[chave];
        const botaoRemocao = this.botoesRemocao[chaveBotao];
        
        if (valor !== null) {
          statusItem.classList.add('has-value');
          if (botaoRemocao) botaoRemocao.style.display = 'inline-block';
          
          // Mostra seletor específico se necessário
          if (chave === 'D') this.mostrarSeletorD();
        } else {
          statusItem.classList.remove('has-value');
          if (botaoRemocao) botaoRemocao.style.display = 'none';
        }
      }
    });
  }

  // Atualiza os labels para refletir o modo de desconto
  atualizarLabelsParaDesconto() {
    const labelPV = document.querySelector('.status-item:first-child .label');
    const labelFV = document.querySelector('.status-item:nth-child(2) .label');
    const statusDisplay = document.querySelector('.status-display');
    
    if (labelPV) labelPV.textContent = 'N:';
    if (labelFV) labelFV.textContent = 'Va:';
    
    // Mostra o campo do desconto e oculta o campo de juros
    if (statusDisplay) statusDisplay.classList.add('modo-desconto');
  }

  // Restaura os labels originais do status
  restaurarLabelsStatus() {
    const labelPV = document.querySelector('.status-item:first-child .label');
    const labelFV = document.querySelector('.status-item:nth-child(2) .label');
    const statusDisplay = document.querySelector('.status-display');
    
    if (labelPV) labelPV.textContent = 'PV:';
    if (labelFV) labelFV.textContent = 'FV:';
    
    // Oculta o campo do desconto e mostra o campo de juros
    if (statusDisplay) statusDisplay.classList.remove('modo-desconto');
  }

  // Limpa os valores financeiros e restaura labels
  limparValoresFinanceiros() {
    this.valoresFinanceiros = {
      pv: null,
      fv: null,
      j: null,
      i: null,
      n: null
    };
    this.atualizarDisplayStatus();
  }

  // Limpa os valores de desconto e restaura labels
  limparValoresDesconto() {
    this.valoresDesconto = {
      N: null,
      Va: null,
      i: null, 
      n: null,
      D: null
    };
    this.restaurarLabelsStatus();
    this.atualizarDisplayStatus();
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
        const simbolosOp = {
          soma: '+',
          subtrai: '-', 
          multiplica: 'x',
          divide: '÷'
        };
        
        // Atualiza o display de operação com o resultado
        this.displayOp.textContent = `${this.formatarNumero(this.operando)} ${simbolosOp[this.operacaoAtual]} ${this.formatarNumero(atual)} =`;
        
        this.entradaAtual = resultado.toString();
        this.atualizarDisplay();
        this.novaEntrada = true;
        
        // Limpa a operação após exibir o resultado
        setTimeout(() => this.limparOp(), 2000);
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
      setTimeout(() => this.displayOp.textContent = '', 2000);
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
      setTimeout(() => this.displayOp.textContent = '', 2000);
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
      setTimeout(() => this.displayOp.textContent = '', 2000);
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

  // Converte taxas entre dia, mês e ano
  converterTaxa(tipoConversao) {
    this.limparErro();
    
    const taxaAtual = parseFloat(this.entradaAtual);
    if (isNaN(taxaAtual) || taxaAtual < 0) {
      this.mostrarErro('Taxa inválida');
      return;
    }

    // Remove destaque de outros botões de conversão
    document.querySelectorAll('.conversion-btn').forEach(btn => btn.classList.remove('active'));

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
    
    // Atualiza o display do modo
    this.displayModo.textContent = modoTexto;
    
    // Atualiza o display das operações
    if (this.operando !== undefined && this.operacaoAtual) {
      const simbolosOp = {
        'soma': '+',
        'subtrai': '-',
        'multiplica': 'x',
        'divide': '÷'
      };
      operacaoTexto = `${this.formatarNumero(this.operando)} ${simbolosOp[this.operacaoAtual] || this.operacaoAtual}`;
    }
    
    this.displayOp.textContent = operacaoTexto;
  }

  // Atualiza o display de operação
  atualizarDisplayOp(simbolo) {
    if (this.operando !== undefined) {
      const operacaoTexto = `${this.formatarNumero(this.operando)} ${simbolo}`;
      this.displayOp.textContent = operacaoTexto;
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
    // Verifica se está em modo de desconto
    const ehModoDesconto = this.modoAtual === 'desconto-racional' || this.modoAtual === 'desconto-comercial';
    
    if (ehModoDesconto) this.atualizarDisplayStatusDesconto();
    else {
      Object.keys(this.valoresFinanceiros).forEach(chave => {
        const valor = this.valoresFinanceiros[chave];
        this.valoresStatus[chave].textContent = valor !== null ? this.formatarNumero(valor) : '-';
        
        // Atualiza visibilidade do botão de remoção e classe do status-item
        const statusItem = this.valoresStatus[chave].closest('.status-item');
        const botaoRemocao = this.botoesRemocao[chave];
        
        if (valor !== null) {
          statusItem.classList.add('has-value');
          if (botaoRemocao) botaoRemocao.style.display = 'inline-block';
        } else {
          statusItem.classList.remove('has-value');
          if (botaoRemocao) botaoRemocao.style.display = 'none';
        }
      });
      // Limpa o campo de desconto quando não está em modo desconto
      if (this.valoresStatus.d) this.valoresStatus.d.textContent = '-';
    }
    
    // Mostra os seletores para campos que têm valores definidos
    this.atualizarVisibilidadeSeletores();
  }

  // Atualiza a visibilidade dos seletores - mantém todos sempre visíveis
  atualizarVisibilidadeSeletores() {
    const ehModoDesconto = this.modoAtual === 'desconto-racional' || this.modoAtual === 'desconto-comercial';
    
    if (ehModoDesconto) {
      // Modo desconto - mostra todos os seletores relevantes sempre
      this.mostrarSeletorD();
      this.mostrarSeletorTaxa();
      this.mostrarSeletorPeriodo();
      
      // Esconde seletores que não são relevantes no modo desconto
      this.seletorPV.style.display = 'none';
      this.seletorFV.style.display = 'none';
      this.seletorJ.style.display = 'none';
    } else {
      // Modo normal - mostra todos os seletores sempre
      this.mostrarSeletorPV();
      this.mostrarSeletorFV();
      this.mostrarSeletorJ();
      this.mostrarSeletorTaxa();
      this.mostrarSeletorPeriodo();
      
      // Esconde o seletor de desconto no modo normal
      this.seletorD.style.display = 'none';
    }
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

  // Mostra o seletor de moeda J
  mostrarSeletorJ() {
    this.seletorJ.style.display = 'block';
    // Só define o valor se ainda não estiver definido
    if (!this.seletorJ.value || this.seletorJ.value === '') this.seletorJ.value = this.tipoMoedaJ;
  }

  // Mostra o seletor de moeda D
  mostrarSeletorD() {
    this.seletorD.style.display = 'block';
    // Só define o valor se ainda não estiver definido
    if (!this.seletorD.value || this.seletorD.value === '') this.seletorD.value = this.tipoMoedaD;
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
    this.seletorJ.style.display = 'none';
    this.seletorD.style.display = 'none';
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
      const taxaConvertida = this.calculosFinanceiros.converterTaxaEntrePeriodos(valorAtualI, periodoAnterior, novoperiodo);
      this.valoresFinanceiros.i = taxaConvertida;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `I(${this.calculosFinanceiros.obterNomePeriodo(novoperiodo)}): ${this.formatarNumero(taxaConvertida)}%`;
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
      const valorConvertido = this.calculosFinanceiros.converterMoeda(valorAtualPV, moedaAnterior, novaMoeda);
      this.valoresFinanceiros.pv = valorConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `PV(${this.calculosFinanceiros.obterSimboloMoeda(novaMoeda)}): ${this.formatarNumero(valorConvertido)}`;
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
      const valorConvertido = this.calculosFinanceiros.converterMoeda(valorAtualFV, moedaAnterior, novaMoeda);
      this.valoresFinanceiros.fv = valorConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `FV(${this.calculosFinanceiros.obterSimboloMoeda(novaMoeda)}): ${this.formatarNumero(valorConvertido)}`;
    }
  }

  // Altera a moeda do J
  alterarMoedaJ() {
    const novaMoeda = this.seletorJ.value;
    const valorAtualJ = this.valoresFinanceiros.j;
    
    // Atualiza a propriedade interna primeiro
    const moedaAnterior = this.tipoMoedaJ;
    this.tipoMoedaJ = novaMoeda;
    
    if (valorAtualJ !== null) {
      // Converte o valor para a nova moeda
      const valorConvertido = this.calculosFinanceiros.converterMoeda(valorAtualJ, moedaAnterior, novaMoeda);
      this.valoresFinanceiros.j = valorConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `J(${this.calculosFinanceiros.obterSimboloMoeda(novaMoeda)}): ${this.formatarNumero(valorConvertido)}`;
    }
  }

  // Altera a moeda do D
  alterarMoedaD() {
    const novaMoeda = this.seletorD.value;
    const valorAtualD = this.valoresDesconto.D;
    
    // Atualiza a propriedade interna primeiro
    const moedaAnterior = this.tipoMoedaD;
    this.tipoMoedaD = novaMoeda;
    
    if (valorAtualD !== null) {
      // Converte o valor para a nova moeda
      const valorConvertido = this.calculosFinanceiros.converterMoeda(valorAtualD, moedaAnterior, novaMoeda);
      this.valoresDesconto.D = valorConvertido;
      this.atualizarDisplayStatusDesconto();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `Desconto(${this.calculosFinanceiros.obterSimboloMoeda(novaMoeda)}): ${this.formatarNumero(valorConvertido)}`;
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
      const periodoConvertido = this.calculosFinanceiros.converterPeriodo(valorAtualN, periodoAnterior, novoPeriodo);
      this.valoresFinanceiros.n = periodoConvertido;
      this.atualizarDisplayStatus();
      
      // Atualiza o display da variável
      this.displayVariavel.textContent = `N(${this.calculosFinanceiros.obterNomePeriodo(novoPeriodo)}): ${this.formatarNumero(periodoConvertido)}`;
    }
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
    
    // Salva o conteúdo atual do variable-display para restaurar depois
    this.variableDisplayAnterior = this.displayVariavel.textContent;
    
    // Exibe a mensagem de erro no variable-display
    this.displayVariavel.textContent = `❌ ${mensagem}`;
    this.displayVariavel.classList.add('error');
    this.displayPrincipal.classList.add('error');

    // Marca que há uma mensagem de erro ativa
    this.mensagemErro = true;

    setTimeout(() => this.limparErro(), 3000);
  }

  // Limpa a mensagem de erro atual
  limparErro() {
    if (this.mensagemErro) {
      // Restaura o conteúdo anterior do variable-display
      this.displayVariavel.textContent = this.variableDisplayAnterior || '-';
      this.displayVariavel.classList.remove('error');
      this.mensagemErro = null;
      this.variableDisplayAnterior = null;
    }    
    this.displayPrincipal.classList.remove('error');
  }

  // Manipula o e de colar (paste)
  manipularColar(e) {
    e.preventDefault();
    
    // Obtém o texto colado
    const textoColado = (e.clipboardData || window.clipboardData).getData('text');
    
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
    setTimeout(() => this.displayPrincipal.classList.remove('pasted'), 300);
  }

  // Manipula eventos de teclado para entrada de números e operações
  manipularTeclado(e) {
    const tecla = e.key;

    // Verificar se o foco está na seção da taxa calculator
    const elementoAtivo = document.activeElement;
    const taxaCalculatorContainer = document.querySelector('.taxa-calculator-container');
    
    // Se o elemento ativo está dentro da taxa calculator, não interceptar
    if (taxaCalculatorContainer && taxaCalculatorContainer.contains(elementoAtivo)) {
      return;
    }

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
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    // Números
    if (/[0-9]/.test(tecla)) {
      this.inserirNumero(tecla);
      e.preventDefault();
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
      e.preventDefault();
    }
  }

  // Remove um valor individual específico
  removerValorIndividual(variavel) {
    this.limparErro();
    
    // Verifica se está em modo de desconto
    const ehModoDesconto = this.modoAtual === 'desconto-racional' || this.modoAtual === 'desconto-comercial';
    
    if (ehModoDesconto) {
      // Para modo desconto, mapeia as variáveis
      const mapeamentoDesconto = {
        'pv': 'N',   // Valor Nominal
        'fv': 'Va',  // Valor Atual
        'i': 'i',    // Taxa
        'n': 'n',    // Tempo
        'd': 'D'     // Desconto
      };
      
      const variavelDesconto = mapeamentoDesconto[variavel];
      if (variavelDesconto && this.valoresDesconto[variavelDesconto] !== null) {
        this.valoresDesconto[variavelDesconto] = null;
        this.displayOp.textContent = `${variavelDesconto} removido`;
        this.atualizarDisplayStatusDesconto();
      }
    } else {
      // Para modo juros simples/compostos
      if (this.valoresFinanceiros[variavel] !== null) {
        this.valoresFinanceiros[variavel] = null;
        this.displayOp.textContent = `${variavel.toUpperCase()} removido`;
        this.atualizarDisplayStatus();
      }
    }
    
    // Limpa a mensagem após 2 segundos
    setTimeout(() => this.displayOp.textContent = '', 2000);
    
    // Se foi a última variável definida, limpa o display de variável
    if (this.ultimaVariavel === variavel) {
      this.displayVariavel.textContent = '-';
      this.ultimaVariavel = null;
    }
    
    this.atualizarDisplay();
  }
}

// Inicializa calculadora quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new CalculadoraFinanceira();
  
  // Foca na calculadora para permitir eventos de cola
  const elementoCalculadora = document.getElementById('calculator');
  if (elementoCalculadora) elementoCalculadora.focus();
});