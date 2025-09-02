// Calculadora de VPL (Valor Presente Líquido)
// Variáveis globais
let proximoPeriodo = 1;

// Adiciona um novo período de fluxo de caixa
function adicionarPeriodo() {
  const container = document.getElementById('cashFlowsContainer');
  const periodoDiv = document.createElement('div');
  periodoDiv.className = 'cash-flow-item';
  periodoDiv.id = `periodo-${proximoPeriodo}`;

  periodoDiv.innerHTML = `
      <label>Período ${proximoPeriodo}:</label>
      <input type="number" 
        id="fluxo-${proximoPeriodo}" 
        step="0.01" 
        placeholder="Valor do fluxo de caixa">
      <button type="button" class="remove-btn" onclick="removerPeriodo(${proximoPeriodo})">Remover</button>
    `;

  container.appendChild(periodoDiv);
  proximoPeriodo++;
}

// Remove um período de fluxo de caixa
function removerPeriodo(periodo) {
  const elemento = document.getElementById(`periodo-${periodo}`);
  if (elemento) elemento.remove();
}

// Calcula o VPL com base nos dados inseridos
function calcularVPL() {
  try {
    // Coletar dados de entrada
    const investimento = parseFloat(document.getElementById('investimento').value) || 0;
    const taxa = parseFloat(document.getElementById('taxa').value) || 0;
    const valorResidual = parseFloat(document.getElementById('valorResidual').value) || 0;
    const periodoResidual = parseInt(document.getElementById('periodoResidual').value) || 0;

    // Validar entrada
    if (taxa <= 0) {
      alert('Por favor, insira uma taxa de desconto válida (maior que 0).');
      return;
    }

    // Coleta fluxos de caixa
    const fluxosCaixa = coletarFluxosCaixa();

    if (fluxosCaixa.length === 0) {
      alert('Por favor, insira pelo menos um fluxo de caixa.');
      return;
    }

    // Calcula VPL
    const resultado = calcularVPLDetalhado(investimento, taxa, fluxosCaixa, valorResidual, periodoResidual);

    // Exibe resultado
    exibirResultado(resultado);
  } catch (error) {
    console.error('Erro no cálculo do VPL:', error);
    alert('Erro no cálculo. Verifique os dados inseridos.');
  }
}

// Coleta todos os fluxos de caixa inseridos
function coletarFluxosCaixa() {
  const fluxos = [];
  const container = document.getElementById('cashFlowsContainer');
  const inputs = container.querySelectorAll('input[id^="fluxo-"]');

  inputs.forEach((input, index) => {
    const valor = parseFloat(input.value);
    if (!isNaN(valor)) {
      fluxos.push({
        periodo: index + 1,
        valor: valor
      });
    }
  });

  return fluxos;
}

// Calcula o VPL com detalhamento dos passos
function calcularVPLDetalhado(investimento, taxa, fluxosCaixa, valorResidual, periodoResidual) {
  const taxaDecimal = taxa / 100;
  let vpl = -investimento; // Investimento inicial é negativo
  const passos = [];

  // Adiciona investimento inicial
  passos.push({
    descricao: 'Investimento Inicial',
    periodo: 0,
    fluxo: -investimento,
    fatorDesconto: 1,
    valorPresente: -investimento
  });

  // Calcula valor presente de cada fluxo de caixa
  fluxosCaixa.forEach(fluxo => {
    const fatorDesconto = 1 / Math.pow(1 + taxaDecimal, fluxo.periodo);
    const valorPresente = fluxo.valor * fatorDesconto;
    vpl += valorPresente;

    passos.push({
      descricao: `Fluxo de Caixa Período ${fluxo.periodo}`,
      periodo: fluxo.periodo,
      fluxo: fluxo.valor,
      fatorDesconto: fatorDesconto,
      valorPresente: valorPresente
    });
  });

  // Adiciona valor residual se especificado
  if (valorResidual > 0 && periodoResidual > 0) {
    const fatorDescontoResidual = 1 / Math.pow(1 + taxaDecimal, periodoResidual);
    const valorPresenteResidual = valorResidual * fatorDescontoResidual;
    vpl += valorPresenteResidual;

    passos.push({
      descricao: `Valor Residual (Período ${periodoResidual})`,
      periodo: periodoResidual,
      fluxo: valorResidual,
      fatorDesconto: fatorDescontoResidual,
      valorPresente: valorPresenteResidual
    });
  }

  return {
    vpl: vpl,
    passos: passos,
    investimento: investimento,
    taxa: taxa,
    valorResidual: valorResidual,
    periodoResidual: periodoResidual
  };
}

