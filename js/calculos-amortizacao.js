/**
 * CALCULADORA DE AMORTIZAÇÃO - SISTEMA SAC
 * Sistema de Amortização Constante (SAC)
 * 
 * No SAC:
 * - A amortização é constante (igual em todas as parcelas)
 * - Os juros diminuem a cada parcela (calculados sobre o saldo devedor)
 * - A prestação diminui a cada parcela
 * - Saldo devedor diminui linearmente
 */
class CalculadoraAmortizacao {
  constructor() {
    this.valorFinanciamento = 0;
    this.taxaJuros = 0;
    this.taxaOriginal = 0;
    this.periodoTaxa = 'mensal';
    this.numeroMeses = 0;
    this.amortizacaoConstante = 0;
    this.tabelaAmortizacao = [];

    this.initEventListeners();
  }

  // Inicializa os event listeners
  initEventListeners() {
    const form = document.getElementById('amortizationForm');
    const tipoCalculo = document.getElementById('tipoCalculo');
    const parcelaEspecificaGroup = document.getElementById('parcelaEspecificaGroup');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calcularAmortizacao();
    });

    tipoCalculo.addEventListener('change', () => {
      if (tipoCalculo.value === 'parcela') {
        parcelaEspecificaGroup.style.display = 'block';
        document.getElementById('parcelaEspecifica').required = true;
      } else {
        parcelaEspecificaGroup.style.display = 'none';
        document.getElementById('parcelaEspecifica').required = false;
      }
    });
  }

  // Converte taxa de juros para taxa mensal equivalente
  converterTaxaParaMensal(taxaOriginal, periodoTaxa) {
    // Taxa já em decimal (por exemplo, 1.5% = 0.015)
    const taxa = taxaOriginal;
    
    switch (periodoTaxa) {
      // Já está em taxa mensal
      case 'mensal': return taxa; 

      // Converte taxa anual para mensal: (1 + i_anual)^(1/12) - 1
      case 'anual': return Math.pow(1 + taxa, 1/12) - 1;
        
      // Converte taxa trimestral para mensal: (1 + i_trimestral)^(1/3) - 1
      case 'trimestral': return Math.pow(1 + taxa, 1/3) - 1;
        
      // Converte taxa semestral para mensal: (1 + i_semestral)^(1/6) - 1
      case 'semestral': return Math.pow(1 + taxa, 1/6) - 1;
        
      // Converte taxa diária para mensal: (1 + i_diaria)^30 - 1
      case 'diario': return Math.pow(1 + taxa, 30) - 1;
        
      default: return taxa;
    }
  }

  // Traduz período da taxa para português
  traduzirPeriodoTaxa(periodo) {
    const traducoes = {
      'mensal': 'ao mês',
      'anual': 'ao ano',
      'trimestral': 'ao trimestre',
      'semestral': 'ao semestre',
      'diario': 'ao dia'
    };
    return traducoes[periodo] || periodo;
  }

  // Valida os dados de entrada
  validarDados() {
    const valorFinanciamento = parseFloat(document.getElementById('valorFinanciamento').value);
    const taxaJuros = parseFloat(document.getElementById('taxaJuros').value);
    const numeroMeses = parseInt(document.getElementById('numeroMeses').value);
    const tipoCalculo = document.getElementById('tipoCalculo').value;
    const parcelaEspecifica = parseInt(document.getElementById('parcelaEspecifica').value) || 0;

    const erros = [];

    if (!valorFinanciamento || valorFinanciamento <= 0) erros.push('Valor do financiamento deve ser maior que zero');

    if (!taxaJuros || taxaJuros <= 0) erros.push('Taxa de juros deve ser maior que zero');

    if (!numeroMeses || numeroMeses <= 0) erros.push('Número de parcelas deve ser maior que zero');

    if (tipoCalculo === 'parcela') {
      if (!parcelaEspecifica || parcelaEspecifica <= 0 || parcelaEspecifica > numeroMeses) erros.push(`Parcela específica deve estar entre 1 e ${numeroMeses}`);
    }

    if (erros.length > 0) {
      this.mostrarErro(erros.join('<br>'));
      return false;
    }

    this.esconderErro();
    return true;
  }

  // Mostra mensagem de erro
  mostrarErro(mensagem) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.innerHTML = mensagem;
    errorElement.style.display = 'block';
    errorElement.scrollIntoView({ behavior: 'smooth' });
  }

  // Esconde mensagem de erro
  esconderErro() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'none';
  }

  // Função principal para calcular a amortização
  calcularAmortizacao() {
    if (!this.validarDados()) return;

    // Captura os valores do formulário
    this.valorFinanciamento = parseFloat(document.getElementById('valorFinanciamento').value);
    this.taxaOriginal = parseFloat(document.getElementById('taxaJuros').value) / 100; // Converte % para decimal
    this.periodoTaxa = document.getElementById('periodoTaxa').value;
    this.numeroMeses = parseInt(document.getElementById('numeroMeses').value);
    const tipoCalculo = document.getElementById('tipoCalculo').value;
    const parcelaEspecifica = parseInt(document.getElementById('parcelaEspecifica').value) || 0;

    // Converte a taxa para taxa mensal equivalente
    this.taxaJuros = this.converterTaxaParaMensal(this.taxaOriginal, this.periodoTaxa);

    // Calcula a amortização constante (VP / n)
    this.amortizacaoConstante = this.valorFinanciamento / this.numeroMeses;

    if (tipoCalculo === 'tabela') this.gerarTabelaCompleta();
    else this.calcularParcelaEspecifica(parcelaEspecifica);

    this.exibirResultados(tipoCalculo, parcelaEspecifica);
  }

  // Gera a tabela completa de amortização
  gerarTabelaCompleta() {
    this.tabelaAmortizacao = [];
    let saldoDevedor = this.valorFinanciamento;

    for (let parcela = 1; parcela <= this.numeroMeses; parcela++) {
      const dadosParcela = this.calcularDadosParcela(parcela, saldoDevedor);
      this.tabelaAmortizacao.push(dadosParcela);
      saldoDevedor = dadosParcela.saldoDevedor;
    }
  }

  // Calcula uma parcela específica
  calcularParcelaEspecifica(numeroParcela) {
    // Para SAC, podemos calcular diretamente qualquer parcela
    const saldoAnterior = this.valorFinanciamento - (this.amortizacaoConstante * (numeroParcela - 1));
    const dadosParcela = this.calcularDadosParcela(numeroParcela, saldoAnterior);
    this.tabelaAmortizacao = [dadosParcela];
  }

  // Calcula os dados de uma parcela específica
  calcularDadosParcela(numeroParcela, saldoAnterior) {
    const juros = saldoAnterior * this.taxaJuros;
    const amortizacao = this.amortizacaoConstante;
    const prestacao = juros + amortizacao;
    const saldoDevedor = saldoAnterior - amortizacao;

    return {
      parcela: numeroParcela,
      saldoAnterior: saldoAnterior,
      juros: juros,
      amortizacao: amortizacao,
      prestacao: prestacao,
      saldoDevedor: Math.max(0, saldoDevedor) // Garante que não seja negativo
    };
  }

  // Calcula totais da tabela
  calcularTotais() {
    const totalJuros = this.tabelaAmortizacao.reduce((total, parcela) => total + parcela.juros, 0);
    const totalAmortizacao = this.tabelaAmortizacao.reduce((total, parcela) => total + parcela.amortizacao, 0);
    const totalPrestacoes = this.tabelaAmortizacao.reduce((total, parcela) => total + parcela.prestacao, 0);

    return {
      totalJuros,
      totalAmortizacao,
      totalPrestacoes,
      valorTotal: this.valorFinanciamento + totalJuros
    };
  }

  // Exibe os resultados na interface
  exibirResultados(tipoCalculo, parcelaEspecifica = 0) {
    const resultsSection = document.getElementById('resultsSection');
    const summaryCards = document.getElementById('summaryCards');
    const tableContainer = document.getElementById('tableContainer');

    // Limpa resultados anteriores
    summaryCards.innerHTML = '';
    tableContainer.innerHTML = '';

    if (tipoCalculo === 'tabela') {
      this.criarCardsSumoCompleto(summaryCards);
      this.criarTabelaCompleta(tableContainer);
    } else {
      this.criarCardsParcela(summaryCards, parcelaEspecifica);
      this.criarTabelaParcela(tableContainer, parcelaEspecifica);
    }

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Cria cards de resumo para tabela completa
  criarCardsSumoCompleto(container) {
    const totais = this.calcularTotais();
    const primeiraParcela = this.tabelaAmortizacao[0];
    const ultimaParcela = this.tabelaAmortizacao[this.tabelaAmortizacao.length - 1];

    const cards = [
      {
        titulo: 'Valor Financiado',
        valor: this.formatarValor(this.valorFinanciamento)
      },
      {
        titulo: 'Total de Juros',
        valor: this.formatarValor(totais.totalJuros)
      },
      {
        titulo: 'Valor Total Pago',
        valor: this.formatarValor(totais.valorTotal)
      },
      {
        titulo: 'Primeira Prestação',
        valor: this.formatarValor(primeiraParcela.prestacao)
      },
      {
        titulo: 'Última Prestação',
        valor: this.formatarValor(ultimaParcela.prestacao)
      },
      {
        titulo: 'Amortização Mensal',
        valor: this.formatarValor(this.amortizacaoConstante)
      }
    ];

    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'summary-card';
      cardElement.innerHTML = `
        <h3>${card.titulo}</h3>
        <p class="value">${card.valor}</p>
      `;
      container.appendChild(cardElement);
    });
  }

  // Cria cards para parcela específica
  criarCardsParcela(container, numeroParcela) {
    const parcela = this.tabelaAmortizacao[0];

    const cards = [
      {
        titulo: `Prestação ${numeroParcela}`,
        valor: this.formatarValor(parcela.prestacao)
      },
      {
        titulo: 'Juros',
        valor: this.formatarValor(parcela.juros)
      },
      {
        titulo: 'Amortização',
        valor: this.formatarValor(parcela.amortizacao)
      },
      {
        titulo: 'Saldo Devedor',
        valor: this.formatarValor(parcela.saldoDevedor)
      }
    ];

    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'summary-card';
      cardElement.innerHTML = `
        <h3>${card.titulo}</h3>
        <p class="value">${card.valor}</p>
      `;
      container.appendChild(cardElement);
    });
  }

  // Cria tabela completa de amortização
  criarTabelaCompleta(container) {
    const table = document.createElement('table');
    table.className = 'amortization-table';

    // Cabeçalho
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Parcela</th>
        <th>Saldo Anterior</th>
        <th>Juros</th>
        <th>Amortização</th>
        <th>Prestação</th>
        <th>Saldo Devedor</th>
      </tr>
    `;
    table.appendChild(thead);

    // Corpo da tabela
    const tbody = document.createElement('tbody');
    this.tabelaAmortizacao.forEach(parcela => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${parcela.parcela}</td>
        <td>${this.formatarValor(parcela.saldoAnterior)}</td>
        <td>${this.formatarValor(parcela.juros)}</td>
        <td>${this.formatarValor(parcela.amortizacao)}</td>
        <td><strong>${this.formatarValor(parcela.prestacao)}</strong></td>
        <td>${this.formatarValor(parcela.saldoDevedor)}</td>
      `;
      tbody.appendChild(row);
    });

    // Linha de totais
    const totais = this.calcularTotais();
    const totalRow = document.createElement('tr');
    totalRow.style.backgroundColor = 'blue';
    totalRow.style.fontWeight = 'bold';
    totalRow.innerHTML = `
      <td>TOTAL</td>
      <td>-</td>
      <td>${this.formatarValor(totais.totalJuros)}</td>
      <td>${this.formatarValor(totais.totalAmortizacao)}</td>
      <td>${this.formatarValor(totais.totalPrestacoes)}</td>
      <td>R$ 0,00</td>
    `;
    tbody.appendChild(totalRow);

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Cria tabela para parcela específica
  criarTabelaParcela(container, numeroParcela) {
    const parcela = this.tabelaAmortizacao[0];

    const table = document.createElement('table');
    table.className = 'amortization-table';

    table.innerHTML = `
      <thead>
        <tr>
          <th colspan="2">Detalhes da Parcela ${numeroParcela}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Saldo Anterior</strong></td>
          <td>${this.formatarValor(parcela.saldoAnterior)}</td>
        </tr>
        <tr>
          <td><strong>Taxa Original</strong></td>
          <td>${(this.taxaOriginal * 100).toFixed(3)}% ${this.traduzirPeriodoTaxa(this.periodoTaxa)}</td>
        </tr>
        <tr>
          <td><strong>Taxa Mensal Equivalente</strong></td>
          <td>${(this.taxaJuros * 100).toFixed(3)}% ao mês</td>
        </tr>
        <tr>
          <td><strong>Juros</strong></td>
          <td>${this.formatarValor(parcela.juros)}</td>
        </tr>
        <tr>
          <td><strong>Amortização</strong></td>
          <td>${this.formatarValor(parcela.amortizacao)}</td>
        </tr>
        <tr style="background-color: blue;">
          <td><strong>Prestação</strong></td>
          <td><strong>${this.formatarValor(parcela.prestacao)}</strong></td>
        </tr>
        <tr>
          <td><strong>Saldo Devedor</strong></td>
          <td>${this.formatarValor(parcela.saldoDevedor)}</td>
        </tr>
      </tbody>
    `;

    container.appendChild(table);
  }

  // Formata valor monetário
  formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}

