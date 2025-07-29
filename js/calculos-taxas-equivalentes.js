/**
 * CÁLCULOS DE TAXAS EQUIVALENTES
 * Classe responsável pelos cálculos de conversão entre taxas equivalentes
 * Suporta conversão entre taxas de juros para diferentes períodos
 */
export class CalculosTaxasEquivalentes {
  constructor() {
    // Valores para taxas equivalentes
    this.valoresTaxasEquivalentes = {
      i1: null,   // Taxa 1
      i2: null,   // Taxa 2  
      n1: null,   // Períodos 1
      n2: null    // Períodos 2
    };
  }

  /**
   * Define uma variável para modo de taxas equivalentes
   * @param {string} variavel - Variável a ser definida (i1, i2, n1, n2)
   * @param {number} valor - Valor a ser atribuído
   */
  definirVariavel(variavel, valor) {
    if (!['i1', 'i2', 'n1', 'n2'].includes(variavel)) throw new Error(`Variável ${variavel} não é válida para taxas equivalentes`);
    if (isNaN(valor)) throw new Error('Valor deve ser numérico');

    this.valoresTaxasEquivalentes[variavel] = valor;
  }

  /**
   * Obtém o valor de uma variável
   * @param {string} variavel - Variável a ser obtida
   * @returns {number|null} Valor da variável ou null se não definida
   */
  obterValor(variavel) {
    return this.valoresTaxasEquivalentes[variavel] || null;
  }

  /**
   * Obtém todos os valores
   * @returns {object} Objeto com todos os valores
   */
  obterTodosValores() {
    return { ...this.valoresTaxasEquivalentes };
  }

  /**
   * Calcula o valor faltante no modo de taxas equivalentes
   * @returns {object} Objeto com a variável calculada e seu valor
   */
  calcularVariavelFaltante() {
    // Conta quantas variáveis estão definidas
    const valoresDefinidos = Object.values(this.valoresTaxasEquivalentes).filter(v => v !== null && v !== undefined);

    if (valoresDefinidos.length < 3) throw new Error('É necessário definir pelo menos 3 valores para calcular');
    if (valoresDefinidos.length === 4) throw new Error('Todos os valores já estão definidos');

    // Identifica qual variável está faltando
    const variaveisNecessarias = ['i1', 'i2', 'n1', 'n2'];
    const variavelFaltante = variaveisNecessarias.find(chave => 
      !this.valoresTaxasEquivalentes.hasOwnProperty(chave) || 
      this.valoresTaxasEquivalentes[chave] === null || 
      this.valoresTaxasEquivalentes[chave] === undefined
    );

    if (!variavelFaltante) {
      throw new Error('Nenhuma variável faltante encontrada');
    }

    const { i1, i2, n1, n2 } = this.valoresTaxasEquivalentes;
    let valorCalculado;

    // Fórmula de taxas equivalentes: (1 + i1)^n1 = (1 + i2)^n2
    if (variavelFaltante === 'i1' && i2 && n1 && n2) {
      // i1 = (1 + i2)^(n2/n1) - 1
      const i2Decimal = i2 / 100;
      valorCalculado = (Math.pow(1 + i2Decimal, n2 / n1) - 1) * 100;
    } else if (variavelFaltante === 'i2' && i1 && n1 && n2) {
      // i2 = (1 + i1)^(n1/n2) - 1
      const i1Decimal = i1 / 100;
      valorCalculado = (Math.pow(1 + i1Decimal, n1 / n2) - 1) * 100;
    } else if (variavelFaltante === 'n1' && i1 && i2 && n2) {
      // n1 = n2 * ln(1 + i1) / ln(1 + i2)
      const i1Decimal = i1 / 100;
      const i2Decimal = i2 / 100;
      if (i1Decimal <= -1 || i2Decimal <= -1) throw new Error('Taxas devem ser maiores que -100%');
      valorCalculado = n2 * Math.log(1 + i1Decimal) / Math.log(1 + i2Decimal);
    } else if (variavelFaltante === 'n2' && i1 && i2 && n1) {
      // n2 = n1 * ln(1 + i2) / ln(1 + i1)
      const i1Decimal = i1 / 100;
      const i2Decimal = i2 / 100;
      if (i1Decimal <= -1 || i2Decimal <= -1) {
        throw new Error('Taxas devem ser maiores que -100%');
      }
      valorCalculado = n1 * Math.log(1 + i2Decimal) / Math.log(1 + i1Decimal);
    } else throw new Error('Combinação de valores inválida para o cálculo');

    // Validar se os resultados fazem sentido
    if (isNaN(valorCalculado) || !isFinite(valorCalculado)) throw new Error('Resultado inválido - verifique os valores de entrada');

    // Atualiza a variável calculada
    this.valoresTaxasEquivalentes[variavelFaltante] = valorCalculado;

    return {
      variavel: variavelFaltante,
      valor: valorCalculado
    };
  }

  /**
   * Limpa todos os valores
   */
  limparTodosValores() {
    this.valoresTaxasEquivalentes = {
      i1: null,
      i2: null,
      n1: null,
      n2: null
    };
  }

  /**
   * Limpa um valor específico
   * @param {string} variavel - Variável a ser limpa
   */
  limparValor(variavel) {
    if (this.valoresTaxasEquivalentes.hasOwnProperty(variavel)) this.valoresTaxasEquivalentes[variavel] = null;
  }

  /**
   * Verifica se todas as variáveis estão definidas
   * @returns {boolean} True se todas estão definidas
   */
  todasVariaveisDefinidas() {
    return Object.values(this.valoresTaxasEquivalentes).every(v => v !== null && v !== undefined);
  }

  /**
   * Conta quantas variáveis estão definidas
   * @returns {number} Número de variáveis definidas
   */
  contarVariaveisDefinidas() {
    return Object.values(this.valoresTaxasEquivalentes).filter(v => v !== null && v !== undefined).length;
  }

  /**
   * Valida se uma configuração de valores é válida para cálculo
   * @returns {object} Objeto com status da validação e mensagem
   */
  validarConfiguracao() {
    const definidas = this.contarVariaveisDefinidas();
    
    if (definidas < 3) {
      return {
        valida: false,
        mensagem: 'É necessário definir pelo menos 3 valores para calcular'
      };
    }
    
    if (definidas === 4) {
      return {
        valida: false,
        mensagem: 'Todos os valores já estão definidos'
      };
    }
    
    return {
      valida: true,
      mensagem: 'Configuração válida para cálculo'
    };
  }
}
