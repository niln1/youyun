// Type definitions for Kendo UI

declare module kendo {
    function bind(selector: string, viewModel: any, namespace?: any): void;
    function bind(element: JQuery, viewModel: any, namespace?: any): void;
    function bind(element: Element, viewModel: any, namespace?: any): void;
    function culture(value: string): void;
    function culture(): {
        name: string;
        calendar: {
            AM: string[];
            PM: string[];
            days: {
                names: string[];
                namesAbbr: string[];
                namesShort: string[];
                firstDay: number;
            };
            months: {
                names: string[];
                namesAbbr: string[];
            };
            patterns: {
                D: string;
                F: string;
                G: string;
                M: string;
                T: string;
                Y: string;
                d: string;
                g: string;
                m: string;
                s: string;
                t: string;
                u: string;
                y: string;
            };
            twoDigitYearMax: number;
        };
        calendars: {
            standard: {
                AM: string[];
                PM: string[];
                days: {
                    names: string[];
                    namesAbbr: string[];
                    namesShort: string[];
                    firstDay: number;
                };
                months: {
                    names: string[];
                    namesAbbr: string[];
                };
                patterns: {
                    D: string;
                    F: string;
                    G: string;
                    M: string;
                    T: string;
                    Y: string;
                    d: string;
                    g: string;
                    m: string;
                    s: string;
                    t: string;
                    u: string;
                    y: string;
                };
                twoDigitYearMax: number;
            };
        };
        numberFormat: {
            currency: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
            decimals: number;
            groupSize: number[];
            pattern: string[];
            percent: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
        };
    };

    var cultures: {[culture:string] : {
        name?: string;
        calendar?: {
            AM: string[];
            PM: string[];
            days: {
                names: string[];
                namesAbbr: string[];
                namesShort: string[];
                firstDay: number;
            };
            months: {
                names: string[];
                namesAbbr: string[];
            };
            patterns: {
                D: string;
                F: string;
                G: string;
                M: string;
                T: string;
                Y: string;
                d: string;
                g: string;
                m: string;
                s: string;
                t: string;
                u: string;
                y: string;
            };
            twoDigitYearMax: number;
        };
        calendars?: {
            standard: {
                AM: string[];
                PM: string[];
                days: {
                    names: string[];
                    namesAbbr: string[];
                    namesShort: string[];
                    firstDay: number;
                };
                months: {
                    names: string[];
                    namesAbbr: string[];
                };
                patterns: {
                    D: string;
                    F: string;
                    G: string;
                    M: string;
                    T: string;
                    Y: string;
                    d: string;
                    g: string;
                    m: string;
                    s: string;
                    t: string;
                    u: string;
                    y: string;
                };
                twoDigitYearMax: number;
            };
        };
        numberFormat?: {
            currency: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
            decimals: number;
            groupSize: number[];
            pattern: string[];
            percent: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
        };
    }};

    function destroy(selector: string): void;
    function destroy(element: Element): void;
    function destroy(element: JQuery): void;
    function format(format: string, ...values: any[]): string;

    function fx(selector: string): effects.Element;
    function fx(element: Element): effects.Element;
    function fx(element: JQuery): effects.Element;

    function htmlEncode(value: string): string;
    function init(selector: string, ...namespaces: any[]): void;
    function init(element: JQuery, ...namespaces: any[]): void;
    function init(element: Element, ...namespaces: any[]): void;
    function observable(data: any): kendo.data.ObservableObject;
    function observableHierarchy(array: any[]): kendo.data.ObservableArray;
    function parseDate(value: any, format?: string, culture?: string): Date;
    function parseFloat(value: any, culture?: string): number;
    function parseInt(value: any, culture?: string): number;
    function render(template:(data: any) => string, data: any[]): string;
    function resize(selector: string): void;
    function resize(element: JQuery): void;
    function resize(element: Element): void;
    function stringify(value: Object): string;
    function template(template: string, options?: TemplateOptions): (data: any) => string;
    function touchScroller(selector: string): void;
    function touchScroller(element: Element): void;
    function touchScroller(element: JQuery): void;
    function toString(value: number, format: string): string;
    function toString(value: Date, format: string): string;
    function unbind(selector: string): void;
    function unbind(element: JQuery): void;
    function unbind(element: Element): void;
    function guid(): string;
    function widgetInstance(element: JQuery, suite: typeof kendo.ui): kendo.ui.Widget;
    function widgetInstance(element: JQuery, suite: typeof kendo.dataviz.ui): kendo.ui.Widget;


    var ns: string;

    var keys: {
        INSERT: number;
        DELETE: number;
        BACKSPACE: number;
        TAB: number;
        ENTER: number;
        ESC: number;
        LEFT: number;
        UP: number;
        RIGHT: number;
        DOWN: number;
        END: number;
        HOME: number;
        SPACEBAR: number;
        PAGEUP: number;
        PAGEDOWN: number;
        F2: number;
        F10: number;
        F12: number;
    }

    var support: {
        touch: boolean;
        pointers: boolean;
        scrollbar(): number;
        hasHW3D: boolean;
        hasNativeScrolling: boolean;
        devicePixelRatio: number;
        placeHolder: boolean;
        zoomLevel: number;
        mobileOS: {
            device: string;
            tablet: any;
            browser: string;
            name: string;
            majorVersion: string;
            minorVersion: string;
            flatVersion: number;
            appMode: boolean;
        };
        browser: {
            msie: boolean;
            webkit: boolean;
            safari: boolean;
            opera: boolean;
            version: string;
        };
    }

    interface TemplateOptions {
        paramName?: string;
        useWithBlock?: boolean;
    }

    class Class {
        static fn: Class;
        static extend(prototype: Object): Class;
    }

    class Observable extends Class {
        static fn: Observable;
        static extend(prototype: Object): Observable;

        bind(eventName: string, handler: Function): Observable;
        one(eventName: string, handler: Function): Observable;
        trigger(eventName: string, e?: any): boolean;
        unbind(eventName: string, handler?: any): Observable;
    }

    interface ViewOptions {
        tagName?: string;
        wrap?: boolean;
        model?: Object;
        init?: (e: ViewEvent) => void;
        show?: (e: ViewEvent) => void;
        hide?: (e: ViewEvent) => void;
    }

    interface ViewEvent {
        sender: View;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    class View extends Observable {
        constructor(element: Element, options?: ViewOptions);
        constructor(element: string, options?: ViewOptions);
        init(element: Element, options?: ViewOptions): void;
        init(element: string, options?: ViewOptions): void;
        render(container?: any): JQuery;
        destroy(): void;
        element: JQuery;
        content: any;
        tagName: string;
        model: Object;
    }

    class Layout extends View {
        showIn(selector: string, view: View): void;
        regions: { [selector: string]: View; };
    }

    class History extends Observable {
        start(options: Object): void;
        stop(): void;
        current: string;
        root: string;
        change(callback: Function): void;
        navigate(location: string, silent?: boolean): void;
    }

    var history: History;

    interface RouterOptions {
        init?: (e: RouterEvent) => void;
        routeMissing?: (e: RouterEvent) => void;
        change?: (e: RouterEvent) => void;
    }

    interface RouterEvent {
        sender: Router;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
        url: string;
    }

    class Route extends Class {
        route: RegExp;
        callback(url: string): void;
        worksWith(url: string): void;
    }

    class Router extends Observable {
        constructor(options?: RouterOptions);
        init(options?: RouterOptions): void;
        start(): void;
        destroy(): void;
        route(route: string, callback: Function): void;
        navigate(location: string, silent?: boolean): void;
        routes: Route[];
    }

}

declare module kendo.effects {
    interface Element {
        expand(direction: string): effects.Expand;
        expandHorizontal(): effects.Expand;
        expandVertical(): effects.Expand;
        fade(direction: string): effects.Fade;
        fadeIn(): effects.Fade;
        fadeOut(): effects.Fade;
        flip(axis: string, face: JQuery, back: JQuery): effects.Flip;
        flipHorizontal(face: JQuery, back: JQuery): effects.Flip;
        flipVertical(face: JQuery, back: JQuery): effects.Flip;
        pageturn(axis: string, face: JQuery, back: JQuery): effects.PageTurn;
        pageturnHorizontal(face: JQuery, back: JQuery): effects.PageTurn;
        pageturnVertical(face: JQuery, back: JQuery): effects.PageTurn;
        slideIn(direction: string): effects.SlideIn;
        slideInDown(): effects.SlideIn;
        slideInLeft(): effects.SlideIn;
        slideInRight(): effects.SlideIn;
        slideInUp(): effects.SlideIn;
        tile(direction: string, previous: JQuery): effects.Tile;
        tileDown(previous: JQuery): effects.Tile;
        tileLeft(previous: JQuery): effects.Tile;
        tileRight(previous: JQuery): effects.Tile;
        tileUp(previous: JQuery): effects.Tile;
        transfer(target: JQuery): effects.Transfer;
        zoom(direction: string): effects.Zoom;
        zoomIn(): effects.Zoom;
        zoomOut(): effects.Zoom;
    }

    interface Effect {
        play(): JQueryPromise<any>;
        reverse(): JQueryPromise<any>;
        duration(value: number): Effect;
        add(effect: Effect): Effect;
        stop(): Effect;
    }

    interface Expand extends Effect {
        duration(value: number): Expand;
        direction(value: string): Expand;
        stop(): Expand;
        add(effect: Effect): Expand;
    }

    interface Fade extends Effect {
        duration(value: number): Fade;
        direction(value: string): Fade;
        stop(): Fade;
        add(effect: Effect): Fade;
        startValue(value: number): Fade;
        endValue(value: number): Fade;
    }

    interface Flip extends Effect {
        duration(value: number): Flip;
        direction(value: string): Flip;
        stop(): Flip;
        add(effect: Effect): Flip;
    }

    interface PageTurn extends Effect {
        duration(value: number): PageTurn;
        direction(value: string): PageTurn;
        stop(): PageTurn;
        add(effect: Effect): PageTurn;
    }

    interface SlideIn extends Effect {
        duration(value: number): SlideIn;
        direction(value: string): SlideIn;
        stop(): SlideIn;
        add(effect: Effect): SlideIn;
    }

    interface Tile extends Effect {
        duration(value: number): Tile;
        direction(value: string): Tile;
        stop(): Tile;
        add(effect: Effect): Tile;
    }

    interface Transfer extends Effect {
        duration(value: number): Transfer;
        stop(): Transfer;
        add(effect: Effect): Transfer;
    }

    interface Zoom extends Effect {
        duration(value: number): Zoom;
        direction(value: string): Zoom;
        stop(): Zoom;
        add(effect: Effect): Zoom;
        startValue(value: number): Zoom;
        endValue(value: number): Zoom;
    }
}

declare module kendo.data {
    interface ObservableObjectEvent {
        sender?: ObservableObject;
        field?: string;
    }

    interface ObservableObjectSetEvent extends ObservableObjectEvent {
        value?: any;
        preventDefault?: Function;
    }


    class Binding extends Observable {
        source: any;
        parents: any[];
        path: string;
        dependencies: { [path: string]: boolean; };
        observable: boolean;
        constructor(parents: any[], path: string);
        change(e: Object): void;
        start(source: kendo.Observable): void;
        stop(source: kendo.Observable): void;
        get (): any;
        set (value: any): void;
        destroy(): void;
    }

    class EventBinding extends Binding {
        get (): void;
    }

    class TemplateBinding extends Binding {
        constructor(source: kendo.Observable, path: string, template: Function);
        render(value: Object): string;
    }

    module binders { }

    interface Bindings {
        [key: string]: Binding;
    }

    class Binder extends Class {
        static fn: Binder;
        static extend(prototype: Object): Binder;

        element: any;
        bindings: Bindings;
        constructor(element: any, bindings: Bindings, options?: BinderOptions);
        init(element: any, bindings: Bindings, options?: BinderOptions): void;
        bind(binding: Binding, attribute: string): void;
        destroy(): void;
        refresh(): void;
        refresh(attribute: string): void;
        options: BinderOptions;
    }

    interface BinderOptions {
    }

    class ObservableObject extends Observable{
        constructor(value?: any);
        init(value?: any): void;
        get(name: string): any;
        parent(): ObservableObject;
        set(name: string, value: any): void;
        toJSON(): Object;
        uid: string;
    }

    class Model extends ObservableObject {
        idField: string;
        _defaultId: any;
        fields: DataSourceSchemaModelFields;
        defaults: {
            [field: string]: any;
        };
        constructor(data?: any);
        init(data?: any):void;
        dirty: boolean;
        id: any;
        editable(field: string): boolean;
        isNew(): boolean;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof Model;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof Model;
    }

    class SchedulerEvent extends Model {
        constructor(data?: any);
        init(data?: any): void;

        description: string;
        end: Date;
        endTimezone: string;
        isAllDay: boolean;
        id: any;
        start: Date;
        startTimezone: string;
        recurrenceId: any;
        recurrenceRule: string;
        recurrenceException: string;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof SchedulerEvent;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof SchedulerEvent;
    }

    class Node extends Model {
        children: HierarchicalDataSource;

        append(model: any): void;
        level(): number;
        load(id: any): void;
        loaded(value: boolean): void;
        loaded(): boolean;
        parentNode(): Node;
    }

