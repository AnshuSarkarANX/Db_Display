import { useState } from 'react'

import './App.css'

import Tabs from './Introduction/Tabs';
import Bottom from './Introduction/Bottom';
import UserMenu from './menu/UserMenu';

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Tabs />
      <Bottom />
      <UserMenu />
    </>
  )
}

export default App
