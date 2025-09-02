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
      numeroPeríodos: null,  // Número de períodos para conversão
      periodoOriginal: 'month', // Período da taxa original
      periodoEquivalente: 'month' // Período da taxa equivalente
    };

    // Mapeamento de períodos para número de períodos por ano
    this.periodos = {
      'day': 365,
      'month': 12,
      'year': 1,
      'semester': 2,
      'quarter': 4
    };
  }

  /**
   * Define uma variável para conversão de taxas equivalentes
   * @param {string} variavel - Variável a ser definida (taxaOriginal, numeroPeríodos, periodoOriginal)
   * @param {number|string} valor - Valor a ser atribuído
   */
  definirVariavel(variavel, valor) {
    const variaveisValidas = ['taxaOriginal', 'numeroPeríodos', 'periodoOriginal', 'periodoEquivalente'];
    
    if (!variaveisValidas.includes(variavel)) throw new Error(`Variável ${variavel} não é válida. Use: ${variaveisValidas.join(', ')}`);
    
    if (variavel === 'taxaOriginal' || variavel === 'numeroPeríodos') {
      if (isNaN(valor)) throw new Error('Valor deve ser numérico');
      if (variavel === 'taxaOriginal' && valor <= -100) throw new Error('Taxa original deve ser maior que -100%');
      if (variavel === 'numeroPeríodos' && valor <= 0) throw new Error('Número de períodos deve ser maior que zero');
    }
    
    if ((variavel === 'periodoOriginal' || variavel === 'periodoEquivalente') && !this.periodos[valor]) {
      throw new Error(`Período ${valor} não é válido. Use: ${Object.keys(this.periodos).join(', ')}`);
    }

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
    const { taxaOriginal, numeroPeríodos, periodoOriginal, periodoEquivalente } = this.valores;

    // Validar se os valores essenciais estão definidos
    if (taxaOriginal === null || taxaOriginal === undefined) throw new Error('Taxa original deve ser definida');
    if (numeroPeríodos === null || numeroPeríodos === undefined) throw new Error('Número de períodos deve ser definido');

    // Converter taxa de porcentagem para decimal
    const taxaDecimal = taxaOriginal / 100;
    
    // Validações adicionais
    if (taxaDecimal <= -1) throw new Error('Taxa original deve ser maior que -100%');
    if (numeroPeríodos <= 0) throw new Error('Número de períodos deve ser maior que zero');

    // Calcular a relação entre os períodos
    const periodosOriginaisPorAno = this.periodos[periodoOriginal];
    const periodosEquivalentesPorAno = this.periodos[periodoEquivalente];
    
    let taxaEquivalente;
    
    // Determina se estamos convertendo entre períodos ou aplicando capitalização
    if (periodoOriginal === periodoEquivalente) {
      // Mesmo período: aplicar capitalização simples
      // Fórmula: (1 + i)^n - 1
      taxaEquivalente = (Math.pow(1 + taxaDecimal, numeroPeríodos) - 1) * 100;
    } else {
      if (periodosOriginaisPorAno < periodosEquivalentesPorAno) {
        // Convertendo de período maior para menor (ex: ano para mês)
        // A taxa original já representa o período completo, n representa quantos sub-períodos
        taxaEquivalente = (Math.pow(1 + taxaDecimal, 1 / numeroPeríodos) - 1) * 100;
      } else if (periodosOriginaisPorAno > periodosEquivalentesPorAno) {
        // Convertendo de período menor para maior (ex: mês para ano)
        // Aplicamos capitalização: taxa mensal elevada a n meses = taxa anual
        taxaEquivalente = (Math.pow(1 + taxaDecimal, numeroPeríodos) - 1) * 100;
      } else {
        // Períodos iguais mas n diferente de 1 - capitalização simples
        taxaEquivalente = (Math.pow(1 + taxaDecimal, numeroPeríodos) - 1) * 100;
      }
    }

    // Validar resultado
    if (isNaN(taxaEquivalente) || !isFinite(taxaEquivalente)) throw new Error('Resultado inválido - verifique os valores de entrada');

    // Obter nome do período para descrição
    const nomesPeriodos = {
      'day': 'diária',
      'month': 'mensal',
      'year': 'anual',
      'semester': 'semestral',
      'quarter': 'trimestral'
    };

    const nomeOriginal = nomesPeriodos[periodoOriginal] || 'mensal';
    const nomeEquivalente = nomesPeriodos[periodoEquivalente] || 'mensal';

    return {
      taxaOriginal: taxaOriginal,
      numeroPeríodos: numeroPeríodos,
      periodoOriginal: nomeOriginal,
      periodoEquivalente: nomeEquivalente,
      taxaEquivalente: taxaEquivalente,
      descrição: `Ieq (${nomeEquivalente}): ${taxaEquivalente.toFixed(6)}%`
    };
  }

  // Limpa todos os valores
  limparTodosValores() {
    this.valores = {
      taxaOriginal: null,
      numeroPeríodos: null,
      periodoOriginal: 'month',
      periodoEquivalente: 'month'
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
    return this.valores.taxaOriginal !== null && 
           this.valores.numeroPeríodos !== null &&
           this.valores.periodoOriginal !== null &&
           this.valores.periodoEquivalente !== null;
  }

  /**
   * Conta quantas variáveis estão definidas
   * @returns {number} Número de variáveis definidas
   */
  contarVariaveisDefinidas() {
    let count = 0;
    if (this.valores.taxaOriginal !== null) count++;
    if (this.valores.numeroPeríodos !== null) count++;
    // Períodos sempre têm valores padrão, então não contamos
    return count;
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
}