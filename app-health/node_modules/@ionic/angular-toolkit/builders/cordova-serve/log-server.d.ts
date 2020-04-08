import * as WebSocket from 'ws';
export interface ConsoleLogServerMessage {
    category: 'console';
    type: string;
    data: any[];
}
export interface ConsoleLogServerOptions {
    consolelogs: boolean;
    consolelogsPort: number;
}
export declare function isConsoleLogServerMessage(m: any): m is ConsoleLogServerMessage;
export declare function createConsoleLogServer(host: string, port: number): Promise<WebSocket.Server>;
