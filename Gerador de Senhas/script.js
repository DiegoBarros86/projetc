
// script.
(function () {
  'use strict';

  function gerarSenha(comprimento, incluirMaiusculas, incluirMinusculas, incluirNumeros, incluirSimbolos, excluirSimilares) {
    comprimento = Number(comprimento) || 0;
    if (comprimento <= 0) {
      alert('O comprimento da senha deve ser maior que zero.');
      return '';
    }

    const MAIUS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const MINUS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMS = '0123456789';
    const SYMS = '!@#$%^&*()-_=+[]{}|;:,.<>?/`~';
    const SIMILARES = 'il1Lo0O';

    let caracteres = '';
    if (incluirMaiusculas) caracteres += MAIUS;
    if (incluirMinusculas) caracteres += MINUS;
    if (incluirNumeros) caracteres += NUMS;
    if (incluirSimbolos) caracteres += SYMS;

    if (!caracteres) {
      alert('Selecione pelo menos um tipo de caractere.');
      return '';
    }

    if (excluirSimilares) {
      const escaped = SIMILARES.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      caracteres = caracteres.replace(new RegExp('[' + escaped + ']', 'g'), '');
    }

    if (caracteres.length === 0) {
      alert('Nenhum caractere disponível para gerar a senha.');
      return '';
    }

    const getRandomIndex = (max) => {
      if (window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return arr[0] % max;
      }
      return Math.floor(Math.random() * max);
    };

    let senha = '';
    for (let i = 0; i < comprimento; i++) {
      const idx = getRandomIndex(caracteres.length);
      senha += caracteres.charAt(idx);
    }
    return senha;
  }

  function setPasswordDisplay(el, text) {
    if (!el) return;
    const tag = el.tagName ? el.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') el.value = text;
    else el.textContent = text;
  }
  function getPasswordDisplayText(el) {
    if (!el) return '';
    const tag = el.tagName ? el.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return el.value || '';
    return el.textContent || '';
  }

  const form = document.getElementById('passwordForm');
  const passwordDisplay = document.getElementById('passwordDisplay');
  const copyButton = document.getElementById('copyButton');
  const clearButton = document.getElementById('clearButton');
  const togglePassword = document.getElementById('togglePassword');

  // Conecta checkbox de mostrar/ocultar senha ao campo de exibição
  if (togglePassword && passwordDisplay) {
    togglePassword.addEventListener('change', function () {
      const tag = passwordDisplay.tagName ? passwordDisplay.tagName.toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        try {
          passwordDisplay.type = togglePassword.checked ? 'text' : 'password';
        } catch (e) {
          // alguns elementos não suportam .type (por ex. elementos não-input), ignorar
        }
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const comprimento = parseInt(document.getElementById('length').value, 10) || 0;
      const incluirMaiusculas = !!document.getElementById('includeUppercase').checked;
      const incluirMinusculas = !!document.getElementById('includeLowercase').checked;
      const incluirNumeros = !!document.getElementById('includeNumbers').checked;
      const incluirSimbolos = !!document.getElementById('includeSpecialChars')?.checked || !!document.getElementById('includeSymbols')?.checked;
      const excluirSimilares = !!document.getElementById('excludeSimilarChars').checked;

      const senhaGerada = gerarSenha(comprimento, incluirMaiusculas, incluirMinusculas, incluirNumeros, incluirSimbolos, excluirSimilares);
      setPasswordDisplay(passwordDisplay, senhaGerada);
    });
  }

  if (copyButton) {
    copyButton.addEventListener('click', function () {
      const texto = getPasswordDisplayText(passwordDisplay);
      if (!texto) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () {
          alert('Senha copiada para a área de transferência!');
        }).catch(function (err) {
          alert('Erro ao copiar a senha: ' + err);
        });
      } else {
        try {
          const tag = passwordDisplay?.tagName ? passwordDisplay.tagName.toUpperCase() : '';
          if (tag === 'INPUT' || tag === 'TEXTAREA') {
            passwordDisplay.select();
            document.execCommand('copy');
            alert('Senha copiada para a área de transferência!');
          } else {
            const ta = document.createElement('textarea');
            ta.value = texto;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Senha copiada para a área de transferência!');
          }
        } catch (e) {
          alert('Não foi possível copiar a senha automaticamente.');
        }
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      setPasswordDisplay(passwordDisplay, '');
    });
  }
})();





