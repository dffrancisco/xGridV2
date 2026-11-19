# Changelog

## [2.4.1] — 2026-11-19

### Corrigido

- `deleteLine(0)` remove a primeira linha (antes não fazia nada e devolvia `undefined`).
- `deleteLine` com a grid vazia ou com um índice que não existe não lança mais erro.
- `xGridV2.version` devolve a versão do pacote (estava fixo em `2.3`). Agora é texto, por exemplo `"2.4.1"`.

### Mudou

- `npm version` gera a pasta `xGridV2/` e a inclui no commit da versão. `npm run build` virou atalho para `npm version patch`.

## [2.4.0] — 2026-11-19

### Adicionado

- Pacote npm `xgridv2`: `import xGridV2 from "xgridv2"`, CSS em `xgridv2/index.css` e tipos incluídos. O build gera `xGridV2/xGridV2.mjs` (módulo ES) e `xGridV2/xGridV2.js` (script com a global `xGridV2`).
- Tema `x-Vyzo`, que usa as variáveis `--matdash-*` e `--v-theme-primary` da página, com padrões para o modo claro e o escuro (`.dark`).
- `x-bocatan`, `x-modern-dark` e `x-Vyzo` nos tipos de `theme`.

### Corrigido

- O texto das células pode ser selecionado e copiado. O duplo clique não seleciona mais a palavra, exceto em campos editáveis.
- Filtro: filtrar de novo ou apagar o filtro volta a mostrar todas as linhas. A lista filtrada não substitui mais a completa, inclusive ao ordenar um resultado filtrado.
- `source()` chamados em sequência em listas grandes não misturam linhas da renderização anterior.
- `title: false` faz as linhas ocuparem toda a altura da grid.
- `changeTheme` também remove os temas `x-bocatan`, `x-modern-dark` e `x-Vyzo` antes de aplicar o novo.

### Mudou

- Os arquivos gerados ficam em `xGridV2/` (não mais em `dist/`).
- Os temas `x-whiteV2`, `x-bocatan` e `x-modern-dark` deixam de fixar a fonte Roboto e usam a da página.

## [2.3.0] — 2026

### Adicionado

- Build com `npm run build` → `dist/xGridV2.js`, `dist/xGridV2.css`, `dist/index.d.ts`
- TypeScript (`index.ts`) com checagem `npm run typecheck`
- Segurança: `escapeCells` (default `true`), `columns[].html` para HTML intencional
- `filterDelay` para debounce do filtro
- Paginação `query`: flag `queryComplete` — para ao receber `querySourceAdd([])`
- Suporte Vue 3: `vModel` como objeto reativo, `vRefs` com template refs
- Testes automatizados (`npm test`)

### Corrigido

- Regressões `vModel` / `vRefs` após migração TS
- Filtro: callback com contagem correta (`length`)
- `changeTheme`, resize de colunas, foco com grid vazio
- Scroll infinito: não reconsulta servidor após fim dos dados
- `html: true` com `center: true` renderiza imagens corretamente

### Breaking changes

- **`escapeCells` default `true`**: dados com HTML nas células precisam de `columns[].html: true` ou `escapeCells: false`
- Artefatos em **`dist/`** (não mais `xGridV2.js` na raiz)
- Propriedade oficial: **`setfocus`** (não `setFocus`)

### Legado

- Código JS anterior em `old/xGridV2.js`
