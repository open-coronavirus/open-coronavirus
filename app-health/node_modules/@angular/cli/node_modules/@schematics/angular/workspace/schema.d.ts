export interface Schema {
    /**
     * When true, creates a workspace without any testing frameworks. (Use for learning purposes
     * only.)
     */
    minimal?: boolean;
    /**
     * The name of the workspace.
     */
    name: string;
    /**
     * The path where new projects will be created.
     */
    newProjectRoot?: string;
    /**
     * The version of the Angular CLI to use.
     */
    version: string;
}
