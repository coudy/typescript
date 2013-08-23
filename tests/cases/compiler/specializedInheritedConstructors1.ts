interface ViewOptions<TModel> {

    model: TModel;

}

 

class View<TModel> {

    constructor(options: ViewOptions<TModel>) { }

    model: TModel;

}

 

class Model { }

class MyView extends View<Model> { }

 

var m: ViewOptions<Model> = { model: new Model() };

//var aView = new View({ model: new Model() }); // no error 

//var aView2 = new View(m); // no error, causes next line to no longer be an error

var myView = new MyView(m); // error
