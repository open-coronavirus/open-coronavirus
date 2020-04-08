/// <amd-module name="@angular/compiler-cli/ngcc" />
import { mainNgcc } from './src/main';
export { ConsoleLogger, LogLevel } from './src/logging/console_logger';
export { Logger } from './src/logging/logger';
export { NgccOptions } from './src/main';
export { PathMappings } from './src/utils';
export declare function hasBeenProcessed(packageJson: object, format: string): boolean;
export declare function process(...args: Parameters<typeof mainNgcc>): void;
