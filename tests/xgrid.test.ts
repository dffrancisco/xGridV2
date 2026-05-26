import { describe, it, expect, beforeEach } from 'vitest'
import xGridV2 from '../index.ts'

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
})
