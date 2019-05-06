"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const util_1 = require("../util/util");
const browser_1 = require("@angular-devkit/build-angular/src/browser");
const ts = require("typescript");
exports.execute = (options, context) => {
    let serverOptions;
    let buildElectronOptions;
    function setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const browserTarget = architect_1.targetFromTargetString(options.browserTarget);
            serverOptions = yield context.getTargetOptions(browserTarget);
            const buildOptions = yield context.getTargetOptions({
                project: context.target.project,
                target: "build"
            });
            buildOptions.browserTarget = context.target.project + ":package";
            buildOptions.port = options.port ? options.port : 4200;
            buildOptions.watch = true;
            buildOptions.baseHref = "./";
            util_1.compile([options.electronMain], {
                noEmitOnError: true,
                noImplicitAny: true,
                target: ts.ScriptTarget.ES2015,
                module: ts.ModuleKind.CommonJS,
                outDir: buildOptions.outputPath
            });
            const electronBuildTarget = architect_1.targetFromTargetString(context.target.project + ":package-electron");
            buildElectronOptions = yield context.getTargetOptions(electronBuildTarget);
            return {
                buildOptions: buildOptions,
                buildElectronOptions: buildElectronOptions
            };
        });
    }
    return rxjs_1.from(setup()).pipe(operators_1.switchMap(opt => {
        return browser_1.buildWebpackBrowser(opt.buildOptions, context, {
            webpackConfiguration: util_1.noneElectronWebpackConfigTransformFactory(opt.buildOptions, opt.buildElectronOptions, context)
        });
    }), operators_1.mapTo({ success: true }));
};
exports.default = architect_1.createBuilder(exports.execute);
//# sourceMappingURL=index.js.map