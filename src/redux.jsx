import React, {useContext, useEffect, useState} from "react";

let state = undefined;
let reducer = undefined;
let listeners = [];

const setState = (newState) => {
    state = newState;
    listeners.forEach((fn) => fn(newState))
};

const store = {
    getState() {
        return state;
    },
    dispatch(action) {
        setState(reducer(state, action));
    },
    subscribe(fn) {
        listeners.push(fn);
        return () => {
            const index = listeners.findIndex(fn);
            listeners.splice(index, 1);
        };
    }
};

let dispatch = store.dispatch;
let prevDispatch = dispatch;
dispatch = (action) => {
    if (typeof action === 'function') {
        action(dispatch);
    } else {
        prevDispatch(action);
    }
}

export const createStore = (_reducer, initState) => {
    reducer = _reducer;
    state = initState;
    return store;
};

const isChanged = (state, newState) => {
    if (state === newState) {
        return true;
    }

    const isChanged = false;
    for (let key in state) {
        if (state[key] !== newState[key]) {
            return true;
        }
    }

    return isChanged;
}

export const connect = (selector, mapDispatchToProps) => (Component) => {
    return (props) => {
        const dispatcher = mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch};
        const data = selector ? selector(state) : {state};
        const [, update] = useState({});
        useEffect(() => {
            return store.subscribe(() => {
                const newState = selector ? selector(state) : {state: state};
                if (isChanged(data, newState)) {
                    update({})
                }
            })
        }, [selector])

        return <Component {...props} {...data} {...dispatcher}/>
    }
};

const appContext = React.createContext(null);

export const Provider = ({store, children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
};
