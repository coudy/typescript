// This file contains the build logic for the public repo

var fs = require("fs");
var path = require("path");

// Variables
var compilerDirectory = "src/compiler/";
var servicesDirectory = "src/services/";
var harnessDirectory = "src/harness/";
var resourcesDirectory = "src/compiler/resources/";
var runnersDirectory = "tests/runners/";
var libraryDirectory = "typings/";

var builtDirectory = "built/";
var builtLocalDirectory = "built/local/";
var builtTestDirectory = "built/localtest/";
var LKGDirectory = "bin/";

var copyright = "CopyrightNotice.txt";
var thirdParty = "ThirdPartyNoticeText.txt";
var compilerSources = [
	"diagnostics.ts",
	"flags.ts",
	"nodeTypes.ts",
	"hashTable.ts",
	"ast.ts",
	"astWalker.ts",
	"astPath.ts",
	"types.ts",
	"base64.ts",
	"sourceMapping.ts",
	"emitter.ts",
	"declarationEmitter.ts",
	"precompile.ts",
	"pathUtils.ts",
	"referenceResolution.ts",
	"referenceResolver.ts",
	"core/environment.ts",
	"syntax/parser.ts",
	"syntax/syntaxTree.ts",
	"typecheck/pullFlags.ts",
	"typecheck/pullDecls.ts",
	"typecheck/pullSymbols.ts",
	"typecheck/pullSymbolBindingContext.ts",
	"typecheck/pullTypeResolutionContext.ts",
	"typecheck/pullTypeResolution.ts",
	"typecheck/pullTypeChecker.ts",
	"typecheck/pullDeclDiffer.ts",
	"typecheck/pullSemanticInfo.ts",
	"typecheck/pullDeclCollection.ts",
	"typecheck/pullSymbolBinder.ts",
	"typecheck/pullSymbolGraph.ts",
	"typecheck/SemanticDiagnostic.ts",
	"typecheck/pullHelpers.ts",	
	"syntaxTreeToAstVisitor.ts",
	"typescript.ts"
].map(function (f) {
	return path.join(compilerDirectory, f);
});

var tscSources = [
	"io.ts",
	"optionsParser.ts",
	"tsc.ts"
].map(function (f) {
	return path.join(compilerDirectory, f);
});

var servicesSources = [
	"es5compat.ts",
	"formatting/textSnapshot.ts",
	"formatting/textSnapshotLine.ts",
	"formatting/snapshotPoint.ts",
	"formatting/formattingContext.ts",
	"formatting/formattingManager.ts",
	"formatting/formattingRequestKind.ts",
	"formatting/rule.ts",
	"formatting/ruleAction.ts",
	"formatting/ruleDescriptor.ts",
	"formatting/ruleFlag.ts",
	"formatting/ruleOperation.ts",
	"formatting/ruleOperationContext.ts",
	"formatting/rules.ts",
	"formatting/rulesMap.ts",
	"formatting/rulesProvider.ts",
	"formatting/textEditInfo.ts",
	"formatting/tokenRange.ts",
	"formatting/tokenSpan.ts", 
	"formatting/indentationNodeContext.ts", 
	"formatting/indentationNodeContextPool.ts", 
	"formatting/indentationTrackingWalker.ts", 
	"formatting/multipleTokenIndenter.ts", 
	"formatting/singleTokenIndenter.ts", 
	"formatting/formatter.ts", 
	"classifier.ts",
	"coreServices.ts",
	"emitOutputTextWriter.ts",
	"compilerState.ts",
	"languageService.ts",
	"completionHelpers.ts",
	"keywordCompletions.ts",
	"signatureInfoHelpers.ts",
	"pullLanguageService.ts",
	"shims.ts",
	"outliningElementsCollector.ts",
	"braceMatcher.ts",
	"indenter.ts",
	"breakpoints.ts",
	"findReferenceHelpers.ts",
	"typescriptServices.ts"
].map(function (f) {
	return path.join(servicesDirectory, f);
});

var harnessSources = [
	path.join(compilerDirectory, "io.ts"),
	path.join(compilerDirectory, "optionsParser.ts"),

	path.join(harnessDirectory, "exec.ts"),
	path.join(harnessDirectory, "diff.ts"),
	path.join(harnessDirectory, "harness.ts"),
	path.join(harnessDirectory, "baselining.ts"),
	path.join(harnessDirectory, "fourslash.ts"),
	path.join(harnessDirectory, "dumpAST-baselining.ts"),
	path.join(harnessDirectory, "runner.ts"),

	path.join(runnersDirectory, "runnerbase.ts"),
	path.join(runnersDirectory, "compiler/runner.ts"),
	path.join(runnersDirectory, "fourslash/fsrunner.ts"),
	path.join(runnersDirectory, "projects/runner.ts"),
	path.join(runnersDirectory, "unittest/unittestrunner.ts")
];

