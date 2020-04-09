/// <amd-module name="@angular/localize/src/tools/src/file_utils" />
export declare class FileUtils {
    static readFile(absolutePath: string): string;
    static readFileBuffer(absolutePath: string): Buffer;
    static writeFile(absolutePath: string, contents: string | Buffer): void;
    static ensureDir(absolutePath: string): void;
    static remove(p: string): void;
    static isRoot(absolutePath: string): boolean;
}
