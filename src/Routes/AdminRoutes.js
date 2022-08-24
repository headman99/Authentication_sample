import { Route,Routes } from "react-router-dom"
import Dashboard from "../screens/Admin/Dashboard/Dashboard"


export function AdminRoutes(){
    return (
        <Routes>
            <Route index element={<Dashboard/>}></Route>
        </Routes>
    )
}