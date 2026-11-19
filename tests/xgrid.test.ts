import { describe, it, expect, beforeEach } from 'vitest'
import xGridV2 from '../index.ts'
import pkg from '../package.json'

beforeEach(() => {
  document.body.innerHTML = '<div id="grid"></div>'
})

describe('xGridV2', () => {
  it('escapeCells escapa HTML nas células', () => {
    const grid = new xGridV2.create({
      el: '#grid',
      columns: { Nome: { dataField: 'nome' } },
    })
    grid.source([{ nome: '<script>alert(1)</script>' }])
    const cell = document.querySelector('#grid .xGridV2-content [name="nome"]')
    expect(cell?.innerHTML).toContain('&lt;script&gt;')
    expect(cell?.innerHTML).not.toMatch(/<script>/i)
  })

  it('html: true permite HTML na coluna', () => {
    const grid = new xGridV2.create({
      el: '#grid',
      columns: {
        Img: { dataField: 'img', html: true, compare: 'img', center: true },
      },
      compare: {
        img: () => '<img src="x" alt="t">',
      },
    })
    grid.source([{ img: '1' }])
    const cell = document.querySelector('#grid .xGridV2-content [name="img"]')
    expect(cell?.querySelector('img')).toBeTruthy()
  })

  it('filter callback retorna quantidade correta', () => {
    const grid = new xGridV2.create({
      el: '#grid',
      columns: { N: { dataField: 'n' } },
    })
    grid.source([{ n: 'alpha' }, { n: 'beta' }, { n: 'alphabet' }])
    let count = -1
    grid.filter('alpha', (c) => { count = c })
    expect(count).toBe(2)
  })

  it('focus com grid vazio não lança erro', () => {
    const grid = new xGridV2.create({ el: '#grid' })
    expect(() => grid.focus()).not.toThrow()
    expect(grid.focus()).toBe(false)
  })

  it('querySourceAdd vazio encerra paginação', () => {
    const grid = new xGridV2.create({
      el: '#grid',
      query: {
        execute: () => {},
      },
    })
    grid.queryOpen({})
    grid.querySourceAdd([])
    const ax = grid.getAx()
    expect(ax.queryComplete).toBe(true)
    expect(ax.controlScroll).toBe(false)
  })

  describe('filtro mantém a lista completa', () => {
    const rows = () => document.querySelectorAll('#grid .xGridV2-content .xGridV2-row').length
    const novo = () => {
      const grid = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
      grid.source([{ n: 'alpha' }, { n: 'beta' }, { n: 'alphabet' }])
      return grid
    }

    it('um filtro depois do outro busca na lista completa', () => {
      const grid = novo()
      grid.filter('alpha', () => {})
      let count = -1
      grid.filter('beta', (c) => { count = c })
      expect(count).toBe(1)
    })

    it('limpar o filtro volta todas as linhas, sem duplicar', () => {
      const grid = novo()
      grid.filter('alpha', () => {})
      grid.filter('', () => {})
      expect(grid.data().map((r) => r.n)).toEqual(['alpha', 'beta', 'alphabet'])
      expect(rows()).toBe(3)
    })

    it('data() durante o filtro devolve só as linhas exibidas', () => {
      const grid = novo()
      grid.filter('alpha', () => {})
      expect(grid.data().map((r) => r.n)).toEqual(['alpha', 'alphabet'])
    })

    it('filtro sem resultado esvazia data()', () => {
      const grid = novo()
      grid.filter('zzz', () => {})
      expect(grid.data()).toEqual([])
    })

    it('ordenar um resultado filtrado não perde a lista completa', () => {
      const grid = novo()
      grid.filter('alpha', () => {})
      ;(document.querySelector('#grid .xGridV2-title .xGridV2-col') as HTMLElement).click()
      let count = -1
      grid.filter('beta', (c) => { count = c })
      expect(count).toBe(1)
    })

    it('grid preenchida só com sourceAdd também filtra', () => {
      const grid = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
      grid.sourceAdd([{ n: 'alpha' }, { n: 'beta' }])
      let count = -1
      grid.filter('beta', (c) => { count = c })
      expect(count).toBe(1)
    })

    it('querySourceAdd vazio não deixa o filtro achar dados antigos', () => {
      const grid = new xGridV2.create({
        el: '#grid',
        columns: { N: { dataField: 'n' } },
        query: { execute: () => {} },
      })
      grid.source([{ n: 'alpha' }])
      grid.queryOpen({})
      grid.querySourceAdd([])
      let count = -1
      grid.filter('alpha', (c) => { count = c })
      expect(count).toBe(0)
    })
  })

  it('source() novo cancela a renderização em blocos do anterior (>200 linhas)', async () => {
    const grid = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
    grid.source(Array.from({ length: 450 }, (_, i) => ({ n: 'a' + i })))
    grid.source([{ n: 'x' }, { n: 'y' }])
    await new Promise((r) => setTimeout(r, 300))
    expect(document.querySelectorAll('#grid .xGridV2-content .xGridV2-row').length).toBe(2)
    expect(grid.data().map((r) => r.n)).toEqual(['x', 'y'])
    expect(document.querySelector('#grid .xGridV2-load')).toBeNull()
  })

  it('title: false faz o conteúdo ocupar a altura toda', () => {
    new xGridV2.create({ el: '#grid', title: false, columns: { N: { dataField: 'n' } } })
    const content = document.querySelector('#grid .xGridV2-content') as HTMLElement
    expect(content.style.height).toBe('100%')
  })

  describe('seleção de texto no duplo clique', () => {
    const mousedown = (target: Element, detail: number) => {
      const ev = new MouseEvent('mousedown', { bubbles: true, cancelable: true, detail })
      target.dispatchEvent(ev)
      return ev
    }

    it('impede a seleção de palavra no duplo clique sobre a célula', () => {
      const grid = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
      grid.source([{ n: 'alpha' }])
      const cell = document.querySelector('#grid .xGridV2-content [name="n"]')!
      expect(mousedown(cell, 2).defaultPrevented).toBe(true)
      expect(mousedown(cell, 3).defaultPrevented).toBe(true)
    })

    it('clique simples continua permitindo seleção por arraste', () => {
      const grid = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
      grid.source([{ n: 'alpha' }])
      const cell = document.querySelector('#grid .xGridV2-content [name="n"]')!
      expect(mousedown(cell, 1).defaultPrevented).toBe(false)
    })

    it('não interfere no duplo clique dentro de input na célula', () => {
      const grid = new xGridV2.create({
        el: '#grid',
        columns: { N: { dataField: 'n', html: true } },
      })
      grid.source([{ n: '<input value="abc">' }])
      const input = document.querySelector('#grid .xGridV2-content input')!
      expect(mousedown(input, 2).defaultPrevented).toBe(false)
    })
  })

  describe('deleteLine', () => {
    const criar = () => {
      const grid = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
      grid.source([{ n: 'a' }, { n: 'b' }, { n: 'c' }])
      return grid
    }
    const linha = (i: number) => document.querySelector(`#grid .xGridV2-content [tabindex="${i}"]`)

    it('deleteLine(0) remove a primeira linha e devolve os dados dela', () => {
      const grid = criar()
      expect(grid.deleteLine(0)).toEqual({ n: 'a' })
      expect(linha(0)!.classList.contains('xGridV2-deleteLine')).toBe(true)
      expect(grid.data().filter(Boolean)).toEqual([{ n: 'b' }, { n: 'c' }])
    })

    it('sem índice remove a linha selecionada, mesmo sendo a primeira', () => {
      const grid = criar()
      grid.focus(0)
      expect(grid.deleteLine()).toEqual({ n: 'a' })
      expect(grid.data().filter(Boolean)).toEqual([{ n: 'b' }, { n: 'c' }])
    })

    it('continua removendo as outras linhas', () => {
      const grid = criar()
      expect(grid.deleteLine(1)).toEqual({ n: 'b' })
    })

    it('com a grid vazia ou índice inexistente não lança erro', () => {
      const vazia = new xGridV2.create({ el: '#grid', columns: { N: { dataField: 'n' } } })
      expect(() => vazia.deleteLine()).not.toThrow()
      const grid = criar()
      expect(() => grid.deleteLine(99)).not.toThrow()
      expect(grid.data().filter(Boolean)).toHaveLength(3)
    })
  })

  it('version é a versão do package.json', () => {
    expect(xGridV2.version).toBe(pkg.version)
  })
})
