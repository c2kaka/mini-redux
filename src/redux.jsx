import React, {useContext, useEffect, useState} from "react";

export const store = {
    state: {
        user: { name: 'kaka', age: 22 },
    },
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

/**
 * reducer: 用来规范state的创建流程
 * @param state
 * @param type
 * @param payload
 * @returns {*&{user: (*)}}
 */
export const reducer = (state, { type, payload }) => {
    if (type === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        };
    } else {
        return state;
    }
}

export const connect = (Component) => {
    return (props) => {
        const { state, setState } = useContext(appContext);
        const [, update] = useState({});
        useEffect(() => {
            store.subscribe(() => update({}))
        })
        const dispatch = (action) => {
            setState(reducer(state, action));
        }

        return <Component {...props} dispatch={dispatch} state={state}/>
    }
};

export const appContext = React.createContext(null);