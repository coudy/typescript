build:
	del wholeCompiler.ts
	concatFiles.bat
	node.exe compilerToString.js
	..\..\..\..\scripts\tsc.bat -const --out perfCompiler.js frontEnd.ts