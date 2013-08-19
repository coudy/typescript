//@module: amd
export declare module "Person" {
	export module Models {
		export class Person {
			constructor(name: string);
		}
	}
}

import P = require("Person"); // bug was we were not emitting a ; here and causing runtime failures in node

export module Database {
	export class DB {
	    public findPerson(id: number): P.Models.Person {
	        return new P.Models.Person("Rock");
	    }
	}
} 