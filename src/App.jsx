import { useState } from 'react'

import './App.css'

import Tabs from './Introduction/Tabs';

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Tabs />
    </>
  )
}

export default App