var libraryFiles = [
	"lib.d.ts",
	"jquery.d.ts",
	"winjs.d.ts",
	"winrt.d.ts"
];

var librarySources = libraryFiles.map(function (f) {
	return path.join(libraryDirectory, f);
});

var libraryTargets = libraryFiles.map(function (f) {
	return path.join(builtLocalDirectory, f);
});

// Prepends the contents of prefixFile to destinationFile
function prependFile(prefixFile, destinationFile) {
	if (!fs.existsSync(prefixFile)) {
		fail(prefixFile + " does not exist!");
	}
	if (!fs.existsSync(destinationFile)) {
		fail(destinationFile + " failed to be created!");
	}
	var temp = "temptemp";
	jake.cpR(prefixFile, temp);
	fs.appendFileSync(temp, fs.readFileSync(destinationFile));
	fs.renameSync(temp, destinationFile);
}

var useDebugMode = false;
/* Compiles a file from a list of sources
	* @param outFile: the target file name
	* @param sources: an array of the names of the source files
	* @param prereqs: prerequisite tasks to compiling the file
	* @param prefixes: a list of files to prepend to the target file
	* @param useBuiltCompiler: true to use the built compiler, false to use the LKG
	*/
function compileFile(outFile, sources, prereqs, prefixes, useBuiltCompiler) {
	file(outFile, prereqs, function() {
		var dir = useBuiltCompiler ? builtLocalDirectory : LKGDirectory;
		var cmd = (process.env.host || process.env.TYPESCRIPT_HOST || "node") + " " + dir + "tsc.js -const -declaration " + sources.join(" ") + " -out " + outFile;
		if (useDebugMode) {
			cmd = cmd + " -sourcemap -fullSourceMapPath";
		}
		console.log(cmd + "\n");
		var ex = jake.createExec([cmd]);
		// Add listeners for output and error
		ex.addListener("stdout", function(output) {
			process.stdout.write(output);
		});
		ex.addListener("stderr", function(error) {
			process.stderr.write(error);
		});
		ex.addListener("cmdEnd", function() {
			if (!useDebugMode && prefixes && fs.existsSync(outFile)) {
				for (var i in prefixes) {
					prependFile(prefixes[i], outFile);
				}
			}
			complete();
		});
		ex.addListener("error", function() {
			fs.unlinkSync(outFile);
			console.log("Compilation of " + outFile + " unsuccessful");
		});
		ex.run();	
	}, {async: true});
}

// Prerequisite task for built directory and library typings
directory(builtLocalDirectory);

for (var i in libraryTargets) {
	(function (i) {
		file(libraryTargets[i], [builtLocalDirectory, librarySources[i]], function() {
			jake.cpR(librarySources[i], builtLocalDirectory);
		});
	})(i);
}

var typescriptFile = path.join(builtLocalDirectory, "typescript.js");
compileFile(typescriptFile, compilerSources, [builtLocalDirectory, copyright].concat(compilerSources), [copyright]);

var tscFile = path.join(builtLocalDirectory, "tsc.js");
compileFile(tscFile, compilerSources.concat(tscSources), [builtLocalDirectory, copyright].concat(compilerSources).concat(tscSources), [copyright]);

var serviceFile = path.join(builtLocalDirectory, "typescriptServices.js");
compileFile(serviceFile, compilerSources.concat(servicesSources), [builtLocalDirectory, thirdParty, copyright].concat(compilerSources).concat(servicesSources), [thirdParty, copyright]);

// Local target to build the compiler and services
desc("Builds the full compiler and services");
task("local", libraryTargets.concat([typescriptFile, tscFile, serviceFile]));

// Local target to build the compiler and services
desc("Emit debug mode files with sourcemaps");
task("setDebugMode", function() {
    useDebugMode = true;
});

// Local target to build the compiler and services
desc("Builds the full compiler and services in debug mode");
task("local-debug", ["setDebugMode", "local"]);

// Set the default task to "local"
task("default", ["local"]);

// Cleans the built directory
desc("Cleans the compiler output, declare files, and tests");
task("clean", function() {
	jake.rmRf(builtDirectory);
});


// Makes a new LKG. This target does not build anything, but errors if not all the outputs are present in the built/local directory
desc("Makes a new LKG out of the built js files");
task("LKG", libraryTargets, function() {
	var expectedFiles = [typescriptFile, tscFile, serviceFile];
	var missingFiles = expectedFiles.filter(function (f) {
		return !fs.existsSync(f);
	});
	if (missingFiles.length > 0) {
		fail("Cannot replace the LKG unless all built targets are present in directory " + builtLocalDirectory +
			    ". The following files are missing:\n" + missingFiles.join("\n"));
	}
	// Copy all the targets into the LKG directory
	jake.mkdirP(LKGDirectory);
	for (var i in librarySources) {
		jake.cpR(libraryTargets[i], LKGDirectory);
	}
	for (i in expectedFiles) {
		jake.cpR(expectedFiles[i], LKGDirectory);
	}
});

