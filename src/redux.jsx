import React, {useContext, useEffect, useState} from "react";

const store = {
    state: undefined,
    reducer: undefined,
    setState(newState) {
        store.state = newState;
        store.listeners.forEach((fn) => fn(newState))
    },
    listeners: [],
    subscribe(fn) {
        store.listeners.push(fn);
        return () => {
            const index = store.listeners.findIndex(fn);
            store.listeners.splice(index, 1);
        };
    }
};

export const createStore = (reducer, initState) => {
    store.reducer = reducer;
    store.state = initState;
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
        const dispatch = (action) => {
            setState(store.reducer(state, action));
        };
        const { state, setState } = useContext(appContext);
        const dispatcher = mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch};
        const data = selector ? selector(state) : {state};
        const [, update] = useState({});
        useEffect(() => {
            return store.subscribe(() => {
                const newState = selector ? selector(store.state) : { state: store.state };
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
