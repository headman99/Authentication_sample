import { Route, Routes } from "react-router-dom"
import AddIngredient from "../screens/Admin/AddIngredient"
import Dashboard from "../screens/Admin/Dashboard"
import Magazzino from "../screens/Admin/Magazzino"
import UpdateQuantity from "../screens/Admin/UpdateQuantity"
import Catalog from "../screens/Admin/Catalog"

export function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/magazzino">
                <Route index element={<Magazzino />} />
                <Route path="addIngredient" element={<AddIngredient />} />
                <Route path="updateQuantity" element={<UpdateQuantity />}></Route>
            </Route>
            <Route path="catalog" element={<Catalog />}/>
        </Routes>
    )
}