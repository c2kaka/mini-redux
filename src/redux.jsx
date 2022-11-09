import React, {useContext, useEffect, useState} from "react";

export const store = {
    state: {
        user: { name: 'kaka', age: 22 },
        group: { groupName: 'frontend' }
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
            setState(reducer(state, action));
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

export const appContext = React.createContext(null);