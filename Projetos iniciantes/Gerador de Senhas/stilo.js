// Gerador de senhas simples para iniciantes

const el = id => document.getElementById(id);

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUM = '0123456789';
const SYM = "!@#$%^&*()_+-=[]{}|;:',.<>/?`~";

function getSelectedChars() {
    let chars = '';
    if (el('lowercase') && el('lowercase').checked) chars += LOWER;
    if (el('uppercase') && el('uppercase').checked) chars += UPPER;
    if (el('numbers') && el('numbers').checked) chars += NUM;
    if (el('symbols') && el('symbols').checked) chars += SYM;
    return chars;
}

// --- Toasts (notificações) ---
function ensureToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toast-container';
        c.style.position = 'fixed';
        c.style.right = '20px';
        c.style.bottom = '20px';
        c.style.display = 'flex';
        c.style.flexDirection = 'column';
        c.style.gap = '10px';
        c.style.zIndex = '9999';
        document.body.appendChild(c);
    }
    return c;
}

function showToast(message, type = 'info', duration = 3000) {
    const container = ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = message;
    container.appendChild(t);
    // force reflow then animate
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => {
        t.classList.remove('visible');
        setTimeout(() => t.remove(), 250);
    }, duration);
}


function generatePassword(length) {
    const chars = getSelectedChars();
    if (!chars) return '';

    // Garante pelo menos um caractere de cada tipo selecionado
    const pools = [];
    if (el('lowercase') && el('lowercase').checked) pools.push(LOWER);
    if (el('uppercase') && el('uppercase').checked) pools.push(UPPER);
    if (el('numbers') && el('numbers').checked) pools.push(NUM);
    if (el('symbols') && el('symbols').checked) pools.push(SYM);

    const passwordChars = [];

    // Insere um caractere obrigatório de cada pool (se houver espaço)
    for (let i = 0; i < pools.length && passwordChars.length < length; i++) {
        const p = pools[i];
        passwordChars.push(p[Math.floor(Math.random() * p.length)]);
    }

        // Helper para gerar inteiros aleatórios: usa crypto quando disponível
        const randomInt = (max) => {
            if (window.crypto && window.crypto.getRandomValues) {
                // Gera um Uint32 e reduz para o intervalo requerido
                const array = new Uint32Array(1);
                window.crypto.getRandomValues(array);
                return array[0] % max;
            }
            return Math.floor(Math.random() * max);
        };

        // Preenche o restante aleatoriamente
        while (passwordChars.length < length) {
            const idx = randomInt(chars.length);
            passwordChars.push(chars[idx]);
        }

    // Embaralha para evitar padrão previsível
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');
}

function showPassword() {
    const lengthInput = el('length');
    const length = lengthInput ? (parseInt(lengthInput.value, 10) || 12) : 12;
    if (length < 4) {
        showToast('Escolha um comprimento mínimo de 4.', 'error');
        return;
    }

    const chars = getSelectedChars();
    if (!chars) {
        showToast('Selecione pelo menos um tipo de caractere.', 'error');
        return;
    }

    const pwd = generatePassword(length);
    const out = el('password');
    if (out) out.value = pwd;
    updateStrengthUI(pwd, length);
}

function copyPassword() {
    const out = el('password');
    const pwd = out ? out.value : '';
    if (!pwd) return;

    // Usar clipboard API moderna quando disponível
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pwd).then(() => {
            showToast('Senha copiada para a área de transferência!', 'success');
        }).catch(() => {
            fallbackCopy(pwd);
        });
    } else {
        fallbackCopy(pwd);
    }
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
        try {
        document.execCommand('copy');
        showToast('Senha copiada para a área de transferência!', 'success');
    } catch (e) {
        showToast('Não foi possível copiar automaticamente. Selecione e copie manualmente.', 'error');
    }
    document.body.removeChild(ta);
}

// Calcula uma pontuação simples de força com base no comprimento e variedade de caracteres
function calculateStrengthScore(pwd, length) {
    let score = 0;
    if (!pwd) return score;

    // comprimento
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;

    // tipos
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    return score; // max aproximado 7
}

function updateStrengthUI(pwd, length) {
    const score = calculateStrengthScore(pwd, length);
    const fill = el('strength-bar-fill');
    const text = el('strength-text');
    if (!fill || !text) return;

    // Mapear score para percent e rótulo
    let percent = Math.min(100, Math.round((score / 7) * 100));
    let label = 'Fraca';
    let color = '#e55353';
    if (score >= 5) { label = 'Forte'; color = 'var(--success)'; }
    else if (score >= 3) { label = 'Média'; color = '#f0ad4e'; }

    fill.style.width = percent + '%';
    fill.style.background = color;
    text.textContent = label + ' (' + percent + '%)';
}

// Atalhos de teclado úteis
window.addEventListener('keydown', (e) => {
    // Ctrl+G para gerar
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        showPassword();
    }
});

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    const gen = el('generate');
    const cp = el('copy');
    if (gen) gen.addEventListener('click', showPassword);
    if (cp) cp.addEventListener('click', copyPassword);

    // Atualiza força quando o usuário altera opções
    const inputs = ['length','lowercase','uppercase','numbers','symbols'];
    inputs.forEach(id => {
        const node = el(id);
        if (!node) return;
        node.addEventListener('change', () => {
            const lengthInput = el('length');
            const length = lengthInput ? (parseInt(lengthInput.value, 10) || 12) : 12;
            const sample = generatePassword(Math.min(length, 12)); // gera amostra curta para avaliar
            updateStrengthUI(sample, length);
        });
    });

    // Gera senha inicial
    showPassword();
});
