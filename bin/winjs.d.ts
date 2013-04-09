/* *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved. 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0  
 
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, 
MERCHANTABLITY OR NON-INFRINGEMENT. 
 
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

declare module WinJS {
    export function strictProcessing(): void;
    export module Binding {
        export function as(data: any): any;
        export class List {
        	constructor(data: any[]);
            public push(item: any): any;
            public indexOf(item: any): number;
            public splice(index: number, count: number, newelems: any[]): any[];
            public splice(index: number, count: number): any[];
            public splice(index: number): any[];
            public createFiltered(predicate: (x: any) => boolean): List;
            public createGrouped(keySelector: (x: any) => any, dataSelector: (x:any) => any): List;
            public groups: any;
            public dataSource: any;
            public getAt: any;
        }
    }
    export module Namespace {
        export var define: any;
        export var defineWithParent: any;
    }
    export module Class {
        export function define(constructor: any, instanceMembers: any): any;
        export function derive(baseClass: any, constructor: any, instanceMembers: any): any;
        export function mix(constructor: any, mixin: any): any;
    }
    export function xhr(options: { type: string; url: string; user: string; password: string; headers: any; data: any; responseType: string; }): WinJS.Promise;
    export module Application {
        export interface IOHelper {
            exists(filename: string): boolean;
            readText(fileName: string, def: string): WinJS.Promise;
            readText(fileName: string): WinJS.Promise;
            writeText(fileName: string, text: string): WinJS.Promise;
			remove(fileName: string): WinJS.Promise;
        }
        export var local: IOHelper;
        export var roaming: IOHelper;
        export var onactivated: EventListener;
        export var sessionState: any;
        export interface ApplicationActivationEvent extends Event {
            detail: any;
            setPromise(p: Promise): any;
        }
        export function addEventListener(type: string, listener: EventListener, capture?: boolean): void;
        export var oncheckpoint: EventListener;  
        export function start(): void;
        export function stop(): void;
    }
    export class Promise {
    	constructor(init: (c: any, e: any, p: any) => void);
        public then: any;
        static join: any;
        static timeout: any;
    }
    export module Navigation {
        export var history: any;
        export var canGoBack: boolean;
        export var canGoForward: boolean;
        export var location: string;
        export var state: any;
        export function addEventListener(type: string, listener: EventListener, capture: boolean): void;
		export function back(): void;
		export function forward(): void;
		export function navigate(location: any, initialState: any);
		export function navigate(location: any);	
		export function removeEventListener(type: string, listener: EventListener, capture: boolean): void;	
		export var onbeforenavigate: CustomEvent;
		export var onnavigated: CustomEvent;
		export var onnavigating: CustomEvent;
    }
    export module Utilities {
        export function markSupportedForProcessing(obj: any): void;
		export enum Key {
			backspace, 
			tab, 
			enter, 
			shift, 
			ctrl, 
			alt, 
			pause, 
			capsLock, 
			escape, 
			space, 
			pageUp, 
			pageDown, 
			end, 
			home, 
			leftArrow, 
			upArrow, 
			rightArrow, 
			downArrow, 
			insert, 
			deleteKey, 
			num0, 
			num1, 
			num2, 
			num3, 
			num4, 
			num5, 
			num6, 
			num7, 
			num8, 
			num9, 
			a, 
			b, 
			c, 
			d, 
			e, 
			f, 
			g, 
			h, 
			i, 
			j, 
			k, 
			l, 
			m, 
			n, 
			o, 
			p, 
			q, 
			r, 
			s, 
			t, 
			u, 
			v, 
			w, 
			x, 
			y, 
			z, 
			leftWindows, 
			rightWindows, 
			numPad0, 
			numPad1, 
			numPad2, 
			numPad3, 
			numPad4, 
			numPad5, 
			numPad6, 
			numPad7, 
			numPad8, 
			numPad9, 
			multiply, 
			add, 
			subtract, 
			decimalPoint, 
			divide, 
			f1, 
			f2, 
			f3, 
			f4, 
			f5, 
			f6, 
			f7, 
			f8, 
			f9, 
			f10, 
			f11, 
			f12, 
			numLock, 
			scrollLock, 
			semicolon, 
			equal, 
			comma, 
			dash, 
			period, 
			forwardSlash, 
			graveAccent, 
			openBracket, 
			backSlash, 
			closeBracket, 
			singleQuote
		}
	}
    export module UI {  
		export var process: any;
		export var processAll: any;
		export var ListLayout: any;
		export var GridLayout: any;
		export var Pages: any;
		export var Menu: any;
		export var setOptions: any;
    }
}

interface Element {
	winControl: any; // TODO: This should be control?   
}

