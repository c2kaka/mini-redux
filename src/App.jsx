import React from 'react'
import {store, connect, appContext} from "./redux.jsx";

function App() {
  return (
    <appContext.Provider value={store}>
      <First/>
      <Second/>
      <Third/>
    </appContext.Provider>
  )
}

const First = () => {
  console.log('First rendered' + new Date().toString())
  return <section>First<User/></section>
}
const Second = () => {
  console.log('Second rendered' + new Date().toString())
  return <section>Second<UserModifier>--content--</UserModifier></section>
}
const Third = () => {
  console.log('Third rendered' + new Date().toString())
  return <section>Third</section>
}

const User = connect(({state}) => {
  console.log('User rendered' + new Date().toString())
  return <div>User:{state.user.name}</div>
})

const UserModifier = connect(({ dispatch, state, children }) => {
  console.log('UserModifier rendered' + new Date().toString())
  const onChange = (e) => {
    dispatch({type: 'updateUser', payload: {name: e.target.value}})
  }

  return <div>
    <p>{children}</p>
    <input type="text" value={state.user.name} onChange={onChange}/>
  </div>
})

export default App
