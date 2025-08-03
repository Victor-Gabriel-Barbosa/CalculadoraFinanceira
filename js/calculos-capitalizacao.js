/**
 * CÁLCULOS DE CAPITALIZAÇÃO
 * Sistema para cálculos de capitalização de juros 
 * Suporta conversão entre taxa nominal (ik), taxa efetiva (ie) e períodos de capitalização (k)
 */

export class CalculosCapitalizacao {
  constructor() {
    // Valores para capitalização
    this.valoresCapitalizacao = {
      ik: null,   // Taxa nominal
      ie: null,   // Taxa efetiva
      k: null     // Períodos de capitalização
    };
    
    // Períodos das taxas (day, month, year)
    this.periodosCapitalizacao = {
      ik: 'month',  // Período da taxa nominal
      ie: 'month'   // Período da taxa efetiva
    };
  }

  /**
   * Define uma variável de capitalização
   * @param {string} variavel - Variável (ik, ie, k)
   * @param {number} valor - Valor a ser definido
   */
  definirVariavel(variavel, valor) {
    if (isNaN(valor)) throw new Error('Valor inválido');

    // Inicializa objeto se não existe
    if (!this.valoresCapitalizacao) this.valoresCapitalizacao = { ik: null, ie: null, k: null };

    this.valoresCapitalizacao[variavel] = valor;
    return valor;
  }

  /**
   * Define o período de uma taxa
   * @param {string} taxa - Taxa (ik ou ie)
   * @param {string} periodo - Período (day, month, year)
   */
  definirPeriodo(taxa, periodo) {
    if (!this.periodosCapitalizacao) {
      this.periodosCapitalizacao = { ik: 'month', ie: 'month' };
    }
    this.periodosCapitalizacao[taxa] = periodo;
  }

  /**
   * Obtém o período de uma taxa
   * @param {string} taxa - Taxa (ik ou ie)
   * @returns {string} Período (day, month, year)
   */
  obterPeriodo(taxa) {
    if (!this.periodosCapitalizacao) {
      this.periodosCapitalizacao = { ik: 'month', ie: 'month' };
    }
    return this.periodosCapitalizacao[taxa] || 'month';
  }

  /**
   * Converte taxa entre períodos
   * @param {number} taxa - Taxa em porcentagem
   * @param {string} periodoOrigem - Período original
   * @param {string} periodoDestino - Período de destino
   * @returns {number} Taxa convertida
   */
  converterTaxaEntrePeriodos(taxa, periodoOrigem, periodoDestino) {
    if (periodoOrigem === periodoDestino) return taxa;

    const taxaDecimal = taxa / 100;
    let taxaAnual;

    // Converte para taxa anual primeiro
    switch (periodoOrigem) {
      case 'day':
        taxaAnual = Math.pow(1 + taxaDecimal, 365) - 1;
        break;
      case 'month':
        taxaAnual = Math.pow(1 + taxaDecimal, 12) - 1;
        break;
      case 'year':
        taxaAnual = taxaDecimal;
        break;
      default:
        throw new Error('Período de origem inválido');
    }

    // Converte da taxa anual para o período de destino
    let taxaConvertida;
    switch (periodoDestino) {
      case 'day':
        taxaConvertida = Math.pow(1 + taxaAnual, 1/365) - 1;
        break;
      case 'month':
        taxaConvertida = Math.pow(1 + taxaAnual, 1/12) - 1;
        break;
      case 'year':
        taxaConvertida = taxaAnual;
        break;
      default:
        throw new Error('Período de destino inválido');
    }

    return taxaConvertida * 100;
  }

  /**
   * Calcula o valor faltante no modo de capitalização
   * @returns {Object} Resultado com variável faltante e valor calculado
   */
  calcularValorFaltante() {
    if (!this.valoresCapitalizacao) throw new Error('Nenhum valor foi definido');

    // Conta quantas variáveis estão definidas
    const valoresDefinidos = Object.values(this.valoresCapitalizacao).filter(v => v !== null && v !== undefined);

    if (valoresDefinidos.length < 2) throw new Error('É necessário definir pelo menos 2 valores para calcular');

    if (valoresDefinidos.length === 3) throw new Error('Todos os valores já estão definidos');

    // Identifica qual variável está faltando
    const variaveisNecessarias = ['ik', 'ie', 'k'];
    const variavelFaltante = variaveisNecessarias.find(chave => 
      !this.valoresCapitalizacao.hasOwnProperty(chave) || 
      this.valoresCapitalizacao[chave] === null || 
      this.valoresCapitalizacao[chave] === undefined
    );

    if (!variavelFaltante) throw new Error('Nenhuma variável faltante encontrada');

    let { ik, ie, k } = this.valoresCapitalizacao;
    let valorCalculado;

    // Normaliza as taxas para o mesmo período antes do cálculo
    if (ik !== null && ie !== null) {
      const periodoIk = this.obterPeriodo('ik');
      const periodoIe = this.obterPeriodo('ie');
      
      // Converte ambas as taxas para o período anual para uniformizar os cálculos
      ik = this.converterTaxaEntrePeriodos(ik, periodoIk, 'year');
      ie = this.converterTaxaEntrePeriodos(ie, periodoIe, 'year');
    }

    // Deduz automaticamente qual fórmula usar baseado na variável faltante
    if (variavelFaltante === 'ie' && ik !== null && k !== null) {
      // Converte ik para o período anual se necessário
      const periodoIk = this.obterPeriodo('ik');
      const ikAnual = this.converterTaxaEntrePeriodos(ik, periodoIk, 'year');
      
      // Calcula taxa efetiva anual: ie = (1 + ik/k)^k - 1
      const ieAnual = this.calcularTaxaEfetiva(ikAnual, k);
      
      // Converte a taxa efetiva para o período desejado
      const periodoIe = this.obterPeriodo('ie');
      valorCalculado = this.converterTaxaEntrePeriodos(ieAnual, 'year', periodoIe);
      
    } else if (variavelFaltante === 'ik' && ie !== null && k !== null) {
      // Converte ie para o período anual se necessário
      const periodoIe = this.obterPeriodo('ie');
      const ieAnual = this.converterTaxaEntrePeriodos(ie, periodoIe, 'year');
      
      // Calcula taxa nominal anual: ik = k * ((1 + ie)^(1/k) - 1)
      const ikAnual = this.calcularTaxaNominal(ieAnual, k);
      
      // Converte a taxa nominal para o período desejado
      const periodoIk = this.obterPeriodo('ik');
      valorCalculado = this.converterTaxaEntrePeriodos(ikAnual, 'year', periodoIk);
      
    } else if (variavelFaltante === 'k' && ik !== null && ie !== null) {
      // Calcula k iterativamente usando taxas anuais
      valorCalculado = this.calcularPeriodosCapitalizacao(ik, ie);
    } else throw new Error('Combinação de valores inválida para o cálculo');

    // Validar se os resultados fazem sentido
    if (valorCalculado < 0 || isNaN(valorCalculado) || !isFinite(valorCalculado)) throw new Error('Resultado inválido - verifique os valores de entrada');

    // Atualiza a variável calculada
    this.valoresCapitalizacao[variavelFaltante] = valorCalculado;
    
    return {
      variavel: variavelFaltante,
      valor: valorCalculado,
      valores: { ...this.valoresCapitalizacao }
    };
  }

