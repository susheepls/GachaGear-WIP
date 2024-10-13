import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Inventory from "./pages/Inventory"
import GachaRoll from "./pages/GachaRoll"

function App() {

  //handlers

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home/>} />
          <Route path="login" element={<Login/>} />
          <Route path=":username/inventory" element={<Inventory/>} />
          <Route path="gacharoll" element={<GachaRoll/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
