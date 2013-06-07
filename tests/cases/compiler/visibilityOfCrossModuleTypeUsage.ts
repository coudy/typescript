// @Filename: commands.ts
import fs = require('fs');
import server = require('server');

export interface IConfiguration {
    workspace: server.IWorkspace;
    server?: server.IServer;
}

// @Filename: fs.ts
import commands = require('commands');
function run(configuration: commands.IConfiguration) {
    var absoluteWorkspacePath = configuration.workspace.toAbsolutePath(configuration.server);
}

// @Filename: server.ts
export interface IServer {
}

export interface IWorkspace {
    toAbsolutePath(server: IServer, workspaceRelativePath?: string): string;
}