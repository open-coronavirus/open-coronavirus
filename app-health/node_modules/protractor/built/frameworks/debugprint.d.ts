import { Runner } from '../runner';
import { RunResults } from '../taskRunner';
/**
 * A debug framework which does not actually run any tests, just spits
 * out the list that would be run.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {Promise} Promise resolved with the test results
 */
export declare const run: (runner: Runner, specs: string[]) => Promise<RunResults>;
