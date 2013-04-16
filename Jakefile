// This file contains the build logic for the public repo

var fs = require("fs");
var path = require("path");

// Variables
var compilerDirectory = "src/Compiler/";
var servicesDirectory = "src/Services/";
var harnessDirectory = "src/Harness/";
var runnersDirectory = "tests/Runners/";
var libraryDirectory = "typings/";
var genericLibraryDirectory = "typings/generic";
var nongenericLibraryDirectory = "typings/non-generic";
var builtDirectory = "built/";
var builtLocalDirectory = "built/local/";
var builtTestDirectory = "built/localtest/";
var LKGDirectory = "bin/";
var copyright = "CopyrightNotice.txt";
var thirdParty = "ThirdPartyNoticeText.txt";
var compilerSources = [
	"Diagnostics.ts",
	"Flags.ts",
	"NodeTypes.ts",
	"HashTable.ts",
	"PrintContext.ts",
	"ScopeWalk.ts",
	"TypeCollection.ts",
	"ScopeAssignment.ts",
	"Binder.ts",
	"Ast.ts",
	"AstWalker.ts",
	"AstWalkerCallback.ts",
	"AstPath.ts",
	"SymbolScope.ts",
	"Types.ts",
	"Signatures.ts",
	"Symbols.ts",
	"ErrorReporter.ts",
	"TypeFlow.ts",
	"TypeChecker.ts",
	"Base64.ts",
	"SourceMapping.ts",
	"Emitter.ts",
	"DeclarationEmitter.ts",
	"PreCompile.ts",
	"PathUtils.ts",
	"ReferenceResolution.ts",
	"Typecheck/DataMap.ts",
	"Typecheck/PullFlags.ts",
	"Typecheck/PullDecls.ts",
	"Typecheck/PullSymbols.ts",
	"Typecheck/PullSymbolBindingContext.ts",
	"Typecheck/PullTypeResolutionContext.ts",
	"Typecheck/PullTypeResolution.ts",
	"Typecheck/PullTypeChecker.ts",
	"Typecheck/PullDeclDiffer.ts",
	"Typecheck/PullSemanticInfo.ts",
	"Typecheck/PullDeclCollection.ts",
	"Typecheck/PullSymbolBinder.ts",
	"Typecheck/PullSymbolGraph.ts",
	"Typecheck/PullErrors.ts",
	"Typecheck/PullHelpers.ts",	
	"SyntaxTreeToAstVisitor.ts",
	"Typescript.ts"
].map(function (f) {
	return path.join(compilerDirectory, f);
});

var tscSources = [
	"IO.ts",
	"OptionsParser.ts",
	"tsc.ts"
].map(function (f) {
	return path.join(compilerDirectory, f);
});

var servicesSources = [
	"es5compat.ts",
	"Formatting/ITextSnapshot.ts",
	"Formatting/ITextSnapshotLine.ts",
	"Formatting/TextSnapshot.ts",
	"Formatting/TextSnapshotLine.ts",
	"Formatting/SnapshotPoint.ts",
	"Formatting/FormattingContext.ts",
	"Formatting/FormattingManager.ts",
	"Formatting/FormattingRequestKind.ts",
	"Formatting/Rule.ts",
	"Formatting/RuleAction.ts",
	"Formatting/RuleDescriptor.ts",
	"Formatting/RuleFlag.ts",
	"Formatting/RuleOperation.ts",
	"Formatting/RuleOperationContext.ts",
	"Formatting/Rules.ts",
	"Formatting/RulesMap.ts",
	"Formatting/RulesProvider.ts",
	"Formatting/TextEditInfo.ts",
	"Formatting/TokenRange.ts",
	"Formatting/TokenSpan.ts", 
	"Formatting/IndentationNodeContext.ts", 
	"Formatting/IndentationNodeContextPool.ts", 
	"Formatting/IndentationTrackingWalker.ts", 
	"Formatting/MultipleTokenIndenter.ts", 
	"Formatting/SingleTokenIndenter.ts", 
	"Formatting/Formatter.ts", 
	"Classifier.ts",
	"CoreServices.ts",
	"CompilerState.ts",
	"SymbolSet.ts",
	"SymbolTree.ts",
	"OverridesCollector.ts",
	"LanguageService.ts",
	"PullLanguageService.ts",
	"Shims.ts",
	"OutliningElementsCollector.ts",
	"BraceMatcher.ts",
	"Indenter.ts",
	"TypescriptServices.ts"
].map(function (f) {
	return path.join(servicesDirectory, f);
});

var harnessSources = [
	path.join(compilerDirectory, "IO.ts"),
	path.join(compilerDirectory, "OptionsParser.ts"),

	path.join(harnessDirectory, "Exec.ts"),
	path.join(harnessDirectory, "Diff.ts"),
	path.join(harnessDirectory, "Harness.ts"),
	path.join(harnessDirectory, "Baselining.ts"),
	path.join(harnessDirectory, "FourSlash.ts"),
	path.join(harnessDirectory, "DumpAST-baselining.ts"),
	path.join(harnessDirectory, "external/json2.ts"),
	path.join(harnessDirectory, "Runner.ts"),

	path.join(runnersDirectory, "RunnerBase.ts"),
	path.join(runnersDirectory, "Compiler/Runner.ts"),
	path.join(runnersDirectory, "FourSlash/FSRunner.ts"),
	path.join(runnersDirectory, "Projects/Runner.ts"),
	path.join(runnersDirectory, "UnitTest/UnitTestRunner.ts")
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
		var cmd = (process.env.TYPESCRIPT_HOST || "Node") + " " + dir + "tsc.js -cflowu -const -declaration -disallowbool " + sources.join(" ") + " -out " + outFile;
		if (useDebugMode) {
			cmd = cmd + " -sourcemap -fullSourceMapPath";
		}
		console.log(cmd);
		jake.exec([cmd], function() {
			if (!useDebugMode && prefixes) {
				for (var i in prefixes) {
					prependFile(prefixes[i], outFile);
				}
			}
			complete();
		},
		{printStdout: true, printStderror: true});
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

// Copies generic lib.d.ts to built\bin
desc("Copies generic lib.d.ts to built\bin for use by compiler");
task("generic", function() {
	jake.cpR(path.join(genericLibraryDirectory, "lib.d.ts"), builtLocalDirectory);
});

// Copies non-generic lib.d.ts to built\bin
desc("Copies non-generic lib.d.ts to built\bin for use by compiler");
task("nongeneric", function() {
	jake.cpR(path.join(nongenericLibraryDirectory, "lib.d.ts"), builtLocalDirectory);
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

var localBaseline = "tests/baselines/local/";
var refBaseline = "tests/baselines/reference/";

desc("Builds the test infrastructure using the built compiler");
task("tests", [run, serviceFile].concat(libraryTargets), function() {	
	// Copy the language service over to the test directory
	jake.cpR(serviceFile, builtTestDirectory);
	jake.cpR(path.join(genericLibraryDirectory, "lib.d.ts"), builtTestDirectory);	
});

desc("Runs the tests using the built run.js file. Syntax is jake runtests. Optional parameters 'host=' and 'tests='.");
task("runtests", ["local", "tests", builtTestDirectory], function() {
	// Clean the local baselines directory
	if (fs.existsSync(localBaseline)) {
		jake.rmRf(localBaseline);
	}
	jake.mkdirP(localBaseline);
	host = process.env.host || process.env.TYPESCRIPT_HOST || "Node";
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