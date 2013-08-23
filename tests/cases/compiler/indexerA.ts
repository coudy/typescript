class JQueryElement {
    id:string;
}

class JQuery {
    [n:number]:JQueryElement
}

var jq:JQuery={ 0: { id : "a" }, 1: { id : "b" } };
// BUG 766379
//jq[0].id;