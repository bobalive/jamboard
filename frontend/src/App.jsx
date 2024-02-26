import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Canvas from './Components/Canvas'
import { BrowserRouter,Route, Routes  } from 'react-router-dom'

function App() {
  const [table, setTable] = useState(0)

  return (
    <div style={{width:'100vw', display:'flex' , justifyContent:'center'}}>
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Canvas table = {table} setTable = {setTable}/>}></Route>
      </Routes>
 
      </BrowserRouter>
    
    
    </div>
  )
}

export default App