// Exibe o resultado do cálculo na tela
function exibirResultado(resultado) {
  const resultSection = document.getElementById('resultSection');
  const vplResultDiv = document.getElementById('vplResult');
  const interpretationDiv = document.getElementById('resultInterpretation');
  const calculationStepsDiv = document.getElementById('calculationSteps');

  // Formatar e exibir o VPL
  const vplFormatado = formatarMoeda(resultado.vpl);
  vplResultDiv.textContent = vplFormatado;

  // Aplicar classe CSS baseada no resultado
  vplResultDiv.className = 'vpl-result';
  interpretationDiv.className = 'result-interpretation';

  if (resultado.vpl > 0) {
    vplResultDiv.classList.add('vpl-positive');
    interpretationDiv.classList.add('interpretation-positive');
    interpretationDiv.textContent = '✅ Projeto VIÁVEL - O VPL é positivo, indicando que o projeto gera valor e deve ser aceito.';
  } else if (resultado.vpl < 0) {
    vplResultDiv.classList.add('vpl-negative');
    interpretationDiv.classList.add('interpretation-negative');
    interpretationDiv.textContent = '❌ Projeto INVIÁVEL - O VPL é negativo, indicando que o projeto destrói valor e deve ser rejeitado.';
  } else {
    vplResultDiv.classList.add('vpl-zero');
    interpretationDiv.classList.add('interpretation-zero');
    interpretationDiv.textContent = '⚖️ Projeto NEUTRO - O VPL é zero, indicando que o projeto não gera nem destrói valor.';
  }

  // Gerar detalhamento do cálculo
  gerarDetalhamentoCalculo(resultado, calculationStepsDiv);

  // Exibir seção de resultado
  resultSection.style.display = 'block';

  // Scroll suave para o resultado
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Gera o detalhamento passo a passo do cálculo
function gerarDetalhamentoCalculo(resultado, container) {
  container.innerHTML = '';

  // Fórmula do VPL
  const formulaDiv = document.createElement('div');
  formulaDiv.className = 'calculation-step';
  formulaDiv.innerHTML = `
    <strong>Fórmula do VPL:</strong><br>
    VPL = -I₀ + Σ(FCt / (1 + r)^t) + VR / (1 + r)^n<br>
    Onde: I₀ = Investimento inicial, FCt = Fluxo de caixa no período t, r = Taxa de desconto, VR = Valor residual
  `;
  container.appendChild(formulaDiv);

  // Dados utilizados
  const dadosDiv = document.createElement('div');
  dadosDiv.className = 'calculation-step';
  dadosDiv.innerHTML = `
    <strong>Dados utilizados:</strong><br>
    • Investimento inicial: ${formatarMoeda(resultado.investimento)}<br>
    • Taxa de desconto: ${resultado.taxa}% ao período<br>
    ${resultado.valorResidual > 0 ? `• Valor residual: ${formatarMoeda(resultado.valorResidual)} no período ${resultado.periodoResidual}` : ''}
  `;
  container.appendChild(dadosDiv);

  // Cálculo passo a passo
  resultado.passos.forEach((passo, index) => {
    const passoDiv = document.createElement('div');
    passoDiv.className = 'calculation-step';

    if (passo.periodo === 0) {
      passoDiv.innerHTML = `
        <strong>Passo ${index + 1}:</strong> ${passo.descricao}<br>
        Valor: ${formatarMoeda(passo.valorPresente)}
      `;
    } else {
      passoDiv.innerHTML = `
        <strong>Passo ${index + 1}:</strong> ${passo.descricao}<br>
        Cálculo: ${formatarMoeda(passo.fluxo)} ÷ (1 + ${resultado.taxa / 100})^${passo.periodo}<br>
        Fator de desconto: ${passo.fatorDesconto.toFixed(6)}<br>
        Valor presente: ${formatarMoeda(passo.valorPresente)}
      `;
    }

    container.appendChild(passoDiv);
  });

  // Resultado final
  const finalDiv = document.createElement('div');
  finalDiv.className = 'calculation-step';
  finalDiv.style.backgroundColor = '#e3f2fd';
  finalDiv.style.borderLeftColor = '#2196f3';
  finalDiv.innerHTML = `
    <strong>Resultado Final:</strong><br>
    VPL = ${resultado.passos.map(p => formatarMoeda(p.valorPresente)).join(' + ')}<br>
    VPL = ${formatarMoeda(resultado.vpl)}
  `;
  container.appendChild(finalDiv);
}

// Formata um valor como moeda brasileira
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Valida se um valor é um número válido
function validarNumero(valor, nome) {
  if (isNaN(valor) || valor === '') throw new Error(`${nome} deve ser um número válido.`);
  return true;
}

// Limpa todos os campos do formulário
function limparFormulario() {
  document.getElementById('investimento').value = '';
  document.getElementById('taxa').value = '';
  document.getElementById('valorResidual').value = '0';
  document.getElementById('periodoResidual').value = '0';

  // Limpar fluxos de caixa
  const container = document.getElementById('cashFlowsContainer');
  container.innerHTML = '';
  proximoPeriodo = 1;

  // Adiciona períodos iniciais
  adicionarPeriodo();
  adicionarPeriodo();
  adicionarPeriodo();

  // Oculta resultado
  document.getElementById('resultSection').style.display = 'none';
}

// Exporta os resultados para um formato de texto
function exportarResultados() {
  const resultSection = document.getElementById('resultSection');
  if (resultSection.style.display === 'none') {
    alert('Calcule o VPL primeiro antes de exportar os resultados.');
    return;
  }

  const vplValue = document.getElementById('vplResult').textContent;
  const interpretation = document.getElementById('resultInterpretation').textContent;
  const calculationSteps = document.getElementById('calculationSteps').innerText;

  const exportText = `
    RESULTADO DO CÁLCULO DE VPL
    ============================

    VPL Calculado: ${vplValue}
    Interpretação: ${interpretation}

    DETALHAMENTO DO CÁLCULO:
    ${calculationSteps}

    Gerado em: ${new Date().toLocaleString('pt-BR')}
  `;

  // Cria e baixa arquivo
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calculo-vpl.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}