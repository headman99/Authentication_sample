import { Route,Routes } from "react-router-dom"
import Home from "../screens/Client/Home"
import MenuPage from "../screens/Client/MenuPage"


export function ClientRoutes(){
    return (
        <Routes>
            <Route index element={<Home/>}></Route>
            <Route path="/menu/:id" element={<MenuPage/>} />
        </Routes>
    )
}