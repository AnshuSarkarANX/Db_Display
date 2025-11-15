import { useState } from 'react'

import './App.css'

import Tabs from './Introduction/Tabs';
import Bottom from './Introduction/Bottom';

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Tabs />
      <Bottom />
    </>
  )
}

export default App