// Test directory
directory(builtTestDirectory);

// Task to build the tests infrastructure using the built compiler
var run = path.join(builtTestDirectory, "run.js");
compileFile(run, harnessSources, [builtTestDirectory, tscFile].concat(libraryTargets).concat(harnessSources), [], true);

// Webharness
var frontEndPath = "tests/cases/webharness/frontEnd.ts";
var perfCompilerPath = "tests/cases/webharness/perfCompiler.js";
compileFile(perfCompilerPath, [frontEndPath], [tscFile], [], true);

desc("Builds the web harness front end");
task("test-harness", [perfCompilerPath]);

var localBaseline = "tests/baselines/local/";
var refBaseline = "tests/baselines/reference/";

desc("Builds the test infrastructure using the built compiler");
task("tests", [run, serviceFile, perfCompilerPath].concat(libraryTargets), function() {	
	// Copy the language service over to the test directory
	jake.cpR(serviceFile, builtTestDirectory);
	jake.cpR(path.join(libraryDirectory, "lib.d.ts"), builtTestDirectory);	
});

desc("Runs the tests using the built run.js file. Syntax is jake runtests. Optional parameters 'host=' and 'tests='.");
task("runtests", ["local", "tests", builtTestDirectory], function() {
	// Clean the local baselines directory
	if (fs.existsSync(localBaseline)) {
		jake.rmRf(localBaseline);
	}
	jake.mkdirP(localBaseline);
	host = process.env.host || process.env.TYPESCRIPT_HOST || "node";
	tests = process.env.test || process.env.tests;
	tests = tests ? tests.split(',').join(' ') : ([].slice.call(arguments).join(' ') || "");
	var cmd = host + " " + run + " " + tests;
	console.log(cmd);
	var ex = jake.createExec([cmd]);
	// Add listeners for output and error
	ex.addListener("stdout", function(output) {
		process.stdout.write(output);
	});
	ex.addListener("stderr", function(error) {
		process.stderr.write(error);
	});
	ex.addListener("cmdEnd", function() {
		complete();
	});
	ex.run();	
}, {async: true});

desc("Builds the test sources and automation in debug mode");
task("tests-debug", ["setDebugMode", "tests"]);

// Makes the test results the new baseline
desc("Makes the most recent test results the new baseline, overwriting the old baseline");
task("baseline-accept", function() {
	jake.rmRf(refBaseline);
	fs.renameSync(localBaseline, refBaseline);
});

// Fidelity Tests
var fidelityTestsOutFile = "tests/Fidelity/program.js";
var fidelityTestsInFile = "tests/Fidelity/Program.ts";
compileFile(fidelityTestsOutFile, [fidelityTestsInFile], [tscFile], [], true);

// Syntax Generator
var syntaxGeneratorOutFile = compilerDirectory + "syntax/SyntaxGenerator.js";
var syntaxGeneratorInFile = compilerDirectory + "syntax/SyntaxGenerator.ts";
compileFile(syntaxGeneratorOutFile, [syntaxGeneratorInFile], [tscFile], [], true);

desc("Builds and runs the syntax generator");
task("run-syntax-generator", [syntaxGeneratorOutFile], function() {
	host = process.env.host || process.env.TYPESCRIPT_HOST || "node";
	var cmd = host + " " + syntaxGeneratorOutFile;
	console.log(cmd);
	var ex = jake.createExec([cmd]);
	// Add listeners for output and error
	ex.addListener("stdout", function(output) {
		process.stdout.write(output);
	});
	ex.addListener("stderr", function(error) {
		process.stderr.write(error);
	});
	ex.addListener("cmdEnd", function() {
		complete();
	});
	ex.run();	
}, {async: true});

desc("Builds and runs the Fidelity tests");
task("run-fidelity-tests", [fidelityTestsOutFile], function() {
	host = process.env.host || process.env.TYPESCRIPT_HOST || "node";
	var cmd = host + " " + fidelityTestsOutFile;
	console.log(cmd);
	var ex = jake.createExec([cmd]);
	// Add listeners for output and error
	ex.addListener("stdout", function(output) {
		process.stdout.write(output);
	});
	ex.addListener("stderr", function(error) {
		process.stderr.write(error);
	});
	ex.addListener("cmdEnd", function() {
		complete();
	});
	ex.run();	
}, {async: true});