    class SchedulerDataSource extends DataSource {
        add(model: Object): kendo.data.SchedulerEvent;
        add(model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        at(index: number): kendo.data.SchedulerEvent;
        cancelChanges(model?: kendo.data.SchedulerEvent): void;
        get(id: any): kendo.data.SchedulerEvent;
        getByUid(uid: string): kendo.data.SchedulerEvent;
        indexOf(value: kendo.data.SchedulerEvent): number;
        insert(index: number, model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        insert(index: number, model: Object): kendo.data.SchedulerEvent;
        remove(model: kendo.data.SchedulerEvent): void;
    }

    class HierarchicalDataSource extends DataSource {
        constructor(options?: HierarchicalDataSourceOptions);
        init(options?: HierarchicalDataSourceOptions): void;
    }

    interface HierarchicalDataSourceOptions extends DataSourceOptions {
        schema?: HierarchicalDataSourceSchema;
    }


    interface HierarchicalDataSourceSchema extends DataSourceSchemaWithOptionsModel {
        model?: HierarchicalDataSourceSchemaModel;
    }

    interface HierarchicalDataSourceSchemaModel extends DataSourceSchemaModel {
        hasChildren?: any;
        children?: any;
    }

    interface DataSourceTransport {
        parameterMap?(data: DataSourceTransportParameterMapData, type: string): any;
    }

    interface DataSourceParameterMapDataAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceParameterMapDataGroup {
        aggregate?: DataSourceParameterMapDataAggregate[];
        field?: string;
        dir?: string;
    }

    interface DataSourceParameterMapDataFilter {
        field?: string;
        filters?: DataSourceParameterMapDataFilter[];
        logic?: string;
        operator?: string;
        value?: any;
    }

    interface DataSourceParameterMapDataSort {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportParameterMapData {
        aggregate?: DataSourceParameterMapDataAggregate[];
        group?: DataSourceParameterMapDataGroup[];
        filter?: DataSourceParameterMapDataFilter;
        models?: Model[];
        page?: number;
        pageSize?: number;
        skip?: number;
        sort?: DataSourceParameterMapDataSort[];
        take?: number;
    }

    interface DataSourceSchema {
        model?: any;
    }

    interface DataSourceSchemaWithOptionsModel extends DataSourceSchema {
        model?: DataSourceSchemaModel;
    }

    interface DataSourceSchemaWithConstructorModel extends DataSourceSchema {
        model?:  typeof Model;
    }

    interface DataSourceSchemaModel {
        id?: string;
        fields?: any;
    }

    interface DataSourceSchemaModelWithFieldsArray extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelField[];
    }

    interface DataSourceSchemaModelWithFieldsObject extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelFields;
    }

    interface DataSourceSchemaModelFields {
        [index: string]: DataSourceSchemaModelField;
    }

    interface DataSourceSchemaModelField {
        field?: string;
        from?: string;
        defaultValue?: any;
        editable?: boolean;
        nullable?: boolean;
        parse?: Function;
        type?: string;
        validation?: DataSourceSchemaModelFieldValidation;
    }

    interface DataSourceSchemaModelFieldValidation {
        required?: boolean;
        min?: any;
        max?: any;
    }

