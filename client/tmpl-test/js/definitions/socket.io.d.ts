
declare module io {
    export function connect(url:string):Socket;
}

interface Socket {
    json:any;
    log: any;
    volatile: any;
    broadcast: any;
    in(room: string): Socket;
    to(room: string): Socket;
    join(name: string, fn: Function): Socket;
    unjoin(name: string, fn: Function): Socket;
    set(key: string, value: any, fn: Function): Socket;
    get(key: string, value: any, fn: Function): Socket;
    has(key: string, fn: Function): Socket;
    del(key: string, fn: Function): Socket;
    disconnect(): Socket;
    send(data: any, fn: Function): Socket;
    emit(ev: any, ...data:any[]): Socket;
    on(ns: string, fn: Function): Socket;
}

interface SocketNamespace {
    clients(room: string): Socket[];
    log: any;
    store: any;
    json: any;
    volatile: any;
    in(room: string): SocketNamespace;
    on(evt: string, fn: Function): SocketNamespace;
    to(room: string): SocketNamespace;
    except(id: any): SocketNamespace;
    send(data: any): any;
    emit(ev: any, ...data:any[]): Socket;
    socket(sid: any, readable: boolean): Socket;
    authorization(fn: Function);
}

interface SocketManager {
    get(key: any): any;
    set(key: any, value: any): SocketManager;
    enable(key: any): SocketManager;
    disable(key: any): SocketManager;
    enabled(key: any): boolean;
    disabled(key: any): boolean;
    configure(env: string, fn: Function): SocketManager;
    configure(fn: Function): SocketManager;
    of(nsp: string): SocketNamespace;
    on(ns: string, fn: Function): SocketManager;
    sockets: SocketNamespace;
}