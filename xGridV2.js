// export default (function() {

// eslint-disable-next-line no-unused-vars
let xGrid = (function () {
    const version = 2.0;
    const state = { save: 'save', insert: 'insert', update: 'update', select: 'select', cancel: 'cancel', delete: 'delete' }
    // configuração de icones global
    // ajaxSetup global

    function create(param) {

        let argDefault = {
            source: [],
            filter: {
                filterBegin: false,
                concat: {
                    fields: false,
                    condicional: 'OR'
                },
                fieldByField: {
                    condicional: 'OR'
                }
            },
            columns: {},
            onSelectLine: false,
            compare: {},
            heightLine: '',
            height: 'default',
            width: 'default',
            setfocus: false,
            render: {},
            theme: 'x-gray',
            query: {
                endScroll: 0.1,
                execute: false,
            },
            afterSearch: false,
            sideBySide: false,
            click: false,
            dblClick: false,
            enter: false,
            duplicity: false,
            frame: false,
            complete: false,
            keyDown: false,
            count: false,
            title: true
        };

        param = Object.assign({}, param);
        if (param.filter) {
            param.filter.concat = Object.assign(argDefault.filter.concat, param.filter.concat)
            param.filter.fieldByField = Object.assign(argDefault.filter.fieldByField, param.filter.fieldByField)
        }
        if (param.query)
            param.query = Object.assign(argDefault.query, param.query)

        let ax = {
            arg: {},
            idElment: '',
            element: '',
            gridTitle: '',
            gridContent: '',
            elementSideBySide: {},
            widthAll: 0,
            columnsAutoCreate: [],
            tabindex: 0,
            sourceSelect: false,
            indexSelect: false,
            gridDisable: null,
            divLoad: null,
            controlScroll: true,
            paramQuery: false,
            buttonsFrame: {},
            messageDuplicity: '',
            listTabForEnter: false,
            constructor() {
                this.element = document.querySelector(this.arg.el)
                this.idElment = this.element.id
                this.element.classList.add("xGrid-main");
                this.element.classList.add(this.arg.theme);

                if (this.arg.height != 'default') this.element.style.height = `${this.arg.height}px`
                if (this.arg.width != 'default') this.element.style.width = `${this.arg.width}px`

                this.element.appendChild(this.createTitle())
                this.element.appendChild(this.setContent())

                this.onKeyDown();

                // lê os fields do html
                if (this.arg.sideBySide) {
                    if (this.arg.sideBySide.el) {
                        this.listTabForEnter =
                            [...document.querySelector(this.arg.sideBySide.el)
                                .querySelectorAll('input[name], select[name],button[name],textarea[name]')]
                        let qto = 0;
                        document.querySelectorAll(this.arg.sideBySide.el).forEach((el) => {
                            el.querySelectorAll('[name]').forEach((field) => {

                                if (this.elementSideBySide[field.name]) {
                                    if (qto == 0) {
                                        let _el_ = this.elementSideBySide[field.name]
                                        this.elementSideBySide[field.name] = []
                                        this.elementSideBySide[field.name].type = 'radio'
                                        this.elementSideBySide[field.name][qto] = _el_
                                    }
                                    qto++
                                    this.elementSideBySide[field.name][qto] = field
                                } else {
                                    this.elementSideBySide[field.name] = field
                                    this.tabToEnter(field.name)
                                }
                            })
                        })

                    }
                    this.frame()
                    this.duplicity()
                    this.tabToEnter()
                }

            },
            createTitle() {
                this.gridTitle = document.createElement("div")
                this.gridTitle.classList.add('xGrid-title')
                this.gridTitle.classList.add('xGrid-row')

                if (Object.keys(this.arg.columns).length > 0) {
                    this.checkWidthColuns();
                    this.widthAll = Object.values(this.arg.columns).reduce((total, b) => total + parseInt(b.width), 0);
                    this.setColumnsTitle(this.arg.columns);
                } else
                    this.setColumnsTitle({ '-': { dataField: '-', width: '100%' } });

                return this.gridTitle;
            },
            setTitle(source) {

                if (Object.keys(this.arg.columns).length == 0) {
                    while (this.gridTitle.firstChild) this.gridTitle.removeChild(this.gridTitle.firstChild)
                    this.columnsAutoCreate = [];
                    this.autoColumns(source)
                    this.widthAll = Object.values(this.columnsAutoCreate).reduce((total, b) => total + parseInt(b.width), 0);
                    this.setColumnsTitle(this.columnsAutoCreate);
                }

            },
            setColumnsTitle(columns) {

                for (let id in columns) {
                    let col = document.createElement("div")
                    let span = document.createElement("span")
                    let label = document.createElement("label")

                    col.setAttribute('name', columns[id].dataField)
                    col.classList.add('xGrid-col')
                    col.style.width = columns[id].width

                    if (columns[id].dataField == '_count_')
                        span.innerHTML = '&nbsp;'
                    else
                        if (this.widthAll > 100)
                            span.innerHTML = columns[id].dataField
                        else
                            span.innerHTML = id

                    col.appendChild(span)
                    col.appendChild(label)

                    this.gridTitle.appendChild(col)
                }

                if (this.widthAll > 100) {
                    this.gridTitle.lastChild.style.paddingRight = '3px'
                }
                // this.gridTitle.appendChild(templete)

            },
            setContent() {
                this.gridContent = document.createElement("div")
                this.gridContent.classList.add('xGrid-content')

                // this.gridContent.style.width = `${this.widthAll}%`

                if (this.arg.query.execute)
                    this.gridContent.addEventListener('scroll', this.eventListenerScroll)


                return this.gridContent;
            },
            source(source) {

                this.onEvent.removeEventListenerAndRemoveElement()

                // while (this.gridContent.firstChild) this.gridContent.removeChild(this.gridContent.firstChild)

                this.arg.source = [];

                this.setTitle(source)

                this.tabindex = 0
                this.gridContent.scrollTop = 0

                this.createLine(source)

                if (this.widthAll > 100) {
                    this.element.style.overflow = 'auto'
                    this.element.scrollTop = 0
                    this.element.scrollLeft = 0
                    this.gridContent.style.overflowY = 'unset';
                    this.gridContent.style.width = `${this.widthAll}%`
                    this.gridTitle.style.width = `${this.widthAll}%`
                    if (this.arg.query.execute)
                        this.element.addEventListener('scroll', this.eventListenerScroll)
                }

                if (this.arg.setfocus)
                    this.focus(this.arg.setfocus - 1)

            },
            checkWidthColuns() {
                let valPercente = 0;
                let qtoColumn = 0;

                if (this.arg.count) {
                    let obj = {};
                    obj['_count_'] = { dataField: '_count_', width: '4%' }
                    this.arg.columns = Object.assign(obj, this.arg.columns)
                }


                for (let i in this.arg.columns) {
                    // if (this.arg.count)
                    //     this.arg.columns.push({ dataField: '_count_', width: '4%' });

                    // console.log(this.arg.columns);
                    if (this.arg.columns[i].width == undefined)
                        qtoColumn++;
                    let wd = this.arg.columns[i].width != undefined ? parseInt(this.arg.columns[i].width) : 0;
                    valPercente += parseInt(wd);
                    // console.log(valPercente);
                }

                if (qtoColumn != 0)
                    for (let i in this.arg.columns) {
                        if (this.arg.columns[i].width == undefined)
                            // this.arg.columns[i].width = ((100 - valPercente) / qtoColumn).toFixed(2) + '%';
                            this.arg.columns[i].width = ((100 - valPercente) / qtoColumn) + '%';
                    }

            },
            autoColumns(source) {
                if (this.arg.count)
                    this.columnsAutoCreate.push({ dataField: '_count_', width: '4%' });

                if (source[0] != undefined) {

                    let wid = 100 / Object.keys(source[0]).length;
                    for (let i in source[0]) {
                        // console.log(source[0][i].length);
                        // wid = source[0][i].length > 4 ? source[0][i].length : 4
                        wid = wid < 15 ? 20 : wid
                        // this.arg.columns.push({ dataField: i, width: wid + '%' });
                        this.columnsAutoCreate.push({ dataField: i, width: wid + '%' });
                    }
                }

            },
            setCompare(col, source) {

                if (col.compare) {
                    let _source = { ...source }
                    // source.value = source[col.dataField]
                    _source.value = _source[col.dataField]
                    let value = this.arg.compare[col.compare](_source)

                    if (value == undefined)
                        return false
                    else
                        return this.arg.compare[col.compare](_source)
                }
            },
            createLine(source, order) {
                if (order == undefined)
                    order = 'BOTTOM'

                let col;
                if (Object.keys(this.arg.columns).length > 0)
                    col = this.arg.columns
                else
                    col = this.columnsAutoCreate

                for (let i in source) {
                    this.arg.source[this.tabindex] = source[i]
                    let div = document.createElement('div');
                    div.classList.add('xGrid-row')
                    div.setAttribute('tabindex', this.tabindex)
                    this.tabindex++

                    if (this.arg.count)
                        source[i]._count_ = this.tabindex

                    for (let c in col) {

                        // if (this.arg.count) {
                        //     console.log(col[c].dataField);

                        let value = source[i][col[c].dataField]

                        let compare = this.setCompare(col[c], source[i])
                        if (compare) value = compare

                        if (col[c].render != undefined)
                            value = col[c].render(value)

                        if (col[c].style != undefined) {
                            value = '<span style="width:100%; ' + col[c].style + ' ">' + value + '</span>'
                        }

                        if (this.arg.count)
                            if (col[c].dataField == '_count_')
                                value = '<span style="width:100%;text-align: center;opacity: 0.5; ">' + value + '</span>'


                        let divCol = document.createElement('div');
                        divCol.classList.add('xGrid-col')
                        divCol.style.width = col[c].width
                        divCol.setAttribute('name', col[c].dataField)
                        divCol.innerHTML = value
                        div.appendChild(divCol)
                    }


                    if (order.toUpperCase() == 'TOP')
                        this.gridContent.insertBefore(div, this.gridContent.firstChild)

                    if (order.toUpperCase() == 'BOTTOM')
                        this.gridContent.appendChild(div)

                    this.onEvent.setEventListener(div)

                    if (this.arg.count)
                        delete source[i]._count_

                }

                if (Object.keys(source).length > 0)
                    this.controlScroll = true
                this.closeLoad()
                this.loadMore(false)
            },
            onEvent: {
                _control: false,
                divDisable: [],
                keyup(e) {
                    if (e.keyCode == 17) {
                        ax.onEvent._control = false
                    }
                },
                keydown(e) {
                    // seta para cima
                    if (e.keyCode == 38) {

                        if (ax.widthAll <= 100) {
                            if (ax.gridContent.scrollTop > 0)
                                ax.gridContent.scrollTop = ax.gridContent.scrollTop - 1;
                        } else {
                            let scroll = ax.element.scrollTop
                            if (scroll > 0) {
                                let rowHeight = e.target.offsetHeight
                                ax.element.scrollTop = (scroll - rowHeight);
                            }
                        }


                        if (e.target.previousSibling)
                            e.target.previousSibling.focus()


                        if (e.preventDefault)
                            e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                    }

                    // seta para baixo
                    if (e.keyCode == 40) {

                        if (ax.widthAll <= 100)
                            ax.gridContent.scrollTop = ax.gridContent.scrollTop + 1
                        else
                            ax.element.scrollTop = ax.element.scrollTop + 1


                        if (e.target.nextSibling)
                            e.target.nextSibling.focus()

                        e.preventDefault();
                        e.stopPropagation();
                    }

                    // page up
                    if (e.keyCode == 33) {

                        try {
                            e.target.previousSibling.previousSibling.previousSibling.previousSibling.focus()
                        } catch (error) { return }

                        if (e.preventDefault)
                            e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                    }

                    // page Down
                    if (e.keyCode == 34) {
                        try {
                            e.target.nextSibling.nextSibling.nextSibling.nextSibling.focus()
                        } catch (error) { return }

                        if (e.preventDefault)
                            e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                    }

                    // key and last line
                    if (e.keyCode == 35) {
                        ax.gridContent.querySelector('[tabindex="' + (ax.tabindex - 1) + '"]').focus()
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    // key home 1ª line
                    if (e.keyCode == 36) {
                        ax.gridContent.querySelector('[tabindex="0"]').focus()
                        e.preventDefault();
                        e.stopPropagation();
                    }


                    // control pressionado
                    if (e.keyCode == 17)
                        ax.onEvent._control = true

                },
                focusin(e) {

                    // let el = ax.element.querySelector('.xGrid-content');
                    let el = ax.gridContent
                    let select = el.querySelectorAll('.xGrid-Selected')
                    let selectOut = el.querySelectorAll('.xGrid-SelectedFocusOut')

                    if (ax.onEvent._control == false) {
                        select.forEach(r => r.classList.remove("xGrid-Selected"))
                        selectOut.forEach(r => r.classList.remove("xGrid-SelectedFocusOut"))

                        ax.indexSelect = e.currentTarget.getAttribute('tabindex')
                        ax.sourceSelect = ax.arg.source[ax.indexSelect]



                        ax.setElementSideBySide()


                    } else {
                        ax.indexSelect = e.currentTarget.getAttribute('tabindex')
                        ax.sourceSelect[ax.indexSelect] = ax.arg.source[ax.indexSelect]
                    }

                    e.target.classList.add('xGrid-Selected')

                    ax.onSelectLine()



                },
                focusout() {
                    if (ax.onEvent._control == false) {
                        let select = ax.gridContent.querySelectorAll('.xGrid-Selected')
                        select.forEach((r) => {
                            r.classList.remove("xGrid-Selected");
                            r.classList.add("xGrid-SelectedFocusOut");
                        })
                    }
                },
                setEventListener(el) {
                    el.addEventListener('focusin', this.focusin)
                    el.addEventListener('keydown', this.keydown)
                    el.addEventListener('focusout', this.focusout)
                    el.addEventListener('keyup', this.keyup)
                },
                removeEventListenerAndRemoveElement() {
                    Object.values(ax.gridContent.querySelectorAll('.xGrid-row')).map((el) => {
                        el.removeEventListener('focusin', this.focusin)
                        el.removeEventListener('keydown', this.keydown)
                        el.removeEventListener('focusout', this.focusout)
                        el.removeEventListener('keyup', this.keyup)
                        el.remove()
                    })
                },
                removeEventListener() {
                    Object.values(ax.gridContent.querySelectorAll('.xGrid-row')).map((el) => {
                        el.removeEventListener('focusin', this.focusin)
                        el.removeEventListener('keydown', this.keydown)
                        el.removeEventListener('focusout', this.focusout)
                        el.removeEventListener('keyup', this.keyup)
                    })
                },
                removeEventListenerElement(el) {
                    el.removeEventListener('focusin', this.focusin)
                    el.removeEventListener('keydown', this.keydown)
                    el.removeEventListener('focusout', this.focusout)
                    el.removeEventListener('keyup', this.keyup)
                },
                setEventListenerAll() {
                    this.removeEventListener();
                    Object.values(ax.gridContent.querySelectorAll('.xGrid-row')).map((el) => {
                        el.addEventListener('focusin', this.focusin)
                        el.addEventListener('keydown', this.keydown)
                        el.addEventListener('focusout', this.focusout)
                        el.addEventListener('keyup', this.keyup)
                    })
                }
            },
            dataSource(field, value) {

                if (typeof field == 'string') {

                    if (field != undefined && value != undefined) {
                        let cell = this.gridContent.querySelector('[tabindex="' + this.indexSelect + '"]').querySelector('[name="' + field + '"]')
                        let columns = Object.keys(this.arg.columns).length > 0 ? this.arg.columns : this.columnsAutoCreate;

                        for (let i in columns) {
                            if (columns[i].dataField == field) {
                                ax.sourceSelect[field] = value;

                                let compare = this.setCompare(columns[i], ax.sourceSelect)
                                if (compare) value = compare


                                if (columns[i].render != undefined)
                                    value = columns[i].render(value)

                                if (columns[i].style != undefined)
                                    value = '<span style="width:100%; ' + columns[i].style + ' ">' + value + '</span>'
                            }
                        }

                        cell.innerHTML = value
                    }
                    /*get o valor do field solicitado*/
                    if (field != undefined && value == undefined)
                        return ax.sourceSelect[field];
                }

                if (typeof field == 'object') {
                    let columns = Object.keys(this.arg.columns).length > 0 ? this.arg.columns : this.columnsAutoCreate;
                    let linha = this.gridContent.querySelector('[tabindex="' + this.indexSelect + '"]')
                    let cell;
                    for (let x in field) {
                        let _field = x
                        let _value = field[x]
                        cell = linha.querySelector('[name="' + _field + '"]')

                        for (let i in columns) {
                            if (columns[i].dataField == _field) {
                                ax.sourceSelect[_field] = _value;

                                let compare = this.setCompare(columns[i], ax.sourceSelect)
                                if (compare) _value = compare


                                if (columns[i].render != undefined)
                                    _value = columns[i].render(_value)

                                if (columns[i].style != undefined)
                                    _value = '<span style="width:100%; ' + columns[i].style + ' ">' + _value + '</span>'
                            }
                        }
                        cell.innerHTML = _value
                    }
                }

                return ax.sourceSelect

            },
            eventListenerScroll(e) {
                let target = e.currentTarget
                let h = target.scrollHeight - (target.scrollHeight * ax.arg.query.endScroll)

                if (ax.controlScroll)
                    if ((target.offsetHeight + target.scrollTop >= h)) {
                        ax.loadMore()
                        ax.arg.query.execute(ax.tabindex, ax.paramQuery)
                        ax.controlScroll = false
                    }
            },
            focus(numLine) {

                if (this.gridDisable)
                    return false

                if (Object.keys(this.sourceSelect).length > 0) {
                    if (numLine == undefined) {
                        this.gridContent.querySelector('[tabindex="' + this.indexSelect + '"]').focus()

                    } else {
                        this.gridContent.querySelector('[tabindex="' + numLine + '"]').focus()
                    }
                } else {
                    if (numLine == undefined) {
                        this.gridContent.querySelector('[tabindex="0"]').focus()
                    } else {
                        this.gridContent.querySelector('[tabindex="' + numLine + '"]').focus()
                    }

                }

            },
            disable(call) {
                this.onEvent.divDisable[0] = document.createElement('div')
                this.onEvent.divDisable[1] = document.createElement('div')
                this.onEvent.divDisable[0].classList.add('xGrid-disable')
                this.onEvent.divDisable[1].classList.add('xGrid-disable')

                this.onEvent.removeEventListener()

                if (this.widthAll > 100)
                    this.element.style.overflow = 'hidden'

                this.gridContent.insertBefore(this.onEvent.divDisable[0], this.gridContent.firstChild)
                this.gridTitle.insertBefore(this.onEvent.divDisable[1], this.gridTitle.firstChild)

                this.gridDisable = true

                call && call()

            },
            enable(call) {
                this.onEvent.divDisable[0].remove()
                this.onEvent.divDisable[1].remove()

                this.onEvent.setEventListenerAll()

                if (this.widthAll > 100)
                    this.element.style.overflow = 'auto'

                this.gridDisable = false

                call && call()
            },
            clear(call) {
                this.onEvent.removeEventListenerAndRemoveElement()
                call && call()
            },
            loadMore(open = true) {
                if (open) {
                    this.divLoadMore = document.createElement('div')
                    this.divLoadMore.classList.add('xGrid-load-search')
                    this.divLoadMore.innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw fa-lg"></i> Carregando'

                    this.element.insertBefore(this.divLoadMore, this.element.firstChild)
                } else {
                    if (this.divLoadMore)
                        this.divLoadMore.remove()
                }
            },
            load(text, call) {

                if (text == undefined)
                    text = 'Carregando . . .';
                this.divLoad = document.createElement('div')
                this.divLoad.classList.add('xGrid-load')
                this.divLoad.innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw fa-lg"></i> ' + text;

                this.element.insertBefore(this.divLoad, this.element.firstChild)

                call && call()
            },
            closeLoad(call) {
                if (this.divLoad)
                    this.divLoad.remove()
                call && call()
            },
            getIndex() {
                return this.indexSelect
            },
            deleteLine(index) {

                // forDeleteSearch = true;

                index = index == undefined ? this.indexSelect : index;

                if (!index)
                    return

                let del = this.arg.source[index]
                delete this.arg.source[index];
                //  let indexOld = index;
                let target = this.gridContent.querySelector('[tabindex="' + index + '"]');

                if (target.nextSibling)
                    target.nextSibling.focus()
                else
                    if (target.previousSibling)
                        target.previousSibling.focus()

                this.onEvent.removeEventListenerElement(target)

                target.classList.add('xGrid-deleteLine');
                setTimeout(() => {
                    target.remove()
                }, 500);


                // if (element.find('.xGrid-content .xGrid-row').length == 1)
                //     if (arg.sideBySide != false)
                //         clearDataSource();

                return del;
            },
            insertLine(param, order, call) {

                if (param[0] == undefined) {
                    param = [param];
                }

                this.createLine(param, order)

                this.focus(this.tabindex - 1)

                if (call != undefined)
                    call();

                return param;

            },
            sumDataField(dataField) {
                return Object.values(this.arg.source).reduce((sum, field) => sum + parseFloat(field[dataField]), 0);
            },
            onKeyDown() {
                this.element.addEventListener('keydown', (e) => {

                    let ctrlKey = e.ctrlKey ? "ctrl+" : "";
                    let shiftKey = e.shiftKey ? "shift+" : "";
                    let altKey = e.altKey ? "alt+" : "";
                    let key = ctrlKey + shiftKey + altKey + e.keyCode;


                    if (key == 13) {
                        if (this.arg.enter)
                            this.arg.enter(this.sourceSelect, e)
                    }

                    if (this.arg.onKeyDown[key])
                        this.arg.onKeyDown[key](this.sourceSelect, e)

                    e.preventDefault();
                    e.stopPropagation();

                })
            },
            onSelectLine() {
                if (this.arg.onSelectLine)
                    this.arg.onSelectLine(this.sourceSelect)
            },
            getElementSideBySideJson(toUpperCase = false, empty = true) {
                let date_regex = /^[0-3]?[0-9][- /.][0-3]?[0-9][- /.](?:[0-9]{2})?[0-9]{2}$/;
                let json = {}
                for (let name in this.elementSideBySide) {

                    let value = this.elementSideBySide[name].value
                    let type = this.elementSideBySide[name].type

                    if (type == undefined)
                        if (this.elementSideBySide[name].localName == 'img')
                            continue

                    if (type == '')
                        if (this.elementSideBySide[name].localName == 'a')
                            continue

                    if (empty)
                        if (value == '')
                            continue

                    /*se o conteudo da variavel for numerico ele retorna false*/
                    /*para igular os valores no edit esta 1,00 no sourceSelect esta 1.00*/
                    if (!isNaN(parseFloat(value))) {
                        if (value.indexOf(",") != -1)
                            value = value.replace(/\./g, '').replace(/\\,/g, '.');
                    }

                    /*tratamento para data*/
                    if (date_regex.test(value))
                        value = value.split(/[- /.]/).reverse().join('-').trim()

                    if (typeof value == 'string')
                        value = toUpperCase ? value.toUpperCase().trim() : value.trim();


                    if (type == 'checkbox')
                        value = this.elementSideBySide[name].checked ? '1' : '0';

                    if (type == 'radio') {
                        for (let r in this.elementSideBySide[name]) {
                            if (this.elementSideBySide[name][r].checked) {
                                value = this.elementSideBySide[name][r].value
                                break
                            }
                        }
                    }

                    json[name] = value

                }

                return json
            },
            setElementSideBySide() {
                if (this.arg.sideBySide) {

                    if (this.arg.sideBySide.el)
                        for (let i in this.elementSideBySide) {

                            let value = this.sourceSelect[i];
                            let type = this.elementSideBySide[i].type

                            if (this.arg.sideBySide.render)
                                if (this.arg.render[this.arg.sideBySide.render[i]])
                                    try {
                                        value = this.arg.sideBySide.render[i](value)
                                    } catch (error) { throw 'erro see your function render' }

                            if (this.arg.sideBySide.compare)
                                if (this.arg.compare[this.arg.sideBySide.compare[i]]) {
                                    try {
                                        let _source = { ...this.sourceSelect }
                                        _source.value = value
                                        value = this.arg.compare[this.arg.sideBySide.compare[i]](_source)
                                    } catch (error) { throw 'erro see your function compare' }
                                }

                            switch (type) {
                                case undefined:
                                    var typeEle = this.elementSideBySide[i].localName;
                                    if (typeEle == 'img') {
                                        this.elementSideBySide[i].src = value
                                    } else
                                        this.elementSideBySide[i].innerHTML = value
                                    break;
                                case 'text':
                                case 'password':
                                case 'textarea':
                                case 'number':
                                case 'tel':
                                case 'date':
                                case 'time':
                                case 'range':
                                case 'hidden':
                                    ax.elementSideBySide[i].value = value
                                    break;
                                case 'radio':
                                    // eslint-disable-next-line no-case-declarations
                                    let radios = { ...ax.elementSideBySide[i] }
                                    delete radios.type
                                    for (let r in radios) {
                                        if (radios[r].value == value) {
                                            radios[r].checked = true
                                            break
                                        }
                                    }
                                    break;
                                case 'select-one':
                                    ax.elementSideBySide[i].value = value
                                    break;
                                case 'checkbox':
                                    ax.elementSideBySide[i].checked = (value == '1' ? true : false)
                                    break;
                                case '': { //href
                                    ax.elementSideBySide[i].href = value
                                    ax.elementSideBySide[i].innerHTML = value
                                    break;
                                }
                            }
                        }
                }
            },
            getDifTwoJson(toUpperCase = false, empty = true) {
                let diff = { old: {}, new: {} }
                let fieldsSideBySide = this.getElementSideBySideJson(toUpperCase, empty)

                for (let i in fieldsSideBySide) {
                    if (fieldsSideBySide[i] != this.sourceSelect[i]) {
                        diff.old[i] = this.sourceSelect[i]
                        diff.new[i] = fieldsSideBySide[i];
                    }
                }

                return diff

            },
            clearElementSideBySide() {
                if (this.arg.sideBySide)

                    if (this.arg.sideBySide.el)
                        for (let i in this.elementSideBySide) {
                            let type = this.elementSideBySide[i].type

                            switch (type) {
                                case undefined:
                                    var typeEle = this.elementSideBySide[i].localName;
                                    if (typeEle == 'img') {
                                        this.elementSideBySide[i].src = ''
                                    } else
                                        this.elementSideBySide[i].innerHTML = ''
                                    break;
                                case 'text':
                                case 'password':
                                case 'textarea':
                                case 'number':
                                case 'tel':
                                case 'date':
                                case 'time':
                                case 'range':
                                case 'hidden':
                                    ax.elementSideBySide[i].value = ''
                                    break;
                                case 'radio':
                                    // eslint-disable-next-line no-case-declarations
                                    let radios = { ...ax.elementSideBySide[i] }
                                    delete radios.type
                                    for (let r in radios) {
                                        radios[r].checked = false
                                        break
                                    }
                                    break;
                                case 'select-one':
                                    ax.elementSideBySide[i].value = ''
                                    break;
                                case 'checkbox':
                                    ax.elementSideBySide[i].checked = false
                                    break;
                                case '':
                                    { //href
                                        ax.elementSideBySide[i].href = ''
                                        ax.elementSideBySide[i].innerHTML = ''
                                        break;
                                    }
                            }
                        }
            },
            querySourceAdd(source) {
                if (this.tabindex == 0)
                    this.source(source)
                else
                    this.createLine(source)
            },
            queryOpen(param) {
                this.paramQuery = param
                this.tabindex = 0
                this.arg.query.execute(this.tabindex, param)
            },
            frame() {
                let btns = {}
                if (this.arg.sideBySide.frame)
                    if (this.arg.sideBySide.frame.el) {
                        let elFrame = document.querySelector(this.arg.sideBySide.frame.el);

                        if (this.arg.sideBySide.frame.style)
                            elFrame.style = this.arg.sideBySide.frame.style

                        if (this.arg.sideBySide.frame.class)
                            this.arg.sideBySide.frame.class.split(' ').forEach((e) => elFrame.classList.add(e))


                        for (let key in this.arg.sideBySide.frame) {
                            if (key == 'el' || key == 'style' || key == 'class')
                                continue

                            let btn = document.createElement('button');
                            btn.classList.add('btn-Frame', 'btn-Frame-blue')
                            btn.innerHTML = this.arg.sideBySide.frame[key].html

                            if (this.arg.sideBySide.frame[key].click)
                                btn.addEventListener('click', (e) => {
                                    if (this.arg.sideBySide.frame[key].click(this.sourceSelect, e) == false)
                                        return false

                                    if (e.target.getAttribute('state') != state.delete)
                                        for (let keyBtns in btns) {
                                            this.buttonsFrame[keyBtns].disabled = !this.buttonsFrame[keyBtns].disabled
                                        }
                                })


                            if (this.arg.sideBySide.frame[key].class)
                                this.arg.sideBySide.frame[key].class.split(' ').forEach((e) => btn.classList.add(e))

                            if (this.arg.sideBySide.frame[key].style)
                                btn.style = this.arg.sideBySide.frame[key].style


                            if (this.arg.sideBySide.frame[key].state) {
                                btn.setAttribute('state', this.arg.sideBySide.frame[key].state)
                                btns[key] = this.arg.sideBySide.frame[key].state
                                if (this.arg.sideBySide.frame[key].state == 'save')
                                    this.listTabForEnter.push(btn)
                                // this.buttonsFrame['_save_'] = btn
                            }

                            if (this.arg.sideBySide.frame[key].state == state.save || this.arg.sideBySide.frame[key].state == state.cancel)
                                btn.disabled = true


                            this.buttonsFrame[key] = btn



                            elFrame.appendChild(btn)

                        }
                    }
            },
            duplicity() {
                this.messageDuplicity = document.createElement('div');

                this.arg.sideBySide.duplicity.dataField.forEach((field) => {
                    // this.elementSideBySide[field].style.color = 'red'

                    this.elementSideBySide[field].addEventListener('focusout', (e) => {
                        if (this.sourceSelect[field] != e.target.value) {
                            this.arg.sideBySide.duplicity.execute({
                                field: field,
                                value: e.target.value,
                                text: this.elementSideBySide[field].previousSibling.previousElementSibling.innerText
                            })

                            // msg.innerHTML = this.elementSideBySide[field].previousSibling.previousElementSibling.innerText +
                            //     (this.arg.sideBySide.duplicity.textMessage != undefined ? this.arg.sideBySide.duplicity.textMessage : ' já está em uso.')

                            // if (this.arg.sideBySide.duplicity.showMessage == true || this.arg.sideBySide.duplicity.showMessage == undefined) {
                            //     msg.classList.add('treme', 'pnMensDuplicity')
                            //     setTimeout(() => msg.remove(), 5000)
                            //     document.body.appendChild(msg)
                            // }
                        }
                    })
                })
            },
            showMessageDuplicity(text) {
                this.messageDuplicity.innerHTML = text
                this.messageDuplicity.classList.add('treme', 'pnMensDuplicity')
                setTimeout(() => this.messageDuplicity.remove(), 5000)
                document.body.appendChild(this.messageDuplicity)
            },
            getDuplicityAll() {
                let that = true;

                for (let i in this.arg.sideBySide.duplicity.dataField) {
                    let field = this.arg.sideBySide.duplicity.dataField[i]

                    if (this.sourceSelect[field] != this.elementSideBySide[field].value) {
                        that = this.arg.sideBySide.duplicity.execute({
                            field: field,
                            value: this.elementSideBySide[field].value.trim(),
                            text: this.elementSideBySide[field].previousSibling.previousElementSibling.innerText
                        })
                        return false
                    }
                }
                return that
            },
            tabToEnter(name) {

                if (this.arg.sideBySide.tabToEnter != false) {
                    if (this.elementSideBySide[name] == undefined) return false

                    this.elementSideBySide[name].addEventListener('keydown', function (e) {
                        if (e.keyCode == 13) {

                            let next = ax.listTabForEnter[ax.listTabForEnter.indexOf(this) + 1]
                            if (next != undefined)
                                if (next.tagName == 'BUTTON' || next.tagName == 'SELECT')
                                    next.focus()
                                else
                                    next.select()

                            e.preventDefault()
                            e.stopPropagation()
                        }
                    })
                }
            },
            focusField(name) {
                if (name == undefined) {
                    if (this.listTabForEnter[0].tagName == 'BUTTON' || this.listTabForEnter[0].tagName == 'SELECT')
                        this.listTabForEnter[0].focus()
                    else
                        this.listTabForEnter[0].select()
                } else
                    if (this.elementSideBySide[name].tagName == 'BUTTON' || this.elementSideBySide[name].tagName == 'SELECT')
                        this.elementSideBySide[name].focus()
                    else
                        this.elementSideBySide[name].select()
            },
            disabledBtnsSalvarCancelar(disabled = true) {
                for (let i in this.buttonsFrame)
                    if (this.buttonsFrame[i].getAttribute('state') == 'save') {
                        if (this.buttonsFrame[i].disabled == disabled)
                            for (let i in this.buttonsFrame)
                                if (this.buttonsFrame[i].getAttribute('state'))
                                    this.buttonsFrame[i].disabled = !this.buttonsFrame[i].disabled
                        break
                    }
            },
        }

        ax.arg = Object.assign(argDefault, param);

        ax.constructor();

        this.getAx = () => ax;

        this.version = () => version

        this.source = (source) => ax.source(source)

        this.sourceAdd = (source) => ax.createLine(source)

        this.dataSource = (field, value) => ax.dataSource(field, value)

        this.data = () => ax.arg.source

        this.getColumns = () => Object.keys(ax.arg.columns).length > 0 ? ax.arg.columns : ax.columnsAutoCreate

        this.focus = (numLine) => ax.focus(numLine)

        this.disable = (call) => ax.disable(call)

        this.enable = (call) => ax.enable(call)

        this.clear = (call) => ax.clear(call)

        this.load = (call) => ax.load(call)

        this.closeLoad = (call) => ax.closeLoad(call)

        this.getIndex = () => ax.getIndex()

        this.deleteLine = (index) => ax.deleteLine(index)

        this.insertLine = (param, order, call) => ax.insertLine(param, order, call)

        this.sumDataField = (dataField) => ax.sumDataField(dataField)

        this.compare = ax.arg.compare

        this.getElementSideBySideJson = (toUpperCase, empty) => ax.getElementSideBySideJson(toUpperCase, empty)

        this.getDifTwoJson = (toUpperCase) => ax.getDifTwoJson(toUpperCase)

        this.clearElementSideBySide = () => ax.clearElementSideBySide()

        this.queryOpen = (param) => ax.queryOpen(param)

        this.querySourceAdd = (source) => ax.querySourceAdd(source)

        this.getDuplicityAll = () => ax.getDuplicityAll()

        this.showMessageDuplicity = (text) => ax.showMessageDuplicity(text)

        this.focusField = (name) => ax.focusField(name)

        this.disabledBtnsSalvarCancelar = (disabled) => ax.disabledBtnsSalvarCancelar(disabled)

    }


    return {
        create: create,
        state: state
    }
})();