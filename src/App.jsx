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
const Second = () => <section>Second<UserModifier/></section>
const Third = () => <section>Third</section>

const User = () => {
  const contextValue = useContext(appContext);
  return <div>User:{contextValue.appState.user.name}</div>
}

const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext);
  const onChange = (e) => {
    appState.user.name = e.target.value;
    setAppState({...appState})
  }

  return <input type="text" value={appState.user.name} onChange={onChange}/>
}

export default App
