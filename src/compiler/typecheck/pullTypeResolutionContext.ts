// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export class CandidateInferenceInfo {
        public typeParameter: PullTypeParameterSymbol = null;
        public isFixed = false;
        public inferenceCandidates: PullTypeSymbol[] = [];

        public addCandidate(candidate: PullTypeSymbol) {
            if (!this.isFixed) {
                this.inferenceCandidates[this.inferenceCandidates.length] = candidate;
            }
        }
    }

    export class ArgumentInferenceContext {
        public candidateCache: any = {};

        public getInferenceInfo(param: PullTypeParameterSymbol) {
            var info = <CandidateInferenceInfo>this.candidateCache[param.getSymbolID().toString()];

            if (!info) {
                info = new CandidateInferenceInfo();
                info.typeParameter = param;
                this.candidateCache[param.getSymbolID().toString()] = info;
            }

            return info;
        }

        public addCandidateForInference(param: PullTypeParameterSymbol, candidate: PullTypeSymbol, fix: bool) {
            var info = this.getInferenceInfo(param);

            info.addCandidate(candidate);

            if (!info.isFixed) {
                info.isFixed = fix;
            }
        }

        public inferArgumentTypes(resolver: PullTypeResolver, context: PullTypeResolutionContext): { param: PullTypeParameterSymbol; type: PullTypeSymbol; }[] {
            var info: CandidateInferenceInfo = null;

            var collection: IPullTypeCollection;

            var bestCommonType: PullTypeSymbol;

            var results: { param: PullTypeParameterSymbol; type: PullTypeSymbol; }[] = [];

            for (var infoKey in this.candidateCache) {
                info = <CandidateInferenceInfo>this.candidateCache[infoKey];

                collection = {
                    getLength: () => { return info.inferenceCandidates.length; },
                    setTypeAtIndex: (index: number, type: PullTypeSymbol) => { },
                    getTypeAtIndex: (index: number) => {
                        return info.inferenceCandidates[index].getType();
                    }
                }

                bestCommonType = resolver.widenType(resolver.findBestCommonType(info.inferenceCandidates[0], null, collection, true, context, new TypeComparisonInfo()));

                if (!bestCommonType) {
                    bestCommonType = resolver.semanticInfoChain.anyTypeSymbol;
                }

                results[results.length] = { param: info.typeParameter, type: bestCommonType };
            }

            return results;
        }
    }

    export class PullContextualTypeContext {

        public hadProvisionalErrors = false;
        public provisionallyTypedSymbols: PullSymbol[] = [];

        constructor (public contextualType: PullTypeSymbol,
                     public provisional: bool) { }

        public recordProvisionallyTypedSymbol(symbol: PullSymbol) {
            this.provisionallyTypedSymbols[this.provisionallyTypedSymbols.length] = symbol;
        }

        public invalidateProvisionallyTypedSymbols() {
            for (var i = 0; i < this.provisionallyTypedSymbols.length; i++) {
                this.provisionallyTypedSymbols[i].invalidate();
            }
        }
    }

    export class PullTypeResolutionContext {
        private contextStack: PullContextualTypeContext[] = [];
        private typeSpecializationStack: any[] = [];

        public resolvingTypeReference = false;

        public resolveAggressively = false;

        public searchTypeSpace = false;
        
        public pushContextualType(type: PullTypeSymbol, provisional: bool) {
            this.contextStack.push(new PullContextualTypeContext(type, provisional));
        }
        
        public popContextualType(): PullContextualTypeContext {
            var tc = this.contextStack.pop();

            tc.invalidateProvisionallyTypedSymbols();

            return tc;
        }
        
        public getContextualType(): PullTypeSymbol {
            var context = !this.contextStack.length ? null : this.contextStack[this.contextStack.length - 1];
            
            if (context) {
                var type = context.contextualType;
                
                // if it's a type parameter, return the upper bound
                if (type.isTypeParameter() && (<PullTypeParameterSymbol>type).getConstraint()) {
                    type = (<PullTypeParameterSymbol>type).getConstraint();
                }

                return type;
            }
            
            return null;
        }
        
        public inProvisionalResolution() {
            return (!this.contextStack.length ? false : this.contextStack[this.contextStack.length - 1].provisional);
        }

        public setTypeInContext(symbol: PullSymbol, type: PullTypeSymbol) {

            symbol.setType(type);

            if (this.contextStack.length && this.inProvisionalResolution()) {
                this.contextStack[this.contextStack.length].recordProvisionallyTypedSymbol(symbol);
            }
        }

        public pushTypeSpecializationCache(cache) {
            this.typeSpecializationStack[this.typeSpecializationStack.length] = cache;
        }

        public popTypeSpecializationCache() {
            if (this.typeSpecializationStack.length) {
                this.typeSpecializationStack.length--;
            }
        }

        public findSpecializationForType(type: PullTypeSymbol) {
            var specialization: PullTypeSymbol = null;

            for (var i = this.typeSpecializationStack.length - 1; i >= 0; i--) {
                specialization = (this.typeSpecializationStack[i])[type.getSymbolID().toString()];

                if (specialization) {
                    return specialization;
                }
            }

            return type;
        }
    }

}