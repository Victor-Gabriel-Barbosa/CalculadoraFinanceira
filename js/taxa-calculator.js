// Taxa Calculator Module
class TaxaCalculator {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.clearResults();
  }

  initializeElements() {
    // Input elements
    this.icInput = document.getElementById('icInput');
    this.nTaxaInput = document.getElementById('nTaxaInput');
    this.iTaxaInput = document.getElementById('iTaxaInput');
    this.nTaxaUnit = document.getElementById('nTaxaUnit');

    // Button elements
    this.calculateBtn = document.getElementById('calculateTaxa');
    this.clearBtn = document.getElementById('clearTaxa');

    // Result elements
    this.icResult = document.getElementById('icResult');
    this.nTaxaResult = document.getElementById('nTaxaResult');
    this.iTaxaResult = document.getElementById('iTaxaResult');
  }

  bindEvents() {
    this.calculateBtn.addEventListener('click', () => this.calculate());
    this.clearBtn.addEventListener('click', () => this.clear());

    // Configurar event listeners para cada input
    [this.icInput, this.nTaxaInput, this.iTaxaInput].forEach(input => {
      // Usar keydown para prevenir caracteres inválidos
      input.addEventListener('keydown', (e) => {
        // Permitir teclas de controle
        const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        
        // Permitir teclas de controle e combinações com Ctrl
        if (controlKeys.includes(e.key) || (e.ctrlKey && ['a', 'c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase()))) return;
        
        // Para o campo n (período), apenas números
        if (input === this.nTaxaInput) {
          if (!/^[0-9]$/.test(e.key)) e.preventDefault();
        } else {
          if (!/^[0-9.]$/.test(e.key)) e.preventDefault(); // Para ic e i, permitir números e um ponto decimal
          else if (e.key === '.' && input.value.includes('.')) e.preventDefault(); // Prevenir múltiplos pontos decimais
        }
      });

      // Auto-calcular quando o valor mudar
      input.addEventListener('input', () => setTimeout(() => this.autoCalculate(), 100));

      // Enter key para calcular
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.calculate();
      });
    });
  }

  autoCalculate() {
    const filledInputs = this.getFilledInputs();
    if (filledInputs.length >= 2) this.calculate();
  }

  getFilledInputs() {
    const inputs = [];
    if (this.icInput.value && this.icInput.value !== '' && !isNaN(parseFloat(this.icInput.value))) inputs.push('ic');
    if (this.nTaxaInput.value && this.nTaxaInput.value !== '' && !isNaN(parseFloat(this.nTaxaInput.value))) inputs.push('n');
    if (this.iTaxaInput.value && this.iTaxaInput.value !== '' && !isNaN(parseFloat(this.iTaxaInput.value))) inputs.push('i');
    return inputs;
  }

  calculate() {
    try {
      this.clearErrors();
      const filledInputs = this.getFilledInputs();

      if (filledInputs.length < 2) {
        this.showError('Preencha pelo menos 2 valores para calcular');
        return;
      }

      if (filledInputs.length === 3) {
        this.showError('Preencha apenas 2 valores. O terceiro será calculado.');
        return;
      }

      // Obter valores das entradas
      const ic = this.icInput.value ? parseFloat(this.icInput.value) / 100 : null; // Converter % para decimal
      const n = this.nTaxaInput.value ? this.convertPeriodToMonths(parseFloat(this.nTaxaInput.value)) : null;
      const i = this.iTaxaInput.value ? parseFloat(this.iTaxaInput.value) / 100 : null; // Converter % para decimal

      // Debug dos valores
      this.debugCalculation(ic, n, i);

      let result = {};

      // Determinar qual valor calcular baseado nos inputs preenchidos
      if (filledInputs.includes('ic') && filledInputs.includes('n') && !filledInputs.includes('i')) {
        // Calcular i a partir de ic e n
        // Fórmula: i = ic / (1 - ic × n)
        const denominator = 1 - (ic * n);
        if (ic === 0 || denominator <= 0) throw new Error('Valores inválidos para o cálculo - denominador zero ou negativo');
        result.i = ic / denominator;
        result.ic = ic;
        result.n = n;
      } else if (filledInputs.includes('i') && filledInputs.includes('n') && !filledInputs.includes('ic')) {
        // Calcular ic a partir de i e n
        // Fórmula: ic = i / (1 + i × n)
        const denominator = 1 + (i * n);
        if (denominator === 0) throw new Error('Valores inválidos para o cálculo');
        result.ic = i / denominator;
        result.i = i;
        result.n = n;
      } else if (filledInputs.includes('ic') && filledInputs.includes('i') && !filledInputs.includes('n')) {
        // Calcular n a partir de ic e i
        // Fórmula: n = (i - ic) / (ic × i)
        if (ic === 0 || i === 0) throw new Error('Valores inválidos para o cálculo - taxas não podem ser zero');
        result.n = (i - ic) / (ic * i);
        result.ic = ic;
        result.i = i;
      }

      // Validar se os resultados fazem sentido
      if (result.ic < 0 || result.i < 0 || result.n < 0) throw new Error('Resultado negativo - verifique os valores de entrada');

      this.displayResults(result);
    } catch (error) {
      this.showError(error.message || 'Erro no cálculo. Verifique os valores inseridos.');
    }
  }

  convertPeriodToMonths(value) {
    const unit = this.nTaxaUnit.value;
    switch (unit) {
      case 'dias':
        return value / 30; // Aproximação: 30 dias = 1 mês
      case 'meses':
        return value;
      case 'anos':
        return value * 12;
      default:
        return value;
    }
  }

  convertMonthsToPeriod(months) {
    const unit = this.nTaxaUnit.value;
    switch (unit) {
      case 'dias':
        return months * 30;
      case 'meses':
        return months;
      case 'anos':
        return months / 12;
      default:
        return months;
    }
  }

  displayResults(result) {
    // Mostrar ic (em %)
    if (result.ic !== undefined) {
      this.icResult.textContent = (result.ic * 100).toFixed(4) + '%';
      this.icResult.classList.add('updated');
    }

    // Mostrar n (no período original)
    if (result.n !== undefined) {
      const nInOriginalUnit = this.convertMonthsToPeriod(result.n);
      this.nTaxaResult.textContent = nInOriginalUnit.toFixed(2) + ' ' + this.nTaxaUnit.value;
      this.nTaxaResult.classList.add('updated');
    }

    // Mostrar i (em %)
    if (result.i !== undefined) {
      this.iTaxaResult.textContent = (result.i * 100).toFixed(4) + '%';
      this.iTaxaResult.classList.add('updated');
    }

    // Remover classe de animação após a animação
    setTimeout(() => {
      [this.icResult, this.nTaxaResult, this.iTaxaResult].forEach(element => {
        element.classList.remove('updated');
      });
    }, 500);
  }

  clearResults() {
    this.icResult.textContent = '-';
    this.nTaxaResult.textContent = '-';
    this.iTaxaResult.textContent = '-';

    [this.icResult, this.nTaxaResult, this.iTaxaResult].forEach(element => {
      element.classList.remove('error');
    });
  }

  clear() {
    // Limpar inputs
    this.icInput.value = '';
    this.nTaxaInput.value = '';
    this.iTaxaInput.value = '';

    // Limpar resultados
    this.clearResults();
    this.clearErrors();
  }

  clearErrors() {
    [this.icInput, this.nTaxaInput, this.iTaxaInput].forEach(input => {
      input.classList.remove('error');
    });

    [this.icResult, this.nTaxaResult, this.iTaxaResult].forEach(element => {
      element.classList.remove('error');
    });
  }

  showError(message) {
    console.error('Taxa Calculator Error:', message);

    // Destacar campos com erro
    [this.icInput, this.nTaxaInput, this.iTaxaInput].forEach(input => {
      if (input.value) {
        input.classList.add('error');
      }
    });

    // Mostrar erro nos resultados
    [this.icResult, this.nTaxaResult, this.iTaxaResult].forEach(element => {
      element.textContent = 'Erro';
      element.classList.add('error');
    });

    // Mostrar alerta para o usuário
    alert(message);
  }

  debugCalculation(ic, n, i) {
    console.log('=== DEBUG CÁLCULO ===');
    console.log('ic (decimal):', ic);
    console.log('n (meses):', n);
    console.log('i (decimal):', i);
    
    if (ic && n) {
      const result = ic / (1 - ic * n);
      console.log('Fórmula: i = ic / (1 - ic × n)');
      console.log('Cálculo: i =', ic, '/ (1 -', ic, '×', n, ')');
      console.log('Cálculo: i =', ic, '/ (1 -', (ic * n), ')');
      console.log('Cálculo: i =', ic, '/', (1 - ic * n));
      console.log('Resultado i:', result);
      console.log('Resultado i (%):', (result * 100).toFixed(4) + '%');
    }
    console.log('===================');
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new TaxaCalculator();
});

// Exportar para uso em outros módulos se necessário
export { TaxaCalculator };