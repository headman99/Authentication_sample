import { Route,Routes } from "react-router-dom"
import Home from "../screens/Client/Home"


export function ClientRoutes(){
    return (
        <Routes>
            <Route index element={<Home/>}></Route>
        </Routes>
    )
}