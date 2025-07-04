/**
 * CÁLCULOS FINANCEIROS
 * Classe responsável por todos os cálculos financeiros baseados em juros simples e compostos
 * Suporta cálculo de Valor Presente (PV), Valor Futuro (FV), Taxa de Juros (i) e Número de Períodos (n)
 */
export class CalculosFinanceiros {
  constructor() {
    // Sistema de conversão de taxas
    this.modoCapitalizacao = 'simples'; // 'simples' ou 'composta'
  }

  /**
   * Define o modo de capitalização para conversão de taxas
   * @param {string} modo - 'simples' ou 'composta'
   */
  setModoCapitalizacao(modo) {
    this.modoCapitalizacao = modo;
  }

  /**
   * Obtém o modo de capitalização atual
   * @returns {string} modo atual
   */
  getModoCapitalizacao() {
    return this.modoCapitalizacao;
  }

  /**
   * Alterna entre modo de capitalização simples e composta
   * @returns {string} novo modo
   */
  alternarModoCapitalizacao() {
    this.modoCapitalizacao = this.modoCapitalizacao === 'simples' ? 'composta' : 'simples';
    return this.modoCapitalizacao;
  }

  /**
   * Resolve a equação financeira para encontrar a variável faltante
   * @param {string} variavelFaltante - variável a ser calculada ('pv', 'fv', 'j', 'i', 'n')
   * @param {Object} valores - objeto com os valores conhecidos
   * @param {string} modoCalculo - modo de cálculo ('simples' ou 'composto')
   * @returns {number} valor calculado
   */
  resolverEqFinanceira(variavelFaltante, valores, modoCalculo = 'simples') {
    const { pv, fv, j, i, n } = valores;

    // Sempre converte taxa de juros de percentual para decimal
    const taxa = i !== null ? i / 100 : null;

    // Seleciona os métodos baseado no modo de cálculo
    const operacoes = modoCalculo === 'simples' ? {
      pv: () => this.calcularPVSimples(fv, j, taxa, n),
      fv: () => this.calcularFVSimples(pv, j, taxa, n),
      j: () => this.calcularJurosSimples(pv, fv, taxa, n),
      i: () => this.calcularTaxaJurosSimples(pv, fv, j, n),
      n: () => this.calcularNSimples(pv, fv, j, taxa),
    } : {
      pv: () => this.calcularPVComposto(fv, j, taxa, n),
      fv: () => this.calcularFVComposto(pv, j, taxa, n),
      j: () => this.calcularJurosComposto(pv, fv, taxa, n),
      i: () => this.calcularTaxaJurosComposto(pv, fv, j, n),
      n: () => this.calcularNComposto(pv, fv, j, taxa),
    };

    if (operacoes[variavelFaltante]) return operacoes[variavelFaltante]();
    else throw new Error('Variável desconhecida');
  }

  // ==================== MÉTODOS DE JUROS COMPOSTOS ====================

  /**
   * Calcula Valor Presente (PV)
   * PV = -FV / (1 + i)^n  OU  PV = FV - J (se J for conhecido)
   * @param {number} fv - Valor Futuro
   * @param {number} j - Juros (opcional)
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Valor Presente
   */
  calcularPVComposto(fv, j, i, n) {
    // Se J (juros) for conhecido, PV = FV - J
    if (j !== null && j !== undefined) return Math.abs(fv) - Math.abs(j);
    
    // Caso especial: taxa zero
    if (i === 0) return -(fv || 0);

    const fator = Math.pow(1 + i, n);
    return -(fv || 0) / fator;
  }

  /**
   * Calcula Valor Futuro (FV)
   * FV = -PV * (1 + i)^n  OU  FV = PV + J (se J for conhecido)
   * @param {number} pv - Valor Presente
   * @param {number} j - Juros (opcional)
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Valor Futuro
   */
  calcularFVComposto(pv, j, i, n) {
    // Se J (juros) for conhecido, FV = PV + J
    if (j !== null && j !== undefined) {
      return Math.abs(pv) + Math.abs(j);
    }
    
    // Caso especial: taxa zero
    if (i === 0) return -(pv || 0);

    const fator = Math.pow(1 + i, n);
    return -(pv || 0) * fator;
  }

