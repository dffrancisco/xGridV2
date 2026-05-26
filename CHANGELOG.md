# Changelog

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
