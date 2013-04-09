declare module "FS"

{

 export class Foo { }

}
 
import Bar = module("FS");
 
function IsFoo(value: any): boolean

{

 return value instanceof Bar.Foo;

}
