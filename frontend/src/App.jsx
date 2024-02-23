import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Canvas from './Components/Canvas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{width:'100vw', display:'flex' , justifyContent:'center'}}>
    
    <Canvas></Canvas>
    </div>
  )
}

export default App