  /**
   * Calcula Juros (J) para juros compostos
   * J = FV - PV  OU  J = PV * [(1 + i)^n - 1]
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Juros
   */
  calcularJurosComposto(pv, fv, i, n) {
    // Se PV e FV são conhecidos, J = |FV| - |PV|
    if (pv !== null && fv !== null) return Math.abs(fv) - Math.abs(pv);
    
    // Se PV, i e n são conhecidos, J = |PV| * [(1 + i)^n - 1]
    if (pv !== null && i !== null && n !== null) {
      if (i === 0) return 0;
      const fator = Math.pow(1 + i, n) - 1;
      return Math.abs(pv) * fator;
    }
    
    // Se FV, i e n são conhecidos, J = |FV| - |FV| / (1 + i)^n
    if (fv !== null && i !== null && n !== null) {
      if (i === 0) return 0;
      const fator = Math.pow(1 + i, n);
      const pv_calculado = Math.abs(fv) / fator;
      return Math.abs(fv) - pv_calculado;
    }
    
    throw new Error('Dados insuficientes para calcular os juros');
  }

  /**
   * Calcula Taxa de Juros (i) usando método direto
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} j - Juros (opcional)
   * @param {number} n - Número de períodos
   * @returns {number} Taxa de juros (percentual)
   */
  calcularTaxaJurosComposto(pv, fv, j, n) {
    // Se J for conhecido e PV ou FV não, calcula o valor faltante primeiro
    if (j !== null && j !== undefined) {
      if (pv === null && fv !== null) pv = Math.abs(fv) - Math.abs(j);
      else if (fv === null && pv !== null) fv = Math.abs(pv) + Math.abs(j);
    }
    
    // Validações básicas
    if (n === 0) throw new Error('Número de períodos não pode ser zero');
    if (pv === 0 || fv === 0) throw new Error('PV e FV não podem ser zero');
    if ((pv > 0 && fv > 0) || (pv < 0 && fv < 0)) throw new Error('PV e FV devem ter sinais opostos');

    // Cálculo direto para juros compostos: i = (FV/PV)^(1/n) - 1
    const taxa = Math.pow(Math.abs(fv / pv), 1 / n) - 1;
    
    if (isNaN(taxa) || !isFinite(taxa)) throw new Error('Não é possível calcular a taxa com estes valores');
    
    return taxa * 100; // Retorna como percentual
  }

