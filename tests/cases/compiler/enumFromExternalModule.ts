// bug: 684225
declare module 'filexx'{
export enum Mode{ Open }
}

import f = module ('filexx');

var x = f.Mode.Open;
