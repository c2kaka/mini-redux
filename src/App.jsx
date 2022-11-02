import React, { useState, useContext } from 'react'

const appContext = React.createContext(null)
function App() {
  const [appState, setAppState] = useState({
    user: { name: 'kaka', age: 22 }
  })
  const contextValue = {appState, setAppState};

  return (
    <appContext.Provider value={contextValue}>
      <First/>
      <Second/>
      <Third/>
    </appContext.Provider>
  )
}

const First = () => <section>First<User/></section>
const Second = () => <section>Second<Wrapper/></section>
const Third = () => <section>Third</section>

/**
 * reducer: 用来规范state的创建流程
 * @param state
 * @param type
 * @param payload
 * @returns {*&{user: (*)}}
 */
const reducer = (state, { type, payload }) => {
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

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User:{contextValue.appState.user.name}</div>
}

const Wrapper = () => {
  const { appState, setAppState } = useContext(appContext);
  const dispatch = (action) => {
    setAppState(reducer(appState, action));
  }

  return <UserModifier dispatch={dispatch} state={appState}/>
}

const UserModifier = ({ dispatch, state }) => {
  const onChange = (e) => {
    dispatch({type: 'updateUser', payload: {name: e.target.value}})
  }

  return <input type="text" value={state.user.name} onChange={onChange}/>
}

export default App