    class ObservableArray extends Observable {
        constructor(array?: any[]);
        init(array?: any[]): void;
        length: number;
        join(separator: string): string;
        parent(): ObservableObject;
        pop(): ObservableObject;
        push(...items: any[]): number;
        slice(begin: number, end?: number): any[];
        splice(start: number): any[];
        splice(start: number, deleteCount: number, ...items: any[]): any[];
        shift(): any;
        toJSON(): any[];
        unshift(...items: any[]): number;
        wrapAll(source: Object, target: Object): any;
        wrap(object: Object, parent: Object): any;
        indexOf(item: any): number;
        forEach(callback: (item: Object, index: number, source: ObservableArray) => void ): void;
        map(callback: (item: Object, index: number, source: ObservableArray) => any): any[];
        filter(callback: (item: Object, index: number, source: ObservableArray) => boolean): any[];
        find(callback: (item: Object, index: number, source: ObservableArray) => boolean): any;
        every(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        some(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        remove(item: Object): void;
    }

    interface ObservableArrayEvent {
        field?: string;
        action?: string;
        index?: number;
        items?: kendo.data.Model[];
    }

    class DataSource extends Observable{
        constructor(options?: DataSourceOptions);
        init(options?: DataSourceOptions): void;
        static create(options?: DataSourceOptions): DataSource;
        options: DataSourceOptions;
        add(model: Object): kendo.data.Model;
        add(model: kendo.data.Model): kendo.data.Model;
        aggregate(val?: any): any;
        aggregates(): any;
        at(index: number): kendo.data.ObservableObject;
        cancelChanges(model?: kendo.data.Model): void;
        data(): kendo.data.ObservableArray;
        data(value: any): void;
        fetch(callback?: Function): void;
        filter(filters: DataSourceFilterItem): void;
        filter(filters: DataSourceFilterItem[]): void;
        filter(filters: DataSourceFilters): void;
        filter(): DataSourceFilters;
        get(id: any): kendo.data.Model;
        getByUid(uid: string): kendo.data.Model;
        group(groups: any): void;
        group(): any;
        hasChanges(): boolean;
        indexOf(value: kendo.data.ObservableObject): number;
        insert(index: number, model: kendo.data.Model): kendo.data.Model;
        insert(index: number, model: Object): kendo.data.Model;
        page(): number;
        page(page: number): void;
        pageSize(): number;
        pageSize(size: number): void;
        query(options?: any): void;
        read(data?: any): void;
        remove(model: kendo.data.Model): void;
        sort(sort: DataSourceSortItem): void;
        sort(sort: DataSourceSortItem[]): void;
        sort(): DataSourceSortItem[];
        sync(): void;
        total(): number;
        totalPages(): number;
        view(): kendo.data.ObservableArray;
    }

    interface DataSourceAggregateItem {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceFilter {
    }

    interface DataSourceFilterItem extends DataSourceFilter {
        operator?: string;
        field?: string;
        value?: any;
    }

    interface DataSourceFilters extends DataSourceFilter {
        logic?: string;
        filters?: DataSourceFilter[];
    }

    interface DataSourceGroupItemAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceGroupItem {
        field?: string;
        dir?: string;
        aggregates?: DataSourceGroupItemAggregate[];
    }

    interface DataSourceSchema {
        aggregates?: any;
        data?: any;
        errors?: any;
        groups?: any;
        parse?: Function;
        total?: any;
        type?: string;
    }

    interface DataSourceSortItem {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportCreate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportDestroy {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportRead {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportUpdate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransport {
        create?: any;
        destroy?: any;
        read?: any;
        update?: any;
    }

    interface DataSourceTransportWithObjectOperations extends DataSourceTransport {
        create?: DataSourceTransportCreate;
        destroy?: DataSourceTransportDestroy;
        read?: DataSourceTransportRead;
        update?: DataSourceTransportUpdate;
    }

    interface DataSourceTransportWithFunctionOperations extends DataSourceTransport {
        create?: (options: DataSourceTransportOptions) => void;
        destroy?: (options: DataSourceTransportOptions) => void;
        read?: (options: DataSourceTransportReadOptions) => void;
        update?: (options: DataSourceTransportOptions) => void;
    }

    interface DataSourceTransportOptions {
        success: (data?: any) => void;
        error: (error?: any) => void;
        data: any;
    }

    interface DataSourceTransportReadOptionsData {
        sort?: DataSourceSortItem[];
        filter?: DataSourceFilters;
        take?: number;
        skip?: number;
    }

    interface DataSourceTransportReadOptions extends DataSourceTransportOptions {
        data: DataSourceTransportReadOptionsData;
    }

    interface DataSourceTransportBatchOptionsData {
        models: any[];
    }

    interface DataSourceTransportBatchOptions extends DataSourceTransportOptions {
        data: DataSourceTransportBatchOptionsData;
    }

    interface DataSourceOptions {
        aggregate?: DataSourceAggregateItem[];
        autoSync?: boolean;
        batch?: boolean;
        data?: any;
        filter?: any;
        group?: DataSourceGroupItem[];
        page?: number;
        pageSize?: number;
        schema?: DataSourceSchema;
        serverAggregates?: boolean;
        serverFiltering?: boolean;
        serverGrouping?: boolean;
        serverPaging?: boolean;
        serverSorting?: boolean;
        sort?: any;
        transport?: DataSourceTransport;
        type?: string;
        change? (e: DataSourceChangeEvent): void;
        error?(e: DataSourceErrorEvent): void;
        sync?(e: DataSourceEvent): void;
        requestStart?(e: DataSourceRequestStartEvent): void;
        requestEnd?(e: DataSourceRequestEndEvent): void;
    }

    interface DataSourceEvent {
        sender?: DataSource;
    }

    interface DataSourceItemOrGroup {
    }

    interface DataSourceGroup extends DataSourceItemOrGroup {
        aggregates: any[];
        field: string;
        hasSubgroups: boolean;
        items: DataSourceItemOrGroup[];
        value: any;
    }

    interface DataSourceChangeEvent extends DataSourceEvent {
        field?: string;
        value?: Model;
        action?: string;
        index?: number;
        items?: DataSourceItemOrGroup[];
        node?: any;
    }

    interface DataSourceErrorEvent extends DataSourceEvent {
        xhr: JQueryXHR;
        status: string;
        errorThrown: any;
        errors?: any;
    }

    interface DataSourceRequestStartEvent extends DataSourceEvent {
    }

    interface DataSourceRequestEndEvent extends DataSourceEvent {
        response?: any;
        type?: string;
    }
}

declare module kendo.data.transports {
    var odata : DataSourceTransport;
}

declare module kendo.ui {
    function progress(container: JQuery, toggle: boolean): void;

    class Widget extends Observable {
        static fn: Widget;
        static extend(prototype: Object): Widget;

        constructor(element: Element, options?: Object);
        constructor(element: JQuery, options?: Object);
        constructor(selector: String, options?: Object);
        init(element: Element, options?: Object): void;
        init(element: JQuery, options?: Object): void;
        init(selector: String, options?: Object): void;
        destroy(): void;
        element: JQuery;
        setOptions(options: Object): void;
        resize(force?: boolean): void;
    }

    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.ui, prefix?: String): void;
    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.dataviz.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.dataviz.ui, prefix?: String): void;

    class Draggable extends kendo.ui.Widget{
        element: JQuery;
        currentTarget: JQuery;
        constructor(element: Element, options?: DraggableOptions);
        options: DraggableOptions;
    }

    interface DraggableEvent extends JQueryEventObject {
        sender?: Draggable;
    }

    class DropTarget extends kendo.ui.Widget{
        element: JQuery;
        constructor(element: Element, options?: DropTargetOptions);
        options: DropTargetOptions;
        static destroyGroup(groupName: string): void;
    }

    interface DropTargetOptions {
        group?: string;
        dragenter?(e: DropTargetDragenterEvent): void;
        dragleave?(e: DropTargetDragleaveEvent): void;
        drop?(e: DropTargetDropEvent): void;
    }

    interface DropTargetEvent extends JQueryEventObject {
        sender?: DropTarget;
    }

    interface DropTargetDragenterEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    interface DropTargetDragleaveEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    interface DropTargetDropEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    class DropTargetArea extends kendo.ui.Widget{
        element: JQuery;
        constructor(element: Element, options?: DropTargetAreaOptions);
        options: DropTargetAreaOptions;
    }

    interface DropTargetAreaOptions {
        group?: string;
        filter?: string;
        dragenter?(e: DropTargetAreaDragenterEvent): void;
        dragleave?(e: DropTargetAreaDragleaveEvent): void;
        drop?(e: DropTargetAreaDropEvent): void;
    }

    interface DropTargetAreaEvent extends JQueryEventObject {
        sender: DropTargetArea;
    }

    interface DropTargetAreaDragenterEvent extends DropTargetAreaEvent {
        draggable?: JQuery;
    }

    interface DropTargetAreaDragleaveEvent extends DropTargetAreaEvent {
        draggable?: JQuery;
    }

    interface DropTargetAreaDropEvent extends DropTargetAreaEvent {
        draggable?: kendo.ui.Draggable;
        dropTarget?: JQuery;
    }

    interface DraggableOptions {
        axis?: string;
        cursorOffset?: any;
        distance?: number;
        group?: string;
        hint?: Function;
        drag?(e: DraggableEvent): void;
        dragcancel?(e: DraggableEvent): void;
        dragend?(e: DraggableEvent): void;
        dragstart?(e: DraggableEvent): void;
    }

    interface GridColumnEditorOptions {
        field?: string;
        format?: string;
        model?: kendo.data.Model;
        values?: any[];
    }

    interface GridColumn {
        editor?(container: JQuery, options: GridColumnEditorOptions): void;
    }
}

declare module kendo.dataviz.ui {
    function registerTheme(name: string, options: any): void;

    function plugin(widget: typeof kendo.ui.Widget): void;
    function plugin(widget: any): void;
}

declare module kendo.dataviz.map {
    class Location {
    }

    class Marker {
    }

    class Extent {
    }
}

declare module kendo.dataviz.map.layer {
    class Shape {
    }
}

declare module kendo.dataviz.drawing {
    class Shape {
    }
}

declare module kendo.dataviz.geometry {
    class Point {
    }
}

declare module kendo.dataviz.ui {
    class Barcode extends kendo.ui.Widget {
        static fn: Barcode;
        static extend(proto: Object): Barcode;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: BarcodeOptions);
        options: BarcodeOptions;
        imageDataURL(): string;
        redraw(): void;
        resize(force?: boolean): void;
        svg(): string;
        value(): string;
        value(value: number): void;
        value(value: string): void;
    }

    interface BarcodeBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface BarcodePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface BarcodeTextMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface BarcodeText {
        color?: string;
        font?: string;
        margin?: BarcodeTextMargin;
        visible?: boolean;
    }

    interface BarcodeOptions {
        name?: string;
        renderAs?: string;
        background?: string;
        border?: BarcodeBorder;
        checksum?: boolean;
        color?: string;
        height?: number;
        padding?: BarcodePadding;
        text?: BarcodeText;
        type?: string;
        value?: string;
        width?: number;
    }

    interface BarcodeEvent {
        sender: Barcode;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Chart extends kendo.ui.Widget {
        static fn: Chart;
        static extend(proto: Object): Chart;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ChartOptions);
        options: ChartOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        redraw(): void;
        refresh(): void;
        resize(force?: boolean): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        setOptions(options: any): void;
        svg(): string;
        imageDataURL(): string;
    }

    interface ChartCategoryAxisItemAutoBaseUnitSteps {
        seconds?: any;
        minutes?: any;
        hours?: any;
        days?: any;
        weeks?: any;
        months?: any;
        years?: any;
    }

    interface ChartCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartCategoryAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartCategoryAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface ChartCategoryAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemLabels {
        background?: string;
        border?: ChartCategoryAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: ChartCategoryAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: ChartCategoryAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartCategoryAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartCategoryAxisItemNotesDataItemIcon;
        label?: ChartCategoryAxisItemNotesDataItemLabel;
        line?: ChartCategoryAxisItemNotesDataItemLine;
    }

    interface ChartCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesIcon {
        background?: string;
        border?: ChartCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesLabel {
        background?: string;
        border?: ChartCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartCategoryAxisItemNotes {
        position?: string;
        icon?: ChartCategoryAxisItemNotesIcon;
        label?: ChartCategoryAxisItemNotesLabel;
        line?: ChartCategoryAxisItemNotesLine;
        data?: ChartCategoryAxisItemNotesDataItem[];
    }

    interface ChartCategoryAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartCategoryAxisItemSelectMousewheel {
        reverse?: boolean;
        zoom?: string;
    }

    interface ChartCategoryAxisItemSelect {
        from?: any;
        max?: any;
        min?: any;
        mousewheel?: ChartCategoryAxisItemSelectMousewheel;
        to?: any;
    }

    interface ChartCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemTitle {
        background?: string;
        border?: ChartCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartCategoryAxisItemTitleMargin;
        padding?: ChartCategoryAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartCategoryAxisItem {
        autoBaseUnitSteps?: ChartCategoryAxisItemAutoBaseUnitSteps;
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        baseUnitStep?: any;
        categories?: any;
        color?: string;
        crosshair?: ChartCategoryAxisItemCrosshair;
        field?: string;
        justified?: boolean;
        labels?: ChartCategoryAxisItemLabels;
        line?: ChartCategoryAxisItemLine;
        majorGridLines?: ChartCategoryAxisItemMajorGridLines;
        majorTicks?: ChartCategoryAxisItemMajorTicks;
        max?: any;
        maxDateGroups?: number;
        min?: any;
        minorGridLines?: ChartCategoryAxisItemMinorGridLines;
        minorTicks?: ChartCategoryAxisItemMinorTicks;
        name?: string;
        pane?: string;
        plotBands?: ChartCategoryAxisItemPlotBand[];
        reverse?: boolean;
        roundToBaseUnit?: boolean;
        select?: ChartCategoryAxisItemSelect;
        startAngle?: number;
        title?: ChartCategoryAxisItemTitle;
        type?: string;
        visible?: boolean;
        weekStartDay?: number;
        notes?: ChartCategoryAxisItemNotes;
    }

    interface ChartChartAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartChartAreaMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartChartArea {
        background?: string;
        border?: ChartChartAreaBorder;
        height?: number;
        margin?: ChartChartAreaMargin;
        opacity?: number;
        width?: number;
    }

    interface ChartLegendBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartLegendInactiveItemsLabels {
        color?: string;
        font?: string;
        template?: any;
    }

    interface ChartLegendInactiveItems {
        labels?: ChartLegendInactiveItemsLabels;
    }

    interface ChartLegendLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegendLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegendLabels {
        color?: string;
        font?: string;
        margin?: ChartLegendLabelsMargin;
        padding?: ChartLegendLabelsPadding;
        template?: any;
    }

    interface ChartLegendMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegendPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegend {
        background?: string;
        border?: ChartLegendBorder;
        height?: number;
        inactiveItems?: ChartLegendInactiveItems;
        labels?: ChartLegendLabels;
        margin?: ChartLegendMargin;
        offsetX?: number;
        offsetY?: number;
        orientation?: string;
        padding?: ChartLegendPadding;
        position?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartPaneBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartPaneMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPanePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPaneTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartPaneTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPaneTitle {
        background?: string;
        border?: ChartPaneTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartPaneTitleMargin;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface ChartPane {
        background?: string;
        border?: ChartPaneBorder;
        clip?: boolean;
        height?: number;
        margin?: ChartPaneMargin;
        name?: string;
        padding?: ChartPanePadding;
        title?: ChartPaneTitle;
    }

    interface ChartPlotAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartPlotAreaMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPlotAreaPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPlotArea {
        background?: string;
        border?: ChartPlotAreaBorder;
        margin?: ChartPlotAreaMargin;
        opacity?: number;
        padding?: ChartPlotAreaPadding;
    }

    interface ChartSeriesItemBorder {
        color?: any;
        dashType?: any;
        opacity?: any;
        width?: any;
    }

    interface ChartSeriesItemConnectors {
        color?: string;
        padding?: number;
        width?: number;
    }

    interface ChartSeriesItemErrorBarsLine {
        width?: number;
        dashType?: string;
    }

    interface ChartSeriesItemErrorBars {
        value?: any;
        xValue?: any;
        yValue?: any;
        endCaps?: boolean;
        color?: string;
        line?: ChartSeriesItemErrorBarsLine;
    }

    interface ChartSeriesItemExtremesBorder {
        color?: any;
        width?: any;
    }

    interface ChartSeriesItemExtremes {
        background?: any;
        border?: ChartSeriesItemExtremesBorder;
        size?: any;
        type?: any;
        rotation?: any;
    }

    interface ChartSeriesItemHighlightBorder {
        color?: string;
        opacity?: number;
        width?: number;
    }

    interface ChartSeriesItemHighlightLine {
        color?: string;
        opacity?: number;
        width?: number;
    }

    interface ChartSeriesItemHighlight {
        border?: ChartSeriesItemHighlightBorder;
        color?: string;
        line?: ChartSeriesItemHighlightLine;
        opacity?: number;
        visible?: boolean;
    }

    interface ChartSeriesItemLabelsBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface ChartSeriesItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabels {
        align?: string;
        background?: any;
        border?: ChartSeriesItemLabelsBorder;
        color?: any;
        distance?: number;
        font?: any;
        format?: any;
        margin?: ChartSeriesItemLabelsMargin;
        padding?: ChartSeriesItemLabelsPadding;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface ChartSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
        style?: string;
    }

    interface ChartSeriesItemMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemMarkersBorder {
        color?: any;
        width?: any;
    }

    interface ChartSeriesItemMarkers {
        background?: any;
        border?: ChartSeriesItemMarkersBorder;
        size?: any;
        type?: any;
        visible?: any;
        rotation?: any;
    }

    interface ChartSeriesItemNegativeValues {
        color?: string;
        visible?: boolean;
    }

    interface ChartSeriesItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesItemNotesIcon {
        background?: string;
        border?: ChartSeriesItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartSeriesItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesItemNotesLabel {
        background?: string;
        border?: ChartSeriesItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartSeriesItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartSeriesItemNotes {
        position?: string;
        icon?: ChartSeriesItemNotesIcon;
        label?: ChartSeriesItemNotesLabel;
        line?: ChartSeriesItemNotesLine;
    }

    interface ChartSeriesItemOutliersBorder {
        color?: any;
        width?: any;
    }

    interface ChartSeriesItemOutliers {
        background?: any;
        border?: ChartSeriesItemOutliersBorder;
        size?: any;
        type?: any;
        rotation?: any;
    }

    interface ChartSeriesItemOverlay {
        gradient?: string;
    }

    interface ChartSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface ChartSeriesItemTargetBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface ChartSeriesItemTargetLine {
        width?: any;
    }

    interface ChartSeriesItemTarget {
        border?: ChartSeriesItemTargetBorder;
        color?: any;
        line?: ChartSeriesItemTargetLine;
    }

    interface ChartSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesItemTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemTooltip {
        background?: string;
        border?: ChartSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartSeriesItemTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesItem {
        aggregate?: string;
        axis?: string;
        border?: ChartSeriesItemBorder;
        categoryField?: string;
        closeField?: string;
        color?: any;
        colorField?: string;
        connectors?: ChartSeriesItemConnectors;
        currentField?: string;
        dashType?: string;
        data?: any;
        downColor?: any;
        downColorField?: string;
        segmentSpacing?: number;
        neckRatio?: number;
        dynamicSlope?: boolean;
        dynamicHeight?: boolean;
        errorBars?: ChartSeriesItemErrorBars;
        errorLowField?: string;
        errorHighField?: string;
        xErrorLowField?: string;
        xErrorHighField?: string;
        yErrorLowField?: string;
        yErrorHighField?: string;
        explodeField?: string;
        field?: string;
        noteTextField?: string;
        lowerField?: string;
        q1Field?: string;
        medianField?: string;
        q3Field?: string;
        upperField?: string;
        meanField?: string;
        outliersField?: string;
        gap?: number;
        highField?: string;
        highlight?: ChartSeriesItemHighlight;
        holeSize?: number;
        labels?: ChartSeriesItemLabels;
        line?: ChartSeriesItemLine;
        lowField?: string;
        margin?: ChartSeriesItemMargin;
        markers?: ChartSeriesItemMarkers;
        outliers?: ChartSeriesItemOutliers;
        extremes?: ChartSeriesItemExtremes;
        maxSize?: number;
        minSize?: number;
        missingValues?: string;
        style?: string;
        name?: string;
        negativeColor?: string;
        negativeValues?: ChartSeriesItemNegativeValues;
        opacity?: number;
        openField?: string;
        overlay?: ChartSeriesItemOverlay;
        padding?: number;
        size?: number;
        sizeField?: string;
        spacing?: number;
        stack?: ChartSeriesItemStack;
        startAngle?: number;
        target?: ChartSeriesItemTarget;
        targetField?: string;
        tooltip?: ChartSeriesItemTooltip;
        type?: string;
        visibleInLegend?: boolean;
        visibleInLegendField?: string;
        width?: number;
        xAxis?: string;
        xField?: string;
        yAxis?: string;
        yField?: string;
        notes?: ChartSeriesItemNotes;
    }

    interface ChartSeriesDefaultsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabels {
        background?: string;
        border?: ChartSeriesDefaultsLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: ChartSeriesDefaultsLabelsMargin;
        padding?: ChartSeriesDefaultsLabelsPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesDefaultsNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsNotesIcon {
        background?: string;
        border?: ChartSeriesDefaultsNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartSeriesDefaultsNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsNotesLabel {
        background?: string;
        border?: ChartSeriesDefaultsNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartSeriesDefaultsNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartSeriesDefaultsNotes {
        icon?: ChartSeriesDefaultsNotesIcon;
        label?: ChartSeriesDefaultsNotesLabel;
        line?: ChartSeriesDefaultsNotesLine;
    }

    interface ChartSeriesDefaultsOverlay {
        gradient?: string;
    }

    interface ChartSeriesDefaultsStack {
        type?: string;
    }

    interface ChartSeriesDefaultsTooltipBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsTooltip {
        background?: string;
        border?: ChartSeriesDefaultsTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartSeriesDefaultsTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesDefaults {
        area?: any;
        bar?: any;
        border?: ChartSeriesDefaultsBorder;
        bubble?: any;
        candlestick?: any;
        column?: any;
        donut?: any;
        gap?: number;
        labels?: ChartSeriesDefaultsLabels;
        line?: any;
        ohlc?: any;
        overlay?: ChartSeriesDefaultsOverlay;
        pie?: any;
        scatter?: any;
        scatterLine?: any;
        spacing?: number;
        stack?: ChartSeriesDefaultsStack;
        type?: string;
        tooltip?: ChartSeriesDefaultsTooltip;
        verticalArea?: any;
        verticalLine?: any;
        notes?: ChartSeriesDefaultsNotes;
    }

    interface ChartTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartTitle {
        align?: string;
        background?: string;
        border?: ChartTitleBorder;
        font?: string;
        margin?: ChartTitleMargin;
        padding?: ChartTitlePadding;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface ChartTooltipBorder {
        color?: string;
        width?: number;
    }

    interface ChartTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartTooltip {
        background?: string;
        border?: ChartTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartTooltipPadding;
        shared?: boolean;
        sharedTemplate?: any;
        template?: any;
        visible?: boolean;
    }

    interface ChartValueAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartValueAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartValueAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartValueAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartValueAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartValueAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemLabels {
        background?: string;
        border?: ChartValueAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: ChartValueAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartValueAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartValueAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartValueAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        type?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        type?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartValueAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartValueAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartValueAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartValueAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartValueAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartValueAxisItemNotesDataItemIcon;
        label?: ChartValueAxisItemNotesDataItemLabel;
        line?: ChartValueAxisItemNotesDataItemLine;
    }

    interface ChartValueAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesIcon {
        background?: string;
        border?: ChartValueAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartValueAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesLabel {
        background?: string;
        border?: ChartValueAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartValueAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartValueAxisItemNotes {
        position?: string;
        icon?: ChartValueAxisItemNotesIcon;
        label?: ChartValueAxisItemNotesLabel;
        line?: ChartValueAxisItemNotesLine;
        data?: ChartValueAxisItemNotesDataItem[];
    }

    interface ChartValueAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartValueAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemTitle {
        background?: string;
        border?: ChartValueAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartValueAxisItemTitleMargin;
        padding?: ChartValueAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartValueAxisItem {
        axisCrossingValue?: any;
        background?: string;
        color?: string;
        crosshair?: ChartValueAxisItemCrosshair;
        labels?: ChartValueAxisItemLabels;
        line?: ChartValueAxisItemLine;
        majorGridLines?: ChartValueAxisItemMajorGridLines;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorGridLines?: ChartValueAxisItemMinorGridLines;
        majorTicks?: ChartValueAxisItemMajorTicks;
        minorTicks?: ChartValueAxisItemMinorTicks;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: ChartValueAxisItemPlotBand[];
        reverse?: boolean;
        title?: ChartValueAxisItemTitle;
        type?: string;
        visible?: boolean;
        notes?: ChartValueAxisItemNotes;
    }

    interface ChartXAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartXAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartXAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartXAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartXAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartXAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface ChartXAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemLabels {
        background?: string;
        border?: ChartXAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: ChartXAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: ChartXAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartXAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartXAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartXAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartXAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartXAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartXAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartXAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartXAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartXAxisItemNotesDataItemIcon;
        label?: ChartXAxisItemNotesDataItemLabel;
        line?: ChartXAxisItemNotesDataItemLine;
    }

    interface ChartXAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesIcon {
        background?: string;
        border?: ChartXAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartXAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesLabel {
        background?: string;
        border?: ChartXAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartXAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartXAxisItemNotes {
        position?: string;
        icon?: ChartXAxisItemNotesIcon;
        label?: ChartXAxisItemNotesLabel;
        line?: ChartXAxisItemNotesLine;
        data?: ChartXAxisItemNotesDataItem[];
    }

    interface ChartXAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartXAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemTitle {
        background?: string;
        border?: ChartXAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartXAxisItemTitleMargin;
        padding?: ChartXAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartXAxisItem {
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        color?: string;
        crosshair?: ChartXAxisItemCrosshair;
        labels?: ChartXAxisItemLabels;
        line?: ChartXAxisItemLine;
        majorGridLines?: ChartXAxisItemMajorGridLines;
        minorGridLines?: ChartXAxisItemMinorGridLines;
        minorTicks?: ChartXAxisItemMinorTicks;
        majorTicks?: ChartXAxisItemMajorTicks;
        majorUnit?: number;
        max?: any;
        min?: any;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: ChartXAxisItemPlotBand[];
        reverse?: boolean;
        startAngle?: number;
        title?: ChartXAxisItemTitle;
        type?: string;
        visible?: boolean;
        notes?: ChartXAxisItemNotes;
    }

    interface ChartYAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartYAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartYAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartYAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartYAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartYAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface ChartYAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemLabels {
        background?: string;
        border?: ChartYAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: ChartYAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: ChartYAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartYAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartYAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartYAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartYAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartYAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartYAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartYAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartYAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartYAxisItemNotesDataItemIcon;
        label?: ChartYAxisItemNotesDataItemLabel;
        line?: ChartYAxisItemNotesDataItemLine;
    }

    interface ChartYAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesIcon {
        background?: string;
        border?: ChartYAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartYAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesLabel {
        background?: string;
        border?: ChartYAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartYAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartYAxisItemNotes {
        position?: string;
        icon?: ChartYAxisItemNotesIcon;
        label?: ChartYAxisItemNotesLabel;
        line?: ChartYAxisItemNotesLine;
        data?: ChartYAxisItemNotesDataItem[];
    }

    interface ChartYAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartYAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemTitle {
        background?: string;
        border?: ChartYAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartYAxisItemTitleMargin;
        padding?: ChartYAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartYAxisItem {
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        color?: string;
        crosshair?: ChartYAxisItemCrosshair;
        labels?: ChartYAxisItemLabels;
        line?: ChartYAxisItemLine;
        majorGridLines?: ChartYAxisItemMajorGridLines;
        minorGridLines?: ChartYAxisItemMinorGridLines;
        minorTicks?: ChartYAxisItemMinorTicks;
        majorTicks?: ChartYAxisItemMajorTicks;
        majorUnit?: number;
        max?: any;
        min?: any;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: ChartYAxisItemPlotBand[];
        reverse?: boolean;
        title?: ChartYAxisItemTitle;
        type?: string;
        visible?: boolean;
        notes?: ChartYAxisItemNotes;
    }

    interface ChartSeriesClickEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface ChartSeriesHoverEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface ChartOptions {
        name?: string;
        autoBind?: boolean;
        axisDefaults?: any;
        categoryAxis?: ChartCategoryAxisItem[];
        chartArea?: ChartChartArea;
        dataSource?: any;
        legend?: ChartLegend;
        panes?: ChartPane[];
        plotArea?: ChartPlotArea;
        renderAs?: string;
        series?: ChartSeriesItem[];
        seriesColors?: any;
        seriesDefaults?: ChartSeriesDefaults;
        theme?: string;
        title?: ChartTitle;
        tooltip?: ChartTooltip;
        transitions?: boolean;
        valueAxis?: ChartValueAxisItem[];
        xAxis?: ChartXAxisItem[];
        yAxis?: ChartYAxisItem[];
        axisLabelClick?(e: ChartAxisLabelClickEvent): void;
        legendItemClick?(e: ChartLegendItemClickEvent): void;
        legendItemHover?(e: ChartLegendItemHoverEvent): void;
        dataBound?(e: ChartDataBoundEvent): void;
        drag?(e: ChartDragEvent): void;
        dragEnd?(e: ChartDragEndEvent): void;
        dragStart?(e: ChartDragStartEvent): void;
        noteClick?(e: ChartNoteClickEvent): void;
        noteHover?(e: ChartNoteHoverEvent): void;
        plotAreaClick?(e: ChartPlotAreaClickEvent): void;
        select?(e: ChartSelectEvent): void;
        selectEnd?(e: ChartSelectEndEvent): void;
        selectStart?(e: ChartSelectStartEvent): void;
        seriesClick?(e: ChartSeriesClickEvent): void;
        seriesHover?(e: ChartSeriesHoverEvent): void;
        zoom?(e: ChartZoomEvent): void;
        zoomEnd?(e: ChartZoomEndEvent): void;
        zoomStart?(e: ChartZoomStartEvent): void;
    }

    interface ChartEvent {
        sender: Chart;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ChartAxisLabelClickEvent extends ChartEvent {
        axis?: any;
        dataItem?: any;
        element?: any;
        index?: any;
        text?: string;
        value?: any;
    }

    interface ChartLegendItemClickEvent extends ChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface ChartLegendItemHoverEvent extends ChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface ChartDataBoundEvent extends ChartEvent {
    }

    interface ChartDragEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartDragEndEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartDragStartEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartNoteClickEvent extends ChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface ChartNoteHoverEvent extends ChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface ChartPlotAreaClickEvent extends ChartEvent {
        category?: any;
        element?: any;
        value?: any;
        x?: any;
        y?: any;
    }

    interface ChartSelectEvent extends ChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface ChartSelectEndEvent extends ChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface ChartSelectStartEvent extends ChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface ChartSeriesClickEvent extends ChartEvent {
        category?: any;
        element?: any;
        series?: ChartSeriesClickEventSeries;
        dataItem?: any;
        value?: any;
        percentage?: any;
    }

    interface ChartSeriesHoverEvent extends ChartEvent {
        category?: any;
        element?: any;
        series?: ChartSeriesHoverEventSeries;
        dataItem?: any;
        value?: any;
        percentage?: any;
    }

    interface ChartZoomEvent extends ChartEvent {
        axisRanges?: any;
        delta?: number;
    }

    interface ChartZoomEndEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartZoomStartEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }


    class Diagram extends kendo.ui.Widget {
        static fn: Diagram;
        static extend(proto: Object): Diagram;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DiagramOptions);
        options: DiagramOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        zoom(zoom: number, staticPoint: any): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        save(): void;
        load(json: string): void;
        pan(pan: any): void;
        viewport(): void;
        viewToDocument(point: any): any;
        documentToView(point: any): any;
        viewToModel(point: any): any;
        modelToView(point: any): any;
        modelToLayer(point: any): any;
        layerToModel(point: any): any;
        documentToModel(point: any): any;
        modelToDocument(point: any): any;
        transformPoint(p: any): void;
        transformRect(r: any): void;
        focus(): void;
        clear(): void;
        connect(source: any, target: any, options: any): void;
        connected(source: any, target: any): void;
        addConnection(connection: any, undoable: boolean): void;
        addShape(obj: any, undoable: boolean): void;
        undo(): void;
        redo(): void;
        remove(items: any, undoable: boolean): void;
        select(obj: any, options: any): void;
        toFront(items: any, undoable: boolean): void;
        toBack(items: any, undoable: boolean): void;
        bringIntoView(obj: any, options: any): void;
        boundingBox(items: any): kendo.dataviz.diagram.Rect;
        copy(): void;
        cut(): void;
        paste(): void;
        layout(options: any): void;
        alignShapes(direction: string): void;
        getShapeById(id: string): any;
    }

    interface DiagramConnectionDefaultsHoverStroke {
        color?: string;
    }

    interface DiagramConnectionDefaultsHover {
        stroke?: DiagramConnectionDefaultsHoverStroke;
    }

    interface DiagramConnectionDefaultsStroke {
        color?: string;
        width?: number;
    }

    interface DiagramConnectionDefaults {
        stroke?: DiagramConnectionDefaultsStroke;
        hover?: DiagramConnectionDefaultsHover;
        startCap?: string;
        endCap?: string;
    }

    interface DiagramConnectionHoverStroke {
        color?: string;
    }

    interface DiagramConnectionHover {
        stroke?: DiagramConnectionHoverStroke;
    }

    interface DiagramConnectionPoint {
        x?: number;
        y?: number;
    }

    interface DiagramConnectionStroke {
        color?: string;
        width?: number;
    }

    interface DiagramConnection {
        stroke?: DiagramConnectionStroke;
        hover?: DiagramConnectionHover;
        startCap?: string;
        endCap?: string;
        points?: DiagramConnectionPoint[];
    }

    interface DiagramEditableResizeHandlesHoverStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableResizeHandlesHover {
        background?: string;
        stroke?: DiagramEditableResizeHandlesHoverStroke;
    }

    interface DiagramEditableResizeHandlesStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableResizeHandles {
        background?: string;
        stroke?: DiagramEditableResizeHandlesStroke;
        hover?: DiagramEditableResizeHandlesHover;
        width?: number;
        height?: number;
    }

    interface DiagramEditableResize {
        handles?: DiagramEditableResizeHandles;
    }

    interface DiagramEditableRotateThumbStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableRotateThumb {
        background?: string;
        stroke?: DiagramEditableRotateThumbStroke;
    }

    interface DiagramEditableRotate {
        thumb?: DiagramEditableRotateThumb;
    }

    interface DiagramEditableSelectStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableSelect {
        background?: string;
        stroke?: DiagramEditableSelectStroke;
    }

    interface DiagramEditable {
        resize?: DiagramEditableResize;
        rotate?: DiagramEditableRotate;
        select?: DiagramEditableSelect;
    }

    interface DiagramLayoutGrid {
        width?: number;
        offsetX?: number;
        offsetY?: number;
        componentSpacingX?: number;
        componentSpacingY?: number;
    }

    interface DiagramLayout {
        type?: string;
        subtype?: string;
        horizontalSeparation?: number;
        verticalSeparation?: number;
        radialFirstLevelSeparation?: number;
        radialSeparation?: number;
        startRadialAngle?: number;
        endRadialAngle?: number;
        underneathVerticalTopOffset?: number;
        underneathVerticalSeparation?: number;
        underneathHorizontalOffset?: number;
        iterations?: number;
        nodeDistance?: number;
        grid?: DiagramLayoutGrid;
        layerSeparation?: number;
    }

    interface DiagramShapeDefaultsConnector {
        name?: string;
        description?: string;
        position?: any;
    }

    interface DiagramShapeDefaultsContent {
        text?: string;
        align?: string;
    }

    interface DiagramShapeDefaultsHover {
        background?: string;
    }

    interface DiagramShapeDefaultsRotation {
        angle?: number;
    }

    interface DiagramShapeDefaultsStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramShapeDefaults {
        path?: string;
        stroke?: DiagramShapeDefaultsStroke;
        type?: string;
        x?: number;
        y?: number;
        minWidth?: number;
        minHeight?: number;
        width?: number;
        height?: number;
        background?: string;
        hover?: DiagramShapeDefaultsHover;
        connectors?: DiagramShapeDefaultsConnector[];
        rotation?: DiagramShapeDefaultsRotation;
        content?: DiagramShapeDefaultsContent;
        visual?: Function;
    }

    interface DiagramShapeConnector {
        name?: string;
        description?: string;
        position?: any;
    }

    interface DiagramShapeContent {
        text?: string;
        align?: string;
    }

    interface DiagramShapeHover {
        background?: string;
    }

    interface DiagramShapeRotation {
        angle?: number;
    }

    interface DiagramShapeStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramShape {
        id?: string;
        path?: string;
        stroke?: DiagramShapeStroke;
        type?: string;
        x?: number;
        y?: number;
        minWidth?: number;
        minHeight?: number;
        width?: number;
        height?: number;
        background?: string;
        hover?: DiagramShapeHover;
        connectors?: DiagramShapeConnector[];
        rotation?: DiagramShapeRotation;
        content?: DiagramShapeContent;
        visual?: Function;
    }

    interface DiagramOptions {
        name?: string;
        autoBind?: boolean;
        zoomRate?: number;
        zoom?: number;
        zoomMin?: number;
        zoomMax?: number;
        editable?: DiagramEditable;
        dataSource?: any;
        draggable?: boolean;
        layout?: DiagramLayout;
        template?: any;
        connectionDefaults?: DiagramConnectionDefaults;
        connections?: DiagramConnection[];
        shapeDefaults?: DiagramShapeDefaults;
        shapes?: DiagramShape[];
        change?(e: DiagramChangeEvent): void;
        itemBoundsChange?(e: DiagramItemBoundsChangeEvent): void;
        itemRotate?(e: DiagramItemRotateEvent): void;
        pan?(e: DiagramPanEvent): void;
        select?(e: DiagramSelectEvent): void;
        zoomStart?(e: DiagramZoomStartEvent): void;
        zoomEnd?(e: DiagramZoomEndEvent): void;
        click?(e: DiagramClickEvent): void;
    }

    interface DiagramEvent {
        sender: Diagram;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DiagramChangeEvent extends DiagramEvent {
        added?: any;
        removed?: any;
    }

    interface DiagramItemBoundsChangeEvent extends DiagramEvent {
        bounds?: kendo.dataviz.diagram.Rect;
        item?: any;
    }

    interface DiagramItemRotateEvent extends DiagramEvent {
        item?: any;
    }

    interface DiagramPanEvent extends DiagramEvent {
    }

    interface DiagramSelectEvent extends DiagramEvent {
        selected?: any;
        deselected?: any;
    }

    interface DiagramZoomStartEvent extends DiagramEvent {
        point?: kendo.dataviz.diagram.Point;
        zoom?: number;
    }

    interface DiagramZoomEndEvent extends DiagramEvent {
        point?: kendo.dataviz.diagram.Point;
        zoom?: number;
    }

    interface DiagramClickEvent extends DiagramEvent {
        item?: any;
        point?: kendo.dataviz.diagram.Point;
    }


    class LinearGauge extends kendo.ui.Widget {
        static fn: LinearGauge;
        static extend(proto: Object): LinearGauge;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: LinearGaugeOptions);
        options: LinearGaugeOptions;
        destroy(): void;
        redraw(): void;
        resize(force?: boolean): void;
        svg(): void;
        imageDataURL(): string;
        value(): void;
    }

    interface LinearGaugeGaugeAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugeGaugeArea {
        background?: any;
        border?: LinearGaugeGaugeAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface LinearGaugePointerBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugePointerTrackBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugePointerTrack {
        border?: LinearGaugePointerTrackBorder;
        color?: string;
        opacity?: number;
        size?: number;
        visible?: boolean;
    }

    interface LinearGaugePointer {
        border?: LinearGaugePointerBorder;
        color?: string;
        margin?: any;
        opacity?: number;
        shape?: string;
        size?: number;
        track?: LinearGaugePointerTrack;
        value?: number;
    }

    interface LinearGaugeScaleLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugeScaleLabels {
        background?: string;
        border?: LinearGaugeScaleLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface LinearGaugeScaleLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface LinearGaugeScaleMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface LinearGaugeScaleMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface LinearGaugeScaleRange {
        from?: number;
        to?: number;
        opacity?: number;
        color?: string;
    }

    interface LinearGaugeScale {
        line?: LinearGaugeScaleLine;
        labels?: LinearGaugeScaleLabels;
        majorTicks?: LinearGaugeScaleMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorTicks?: LinearGaugeScaleMinorTicks;
        minorUnit?: number;
        mirror?: boolean;
        ranges?: LinearGaugeScaleRange[];
        rangePlaceholderColor?: string;
        rangeSize?: number;
        reverse?: boolean;
        vertical?: boolean;
    }

    interface LinearGaugeOptions {
        name?: string;
        gaugeArea?: LinearGaugeGaugeArea;
        pointer?: LinearGaugePointer;
        renderAs?: string;
        scale?: LinearGaugeScale;
        transitions?: boolean;
    }

    interface LinearGaugeEvent {
        sender: LinearGauge;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Map extends kendo.ui.Widget {
        static fn: Map;
        static extend(proto: Object): Map;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: MapOptions);
        options: MapOptions;
        center(): kendo.dataviz.map.Location;
        center(center: any): void;
        center(center: kendo.dataviz.map.Location): void;
        destroy(): void;
        eventOffset(e: any): kendo.dataviz.geometry.Point;
        eventOffset(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        eventToLayer(e: any): kendo.dataviz.geometry.Point;
        eventToLayer(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        eventToLocation(e: any): kendo.dataviz.geometry.Point;
        eventToLocation(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        eventToView(e: any): kendo.dataviz.geometry.Point;
        eventToView(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        extent(): kendo.dataviz.map.Extent;
        layerToLocation(point: any, zoom: number): kendo.dataviz.map.Location;
        layerToLocation(point: kendo.dataviz.geometry.Point, zoom: number): kendo.dataviz.map.Location;
        locationToLayer(location: any, zoom: number): kendo.dataviz.geometry.Point;
        locationToLayer(location: kendo.dataviz.map.Location, zoom: number): kendo.dataviz.geometry.Point;
        locationToView(location: any): kendo.dataviz.geometry.Point;
        locationToView(location: kendo.dataviz.map.Location): kendo.dataviz.geometry.Point;
        resize(force?: boolean): void;
        setOptions(options: any): void;
        viewSize(): any;
        viewToLocation(point: any, zoom: number): kendo.dataviz.map.Location;
        viewToLocation(point: kendo.dataviz.geometry.Point, zoom: number): kendo.dataviz.map.Location;
        zoom(): number;
        zoom(level: number): void;
    }

    interface MapControlsAttribution {
        position?: string;
    }

    interface MapControlsNavigator {
        position?: string;
    }

    interface MapControlsZoom {
        position?: string;
    }

    interface MapControls {
        attribution?: MapControlsAttribution;
        navigator?: MapControlsNavigator;
        zoom?: MapControlsZoom;
    }

    interface MapLayerDefaultsBing {
        attribution?: string;
        opacity?: number;
        key?: string;
        imagerySet?: string;
    }

    interface MapLayerDefaultsMarkerTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapLayerDefaultsMarkerTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapLayerDefaultsMarkerTooltipAnimation {
        close?: MapLayerDefaultsMarkerTooltipAnimationClose;
        open?: MapLayerDefaultsMarkerTooltipAnimationOpen;
    }

    interface MapLayerDefaultsMarkerTooltipContent {
        url?: string;
    }

    interface MapLayerDefaultsMarkerTooltip {
        autoHide?: boolean;
        animation?: MapLayerDefaultsMarkerTooltipAnimation;
        content?: MapLayerDefaultsMarkerTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapLayerDefaultsMarker {
        shape?: string;
        tooltip?: MapLayerDefaultsMarkerTooltip;
        opacity?: number;
    }

    interface MapLayerDefaultsShapeStyleFill {
        color?: string;
        opacity?: number;
    }

    interface MapLayerDefaultsShapeStyleStroke {
        color?: string;
        dashType?: string;
        opacity?: number;
        width?: number;
    }

    interface MapLayerDefaultsShapeStyle {
        fill?: MapLayerDefaultsShapeStyleFill;
        stroke?: MapLayerDefaultsShapeStyleStroke;
    }

    interface MapLayerDefaultsShape {
        attribution?: string;
        opacity?: number;
        style?: MapLayerDefaultsShapeStyle;
    }

    interface MapLayerDefaultsTile {
        urlTemplate?: string;
        attribution?: string;
        subdomains?: any;
        opacity?: number;
    }

    interface MapLayerDefaults {
        marker?: MapLayerDefaultsMarker;
        shape?: MapLayerDefaultsShape;
        tile?: MapLayerDefaultsTile;
        bing?: MapLayerDefaultsBing;
    }

    interface MapLayerStyleFill {
        color?: string;
        opacity?: number;
    }

    interface MapLayerStyleStroke {
        color?: string;
        dashType?: number;
        opacity?: number;
        width?: number;
    }

    interface MapLayerStyle {
        fill?: MapLayerStyleFill;
        stroke?: MapLayerStyleStroke;
    }

    interface MapLayerTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapLayerTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapLayerTooltipAnimation {
        close?: MapLayerTooltipAnimationClose;
        open?: MapLayerTooltipAnimationOpen;
    }

    interface MapLayerTooltipContent {
        url?: string;
    }

    interface MapLayerTooltip {
        autoHide?: boolean;
        animation?: MapLayerTooltipAnimation;
        content?: MapLayerTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapLayer {
        attribution?: string;
        autoBind?: boolean;
        dataSource?: any;
        extent?: any;
        key?: string;
        imagerySet?: string;
        locationField?: string;
        shape?: string;
        titleField?: string;
        tooltip?: MapLayerTooltip;
        opacity?: number;
        subdomains?: any;
        type?: string;
        style?: MapLayerStyle;
        urlTemplate?: string;
    }

    interface MapMarkerDefaultsTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerDefaultsTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerDefaultsTooltipAnimation {
        close?: MapMarkerDefaultsTooltipAnimationClose;
        open?: MapMarkerDefaultsTooltipAnimationOpen;
    }

    interface MapMarkerDefaultsTooltipContent {
        url?: string;
    }

    interface MapMarkerDefaultsTooltip {
        autoHide?: boolean;
        animation?: MapMarkerDefaultsTooltipAnimation;
        content?: MapMarkerDefaultsTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapMarkerDefaults {
        shape?: string;
        tooltip?: MapMarkerDefaultsTooltip;
    }

    interface MapMarkerTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerTooltipAnimation {
        close?: MapMarkerTooltipAnimationClose;
        open?: MapMarkerTooltipAnimationOpen;
    }

    interface MapMarkerTooltipContent {
        url?: string;
    }

    interface MapMarkerTooltip {
        autoHide?: boolean;
        animation?: MapMarkerTooltipAnimation;
        content?: MapMarkerTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapMarker {
        location?: any;
        shape?: string;
        title?: string;
        tooltip?: MapMarkerTooltip;
    }

    interface MapOptions {
        name?: string;
        center?: any;
        controls?: MapControls;
        layerDefaults?: MapLayerDefaults;
        layers?: MapLayer[];
        markerDefaults?: MapMarkerDefaults;
        markers?: MapMarker[];
        minZoom?: number;
        maxZoom?: number;
        minSize?: number;
        pannable?: boolean;
        wraparound?: boolean;
        zoom?: number;
        zoomable?: boolean;
        click?(e: MapClickEvent): void;
        markerCreated?(e: MapMarkerCreatedEvent): void;
        pan?(e: MapPanEvent): void;
        panEnd?(e: MapPanEndEvent): void;
        reset?(e: MapResetEvent): void;
        shapeClick?(e: MapShapeClickEvent): void;
        shapeCreated?(e: MapShapeCreatedEvent): void;
        shapeMouseEnter?(e: MapShapeMouseEnterEvent): void;
        shapeMouseLeave?(e: MapShapeMouseLeaveEvent): void;
        zoomStart?(e: MapZoomStartEvent): void;
        zoomEnd?(e: MapZoomEndEvent): void;
    }

    interface MapEvent {
        sender: Map;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface MapClickEvent extends MapEvent {
        location?: kendo.dataviz.map.Location;
        originalEvent?: any;
    }

    interface MapMarkerCreatedEvent extends MapEvent {
        marker?: kendo.dataviz.map.Marker;
    }

    interface MapPanEvent extends MapEvent {
        origin?: kendo.dataviz.map.Location;
        center?: kendo.dataviz.map.Location;
        originalEvent?: any;
    }

    interface MapPanEndEvent extends MapEvent {
        origin?: kendo.dataviz.map.Location;
        center?: kendo.dataviz.map.Location;
        originalEvent?: any;
    }

    interface MapResetEvent extends MapEvent {
    }

    interface MapShapeClickEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapShapeCreatedEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapShapeMouseEnterEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapShapeMouseLeaveEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapZoomStartEvent extends MapEvent {
        originalEvent?: any;
    }

    interface MapZoomEndEvent extends MapEvent {
        originalEvent?: any;
    }


    class QRCode extends kendo.ui.Widget {
        static fn: QRCode;
        static extend(proto: Object): QRCode;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: QRCodeOptions);
        options: QRCodeOptions;
        destroy(): void;
        imageDataURL(): string;
        redraw(): void;
        resize(force?: boolean): void;
        setOptions(options: any): void;
        svg(): string;
        value(options: string): void;
        value(options: number): void;
    }

    interface QRCodeBorder {
        color?: string;
        width?: number;
    }

    interface QRCodeOptions {
        name?: string;
        background?: string;
        border?: QRCodeBorder;
        color?: string;
        encoding?: string;
        errorCorrection?: string;
        padding?: number;
        renderAs?: string;
        size?: any;
        value?: any;
    }

    interface QRCodeEvent {
        sender: QRCode;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class RadialGauge extends kendo.ui.Widget {
        static fn: RadialGauge;
        static extend(proto: Object): RadialGauge;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: RadialGaugeOptions);
        options: RadialGaugeOptions;
        destroy(): void;
        redraw(): void;
        resize(force?: boolean): void;
        svg(): void;
        imageDataURL(): string;
        value(): void;
    }

    interface RadialGaugeGaugeAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface RadialGaugeGaugeArea {
        background?: any;
        border?: RadialGaugeGaugeAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface RadialGaugePointerCap {
        color?: string;
        size?: number;
    }

    interface RadialGaugePointer {
        cap?: RadialGaugePointerCap;
        color?: string;
        value?: number;
    }

    interface RadialGaugeScaleLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface RadialGaugeScaleLabels {
        background?: string;
        border?: RadialGaugeScaleLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        position?: string;
        template?: any;
        visible?: boolean;
    }

    interface RadialGaugeScaleMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface RadialGaugeScaleMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface RadialGaugeScaleRange {
        from?: number;
        to?: number;
        opacity?: number;
        color?: string;
    }

    interface RadialGaugeScale {
        endAngle?: number;
        labels?: RadialGaugeScaleLabels;
        majorTicks?: RadialGaugeScaleMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorTicks?: RadialGaugeScaleMinorTicks;
        minorUnit?: number;
        ranges?: RadialGaugeScaleRange[];
        rangePlaceholderColor?: string;
        rangeSize?: number;
        rangeDistance?: number;
        reverse?: boolean;
        startAngle?: number;
    }

    interface RadialGaugeOptions {
        name?: string;
        gaugeArea?: RadialGaugeGaugeArea;
        pointer?: RadialGaugePointer;
        renderAs?: string;
        scale?: RadialGaugeScale;
        transitions?: boolean;
    }

    interface RadialGaugeEvent {
        sender: RadialGauge;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Sparkline extends kendo.ui.Widget {
        static fn: Sparkline;
        static extend(proto: Object): Sparkline;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SparklineOptions);
        options: SparklineOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        refresh(): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        setOptions(options: any): void;
        svg(): string;
        imageDataURL(): string;
    }

    interface SparklineCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: SparklineCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: SparklineCategoryAxisItemCrosshairTooltip;
    }

    interface SparklineCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemLabels {
        background?: string;
        border?: SparklineCategoryAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
        culture?: string;
        dateFormats?: any;
    }

    interface SparklineCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface SparklineCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemMajorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemMinorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: SparklineCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: SparklineCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface SparklineCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: SparklineCategoryAxisItemNotesDataItemIcon;
        label?: SparklineCategoryAxisItemNotesDataItemLabel;
        line?: SparklineCategoryAxisItemNotesDataItemLine;
    }

    interface SparklineCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesIcon {
        background?: string;
        border?: SparklineCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesLabel {
        background?: string;
        border?: SparklineCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface SparklineCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineCategoryAxisItemNotes {
        position?: string;
        icon?: SparklineCategoryAxisItemNotesIcon;
        label?: SparklineCategoryAxisItemNotesLabel;
        line?: SparklineCategoryAxisItemNotesLine;
        data?: SparklineCategoryAxisItemNotesDataItem[];
    }

    interface SparklineCategoryAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface SparklineCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemTitle {
        background?: string;
        border?: SparklineCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItem {
        axisCrossingValue?: any;
        categories?: any;
        color?: string;
        field?: string;
        justified?: boolean;
        labels?: SparklineCategoryAxisItemLabels;
        line?: SparklineCategoryAxisItemLine;
        majorGridLines?: SparklineCategoryAxisItemMajorGridLines;
        majorTicks?: SparklineCategoryAxisItemMajorTicks;
        minorGridLines?: SparklineCategoryAxisItemMinorGridLines;
        minorTicks?: SparklineCategoryAxisItemMinorTicks;
        name?: string;
        plotBands?: SparklineCategoryAxisItemPlotBand[];
        reverse?: boolean;
        title?: SparklineCategoryAxisItemTitle;
        type?: string;
        autoBaseUnitSteps?: any;
        baseUnit?: string;
        baseUnitStep?: any;
        max?: any;
        min?: any;
        roundToBaseUnit?: boolean;
        weekStartDay?: number;
        maxDateGroups?: number;
        visible?: boolean;
        crosshair?: SparklineCategoryAxisItemCrosshair;
        notes?: SparklineCategoryAxisItemNotes;
    }

    interface SparklineChartAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineChartArea {
        background?: string;
        opacity?: number;
        border?: SparklineChartAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface SparklinePlotAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklinePlotArea {
        background?: string;
        opacity?: number;
        border?: SparklinePlotAreaBorder;
        margin?: any;
    }

    interface SparklineSeriesItemBorder {
        color?: any;
        dashType?: any;
        opacity?: any;
        width?: any;
    }

    interface SparklineSeriesItemConnectors {
        color?: string;
        padding?: number;
        width?: number;
    }

    interface SparklineSeriesItemHighlightBorder {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface SparklineSeriesItemHighlight {
        border?: SparklineSeriesItemHighlightBorder;
        color?: string;
        opacity?: number;
        visible?: boolean;
    }

    interface SparklineSeriesItemLabelsBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface SparklineSeriesItemLabels {
        align?: string;
        background?: any;
        border?: SparklineSeriesItemLabelsBorder;
        color?: any;
        distance?: number;
        font?: any;
        format?: any;
        margin?: any;
        padding?: any;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface SparklineSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
        style?: string;
    }

    interface SparklineSeriesItemMarkersBorder {
        color?: any;
        width?: any;
    }

    interface SparklineSeriesItemMarkers {
        background?: any;
        border?: SparklineSeriesItemMarkersBorder;
        size?: any;
        type?: any;
        visible?: any;
        rotation?: any;
    }

    interface SparklineSeriesItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineSeriesItemNotesIcon {
        background?: string;
        border?: SparklineSeriesItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineSeriesItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineSeriesItemNotesLabel {
        background?: string;
        border?: SparklineSeriesItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface SparklineSeriesItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineSeriesItemNotes {
        position?: string;
        icon?: SparklineSeriesItemNotesIcon;
        label?: SparklineSeriesItemNotesLabel;
        line?: SparklineSeriesItemNotesLine;
    }

    interface SparklineSeriesItemOverlay {
        gradient?: string;
    }

    interface SparklineSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface SparklineSeriesItemTargetBorder {
        color?: any;
        dashType?: any;
        width?: number;
    }

    interface SparklineSeriesItemTargetLine {
        width?: any;
    }

    interface SparklineSeriesItemTarget {
        line?: SparklineSeriesItemTargetLine;
        color?: any;
        border?: SparklineSeriesItemTargetBorder;
    }

    interface SparklineSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineSeriesItemTooltip {
        background?: string;
        border?: SparklineSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineSeriesItem {
        type?: string;
        dashType?: string;
        data?: any;
        explodeField?: string;
        currentField?: string;
        targetField?: string;
        field?: string;
        name?: string;
        highlight?: SparklineSeriesItemHighlight;
        aggregate?: string;
        axis?: string;
        border?: SparklineSeriesItemBorder;
        categoryField?: string;
        color?: any;
        colorField?: string;
        connectors?: SparklineSeriesItemConnectors;
        gap?: number;
        labels?: SparklineSeriesItemLabels;
        line?: SparklineSeriesItemLine;
        markers?: SparklineSeriesItemMarkers;
        missingValues?: string;
        style?: string;
        negativeColor?: string;
        opacity?: number;
        overlay?: SparklineSeriesItemOverlay;
        padding?: number;
        size?: number;
        startAngle?: number;
        spacing?: number;
        stack?: SparklineSeriesItemStack;
        tooltip?: SparklineSeriesItemTooltip;
        width?: number;
        target?: SparklineSeriesItemTarget;
        notes?: SparklineSeriesItemNotes;
    }

    interface SparklineSeriesDefaultsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineSeriesDefaultsLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineSeriesDefaultsLabels {
        background?: string;
        border?: SparklineSeriesDefaultsLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineSeriesDefaultsStack {
        type?: string;
    }

    interface SparklineSeriesDefaultsTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineSeriesDefaultsTooltip {
        background?: string;
        border?: SparklineSeriesDefaultsTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineSeriesDefaults {
        area?: any;
        bar?: any;
        border?: SparklineSeriesDefaultsBorder;
        column?: any;
        gap?: number;
        labels?: SparklineSeriesDefaultsLabels;
        line?: any;
        overlay?: any;
        pie?: any;
        spacing?: number;
        stack?: SparklineSeriesDefaultsStack;
        type?: string;
        tooltip?: SparklineSeriesDefaultsTooltip;
    }

    interface SparklineTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineTooltip {
        background?: string;
        border?: SparklineTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
        shared?: boolean;
        sharedTemplate?: string;
    }

    interface SparklineValueAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineValueAxisItemCrosshairTooltip {
        background?: string;
        border?: SparklineValueAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineValueAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: SparklineValueAxisItemCrosshairTooltip;
    }

    interface SparklineValueAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemLabels {
        background?: string;
        border?: SparklineValueAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface SparklineValueAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface SparklineValueAxisItemMajorGridLines {
        color?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemMajorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemMinorTicks {
        size?: number;
        color?: string;
        width?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesDataItemIcon {
        background?: string;
        border?: SparklineValueAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineValueAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesDataItemLabel {
        background?: string;
        border?: SparklineValueAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface SparklineValueAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineValueAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: SparklineValueAxisItemNotesDataItemIcon;
        label?: SparklineValueAxisItemNotesDataItemLabel;
        line?: SparklineValueAxisItemNotesDataItemLine;
    }

    interface SparklineValueAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesIcon {
        background?: string;
        border?: SparklineValueAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineValueAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesLabel {
        background?: string;
        border?: SparklineValueAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface SparklineValueAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineValueAxisItemNotes {
        position?: string;
        icon?: SparklineValueAxisItemNotesIcon;
        label?: SparklineValueAxisItemNotesLabel;
        line?: SparklineValueAxisItemNotesLine;
        data?: SparklineValueAxisItemNotesDataItem[];
    }

    interface SparklineValueAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface SparklineValueAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemTitle {
        background?: string;
        border?: SparklineValueAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        padding?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface SparklineValueAxisItem {
        axisCrossingValue?: any;
        color?: string;
        labels?: SparklineValueAxisItemLabels;
        line?: SparklineValueAxisItemLine;
        majorGridLines?: SparklineValueAxisItemMajorGridLines;
        majorTicks?: SparklineValueAxisItemMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorGridLines?: SparklineValueAxisItemMinorGridLines;
        minorTicks?: SparklineValueAxisItemMinorTicks;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        plotBands?: SparklineValueAxisItemPlotBand[];
        reverse?: boolean;
        title?: SparklineValueAxisItemTitle;
        visible?: boolean;
        crosshair?: SparklineValueAxisItemCrosshair;
        notes?: SparklineValueAxisItemNotes;
    }

    interface SparklineSeriesClickEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface SparklineSeriesHoverEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface SparklineOptions {
        name?: string;
        axisDefaults?: any;
        categoryAxis?: SparklineCategoryAxisItem[];
        chartArea?: SparklineChartArea;
        data?: any;
        dataSource?: any;
        autoBind?: boolean;
        plotArea?: SparklinePlotArea;
        pointWidth?: number;
        renderAs?: string;
        series?: SparklineSeriesItem[];
        seriesColors?: any;
        seriesDefaults?: SparklineSeriesDefaults;
        theme?: string;
        tooltip?: SparklineTooltip;
        transitions?: boolean;
        type?: string;
        valueAxis?: SparklineValueAxisItem[];
        axisLabelClick?(e: SparklineAxisLabelClickEvent): void;
        dataBound?(e: SparklineEvent): void;
        dragStart?(e: SparklineDragStartEvent): void;
        drag?(e: SparklineDragEvent): void;
        dragEnd?(e: SparklineDragEndEvent): void;
        plotAreaClick?(e: SparklinePlotAreaClickEvent): void;
        seriesClick?(e: SparklineSeriesClickEvent): void;
        seriesHover?(e: SparklineSeriesHoverEvent): void;
        zoomStart?(e: SparklineZoomStartEvent): void;
        zoom?(e: SparklineZoomEvent): void;
        zoomEnd?(e: SparklineZoomEndEvent): void;
    }

    interface SparklineEvent {
        sender: Sparkline;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SparklineAxisLabelClickEvent extends SparklineEvent {
        axis?: any;
        value?: any;
        text?: any;
        index?: any;
        dataItem?: any;
        element?: any;
    }

    interface SparklineDragStartEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklineDragEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklineDragEndEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklinePlotAreaClickEvent extends SparklineEvent {
        value?: any;
        category?: any;
        element?: any;
        x?: any;
        y?: any;
    }

    interface SparklineSeriesClickEvent extends SparklineEvent {
        value?: any;
        category?: any;
        series?: SparklineSeriesClickEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface SparklineSeriesHoverEvent extends SparklineEvent {
        value?: any;
        category?: any;
        series?: SparklineSeriesHoverEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface SparklineZoomStartEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklineZoomEvent extends SparklineEvent {
        axisRanges?: any;
        delta?: number;
        originalEvent?: any;
    }

    interface SparklineZoomEndEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }


    class StockChart extends kendo.ui.Widget {
        static fn: StockChart;
        static extend(proto: Object): StockChart;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: StockChartOptions);
        options: StockChartOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        redraw(): void;
        refresh(): void;
        resize(force?: boolean): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        svg(): string;
        imageDataURL(): string;
    }

    interface StockChartCategoryAxisItemAutoBaseUnitSteps {
        days?: any;
        hours?: any;
        minutes?: any;
        months?: any;
        weeks?: any;
        years?: any;
    }

    interface StockChartCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: StockChartCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: StockChartCategoryAxisItemCrosshairTooltip;
    }

    interface StockChartCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemLabels {
        background?: string;
        border?: StockChartCategoryAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
        culture?: string;
        dateFormats?: any;
    }

    interface StockChartCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface StockChartCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemMajorTicks {
        color?: string;
        size?: number;
        width?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemMinorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: StockChartCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: StockChartCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface StockChartCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: StockChartCategoryAxisItemNotesDataItemIcon;
        label?: StockChartCategoryAxisItemNotesDataItemLabel;
        line?: StockChartCategoryAxisItemNotesDataItemLine;
    }

    interface StockChartCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesIcon {
        background?: string;
        border?: StockChartCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesLabel {
        background?: string;
        border?: StockChartCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartCategoryAxisItemNotes {
        position?: string;
        icon?: StockChartCategoryAxisItemNotesIcon;
        label?: StockChartCategoryAxisItemNotesLabel;
        line?: StockChartCategoryAxisItemNotesLine;
        data?: StockChartCategoryAxisItemNotesDataItem[];
    }

    interface StockChartCategoryAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartCategoryAxisItemSelectMousewheel {
        reverse?: boolean;
        zoom?: string;
    }

    interface StockChartCategoryAxisItemSelect {
        from?: any;
        to?: any;
        min?: any;
        max?: any;
        mousewheel?: StockChartCategoryAxisItemSelectMousewheel;
    }

    interface StockChartCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemTitle {
        background?: string;
        border?: StockChartCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItem {
        axisCrossingValue?: any;
        categories?: any;
        color?: string;
        field?: string;
        justified?: boolean;
        labels?: StockChartCategoryAxisItemLabels;
        line?: StockChartCategoryAxisItemLine;
        majorGridLines?: StockChartCategoryAxisItemMajorGridLines;
        majorTicks?: StockChartCategoryAxisItemMajorTicks;
        minorGridLines?: StockChartCategoryAxisItemMinorGridLines;
        minorTicks?: StockChartCategoryAxisItemMinorTicks;
        name?: string;
        pane?: string;
        plotBands?: StockChartCategoryAxisItemPlotBand[];
        reverse?: boolean;
        select?: StockChartCategoryAxisItemSelect;
        title?: StockChartCategoryAxisItemTitle;
        type?: string;
        autoBaseUnitSteps?: StockChartCategoryAxisItemAutoBaseUnitSteps;
        background?: string;
        baseUnit?: string;
        baseUnitStep?: any;
        max?: any;
        min?: any;
        roundToBaseUnit?: boolean;
        weekStartDay?: number;
        maxDateGroups?: number;
        visible?: boolean;
        crosshair?: StockChartCategoryAxisItemCrosshair;
        notes?: StockChartCategoryAxisItemNotes;
    }

    interface StockChartChartAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartChartArea {
        background?: string;
        opacity?: number;
        border?: StockChartChartAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface StockChartLegendBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartLegendInactiveItemsLabels {
        color?: string;
        font?: string;
        template?: string;
    }

    interface StockChartLegendInactiveItemsMarkers {
        color?: string;
    }

    interface StockChartLegendInactiveItems {
        labels?: StockChartLegendInactiveItemsLabels;
        markers?: StockChartLegendInactiveItemsMarkers;
    }

    interface StockChartLegendLabels {
        color?: string;
        font?: string;
        template?: string;
    }

    interface StockChartLegend {
        background?: string;
        border?: StockChartLegendBorder;
        labels?: StockChartLegendLabels;
        margin?: any;
        offsetX?: number;
        offsetY?: number;
        padding?: any;
        position?: string;
        visible?: boolean;
        inactiveItems?: StockChartLegendInactiveItems;
    }

    interface StockChartNavigatorCategoryAxisItemAutoBaseUnitSteps {
        seconds?: any;
        minutes?: any;
        hours?: any;
        days?: any;
        weeks?: any;
        months?: any;
        years?: any;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: StockChartNavigatorCategoryAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: StockChartNavigatorCategoryAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabels {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: StockChartNavigatorCategoryAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: StockChartNavigatorCategoryAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: StockChartNavigatorCategoryAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: StockChartNavigatorCategoryAxisItemNotesDataItemIcon;
        label?: StockChartNavigatorCategoryAxisItemNotesDataItemLabel;
        line?: StockChartNavigatorCategoryAxisItemNotesDataItemLine;
    }

    interface StockChartNavigatorCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesIcon {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesLabel {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartNavigatorCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotes {
        position?: string;
        icon?: StockChartNavigatorCategoryAxisItemNotesIcon;
        label?: StockChartNavigatorCategoryAxisItemNotesLabel;
        line?: StockChartNavigatorCategoryAxisItemNotesLine;
        data?: StockChartNavigatorCategoryAxisItemNotesDataItem[];
    }

    interface StockChartNavigatorCategoryAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitle {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: StockChartNavigatorCategoryAxisItemTitleMargin;
        padding?: StockChartNavigatorCategoryAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItem {
        autoBaseUnitSteps?: StockChartNavigatorCategoryAxisItemAutoBaseUnitSteps;
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        baseUnitStep?: any;
        categories?: any;
        color?: string;
        crosshair?: StockChartNavigatorCategoryAxisItemCrosshair;
        field?: string;
        justified?: boolean;
        labels?: StockChartNavigatorCategoryAxisItemLabels;
        line?: StockChartNavigatorCategoryAxisItemLine;
        majorGridLines?: StockChartNavigatorCategoryAxisItemMajorGridLines;
        majorTicks?: StockChartNavigatorCategoryAxisItemMajorTicks;
        max?: any;
        maxDateGroups?: number;
        min?: any;
        minorGridLines?: StockChartNavigatorCategoryAxisItemMinorGridLines;
        minorTicks?: StockChartNavigatorCategoryAxisItemMinorTicks;
        plotBands?: StockChartNavigatorCategoryAxisItemPlotBand[];
        reverse?: boolean;
        roundToBaseUnit?: boolean;
        title?: StockChartNavigatorCategoryAxisItemTitle;
        visible?: boolean;
        weekStartDay?: number;
        notes?: StockChartNavigatorCategoryAxisItemNotes;
    }

    interface StockChartNavigatorHint {
        visible?: boolean;
        template?: any;
        format?: string;
    }

    interface StockChartNavigatorPaneBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorPaneMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorPanePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorPaneTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorPaneTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorPaneTitle {
        background?: string;
        border?: StockChartNavigatorPaneTitleBorder;
        color?: string;
        font?: string;
        margin?: StockChartNavigatorPaneTitleMargin;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorPane {
        background?: string;
        border?: StockChartNavigatorPaneBorder;
        height?: number;
        margin?: StockChartNavigatorPaneMargin;
        name?: string;
        padding?: StockChartNavigatorPanePadding;
        title?: StockChartNavigatorPaneTitle;
    }

    interface StockChartNavigatorSelect {
        from?: Date;
        to?: Date;
    }

    interface StockChartNavigatorSeriesItemBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemHighlightBorder {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartNavigatorSeriesItemHighlightLine {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartNavigatorSeriesItemHighlight {
        border?: StockChartNavigatorSeriesItemHighlightBorder;
        color?: string;
        line?: StockChartNavigatorSeriesItemHighlightLine;
        opacity?: number;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemLabels {
        background?: string;
        border?: StockChartNavigatorSeriesItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        position?: string;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
    }

    interface StockChartNavigatorSeriesItemMarkersBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemMarkers {
        background?: string;
        border?: StockChartNavigatorSeriesItemMarkersBorder;
        rotation?: any;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItemOverlay {
        gradient?: string;
    }

    interface StockChartNavigatorSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface StockChartNavigatorSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemTooltip {
        background?: string;
        border?: StockChartNavigatorSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItem {
        type?: string;
        dashType?: string;
        data?: any;
        highField?: string;
        field?: string;
        categoryField?: string;
        name?: string;
        highlight?: StockChartNavigatorSeriesItemHighlight;
        aggregate?: string;
        axis?: string;
        border?: StockChartNavigatorSeriesItemBorder;
        closeField?: string;
        color?: string;
        colorField?: string;
        downColor?: string;
        downColorField?: string;
        gap?: number;
        labels?: StockChartNavigatorSeriesItemLabels;
        line?: StockChartNavigatorSeriesItemLine;
        lowField?: string;
        markers?: StockChartNavigatorSeriesItemMarkers;
        missingValues?: string;
        style?: string;
        opacity?: number;
        openField?: string;
        overlay?: StockChartNavigatorSeriesItemOverlay;
        spacing?: number;
        stack?: StockChartNavigatorSeriesItemStack;
        tooltip?: StockChartNavigatorSeriesItemTooltip;
        width?: number;
    }

    interface StockChartNavigator {
        categoryAxis?: StockChartNavigatorCategoryAxisItem[];
        dataSource?: any;
        autoBind?: boolean;
        dateField?: string;
        pane?: StockChartNavigatorPane;
        visible?: boolean;
        series?: StockChartNavigatorSeriesItem[];
        select?: StockChartNavigatorSelect;
        hint?: StockChartNavigatorHint;
    }

    interface StockChartPaneBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartPaneTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartPaneTitle {
        background?: string;
        border?: StockChartPaneTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface StockChartPane {
        name?: string;
        margin?: any;
        padding?: any;
        background?: string;
        border?: StockChartPaneBorder;
        clip?: boolean;
        height?: number;
        title?: StockChartPaneTitle;
    }

    interface StockChartPlotAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartPlotArea {
        background?: string;
        opacity?: number;
        border?: StockChartPlotAreaBorder;
        margin?: any;
    }

    interface StockChartSeriesItemBorder {
        color?: any;
        dashType?: any;
        opacity?: any;
        width?: any;
    }

    interface StockChartSeriesItemHighlightBorder {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartSeriesItemHighlightLine {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartSeriesItemHighlight {
        visible?: boolean;
        border?: StockChartSeriesItemHighlightBorder;
        color?: string;
        line?: StockChartSeriesItemHighlightLine;
        opacity?: number;
    }

    interface StockChartSeriesItemLabelsBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface StockChartSeriesItemLabels {
        background?: any;
        border?: StockChartSeriesItemLabelsBorder;
        color?: any;
        font?: any;
        format?: any;
        margin?: any;
        padding?: any;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface StockChartSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
        style?: string;
    }

    interface StockChartSeriesItemMarkersBorder {
        color?: any;
        width?: any;
    }

    interface StockChartSeriesItemMarkers {
        background?: any;
        border?: StockChartSeriesItemMarkersBorder;
        size?: any;
        rotation?: any;
        type?: any;
        visible?: any;
    }

    interface StockChartSeriesItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartSeriesItemNotesIcon {
        background?: string;
        border?: StockChartSeriesItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartSeriesItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartSeriesItemNotesLabel {
        background?: string;
        border?: StockChartSeriesItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartSeriesItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartSeriesItemNotes {
        position?: string;
        icon?: StockChartSeriesItemNotesIcon;
        label?: StockChartSeriesItemNotesLabel;
        line?: StockChartSeriesItemNotesLine;
    }

    interface StockChartSeriesItemOverlay {
        gradient?: string;
    }

    interface StockChartSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface StockChartSeriesItemTargetBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface StockChartSeriesItemTargetLine {
        width?: any;
    }

    interface StockChartSeriesItemTarget {
        line?: StockChartSeriesItemTargetLine;
        color?: any;
        border?: StockChartSeriesItemTargetBorder;
    }

    interface StockChartSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartSeriesItemTooltip {
        background?: string;
        border?: StockChartSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartSeriesItem {
        type?: string;
        dashType?: string;
        data?: any;
        highField?: string;
        field?: string;
        categoryField?: string;
        currentField?: string;
        targetField?: string;
        name?: string;
        highlight?: StockChartSeriesItemHighlight;
        aggregate?: string;
        axis?: string;
        border?: StockChartSeriesItemBorder;
        closeField?: string;
        color?: any;
        colorField?: string;
        downColor?: any;
        downColorField?: string;
        gap?: number;
        labels?: StockChartSeriesItemLabels;
        line?: StockChartSeriesItemLine;
        lowField?: string;
        markers?: StockChartSeriesItemMarkers;
        missingValues?: string;
        style?: string;
        negativeColor?: string;
        opacity?: number;
        openField?: string;
        overlay?: StockChartSeriesItemOverlay;
        spacing?: number;
        stack?: StockChartSeriesItemStack;
        tooltip?: StockChartSeriesItemTooltip;
        visibleInLegend?: boolean;
        width?: number;
        target?: StockChartSeriesItemTarget;
        notes?: StockChartSeriesItemNotes;
    }

    interface StockChartSeriesDefaultsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartSeriesDefaultsLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartSeriesDefaultsLabels {
        background?: string;
        border?: StockChartSeriesDefaultsLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartSeriesDefaultsStack {
        type?: string;
    }

    interface StockChartSeriesDefaultsTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartSeriesDefaultsTooltip {
        background?: string;
        border?: StockChartSeriesDefaultsTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartSeriesDefaults {
        area?: any;
        candlestick?: any;
        ohlc?: any;
        border?: StockChartSeriesDefaultsBorder;
        column?: any;
        gap?: number;
        labels?: StockChartSeriesDefaultsLabels;
        line?: any;
        overlay?: any;
        pie?: any;
        spacing?: number;
        stack?: StockChartSeriesDefaultsStack;
        type?: string;
        tooltip?: StockChartSeriesDefaultsTooltip;
    }

    interface StockChartTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartTitle {
        align?: string;
        background?: string;
        border?: StockChartTitleBorder;
        font?: string;
        margin?: any;
        padding?: any;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface StockChartTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartTooltip {
        background?: string;
        border?: StockChartTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
        shared?: boolean;
        sharedTemplate?: string;
    }

    interface StockChartValueAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartValueAxisItemCrosshairTooltip {
        background?: string;
        border?: StockChartValueAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartValueAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: StockChartValueAxisItemCrosshairTooltip;
    }

    interface StockChartValueAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemLabels {
        background?: string;
        border?: StockChartValueAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface StockChartValueAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface StockChartValueAxisItemMajorGridLines {
        color?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemMajorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemMinorTicks {
        size?: number;
        color?: string;
        width?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesDataItemIcon {
        background?: string;
        border?: StockChartValueAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartValueAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesDataItemLabel {
        background?: string;
        border?: StockChartValueAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface StockChartValueAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartValueAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: StockChartValueAxisItemNotesDataItemIcon;
        label?: StockChartValueAxisItemNotesDataItemLabel;
        line?: StockChartValueAxisItemNotesDataItemLine;
    }

    interface StockChartValueAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesIcon {
        background?: string;
        border?: StockChartValueAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartValueAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesLabel {
        background?: string;
        border?: StockChartValueAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartValueAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartValueAxisItemNotes {
        position?: string;
        icon?: StockChartValueAxisItemNotesIcon;
        label?: StockChartValueAxisItemNotesLabel;
        line?: StockChartValueAxisItemNotesLine;
        data?: StockChartValueAxisItemNotesDataItem[];
    }

    interface StockChartValueAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartValueAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemTitle {
        background?: string;
        border?: StockChartValueAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        padding?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface StockChartValueAxisItem {
        axisCrossingValue?: any;
        background?: string;
        color?: string;
        labels?: StockChartValueAxisItemLabels;
        line?: StockChartValueAxisItemLine;
        majorGridLines?: StockChartValueAxisItemMajorGridLines;
        majorTicks?: StockChartValueAxisItemMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorGridLines?: StockChartValueAxisItemMinorGridLines;
        minorTicks?: StockChartValueAxisItemMinorTicks;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: StockChartValueAxisItemPlotBand[];
        reverse?: boolean;
        title?: StockChartValueAxisItemTitle;
        visible?: boolean;
        crosshair?: StockChartValueAxisItemCrosshair;
        notes?: StockChartValueAxisItemNotes;
    }

    interface StockChartSeriesClickEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface StockChartSeriesHoverEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface StockChartOptions {
        name?: string;
        dateField?: string;
        navigator?: StockChartNavigator;
        axisDefaults?: any;
        categoryAxis?: StockChartCategoryAxisItem[];
        chartArea?: StockChartChartArea;
        dataSource?: any;
        autoBind?: boolean;
        legend?: StockChartLegend;
        panes?: StockChartPane[];
        plotArea?: StockChartPlotArea;
        renderAs?: string;
        series?: StockChartSeriesItem[];
        seriesColors?: any;
        seriesDefaults?: StockChartSeriesDefaults;
        theme?: string;
        title?: StockChartTitle;
        tooltip?: StockChartTooltip;
        transitions?: boolean;
        valueAxis?: StockChartValueAxisItem[];
        axisLabelClick?(e: StockChartAxisLabelClickEvent): void;
        legendItemClick?(e: StockChartLegendItemClickEvent): void;
        legendItemHover?(e: StockChartLegendItemHoverEvent): void;
        dataBound?(e: StockChartEvent): void;
        dragStart?(e: StockChartDragStartEvent): void;
        drag?(e: StockChartDragEvent): void;
        dragEnd?(e: StockChartDragEndEvent): void;
        noteClick?(e: StockChartNoteClickEvent): void;
        noteHover?(e: StockChartNoteHoverEvent): void;
        plotAreaClick?(e: StockChartPlotAreaClickEvent): void;
        seriesClick?(e: StockChartSeriesClickEvent): void;
        seriesHover?(e: StockChartSeriesHoverEvent): void;
        zoomStart?(e: StockChartZoomStartEvent): void;
        zoom?(e: StockChartZoomEvent): void;
        zoomEnd?(e: StockChartZoomEndEvent): void;
        selectStart?(e: StockChartSelectStartEvent): void;
        select?(e: StockChartSelectEvent): void;
        selectEnd?(e: StockChartSelectEndEvent): void;
    }

    interface StockChartEvent {
        sender: StockChart;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface StockChartAxisLabelClickEvent extends StockChartEvent {
        axis?: any;
        value?: any;
        text?: any;
        index?: any;
        dataItem?: any;
        element?: any;
    }

    interface StockChartLegendItemClickEvent extends StockChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface StockChartLegendItemHoverEvent extends StockChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface StockChartDragStartEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartDragEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartDragEndEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartNoteClickEvent extends StockChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface StockChartNoteHoverEvent extends StockChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface StockChartPlotAreaClickEvent extends StockChartEvent {
        value?: any;
        category?: any;
        element?: any;
        x?: any;
        y?: any;
    }

    interface StockChartSeriesClickEvent extends StockChartEvent {
        value?: any;
        category?: any;
        series?: StockChartSeriesClickEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface StockChartSeriesHoverEvent extends StockChartEvent {
        value?: any;
        category?: any;
        series?: StockChartSeriesHoverEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface StockChartZoomStartEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartZoomEvent extends StockChartEvent {
        axisRanges?: any;
        delta?: number;
        originalEvent?: any;
    }

    interface StockChartZoomEndEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartSelectStartEvent extends StockChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface StockChartSelectEvent extends StockChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface StockChartSelectEndEvent extends StockChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }


}
declare module kendo.dataviz.diagram {
    class Circle extends Observable {
        constructor(options?: CircleOptions);
        options: CircleOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface CircleStroke {
        color?: string;
        width?: number;
    }

    interface CircleOptions {
        name?: string;
        background?: string;
        stroke?: CircleStroke;
        center?: any;
        radius?: number;
    }

    interface CircleEvent {
        sender: Circle;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Connection extends Observable {
        constructor(options?: ConnectionOptions);
        options: ConnectionOptions;
        source(): any;
        source(source: kendo.dataviz.diagram.Shape): void;
        source(source: kendo.dataviz.diagram.Point): void;
        source(source: kendo.dataviz.diagram.Connector): void;
        sourcePoint(): kendo.dataviz.diagram.Point;
        target(): any;
        target(target: kendo.dataviz.diagram.Shape): void;
        target(target: kendo.dataviz.diagram.Point): void;
        target(target: kendo.dataviz.diagram.Connector): void;
        targetPoint(): kendo.dataviz.diagram.Point;
        select(value: boolean): void;
        type(): void;
        type(value: string): void;
        points(): any;
        allPoints(): any;
        redraw(): void;
    }

    interface ConnectionHoverStroke {
        color?: string;
    }

    interface ConnectionHover {
        stroke?: ConnectionHoverStroke;
    }

    interface ConnectionPoint {
        x?: number;
        y?: number;
    }

    interface ConnectionStroke {
        color?: string;
    }

    interface ConnectionOptions {
        name?: string;
        stroke?: ConnectionStroke;
        hover?: ConnectionHover;
        startCap?: string;
        endCap?: string;
        points?: ConnectionPoint[];
    }

    interface ConnectionEvent {
        sender: Connection;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Connector extends Observable {
        constructor(options?: ConnectorOptions);
        options: ConnectorOptions;
        position(): kendo.dataviz.diagram.Point;
        position(position: kendo.dataviz.diagram.Point): void;
    }

    interface ConnectorOptions {
        name?: string;
        width?: number;
        height?: number;
        background?: string;
        hoveredBackground?: string;
    }

    interface ConnectorEvent {
        sender: Connector;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Group extends Observable {
        constructor(options?: GroupOptions);
        options: GroupOptions;
        append(element: any): void;
        clear(): void;
        remove(element: any): void;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface GroupOptions {
        name?: string;
        x?: number;
        y?: number;
    }

    interface GroupEvent {
        sender: Group;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Image extends Observable {
        constructor(options?: ImageOptions);
        options: ImageOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface ImageOptions {
        name?: string;
        height?: number;
        width?: number;
        x?: number;
        y?: number;
    }

    interface ImageEvent {
        sender: Image;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Line extends Observable {
        constructor(options?: LineOptions);
        options: LineOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface LineStroke {
        color?: string;
        width?: number;
    }

    interface LineOptions {
        name?: string;
        stroke?: LineStroke;
        from?: any;
        to?: any;
    }

    interface LineEvent {
        sender: Line;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Point extends Observable {
        constructor(options?: PointOptions);
        options: PointOptions;
    }

    interface PointOptions {
        name?: string;
        x?: number;
    }

    interface PointEvent {
        sender: Point;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Rect extends Observable {
        constructor(options?: RectOptions);
        options: RectOptions;
    }

    interface RectOptions {
        name?: string;
        height?: number;
        width?: number;
        x?: number;
        y?: number;
    }

    interface RectEvent {
        sender: Rect;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Rectangle extends Observable {
        constructor(options?: RectangleOptions);
        options: RectangleOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface RectangleStroke {
        color?: string;
        width?: number;
    }

    interface RectangleOptions {
        name?: string;
        background?: string;
        height?: number;
        stroke?: RectangleStroke;
        width?: number;
        x?: number;
        y?: number;
    }

    interface RectangleEvent {
        sender: Rectangle;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Shape extends Observable {
        constructor(options?: ShapeOptions);
        options: ShapeOptions;
        position(): void;
        position(point: kendo.dataviz.diagram.Point): void;
        clone(): kendo.dataviz.diagram.Shape;
        select(value: boolean): void;
        connections(type: string): void;
        getConnector(): void;
        getPosition(side: string): void;
        redraw(): void;
    }

    interface ShapeConnector {
        name?: string;
        description?: string;
        position?: Function;
    }

    interface ShapeContent {
        text?: string;
        align?: string;
    }

    interface ShapeHover {
        background?: string;
    }

    interface ShapeRotation {
        angle?: number;
    }

    interface ShapeStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface ShapeOptions {
        name?: string;
        id?: string;
        path?: string;
        stroke?: ShapeStroke;
        type?: string;
        x?: number;
        y?: number;
        minWidth?: number;
        minHeight?: number;
        width?: number;
        height?: number;
        background?: string;
        hover?: ShapeHover;
        connectors?: ShapeConnector[];
        rotation?: ShapeRotation;
        content?: ShapeContent;
        visual?: Function;
    }

    interface ShapeEvent {
        sender: Shape;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class TextBlock extends Observable {
        constructor(options?: TextBlockOptions);
        options: TextBlockOptions;
        content(): string;
        content(content: string): void;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface TextBlockOptions {
        name?: string;
        background?: string;
        color?: string;
        fontFamily?: string;
        fontSize?: number;
        height?: number;
        text?: string;
        width?: number;
        x?: number;
        y?: number;
    }

    interface TextBlockEvent {
        sender: TextBlock;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module kendo {
    class Color extends Observable {
        options: ColorOptions;
        diff(): number;
        equals(): boolean;
    }

    interface ColorOptions {
        name?: string;
    }

    interface ColorEvent {
        sender: Color;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module FX {
    class FX  {
        options: FXOptions;
        kendoAnimate(duration: number, reverse: boolean, complete: Function, show: boolean, hide: boolean): void;
        kendoStop(gotoEnd: boolean): void;
        kendoAddClass(classes: string, options: any): void;
        kendoRemoveClass(classes: string, options: any): void;
        kendoToggleClass(classes: string, options: any, toggle: boolean): void;
    }

    interface FXKendoAddClassOptions {
        duration?: number;
        exclusive?: string;
        ease?: string;
    }

    interface FXKendoRemoveClassOptions {
        duration?: number;
        exclusive?: string;
        ease?: string;
    }

    interface FXKendoToggleClassOptions {
        duration?: number;
        exclusive?: string;
        ease?: string;
    }

    interface FXOptions {
        name?: string;
    }

    interface FXEvent {
        sender: FX;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module kendo.ui {
    class Validator extends kendo.ui.Widget {
        static fn: Validator;
        static extend(proto: Object): Validator;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ValidatorOptions);
        options: ValidatorOptions;
        errors(): any;
        hideMessages(): void;
        validate(): boolean;
        validateInput(input: Element): boolean;
        validateInput(input: JQuery): boolean;
    }

    interface ValidatorOptions {
        name?: string;
        errorTemplate?: string;
        messages?: any;
        rules?: any;
        validateOnBlur?: boolean;
        validate?(e: ValidatorValidateEvent): void;
    }

    interface ValidatorEvent {
        sender: Validator;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ValidatorValidateEvent extends ValidatorEvent {
    }


}

interface HTMLElement {
    kendoBindingTarget: kendo.data.Binding;
}

interface JQueryXHR {
}

interface JQueryEventObject {
}

interface JQueryPromise<T> {
}

interface JQuery {

    kendoDraggable(): JQuery;
    kendoDraggable(options: kendo.ui.DraggableOptions): JQuery;

    kendoDropTarget(): JQuery;
    kendoDropTarget(options: kendo.ui.DropTargetOptions): JQuery;

    kendoDropTargetArea(): JQuery;
    kendoDropTargetArea(options: kendo.ui.DropTargetAreaOptions): JQuery;

    data(key: any): any;

    kendoBarcode(): JQuery;
    kendoBarcode(options: kendo.dataviz.ui.BarcodeOptions): JQuery;
    data(key: "kendoBarcode") : kendo.dataviz.ui.Barcode;

    kendoChart(): JQuery;
    kendoChart(options: kendo.dataviz.ui.ChartOptions): JQuery;
    data(key: "kendoChart") : kendo.dataviz.ui.Chart;

    kendoDiagram(): JQuery;
    kendoDiagram(options: kendo.dataviz.ui.DiagramOptions): JQuery;
    data(key: "kendoDiagram") : kendo.dataviz.ui.Diagram;

    kendoLinearGauge(): JQuery;
    kendoLinearGauge(options: kendo.dataviz.ui.LinearGaugeOptions): JQuery;
    data(key: "kendoLinearGauge") : kendo.dataviz.ui.LinearGauge;

    kendoMap(): JQuery;
    kendoMap(options: kendo.dataviz.ui.MapOptions): JQuery;
    data(key: "kendoMap") : kendo.dataviz.ui.Map;

    kendoQRCode(): JQuery;
    kendoQRCode(options: kendo.dataviz.ui.QRCodeOptions): JQuery;
    data(key: "kendoQRCode") : kendo.dataviz.ui.QRCode;

    kendoRadialGauge(): JQuery;
    kendoRadialGauge(options: kendo.dataviz.ui.RadialGaugeOptions): JQuery;
    data(key: "kendoRadialGauge") : kendo.dataviz.ui.RadialGauge;

    kendoSparkline(): JQuery;
    kendoSparkline(options: kendo.dataviz.ui.SparklineOptions): JQuery;
    data(key: "kendoSparkline") : kendo.dataviz.ui.Sparkline;

    kendoStockChart(): JQuery;
    kendoStockChart(options: kendo.dataviz.ui.StockChartOptions): JQuery;
    data(key: "kendoStockChart") : kendo.dataviz.ui.StockChart;

    kendoValidator(): JQuery;
    kendoValidator(options: kendo.ui.ValidatorOptions): JQuery;
    data(key: "kendoValidator") : kendo.ui.Validator;

}
