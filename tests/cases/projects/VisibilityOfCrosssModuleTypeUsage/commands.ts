import fs = module('fs');
import server = module('server');

export interface IConfiguration {
    workspace: server.IWorkspace;
    server?: server.IServer;
}
