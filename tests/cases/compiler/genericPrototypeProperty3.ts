class BaseEvent {
    target: {};
}

class MyEvent<T> extends BaseEvent { // Cannot extend BaseEvent because T is instantiated to any in the prototype
    target: T;
}
class BaseEventWrapper {
    t: BaseEvent;
}

class MyEventWrapper extends BaseEventWrapper {
    t: MyEvent<any>;
}