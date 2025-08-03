/**
 * CÁLCULOS DE CAPITALIZAÇÃO
 * Sistema para cálculos de capitalização de juros 
 * Suporta conversão entre taxa nominal (ik), taxa efetiva por período (ie) e períodos de capitalização (k)
 * 
 * Conceitos:
 * - Taxa nominal (ik): Taxa total dividida pelo número de períodos de capitalização
 * - Taxa efetiva por período (ie): Taxa que efetivamente incide em cada período
 * - Períodos de capitalização (k): Número de vezes que os juros são capitalizados
 * 
 * Fórmulas:
 * - ik = ie × k (taxa nominal = taxa efetiva por período × períodos)
 * - ie = ik / k (taxa efetiva por período = taxa nominal / períodos)
 * - k = ik / ie (períodos = taxa nominal / taxa efetiva por período)
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

    // Para capitalização simples: ik = ie × k, ie = ik / k, k = ik / ie
    // Não precisa conversão de períodos para ik pois é sempre considerada em relação ao período base

    // Deduz automaticamente qual fórmula usar baseado na variável faltante
    if (variavelFaltante === 'ie' && ik !== null && k !== null) {
      // Calcula taxa efetiva por período: ie = ik / k
      valorCalculado = this.calcularTaxaEfetiva(ik, k);
      
    } else if (variavelFaltante === 'ik' && ie !== null && k !== null) {
      // Calcula taxa nominal: ik = ie × k
      valorCalculado = this.calcularTaxaNominal(ie, k);
      
    } else if (variavelFaltante === 'k' && ik !== null && ie !== null) {
      // Calcula períodos de capitalização: k = ik / ie
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
   * Calcula taxa efetiva por período a partir da nominal
   * @param {number} ik - Taxa nominal (%)
   * @param {number} k - Períodos de capitalização
   * @returns {number} Taxa efetiva por período (%)
   */
  calcularTaxaEfetiva(ik, k) {
    // Para taxa efetiva por período: ie = ik / k
    // Onde ik é a taxa nominal e k é o número de períodos
    return ik / k;
  }

  /**
   * Calcula taxa nominal a partir da efetiva
   * @param {number} ie - Taxa efetiva por período (%)
   * @param {number} k - Períodos de capitalização
   * @returns {number} Taxa nominal (%)
   */
  calcularTaxaNominal(ie, k) {
    // Para taxa nominal: ik = ie × k
    // Onde ie é a taxa efetiva por período e k é o número de períodos
    return ie * k;
  }

  /**
   * Calcula períodos de capitalização
   * @param {number} ik - Taxa nominal (%)
   * @param {number} ie - Taxa efetiva por período (%)
   * @returns {number} Períodos de capitalização
   */
  calcularPeriodosCapitalizacao(ik, ie) {
    if (ie <= 0) throw new Error('Taxa efetiva deve ser positiva');
    
    // Para períodos de capitalização: k = ik / ie
    // Onde ik é a taxa nominal e ie é a taxa efetiva por período
    return ik / ie;
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
