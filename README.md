# Gerador de Senhas

Projeto simples: gerador de senhas no navegador.

## Descrição
Pequena página web que permite gerar senhas fortes com opções (comprimento, incluir maiúsculas/minúsculas/números/símbolos, excluir caracteres semelhantes). Inclui funcionalidade de copiar para a área de transferência, limpar e mostrar/ocultar a senha.

## Arquivos
- `index.html` — interface do usuário (formulário e botões).
- `stylo.css` — estilos (se presente).
- `script.js` — código JavaScript legível que implementa a geração, exibição, cópia e limpeza da senha.
- `script.min.js` — versão minificada do `script.js` (para produção).

## Uso
1. Abra `index.html` no navegador (duplo-clique no arquivo) ou rode um servidor local.

   Exemplo usando Python (caso tenha Python instalado):

   ```powershell
   cd "c:\Users\diego\Documents\PROJETOS\projetc"
   python -m http.server 8000
   ```

   Em seguida abra `http://localhost:8000/Gerador%20de%20Senhas/index.html` no navegador.

2. Ajuste as opções do formulário (comprimento, tipos de caracteres etc.) e clique em "Gerar Senha".
3. Use "Mostrar senha" para ver o texto em claro, "Copiar Senha" para copiar e "Limpar" para apagar.

## Notas técnicas
- `script.js` usa `crypto.getRandomValues` quando disponível para gerar índices aleatórios mais seguros; há fallback para `Math.random()` quando não disponível.
- A versão `script.min.js` é apenas uma minificação do `script.js` e pode ser usada no ambiente de produção para reduzir o tamanho transferido.

## GitHub
O repositório remoto configurado é: `https://github.com/DiegoBarros86/projetc.git` (push confirmado localmente). Faça commits em branches para alterações maiores e abra PRs para revisão, se desejar.

## Próximos passos sugeridos
- Melhorar feedback UX (substituir `alert()` por um pequeno toast não bloqueante).
- Adicionar testes automatizados (ex.: unit tests para a função `gerarSenha`).
- Configurar CI (GitHub Actions) para lint e testes.

---
Licença: MIT (adapte conforme necessário)
