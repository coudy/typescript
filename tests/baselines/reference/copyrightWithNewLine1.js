/*****************************
* (c) Copyright - Important
****************************/
define(["require", "exports", "./greeter"], function(require, exports, __model__) {
    var model = "./greeter";
    var el = document.getElementById('content');
    var greeter = new model.Greeter(el);

    /** things */
    greeter.start();
});
