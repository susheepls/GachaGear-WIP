import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Inventory from "./pages/Inventory"
import GachaRoll from "./pages/GachaRoll"
import Layout from "./components/Layout"
import UpgradeItem from "./pages/UpgradeItem"
import CurrencyBox from "./pages/CurrencyBox"
import Characters from "./pages/Characters"
import { UserProvider } from "./middleware/UserContext"
import OneCharacter from "./pages/OneCharacter"
import Rankings from "./pages/Rankings"
import PublicCharacterProfile from "./pages/PublicCharacterProfile"

function App() {

  //handlers

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="login" element={<Login/>} />
            <Route path=":username/inventory" element={<Inventory/>} />
            <Route path=":username/inventory/:id" element={<UpgradeItem/>} />
            <Route path="gacharoll" element={<GachaRoll/>} />
            <Route path="currencyBox" element={<CurrencyBox/>} />
            <Route path="characters" element={<Characters/>} />
            <Route path=":username/characters/:id" element={<OneCharacter/>} />
            <Route path="rankings" element={<Rankings/>} />
            <Route path="rankings/characters/:id" element={<PublicCharacterProfile/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
