class BaseEvent {
    target: {};
}

class MyEvent<T> extends BaseEvent { // Cannot extend BaseEvent because T might be instantiated to any
    target: T;
}
class BaseEventWrapper {
    t: BaseEvent;
}

class MyEventWrapper extends BaseEventWrapper {
    t: MyEvent<any>;
}