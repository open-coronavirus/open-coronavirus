import { Arguments, Option } from '../models/interface';
import { SchematicCommand } from '../models/schematic-command';
import { Schema as UpdateCommandSchema } from './update';
export declare class UpdateCommand extends SchematicCommand<UpdateCommandSchema> {
    readonly allowMissingWorkspace = true;
    private readonly packageManager;
    parseArguments(_schematicOptions: string[], _schema: Option[]): Promise<Arguments>;
    run(options: UpdateCommandSchema & Arguments): Promise<number | void>;
    checkCleanGit(): boolean;
    /**
   * Checks if the current installed CLI version is older than the latest version.
   * @returns `true` when the installed version is older.
  */
    private checkCLILatestVersion;
}
