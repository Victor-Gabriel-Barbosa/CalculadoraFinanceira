/**
 * CÁLCULOS FINANCEIROS
 * Classe responsável por todos os cálculos financeiros baseados em juros compostos
 * Suporta cálculo de Valor Presente (PV), Valor Futuro (FV), Taxa de Juros (i) e Número de Períodos (n)
 */
class CalculosFinanceiros {
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
   * @param {string} variavelFaltante - variável a ser calculada ('pv', 'fv', 'i', 'n')
   * @param {Object} valores - objeto com os valores conhecidos
   * @returns {number} valor calculado
   */
  resolverEqFinanceira(variavelFaltante, valores) {
    const { pv, fv, i, n } = valores;

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
   * @param {number} fv - Valor Futuro
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Valor Presente
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
   * @param {number} pv - Valor Presente
   * @param {number} i - Taxa de juros (decimal)
   * @param {number} n - Número de períodos
   * @returns {number} Valor Futuro
   */
  calcularVF(pv, i, n) {
    // Caso especial: taxa zero
    if (i === 0) return -(pv || 0);

    const fator = Math.pow(1 + i, n);
    return -(pv || 0) * fator;
  }

  /**
   * Calcula Taxa de Juros (i) usando método direto
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} n - Número de períodos
   * @returns {number} Taxa de juros (percentual)
   */
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

  /**
   * Calcula Número de Períodos (n)
   * @param {number} pv - Valor Presente
   * @param {number} fv - Valor Futuro
   * @param {number} i - Taxa de juros (decimal)
   * @returns {number} Número de períodos
   */
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

  /**
   * Detecta o tipo de taxa baseado na magnitude do valor
   * @param {number} taxa - Taxa a ser analisada
   * @returns {string} Tipo detectado ('dia', 'mes', 'ano')
   */
  detectarTipoTaxa(taxa) {
    if (taxa <= 1) return 'dia';
    else if (taxa <= 15) return 'mes';
    else return 'ano';
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

    switch (tipoConversao) {
      case 'taxa-dia':
        resultado = this.converterTaxa('dia', taxaAtual, tipoOrigem);
        descricao = 'Taxa diária';
        break;
      case 'taxa-mes':
        resultado = this.converterTaxa('mes', taxaAtual, tipoOrigem);
        descricao = 'Taxa mensal';
        break;
      case 'taxa-ano':
        resultado = this.converterTaxa('ano', taxaAtual, tipoOrigem);
        descricao = 'Taxa anual';
        break;
      default:
        throw new Error('Tipo de conversão inválido');
    }

    return {
      resultado: resultado,
      descricao: descricao,
      tipoOrigem: tipoOrigem,
      modo: this.modoCapitalizacao
    };
  }
}