// Utilitários para exportação de dados
class ExportadorDados {
  // Exporta dados para CSV
  static exportarCSV(tabela, nomeArquivo = 'amortizacao.csv') {
    let csv = 'Parcela,Saldo Anterior,Juros,Amortização,Prestação,Saldo Devedor\n';

    tabela.forEach(parcela => {
      csv += `${parcela.parcela},${parcela.saldoAnterior.toFixed(2)},${parcela.juros.toFixed(2)},`;
      csv += `${parcela.amortizacao.toFixed(2)},${parcela.prestacao.toFixed(2)},${parcela.saldoDevedor.toFixed(2)}\n`;
    });

    this.baixarArquivo(csv, nomeArquivo, 'text/csv');
  }

  // Baixa arquivo
  static baixarArquivo(conteudo, nomeArquivo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

// Adiciona botão de exportação após gerar tabela completa
function adicionarBtnExportar(calculadora) {
  const resultsSection = document.getElementById('resultsSection');

  // Remove botão anterior se existir
  const btnExistente = document.getElementById('btnExportar');
  if (btnExistente) btnExistente.remove();

  if (calculadora.tabelaAmortizacao.length > 1) {
    const btnExportar = document.createElement('button');
    btnExportar.id = 'btnExportar';
    btnExportar.textContent = 'Exportar para CSV';
    btnExportar.className = 'btn-calculate';
    btnExportar.style.marginTop = '20px';

    btnExportar.addEventListener('click', () => {
      ExportadorDados.exportarCSV(calculadora.tabelaAmortizacao);
    });

    resultsSection.appendChild(btnExportar);
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  const calculadora = new CalculadoraAmortizacao();

  // Adiciona funcionalidade de exportação
  const originalExibirResultados = calculadora.exibirResultados;
  calculadora.exibirResultados = function (tipoCalculo, parcelaEspecifica) {
    originalExibirResultados.call(this, tipoCalculo, parcelaEspecifica);
    adicionarBtnExportar(this);
  };
});

// Exporta a classe para uso externo se necessário
if (typeof module !== 'undefined' && module.exports) module.exports = { CalculadoraAmortizacao, ExportadorDados };