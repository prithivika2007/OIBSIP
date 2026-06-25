const formulas = {
  celsius: {
    fahrenheit: (c) => ({ val: (c * 9/5) + 32, formula: `°F = (${c} × 9/5) + 32` }),
    kelvin:     (c) => ({ val: c + 273.15,      formula: `K = ${c} + 273.15` }),
    celsius:    (c) => ({ val: c,                formula: `Same unit — no conversion needed` })
  },
  fahrenheit: {
    celsius:    (f) => ({ val: (f - 32) * 5/9,    formula: `°C = (${f} − 32) × 5/9` }),
    kelvin:     (f) => ({ val: (f - 32) * 5/9 + 273.15, formula: `K = (${f} − 32) × 5/9 + 273.15` }),
    fahrenheit: (f) => ({ val: f,                  formula: `Same unit — no conversion needed` })
  },
  kelvin: {
    celsius:    (k) => ({ val: k - 273.15,         formula: `°C = ${k} − 273.15` }),
    fahrenheit: (k) => ({ val: (k - 273.15) * 9/5 + 32, formula: `°F = (${k} − 273.15) × 9/5 + 32` }),
    kelvin:     (k) => ({ val: k,                  formula: `Same unit — no conversion needed` })
  }
};

function round(val) {
  return Math.round(val * 100) / 100;
}

function convert() {
  const input = document.getElementById('tempInput');
  const errorMsg = document.getElementById('errorMsg');
  const val = parseFloat(input.value);
  const unit = document.querySelector('input[name="unit"]:checked').value;

  // Validate
  if (input.value.trim() === '' || isNaN(val)) {
    input.classList.add('error');
    errorMsg.classList.add('show');
    clearResults();
    return;
  }

  // Kelvin can't be negative
  if (unit === 'kelvin' && val < 0) {
    input.classList.add('error');
    errorMsg.textContent = '⚠ Kelvin cannot be negative!';
    errorMsg.classList.add('show');
    clearResults();
    return;
  }

  input.classList.remove('error');
  errorMsg.classList.remove('show');
  errorMsg.textContent = '⚠ Please enter a valid number';

  // Calculate all
  const c = round(formulas[unit].celsius(val).val);
  const f = round(formulas[unit].fahrenheit(val).val);
  const k = round(formulas[unit].kelvin(val).val);

  // Display results
  document.getElementById('val-celsius').textContent = c + '°';
  document.getElementById('val-fahrenheit').textContent = f + '°';
  document.getElementById('val-kelvin').textContent = k;

  // Highlight source card
  document.querySelectorAll('.result-card').forEach(card => card.classList.remove('active'));
  document.getElementById('res-' + unit).classList.add('active');

  // Formula — show all conversions
  const fromLabel = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' }[unit];
  let formulaLines = [];
  if (unit !== 'celsius')     formulaLines.push(formulas[unit].celsius(val).formula);
  if (unit !== 'fahrenheit')  formulaLines.push(formulas[unit].fahrenheit(val).formula);
  if (unit !== 'kelvin')      formulaLines.push(formulas[unit].kelvin(val).formula);

  document.getElementById('formulaText').textContent = formulaLines.join('   |   ');
}

function clearResults() {
  ['val-celsius', 'val-fahrenheit', 'val-kelvin'].forEach(id => {
    document.getElementById(id).textContent = '—';
  });
  document.querySelectorAll('.result-card').forEach(c => c.classList.remove('active'));
  document.getElementById('formulaText').textContent = '—';
}

// Allow Enter key to convert
document.getElementById('tempInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') convert();
});
