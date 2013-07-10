var x = function somefn() {
    return somefn;
};

////[0.d.ts]
declare var x: () => any;
