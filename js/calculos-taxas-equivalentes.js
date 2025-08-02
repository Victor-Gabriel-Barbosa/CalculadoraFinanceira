/**
 * CÁLCULOS DE TAXAS EQUIVALENTES
 * Classe responsável pelos cálculos de conversão entre taxas equivalentes
 * Converte uma taxa efetiva de um período para outro período equivalente
 */
export class CalculosTaxasEquivalentes {
  constructor() {
    // Valores para conversão de taxas equivalentes
    this.valores = {
      taxaOriginal: null,    // Taxa efetiva no período original (%)
      numeroPeríodos: null   // Número de períodos para conversão
    };
  }

  /**
   * Define uma variável para conversão de taxas equivalentes
   * @param {string} variavel - Variável a ser definida (taxaOriginal, numeroPeríodos)
   * @param {number} valor - Valor a ser atribuído
   */
  definirVariavel(variavel, valor) {
    if (!['taxaOriginal', 'numeroPeríodos'].includes(variavel)) throw new Error(`Variável ${variavel} não é válida. Use: taxaOriginal ou numeroPeríodos`);
    if (isNaN(valor)) throw new Error('Valor deve ser numérico');
    if (variavel === 'taxaOriginal' && valor <= -100) throw new Error('Taxa original deve ser maior que -100%');
    if (variavel === 'numeroPeríodos' && valor <= 0) throw new Error('Número de períodos deve ser maior que zero');

    this.valores[variavel] = valor;
  }

  /**
   * Obtém o valor de uma variável
   * @param {string} variavel - Variável a ser obtida
   * @returns {number|null} Valor da variável ou null se não definida
   */
  obterValor(variavel) {
    return this.valores[variavel] || null;
  }

  /**
   * Obtém todos os valores
   * @returns {object} Objeto com todos os valores
   */
  obterTodosValores() {
    return { ...this.valores };
  }

  /**
   * Calcula a taxa equivalente para o novo período
   * @returns {object} Objeto com a taxa equivalente calculada
   */
  calcularTaxaEquivalente() {
    const { taxaOriginal, numeroPeríodos } = this.valores;

    // Validar se ambos os valores estão definidos
    if (taxaOriginal === null || taxaOriginal === undefined) throw new Error('Taxa original deve ser definida');
    if (numeroPeríodos === null || numeroPeríodos === undefined) throw new Error('Número de períodos deve ser definido');

    // Converter taxa de porcentagem para decimal
    const taxaDecimal = taxaOriginal / 100;
    
    // Validações adicionais
    if (taxaDecimal <= -1) throw new Error('Taxa original deve ser maior que -100%');
    if (numeroPeríodos <= 0) throw new Error('Número de períodos deve ser maior que zero');

    let taxaEquivalente;
    
    // Se n = 1, a taxa equivalente é igual à original
    if (numeroPeríodos === 1) taxaEquivalente = taxaOriginal;
    else {
      // Calcular taxa equivalente usando a fórmula de equivalência
      const fatorConversao = Math.pow(1 + taxaDecimal, 1 / numeroPeríodos);
      taxaEquivalente = (fatorConversao - 1) * 100;
    }

    // Validar resultado
    if (isNaN(taxaEquivalente) || !isFinite(taxaEquivalente)) throw new Error('Resultado inválido - verifique os valores de entrada');

    return {
      taxaOriginal: taxaOriginal,
      numeroPeríodos: numeroPeríodos,
      taxaEquivalente: taxaEquivalente,
      descrição: `ieq: ${taxaEquivalente.toFixed(6)}%`
    };
  }

  /**
   * Limpa todos os valores
   */
  limparTodosValores() {
    this.valores = {
      taxaOriginal: null,
      numeroPeríodos: null
    };
  }

  /**
   * Limpa um valor específico
   * @param {string} variavel - Variável a ser limpa
   */
  limparValor(variavel) {
    if (this.valores.hasOwnProperty(variavel)) this.valores[variavel] = null;
  }

  /**
   * Verifica se todas as variáveis estão definidas
   * @returns {boolean} True se todas estão definidas
   */
  todasVariaveisDefinidas() {
    return Object.values(this.valores).every(v => v !== null && v !== undefined);
  }

  /**
   * Conta quantas variáveis estão definidas
   * @returns {number} Número de variáveis definidas
   */
  contarVariaveisDefinidas() {
    return Object.values(this.valores).filter(v => v !== null && v !== undefined).length;
  }

  /**
   * Valida se uma configuração de valores é válida para cálculo
   * @returns {object} Objeto com status da validação e mensagem
   */
  validarConfiguracao() {
    const definidas = this.contarVariaveisDefinidas();
    
    if (definidas < 2) {
      return {
        valida: false,
        mensagem: 'É necessário definir a taxa original e o número de períodos'
      };
    }
    
    return {
      valida: true,
      mensagem: 'Configuração válida para cálculo'
    };
  }

  /**
   * Método auxiliar para conversões comuns
   * @param {number} taxaOriginal - Taxa original em %
   * @param {string} periodoOriginal - Período original (anual, mensal, diário)
   * @param {string} periodoDesejado - Período desejado (anual, mensal, diário)
   * @returns {object} Resultado do cálculo com descrição
   */
  converterTaxa(taxaOriginal, periodoOriginal, periodoDesejado) {
    // Mapeamento de períodos para número de conversões
    const periodos = {
      'anual': 1,
      'mensal': 12,
      'diário': 365,
      'semestral': 2,
      'trimestral': 4,
      'quinzenal': 24,
      'semanal': 52
    };

    if (!periodos[periodoOriginal] || !periodos[periodoDesejado]) throw new Error('Período não suportado. Use: anual, mensal, diário, semestral, trimestral, quinzenal, semanal');

    // Calcular o fator de conversão
    const fatorrConversao = periodos[periodoDesejado] / periodos[periodoOriginal];
    
    this.definirVariavel('taxaOriginal', taxaOriginal);
    this.definirVariavel('numeroPeríodos', fatorrConversao);
    
    const resultado = this.calcularTaxaEquivalente();
    
    return {
      ...resultado,
      periodoOriginal,
      periodoDesejado,
      descrição: `Taxa ${periodoOriginal} de ${taxaOriginal.toFixed(4)}% equivale a ${resultado.taxaEquivalente.toFixed(6)}% ${periodoDesejado}`
    };
  }
}
