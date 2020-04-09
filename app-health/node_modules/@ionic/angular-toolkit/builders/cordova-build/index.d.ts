import { BuilderContext } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { CordovaBuildBuilderSchema } from './schema';
export declare function buildCordova(options: CordovaBuildBuilderSchema, context: BuilderContext): Promise<import("@angular-devkit/architect").BuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<json.JsonObject & CordovaBuildBuilderSchema>;
export default _default;
