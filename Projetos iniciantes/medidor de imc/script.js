/* Lógica do medidor de IMC
 * - Calcula IMC com peso (kg) e altura (cm)
 * - Valida entradas
 * - Mostra resultado com faixa
 * - Mantém histórico no localStorage (máx 10)
 */

const form = document.getElementById('imc-form');
const pesoInput = document.getElementById('peso');
const alturaInput = document.getElementById('altura');
const resultadoEl = document.getElementById('resultado');
const erroEl = document.getElementById('erro');
const listaHistorico = document.getElementById('lista-historico');
const limparBtn = document.getElementById('limpar');
const limparHistoricoBtn = document.getElementById('limpar-historico');

const STORAGE_KEY = 'imc_historico_v1';

function mostrarErro(msg) {
  erroEl.textContent = msg;
}

function limparErro() {
  erroEl.textContent = '';
}

function calcularIMC(peso, alturaCm) {
  const alturaM = alturaCm / 100;
  if (alturaM <= 0) return NaN;
  return peso / (alturaM * alturaM);
}

function faixaIMC(imc) {
  if (imc < 18.5) return { label: 'Abaixo do peso', class: 'abaixo' };
  if (imc < 25) return { label: 'Peso normal', class: 'normal' };
  if (imc < 30) return { label: 'Sobrepeso', class: 'sobrepeso' };
  return { label: 'Obesidade', class: 'obesidade' };
}

function formatarNumero(n, digits = 1) {
  return Number(n.toFixed(digits)).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function salvarHistorico(item) {
  const arr = carregarHistorico();
  arr.unshift(item);
  if (arr.length > 10) arr.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function carregarHistorico() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao carregar histórico', e);
    return [];
  }
}

function atualizarListaHistorico() {
  const arr = carregarHistorico();
  listaHistorico.innerHTML = '';

  if (arr.length === 0) {
    listaHistorico.innerHTML = '<li>Nenhum registro.</li>';
    return;
  }

  arr.forEach((item) => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.innerHTML = `<strong>${item.imc}</strong> — ${item.faixa}`;
    const right = document.createElement('div');
    right.innerHTML = `<time datetime="${item.when}">${new Date(
      item.when
    ).toLocaleString()}</time>`;
    li.appendChild(left);
    li.appendChild(right);
    listaHistorico.appendChild(li);
  });
}

function mostrarResultado(imc) {
  const faixa = faixaIMC(imc);
  const imcFmt = formatarNumero(imc, 1);
  resultadoEl.innerHTML = `
    <div class="valor">IMC: ${imcFmt}</div>
    <div class="faixa ${faixa.class}">${faixa.label}</div>
  `;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  limparErro();

  const peso = Number(pesoInput.value);
  const altura = Number(alturaInput.value);

  if (!peso || peso <= 0) {
    mostrarErro('Informe um peso válido (kg).');
    pesoInput.focus();
    return;
  }

  if (!altura || altura <= 0) {
    mostrarErro('Informe uma altura válida (cm).');
    alturaInput.focus();
    return;
  }

  const imc = calcularIMC(peso, altura);
  if (!isFinite(imc) || isNaN(imc)) {
    mostrarErro('Erro ao calcular o IMC. Verifique os valores.');
    return;
  }

  mostrarResultado(imc);

  salvarHistorico({
    peso: formatarNumero(peso, 1),
    altura: formatarNumero(altura, 1),
    imc: formatarNumero(imc, 1),
    faixa: faixaIMC(imc).label,
    when: new Date().toISOString(),
  });

  atualizarListaHistorico();
});

limparBtn.addEventListener('click', () => {
  pesoInput.value = '';
  alturaInput.value = '';
  resultadoEl.innerHTML = '';
  limparErro();
  pesoInput.focus();
});

limparHistoricoBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  atualizarListaHistorico();
});

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  atualizarListaHistorico();
});
