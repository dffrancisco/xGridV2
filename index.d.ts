export interface ixGridCreate {
    getAx: Function;
    source: (field: object | Array<any>) => void;
    sourceAdd: (field: object | Array<any>) => void;
    /**
     * @param obj objeto com campos | (field, value) para alterar célula na linha selecionada
     */
    dataSource: (obj?: any | Object) => any;
    data: () => any[];
    getColumns: () => object;
    focus: (indexLine?: number) => void;
    disable: (callback?: Function) => void;
    enable: (callback?: Function) => void;
    clear: (callback?: Function) => void;
    load: (field?: string, callback?: Function) => void;
    closeLoad: (callback?: Function) => void;
    getIndex: () => number;
    deleteLine: (indexLine?: number) => void;
    /**
     * @param order default BOTTOM
     */
    insertLine: (object: Object, order?: 'BOTTOM' | 'TOP', call?: Function) => void;
    sumDataField: (field: string) => number;
    getCompare: any;
    getElementSideBySideJson: (toUpperCase?: boolean, empty?: boolean) => Record<string, any>;
    getDiffTwoJson: (toUpperCase?: boolean, empty?: boolean) => { old: object; new: object; diff: boolean };
    clearElementSideBySide: () => void;
    queryOpen: (field: object, call?: Function) => void;
    querySourceAdd: (field: object | Array<any>) => void;
    getDuplicityAll: () => Promise<any>;
    /**
     * @param time default 5000
     */
    showMessageDuplicity: (text: string, time?: number) => void;
    focusField: (nameField?: string) => void;
    filter: (filter: string | Record<string, any>, call?: (count: number) => void) => void;
    disableBtnsSaveCancel: (disabled?: boolean) => void;
    disableFieldsSideBySide: (disabled?: boolean) => void;
    print: (headHTML?: string) => void;
    setKeySelectUp: (codeKey: number | number[]) => void;
    setKeySelectDown: (codeKey: number | number[]) => void;
    setFilterBegin: (filterBegin: boolean) => void;
    setFilterConditional: (conditional: 'OR' | 'AND') => void;
}

/** Opções passadas a `new xGridV2.create({ ... })` — no código use `setfocus` (README legado: setFocus) */
export interface ixGrid {
    el: string;
    source?: Array<Record<string, any>>;
    height?: string | number;
    width?: string | number;
    heightLine?: number;
    count?: boolean;
    title?: boolean;
    /** Índice da linha inicial com foco (1-based na API, convertido internamente) */
    setfocus?: number;
    multiSelect?: boolean;
    /** Escapa HTML nas células. Default true. Use false para compatibilidade legada. */
    escapeCells?: boolean;
    /** Cabeçalho passado a print(headHTML) é HTML confiável. Default false. */
    printHeadHtml?: boolean;
    /** Atraso em ms antes de executar filter() (ex.: 300). Default false = imediato. */
    filterDelay?: number | false;
    theme?: 'x-grayV2' | 'x-darkV2' | 'x-opacite' | 'x-whiteV2' | 'x-blue';
    columns?: {
        [titleColumn: string]: {
            dataField?: string;
            width?: string | number;
            class?: string;
            left?: boolean;
            center?: boolean;
            right?: boolean;
            /** true = compare/render pode retornar HTML (ex.: img). Default false. */
            html?: boolean;
            render?: (value: any) => any;
            compare?: string;
            style?: string;
        };
    };
    compare?: {
        [name: string]: (row: any) => any;
    };
    onSelectLine?: (dataField: any) => void;
    enter?: (dataField: any) => void;
    click?: (dataField: any) => void;
    dblClick?: (dataField: any) => void;
    complete?: () => void;
    onKeyDown?: {
        [key: string | number]: (dataField: any, e: KeyboardEvent) => void;
    };
    keySelectUp?: number | number[];
    keySelectDown?: number | number[];
    filter?: {
        filterBegin?: boolean;
        fields?: string[] | false;
        conditional?: 'OR' | 'AND';
        fieldByField?: {
            conditional?: 'OR' | 'AND';
        };
        concat?: {
            fields?: Array<string | number>;
            conditional?: 'OR' | 'AND';
        };
    };
    query?: {
        endScroll?: number;
        execute?: (rs: { offset: number; page: number; param: object }) => void | Promise<void>;
    };
    sideBySide?: {
        el: string;
        tabToEnter?: boolean;
        vModel?: Record<string, any>;
        vRefs?: Record<string, { $el: HTMLElement }>;
        render?: Record<string, (value: any) => any>;
        compare?: Record<string, string>;
        duplicity?: {
            dataField: string[];
            execute?: (rs: { field: string; value: string; text: string }) => void | Promise<any>;
        };
        frame?: {
            el: string;
            class?: string;
            style?: string;
            buttons?: {
                [nameButton: string]: {
                    html: string;
                    state?: 'save' | 'insert' | 'update' | 'select' | 'cancel' | 'delete';
                    class?: string;
                    style?: string;
                    id?: string;
                    preLoad?: string;
                    click: (dataField?: any, e?: Event) => void | false | Promise<any>;
                };
            };
        };
    };
}

export interface ixGridState {
    save: string;
    insert: string;
    update: string;
    select: string;
    cancel: string;
    delete: string;
}

export interface ixGridV2Module {
    create: new (param: ixGrid) => ixGridCreate;
    state: ixGridState;
    version: number;
    setNotFound: (value: string) => void;
    getNotFound: () => string;
    getPrintHead: () => string;
    setPrintHead: (html: string) => void;
    setTheme: (theme: string) => void;
    changeTheme: (theme: string) => void;
}

declare const xGridV2: ixGridV2Module;

export default xGridV2;

/** Uso global no browser após incluir dist/xGridV2.js */
declare global {
    const xGridV2: ixGridV2Module;
}
