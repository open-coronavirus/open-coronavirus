/**
 * Protractor target options for Build Facade.
 */
export interface Schema {
    /**
     * Base URL for protractor to connect to.
     */
    baseUrl?: string;
    /**
     * Dev server target to run tests against.
     */
    devServerTarget?: string;
    /**
     * Start Protractor's Element Explorer for debugging.
     */
    elementExplorer?: boolean;
    /**
     * Host to listen on.
     */
    host?: string;
    /**
     * The port to use to serve the application.
     */
    port?: number;
    /**
     * The name of the Protractor configuration file.
     */
    protractorConfig: string;
    /**
     * Override specs in the protractor config.
     */
    specs?: string[];
    /**
     * Override suite in the protractor config.
     */
    suite?: string;
    /**
     * Try to update webdriver.
     */
    webdriverUpdate?: boolean;
}
