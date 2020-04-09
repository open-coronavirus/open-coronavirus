"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../browser/schema");
const bundle_calculator_1 = require("../utilities/bundle-calculator");
const stats_1 = require("../utilities/stats");
class BundleBudgetPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        const { budgets } = this.options;
        if (!budgets || budgets.length === 0) {
            return;
        }
        compiler.hooks.compilation.tap('BundleBudgetPlugin', (compilation) => {
            compilation.hooks.afterOptimizeChunkAssets.tap('BundleBudgetPlugin', () => {
                // In AOT compilations component styles get processed in child compilations.
                // tslint:disable-next-line: no-any
                const parentCompilation = compilation.compiler.parentCompilation;
                if (!parentCompilation) {
                    return;
                }
                const filteredBudgets = budgets.filter(budget => budget.type === schema_1.Type.AnyComponentStyle);
                this.runChecks(filteredBudgets, compilation);
            });
        });
        compiler.hooks.afterEmit.tap('BundleBudgetPlugin', (compilation) => {
            const filteredBudgets = budgets.filter(budget => budget.type !== schema_1.Type.AnyComponentStyle);
            this.runChecks(filteredBudgets, compilation);
        });
    }
    checkMinimum(threshold, size, messages) {
        if (threshold) {
            if (threshold > size.size) {
                const sizeDifference = stats_1.formatSize(threshold - size.size);
                messages.push(`budgets, minimum exceeded for ${size.label}. `
                    + `Budget ${stats_1.formatSize(threshold)} was not reached by ${sizeDifference}.`);
            }
        }
    }
    checkMaximum(threshold, size, messages) {
        if (threshold) {
            if (threshold < size.size) {
                const sizeDifference = stats_1.formatSize(size.size - threshold);
                messages.push(`budgets, maximum exceeded for ${size.label}. `
                    + `Budget ${stats_1.formatSize(threshold)} was exceeded by ${sizeDifference}.`);
            }
        }
    }
    calculate(budget) {
        const thresholds = {};
        if (budget.maximumWarning) {
            thresholds.maximumWarning = bundle_calculator_1.calculateBytes(budget.maximumWarning, budget.baseline, 1);
        }
        if (budget.maximumError) {
            thresholds.maximumError = bundle_calculator_1.calculateBytes(budget.maximumError, budget.baseline, 1);
        }
        if (budget.minimumWarning) {
            thresholds.minimumWarning = bundle_calculator_1.calculateBytes(budget.minimumWarning, budget.baseline, -1);
        }
        if (budget.minimumError) {
            thresholds.minimumError = bundle_calculator_1.calculateBytes(budget.minimumError, budget.baseline, -1);
        }
        if (budget.warning) {
            thresholds.warningLow = bundle_calculator_1.calculateBytes(budget.warning, budget.baseline, -1);
        }
        if (budget.warning) {
            thresholds.warningHigh = bundle_calculator_1.calculateBytes(budget.warning, budget.baseline, 1);
        }
        if (budget.error) {
            thresholds.errorLow = bundle_calculator_1.calculateBytes(budget.error, budget.baseline, -1);
        }
        if (budget.error) {
            thresholds.errorHigh = bundle_calculator_1.calculateBytes(budget.error, budget.baseline, 1);
        }
        return thresholds;
    }
    runChecks(budgets, compilation) {
        budgets
            .map(budget => ({
            budget,
            thresholds: this.calculate(budget),
            sizes: bundle_calculator_1.calculateSizes(budget, compilation),
        }))
            .forEach(budgetCheck => {
            budgetCheck.sizes.forEach(size => {
                this.checkMaximum(budgetCheck.thresholds.maximumWarning, size, compilation.warnings);
                this.checkMaximum(budgetCheck.thresholds.maximumError, size, compilation.errors);
                this.checkMinimum(budgetCheck.thresholds.minimumWarning, size, compilation.warnings);
                this.checkMinimum(budgetCheck.thresholds.minimumError, size, compilation.errors);
                this.checkMinimum(budgetCheck.thresholds.warningLow, size, compilation.warnings);
                this.checkMaximum(budgetCheck.thresholds.warningHigh, size, compilation.warnings);
                this.checkMinimum(budgetCheck.thresholds.errorLow, size, compilation.errors);
                this.checkMaximum(budgetCheck.thresholds.errorHigh, size, compilation.errors);
            });
        });
    }
}
exports.BundleBudgetPlugin = BundleBudgetPlugin;
