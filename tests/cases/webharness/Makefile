build:
	del wholeCompiler.ts
	concatFiles.bat
	node.exe compilerToString.js
	..\..\..\..\scripts\tsc.bat --out perfCompiler.js frontEnd.ts