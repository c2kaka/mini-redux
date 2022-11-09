import React from 'react'
import {store, connect, appContext} from "./redux.jsx";
import {connectUser} from "./connectors/userConnector.js";

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
const Third = connect((state) => {
  return { group: state.group }
})(({group}) => {
  console.log('Third rendered' + new Date().toString())
  return <section>Third:{group.groupName}</section>
})

const User = connectUser(({user}) => {
  console.log('User rendered' + new Date().toString())
  return <div>User:{user.name}</div>
})

const UserModifier = connectUser(({ updateUser, user, children }) => {
  console.log('UserModifier rendered' + new Date().toString())
  const onChange = (e) => {
    updateUser({name: e.target.value})
  }

  return <div>
    <p>{children}</p>
    <input type="text" value={user.name} onChange={onChange}/>
  </div>
})

export default App
