import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Inventory from "./pages/Inventory"

function App() {

  //handlers

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home/>} />
          <Route path="login" element={<Login/>} />
          <Route path="inventory" element={<Inventory/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