  /**
   * Calcula Número de Períodos (n)
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} j - Juros (opcional)
   * @param {number} i - Taxa de juros (decimal)
   * @returns {number} Número de períodos
   */
  calcularNComposto(pv, fv, j, i) {
    // Se J for conhecido e PV ou FV não, calcula o valor faltante primeiro
    if (j !== null && j !== undefined) {
      if (pv === null && fv !== null) pv = Math.abs(fv) - Math.abs(j);
      else if (fv === null && pv !== null) fv = Math.abs(pv) + Math.abs(j);
    }
    
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

  // ==================== MÉTODOS DE JUROS SIMPLES ====================

  /**
   * Calcula Valor Presente (PV) para juros simples
   * PV = FV / (1 + i * n)  OU  PV = FV - J (se J for conhecido)
   * @param {number} fv - Valor Futuro
   * @param {number} j - Juros (opcional)
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Valor Presente
   */
  calcularPVSimples(fv, j, i, n) {
    // Se J (juros) for conhecido, PV = FV - J
    if (j !== null && j !== undefined) {
      return Math.abs(fv) - Math.abs(j);
    }
    
    // Caso especial: taxa zero
    if (i === 0) return -(fv || 0);

    const fator = 1 + (i * n);
    return -(fv || 0) / fator;
  }

  /**
   * Calcula Valor Futuro (FV) para juros simples
   * FV = PV * (1 + i * n)  OU  FV = PV + J (se J for conhecido)
   * @param {number} pv - Valor Presente
   * @param {number} j - Juros (opcional)
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Valor Futuro
   */
  calcularFVSimples(pv, j, i, n) {
    // Se J (juros) for conhecido, FV = PV + J
    if (j !== null && j !== undefined) return Math.abs(pv) + Math.abs(j);
    
    // Caso especial: taxa zero
    if (i === 0) return -(pv || 0);

    const fator = 1 + (i * n);
    return -(pv || 0) * fator;
  }

  /**
   * Calcula Juros (J) para juros simples
   * J = FV - PV  OU  J = PV * i * n
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Juros
   */
  calcularJurosSimples(pv, fv, i, n) {
    // Se PV e FV são conhecidos, J = |FV| - |PV|
    if (pv !== null && fv !== null) return Math.abs(fv) - Math.abs(pv);
    
    // Se PV, i e n são conhecidos, J = |PV| * i * n
    if (pv !== null && i !== null && n !== null) return Math.abs(pv) * i * n;
    
    // Se FV, i e n são conhecidos, J = |FV| - |FV| / (1 + i * n)
    if (fv !== null && i !== null && n !== null) {
      if (i === 0) return 0;
      const fator = 1 + (i * n);
      const pv_calculado = Math.abs(fv) / fator;
      return Math.abs(fv) - pv_calculado;
    }
    
    throw new Error('Dados insuficientes para calcular os juros');
  }

  /**
   * Calcula Taxa de Juros (i) para juros simples
   * i = (FV - PV) / (PV * n)  OU  i = J / (PV * n)
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} j - Juros (opcional)
   * @param {number} n - Número de períodos
   * @returns {number} Taxa de juros (percentual)
   */
  calcularTaxaJurosSimples(pv, fv, j, n) {
    // Se J for conhecido, use J diretamente
    let juros = j;
    
    // Se J não for conhecido mas PV e FV são, calcula J
    if (juros === null && pv !== null && fv !== null) {
      juros = Math.abs(fv) - Math.abs(pv);
    }
    
    // Se ainda não temos os juros ou se não temos PV, usar método original
    if (juros === null || pv === null) {
      // Validações básicas para método original
      if (n === 0) throw new Error('Número de períodos não pode ser zero');
      if (pv === 0) throw new Error('PV não pode ser zero');
      if ((pv > 0 && fv > 0) || (pv < 0 && fv < 0)) throw new Error('PV e FV devem ter sinais opostos');

      // Cálculo para juros simples: i = (FV - PV) / (PV * n)
      const numerador = Math.abs(fv) - Math.abs(pv);
      const denominador = Math.abs(pv) * n;
      
      if (denominador === 0) throw new Error('Não é possível calcular a taxa com estes valores');
      
      const taxa = numerador / denominador;
      
      if (isNaN(taxa) || !isFinite(taxa)) throw new Error('Não é possível calcular a taxa com estes valores');
      
      return taxa * 100; // Retorna como percentual
    }
    
    // Usa a fórmula: i = J / (PV * n)
    if (n === 0) throw new Error('Número de períodos não pode ser zero');
    if (pv === 0) throw new Error('PV não pode ser zero');
    
    const denominador = Math.abs(pv) * n;
    if (denominador === 0) throw new Error('Não é possível calcular a taxa com estes valores');
    
    const taxa = Math.abs(juros) / denominador;
    
    if (isNaN(taxa) || !isFinite(taxa)) throw new Error('Não é possível calcular a taxa com estes valores');
    
    return taxa * 100; // Retorna como percentual
  }

  /**
   * Calcula Número de Períodos (n) para juros simples
   * n = (FV - PV) / (PV * i)  OU  n = J / (PV * i)
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} j - Juros (opcional)
   * @param {number} i - Taxa de juros (decimal)
   * @returns {number} Número de períodos
   */
  calcularNSimples(pv, fv, j, i) {
    // Se J for conhecido, use J diretamente
    let juros = j;
    
    // Se J não for conhecido mas PV e FV são, calcula J
    if (juros === null && pv !== null && fv !== null) juros = Math.abs(fv) - Math.abs(pv);
    
    // Se ainda não temos os juros ou se não temos PV, usar método original
    if (juros === null || pv === null) {
      // Validações básicas para método original
      if (i === 0) throw new Error('Taxa de juros não pode ser zero');
      if (pv === 0) throw new Error('PV não pode ser zero');
      if ((pv > 0 && fv > 0) || (pv < 0 && fv < 0)) throw new Error('PV e FV devem ter sinais opostos');

      // Cálculo para juros simples: n = (FV - PV) / (PV * i)
      const numerador = Math.abs(fv) - Math.abs(pv);
      const denominador = Math.abs(pv) * i;
      
      if (denominador === 0) throw new Error('Não é possível calcular n com estes valores');
      if (numerador <= 0) throw new Error('FV deve ser maior que PV para juros simples');
      
      return numerador / denominador;
    }
    
    // Usa a fórmula: n = J / (PV * i)
    if (i === 0) throw new Error('Taxa de juros não pode ser zero');
    if (pv === 0) throw new Error('PV não pode ser zero');
    
    const denominador = Math.abs(pv) * i;
    if (denominador === 0) throw new Error('Não é possível calcular n com estes valores');
    if (juros <= 0) throw new Error('Juros devem ser positivos');
    
    return Math.abs(juros) / denominador;
  }

  /**
   * Resolve a equação de desconto para encontrar a variável faltante
   * @param {string} variavelFaltante - variável a ser calculada ('N', 'Va', 'i', 'n', 'D')
   * @param {Object} valores - objeto com os valores conhecidos
   * @param {string} tipoDesconto - tipo de desconto ('racional' ou 'comercial')
   * @returns {Object} resultado com valor calculado e informações
   */
  resolverEqDesconto(variavelFaltante, valores, tipoDesconto) {
    const { N, Va, i, n, D } = valores;

    // Define as operações baseadas no tipo de desconto
    const operacoes = {
      racional: {
        N: () => this.calcularValorNominalRacional(Va, i, n),
        Va: () => {
          const resultado = this.calcularDescontoRacional(N, i, n);
          return {
            valorAtual: resultado.valorAtual,
            valorNominal: N,
            desconto: resultado.desconto,
            taxa: i,
            tempo: n,
            tipo: 'Valor Atual (Desconto Racional)',
            formula: 'Va = N - Dr'
          };
        },
        i: () => this.calcularTaxaDescontoRacional(N, Va, n),
        n: () => this.calcularTempoDescontoRacional(N, Va, i),
        D: () => {
          const resultado = this.calcularDescontoRacional(N, i, n);
          return {
            desconto: resultado.desconto,
            valorNominal: N,
            valorAtual: resultado.valorAtual,
            taxa: i,
            tempo: n,
            tipo: 'Desconto Racional',
            formula: 'Dr = N x i x n / (1 + i x n)'
          };
        }
      },
      comercial: {
        N: () => this.calcularValorNominalComercial(Va, i, n),
        Va: () => {
          const resultado = this.calcularDescontoComercial(N, i, n);
          return {
            valorAtual: resultado.valorAtual,
            valorNominal: N,
            desconto: resultado.desconto,
            taxa: i,
            tempo: n,
            tipo: 'Valor Atual (Desconto Comercial)',
            formula: 'Va = N - Dc'
          };
        },
        i: () => this.calcularTaxaDescontoComercial(N, Va, n),
        n: () => this.calcularTempoDescontoComercial(N, Va, i),
        D: () => {
          const resultado = this.calcularDescontoComercial(N, i, n);
          return {
            desconto: resultado.desconto,
            valorNominal: N,
            valorAtual: resultado.valorAtual,
            taxa: i,
            tempo: n,
            tipo: 'Desconto Comercial',
            formula: 'Dc = N x i x n'
          };
        }
      }
    };

    if (operacoes[tipoDesconto] && operacoes[tipoDesconto][variavelFaltante]) return operacoes[tipoDesconto][variavelFaltante]();
    else throw new Error('Variável ou tipo de desconto inválido');
  }

  // ==================== FUNÇÕES DE DESCONTO ====================

  /**
   * Calcula desconto racional (por dentro)
   * Desconto Racional = Valor Nominal x Taxa x Tempo / (1 + Taxa x Tempo)
   * @param {number} valorNominal - Valor nominal do título
   * @param {number} taxa - Taxa de desconto (percentual)
   * @param {number} tempo - Tempo até o vencimento
   * @returns {Object} Objeto com desconto, valor atual e informações
   */
  calcularDescontoRacional(valorNominal, taxa, tempo) {
    // Validações
    if (valorNominal <= 0) throw new Error('Valor nominal deve ser positivo');
    if (taxa < 0) throw new Error('Taxa não pode ser negativa');
    if (tempo < 0) throw new Error('Tempo não pode ser negativo');

    // Converte taxa para decimal
    const taxaDecimal = taxa / 100;

    // Cálculo do desconto racional (por dentro)
    const denominador = 1 + (taxaDecimal * tempo);
    const desconto = (valorNominal * taxaDecimal * tempo) / denominador;
    const valorAtual = valorNominal - desconto;

    return {
      desconto: desconto,
      valorAtual: valorAtual,
      taxa: taxa,
      tempo: tempo,
      tipo: 'Desconto Racional (Por Dentro)',
      formula: 'Dr = N x i x n / (1 + i x n)'
    };
  }

  /**
   * Calcula desconto comercial (por fora)
   * Desconto Comercial = Valor Nominal x Taxa x Tempo
   * @param {number} valorNominal - Valor nominal do título
   * @param {number} taxa - Taxa de desconto (percentual)
   * @param {number} tempo - Tempo até o vencimento
   * @returns {Object} Objeto com desconto, valor atual e informações
   */
  calcularDescontoComercial(valorNominal, taxa, tempo) {
    // Validações
    if (valorNominal <= 0) throw new Error('Valor nominal deve ser positivo');
    if (taxa < 0) throw new Error('Taxa não pode ser negativa');
    if (tempo < 0) throw new Error('Tempo não pode ser negativo');

    // Converte taxa para decimal
    const taxaDecimal = taxa / 100;

    // Cálculo do desconto comercial (por fora)
    const desconto = valorNominal * taxaDecimal * tempo;
    const valorAtual = valorNominal - desconto;

    // Validação para evitar valor atual negativo
    if (valorAtual < 0) throw new Error('Taxa e tempo muito altos resultam em desconto maior que o valor nominal');

    return {
      desconto: desconto,
      valorAtual: valorAtual,
      valorNominal: valorNominal,
      taxa: taxa,
      tempo: tempo,
      tipo: 'Desconto Comercial (Por Fora)',
      formula: 'Dc = N x i x n'
    };
  }

  /**
   * Calcula valor nominal a partir do valor atual (desconto racional)
   * @param {number} valorAtual - Valor atual do título
   * @param {number} taxa - Taxa de desconto (percentual)
   * @param {number} tempo - Tempo até o vencimento
   * @returns {Object} Valor nominal e informações do desconto
   */
  calcularValorNominalRacional(valorAtual, taxa, tempo) {
    // Validações
    if (valorAtual <= 0) throw new Error('Valor atual deve ser positivo');
    if (taxa < 0) throw new Error('Taxa não pode ser negativa');
    if (tempo < 0) throw new Error('Tempo não pode ser negativo');

    const taxaDecimal = taxa / 100;

    // Fórmula: N = Va x (1 + i x n)
    const valorNominal = valorAtual * (1 + taxaDecimal * tempo);
    const desconto = valorNominal - valorAtual;

    return {
      valorNominal: valorNominal,
      valorAtual: valorAtual,
      desconto: desconto,
      taxa: taxa,
      tempo: tempo,
      tipo: 'Valor Nominal (Desconto Racional)',
      formula: 'N = Va x (1 + i x n)'
    };
  }

  /**
   * Calcula valor nominal a partir do valor atual (desconto comercial)
   * @param {number} valorAtual - Valor atual do título
   * @param {number} taxa - Taxa de desconto (percentual)
   * @param {number} tempo - Tempo até o vencimento
   * @returns {Object} Valor nominal e informações do desconto
   */
  calcularValorNominalComercial(valorAtual, taxa, tempo) {
    // Validações
    if (valorAtual <= 0) throw new Error('Valor atual deve ser positivo');
    if (taxa < 0) throw new Error('Taxa não pode ser negativa');
    if (tempo < 0) throw new Error('Tempo não pode ser negativo');

    const taxaDecimal = taxa / 100;

    // Validação para evitar divisão por zero ou valor negativo
    const denominador = 1 - (taxaDecimal * tempo);
    if (denominador <= 0) throw new Error('Taxa e tempo muito altos para calcular valor nominal');

    // Fórmula: N = Va / (1 - i x n)
    const valorNominal = valorAtual / denominador;
    const desconto = valorNominal - valorAtual;

    return {
      valorNominal: valorNominal,
      valorAtual: valorAtual,
      desconto: desconto,
      taxa: taxa,
      tempo: tempo,
      tipo: 'Valor Nominal (Desconto Comercial)',
      formula: 'N = Va / (1 - i x n)'
    };
  }

  /**
   * Calcula taxa de desconto racional
   * @param {number} valorNominal - Valor nominal do título
   * @param {number} valorAtual - Valor atual do título
   * @param {number} tempo - Tempo até o vencimento
   * @returns {Object} Taxa de desconto e informações
   */
  calcularTaxaDescontoRacional(valorNominal, valorAtual, tempo) {
    // Validações
    if (valorNominal <= 0) throw new Error('Valor nominal deve ser positivo');
    if (valorAtual <= 0) throw new Error('Valor atual deve ser positivo');
    if (valorAtual >= valorNominal) throw new Error('Valor atual deve ser menor que o valor nominal');
    if (tempo <= 0) throw new Error('Tempo deve ser positivo');

    // Fórmula: i = (N - Va) / (Va x n)
    const taxa = ((valorNominal - valorAtual) / (valorAtual * tempo)) * 100;
    const desconto = valorNominal - valorAtual;

    return {
      taxa: taxa,
      valorNominal: valorNominal,
      valorAtual: valorAtual,
      desconto: desconto,
      tempo: tempo,
      tipo: 'Taxa de Desconto Racional',
      formula: 'i = (N - Va) / (Va x t)'
    };
  }

  /**
   * Calcula taxa de desconto comercial
   * @param {number} valorNominal - Valor nominal do título
   * @param {number} valorAtual - Valor atual do título
   * @param {number} tempo - Tempo até o vencimento
   * @returns {Object} Taxa de desconto e informações
   */
  calcularTaxaDescontoComercial(valorNominal, valorAtual, tempo) {
    // Validações
    if (valorNominal <= 0) throw new Error('Valor nominal deve ser positivo');
    if (valorAtual <= 0) throw new Error('Valor atual deve ser positivo');
    if (valorAtual >= valorNominal) throw new Error('Valor atual deve ser menor que o valor nominal');
    if (tempo <= 0) throw new Error('Tempo deve ser positivo');

    // Fórmula: i = (N - Va) / (N x n)
    const taxa = ((valorNominal - valorAtual) / (valorNominal * tempo)) * 100;
    const desconto = valorNominal - valorAtual;

    return {
      taxa: taxa,
      valorNominal: valorNominal,
      valorAtual: valorAtual,
      desconto: desconto,
      tempo: tempo,
      tipo: 'Taxa de Desconto Comercial',
      formula: 'i = (N - Va) / (N x n)'
    };
  }

  /**
   * Calcula tempo para desconto racional
   * @param {number} valorNominal - Valor nominal do título
   * @param {number} valorAtual - Valor atual do título
   * @param {number} taxa - Taxa de desconto (percentual)
   * @returns {Object} Tempo e informações do desconto
   */
  calcularTempoDescontoRacional(valorNominal, valorAtual, taxa) {
    // Validações
    if (valorNominal <= 0) throw new Error('Valor nominal deve ser positivo');
    if (valorAtual <= 0) throw new Error('Valor atual deve ser positivo');
    if (valorAtual >= valorNominal) throw new Error('Valor atual deve ser menor que o valor nominal');
    if (taxa <= 0) throw new Error('Taxa deve ser positiva');

    const taxaDecimal = taxa / 100;

    // Fórmula: n = (N - Va) / (Va x i)
    const tempo = (valorNominal - valorAtual) / (valorAtual * taxaDecimal);
    const desconto = valorNominal - valorAtual;

    return {
      tempo: tempo,
      valorNominal: valorNominal,
      valorAtual: valorAtual,
      desconto: desconto,
      taxa: taxa,
      tipo: 'Tempo para Desconto Racional',
      formula: 'n = (N - Va) / (Va x i)'
    };
  }

  /**
   * Calcula tempo para desconto comercial
   * @param {number} valorNominal - Valor nominal do título
   * @param {number} valorAtual - Valor atual do título
   * @param {number} taxa - Taxa de desconto (percentual)
   * @returns {Object} Tempo e informações do desconto
   */
  calcularTempoDescontoComercial(valorNominal, valorAtual, taxa) {
    // Validações
    if (valorNominal <= 0) throw new Error('Valor nominal deve ser positivo');
    if (valorAtual <= 0) throw new Error('Valor atual deve ser positivo');
    if (valorAtual >= valorNominal) throw new Error('Valor atual deve ser menor que o valor nominal');
    if (taxa <= 0) throw new Error('Taxa deve ser positiva');

    const taxaDecimal = taxa / 100;

    // Fórmula: n = (N - Va) / (N x i)
    const tempo = (valorNominal - valorAtual) / (valorNominal * taxaDecimal);
    const desconto = valorNominal - valorAtual;

    return {
      tempo: tempo,
      valorNominal: valorNominal,
      valorAtual: valorAtual,
      desconto: desconto,
      taxa: taxa,
      tipo: 'Tempo para Desconto Comercial',
      formula: 'n = (N - Va) / (N x i)'
    };
  }

  // ==================== FUNÇÕES GERAIS ====================
  
  /**
   * Detecta o tipo de taxa baseado na magnitude do valor
   * @param {number} taxa - Taxa a ser analisada
   * @returns {string} Tipo detectado ('dia', 'mes', 'ano')
   */
  detectarTipoTaxa(taxa) {
    return taxa <= 1 ? 'dia' : taxa <= 15 ? 'mes' : 'ano';
  }

  /**
   * Converte taxa de um período para outro
   * @param {string} tipoDestino - Tipo de período de destino ('dia', 'mes', 'ano')
   * @param {number} taxa - Taxa a ser convertida
   * @param {string} tipoOrigem - Tipo de período de origem
   * @returns {number} Taxa convertida
   */
  converterTaxa(tipoDestino, taxa, tipoOrigem) {
    // Se já é o tipo desejado, retorna a taxa
    if (tipoOrigem === tipoDestino) return taxa;

    // Mapeamento de períodos para fatores de conversão
    const fatoresConversao = {
      'dia': 360,
      'mes': 12,
      'ano': 1
    };

    // Converte para taxa anual primeiro
    const fatorOrigem = fatoresConversao[tipoOrigem];
    const taxaAnual = this.modoCapitalizacao === 'simples' 
      ? taxa * fatorOrigem
      : (Math.pow(1 + taxa / 100, fatorOrigem) - 1) * 100;

    // Converte da taxa anual para o tipo desejado
    const fatorDestino = fatoresConversao[tipoDestino];
    return this.modoCapitalizacao === 'simples' 
      ? taxaAnual / fatorDestino
      : (Math.pow(1 + taxaAnual / 100, 1 / fatorDestino) - 1) * 100;
  }

  /**
   * Converte taxa com detecção automática do tipo
   * @param {string} tipoConversao - Tipo de conversão desejado ('taxa-dia', 'taxa-mes', 'taxa-ano')
   * @param {number} taxaAtual - Taxa atual a ser convertida
   * @returns {Object} Resultado da conversão com valor e descrições
   */
  converterTaxaAutomatica(tipoConversao, taxaAtual) {
    if (isNaN(taxaAtual) || taxaAtual < 0) throw new Error('Taxa inválida');

    // Sistema inteligente de conversão baseado na magnitude da taxa
    let resultado;
    let descricao;
    let tipoOrigem = this.detectarTipoTaxa(taxaAtual);

    // Configuração para conversões
    const configuracoes = {
      'taxa-dia': { tipo: 'dia', descricao: 'Taxa diária' },
      'taxa-mes': { tipo: 'mes', descricao: 'Taxa mensal' },
      'taxa-ano': { tipo: 'ano', descricao: 'Taxa anual' }
    };

    const config = configuracoes[tipoConversao];
    if (!config) throw new Error('Tipo de conversão inválido');

    resultado = this.converterTaxa(config.tipo, taxaAtual, tipoOrigem);
    descricao = config.descricao;

    return {
      resultado: resultado,
      descricao: descricao,
      tipoOrigem: tipoOrigem,
      modo: this.modoCapitalizacao
    };
  }

  /**
   * Converte taxa entre diferentes períodos (day, month, year)
   * @param {number} taxa - Taxa a ser convertida
   * @param {string} periodoOrigem - Período de origem
   * @param {string} periodoDestino - Período de destino
   * @returns {number} Taxa convertida
   */
  converterTaxaEntrePeriodos(taxa, periodoOrigem, periodoDestino) {
    if (periodoOrigem === periodoDestino) return taxa;

    // Mapeamento de períodos para número de dias
    const diasPorPeriodo = { day: 1, month: 30, year: 360 };

    // Converte taxa para decimal
    const taxaDecimal = taxa / 100;

    // Calcula fator de conversão
    const diasOrigem = diasPorPeriodo[periodoOrigem];
    const diasDestino = diasPorPeriodo[periodoDestino];

    // Verifica o modo de capitalização para usar a fórmula correta
    let taxaConvertida;
    if (this.modoCapitalizacao === 'simples') taxaConvertida = taxaDecimal * diasDestino / diasOrigem;
    else taxaConvertida = Math.pow(1 + taxaDecimal, diasDestino / diasOrigem) - 1;

    return taxaConvertida * 100; // Retorna em porcentagem
  }

  /**
   * Retorna o nome do período em português
   * @param {string} periodo - Código do período (day, month, year)
   * @returns {string} Nome do período em português
   */
  obterNomePeriodo(periodo) {
    const nomes = {
      day: 'Dia',
      month: 'Mês',
      year: 'Ano'
    };
    return nomes[periodo] || 'Mês';
  }

  /**
   * Converte valores entre moedas (taxas fixas para demonstração)
   * @param {number} valor - Valor a ser convertido
   * @param {string} moedaOrigem - Moeda de origem
   * @param {string} moedaDestino - Moeda de destino
   * @returns {number} Valor convertido
   */
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

  /**
   * Retorna o símbolo da moeda
   * @param {string} moeda - Código da moeda
   * @returns {string} Símbolo da moeda
   */
  obterSimboloMoeda(moeda) {
    const simbolos = {
      real: 'R$',
      dollar: 'US$',
      euro: '€'
    };
    return simbolos[moeda] || 'R$';
  }

  /**
   * Converte períodos entre diferentes unidades
   * @param {number} valor - Valor do período a ser convertido
   * @param {string} periodoOrigem - Unidade de origem
   * @param {string} periodoDestino - Unidade de destino
   * @returns {number} Valor convertido
   */
  converterPeriodo(valor, periodoOrigem, periodoDestino) {
    if (periodoOrigem === periodoDestino) return valor;

    const diasPorPeriodo = { day: 1, month: 30, year: 360 };

    // Converte o valor para dias
    const valorEmDias = valor * diasPorPeriodo[periodoOrigem];

    // Converte de dias para o período de destino
    return valorEmDias / diasPorPeriodo[periodoDestino];
  }
}