  /**
   * Calcula taxa efetiva a partir da nominal
   * @param {number} ik - Taxa nominal (%)
   * @param {number} k - Períodos de capitalização
   * @returns {number} Taxa efetiva (%)
   */
  calcularTaxaEfetiva(ik, k) {
    const ikDecimal = ik / 100;
    return (Math.pow(1 + ikDecimal / k, k) - 1) * 100;
  }

  /**
   * Calcula taxa nominal a partir da efetiva
   * @param {number} ie - Taxa efetiva (%)
   * @param {number} k - Períodos de capitalização
   * @returns {number} Taxa nominal (%)
   */
  calcularTaxaNominal(ie, k) {
    const ieDecimal = ie / 100;
    return k * (Math.pow(1 + ieDecimal, 1 / k) - 1) * 100;
  }

  /**
   * Calcula períodos de capitalização usando método iterativo
   * @param {number} ik - Taxa nominal (%)
   * @param {number} ie - Taxa efetiva (%)
   * @returns {number} Períodos de capitalização
   */
  calcularPeriodosCapitalizacao(ik, ie) {
    const ikDecimal = ik / 100;
    const ieDecimal = ie / 100;
    
    if (ieDecimal <= 0 || ikDecimal <= 0) throw new Error('Taxas devem ser positivas');
    
    // Método iterativo para encontrar k
    let kTentativa = 1;
    let erro = 1;
    const maxIteracoes = 100;
    let iteracao = 0;
    
    while (Math.abs(erro) > 0.0001 && iteracao < maxIteracoes) {
      const ieCalculada = Math.pow(1 + ikDecimal / kTentativa, kTentativa) - 1;
      erro = ieCalculada - ieDecimal;
      
      // Ajusta k baseado no erro
      if (erro > 0) kTentativa += 0.1;
      else kTentativa -= 0.1;
      
      if (kTentativa <= 0) kTentativa = 0.1;
      iteracao++;
    }
    
    if (iteracao >= maxIteracoes) throw new Error('Não foi possível convergir para um valor de k válido');
    
    return kTentativa;
  }

  /**
   * Remove um valor específico
   * @param {string} variavel - Variável a ser removida (ik, ie, k)
   */
  removerValor(variavel) {
    if (this.valoresCapitalizacao && this.valoresCapitalizacao[variavel] !== null) {
      this.valoresCapitalizacao[variavel] = null;
      return true;
    }
    return false;
  }

  /**
   * Limpa todos os valores de capitalização
   */
  limparTodosValores() {
    this.valoresCapitalizacao = {
      ik: null,
      ie: null,
      k: null
    };
    // Mantém os períodos definidos
    if (!this.periodosCapitalizacao) {
      this.periodosCapitalizacao = { ik: 'month', ie: 'month' };
    }
  }

  /**
   * Obtém todos os valores atuais
   * @returns {Object} Objeto com todos os valores
   */
  obterValores() {
    return { ...this.valoresCapitalizacao };
  }

  /**
   * Obtém todos os períodos atuais
   * @returns {Object} Objeto com todos os períodos
   */
  obterPeriodos() {
    if (!this.periodosCapitalizacao) {
      this.periodosCapitalizacao = { ik: 'month', ie: 'month' };
    }
    return { ...this.periodosCapitalizacao };
  }

  /**
   * Verifica se um valor está definido
   * @param {string} variavel - Variável a verificar
   * @returns {boolean} True se o valor está definido
   */
  valorDefinido(variavel) {
    return this.valoresCapitalizacao && 
           this.valoresCapitalizacao[variavel] !== null && 
           this.valoresCapitalizacao[variavel] !== undefined;
  }

  /**
   * Conta quantos valores estão definidos
   * @returns {number} Número de valores definidos
   */
  contarValoresDefinidos() {
    return Object.values(this.valoresCapitalizacao || {}).filter(v => v !== null && v !== undefined).length;
  }
}
