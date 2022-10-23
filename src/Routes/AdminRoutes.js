import { Route, Routes } from "react-router-dom"
import AddIngredient from "../screens/Admin/AddIngredient"
import Dashboard from "../screens/Admin/Dashboard"
import Magazzino from "../screens/Admin/Magazzino"
import UpdateQuantity from "../screens/Admin/UpdateQuantity"
import ProductCatalog from "../screens/Admin/ProductCatalog"
import AddProduct from "../screens/Admin/AddProduct"
import Catalog from "../screens/Admin/Catalog"
import MenuCatalog from "../screens/Admin/MenuCatalog"
import AddMenuRecipe from "../screens/Admin/AddMenuRecipe"
import OrdiniRicevuti from "../screens/Admin/OrdiniRicevuti"

export function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/magazzino">
                <Route index element={<Magazzino />} />
                <Route path="addIngredient" element={<AddIngredient />} />
                <Route path="updateQuantity" element={<UpdateQuantity />}></Route>
            </Route>
            <Route path="/catalog">
                <Route index element={<Catalog />} />
                <Route path="productCatalog" >
                    <Route index element={<ProductCatalog />}/>
                    <Route path="addProduct" element={<AddProduct />} />
                </Route>
                <Route path="menuCatalog">
                    <Route index element={<MenuCatalog />}/>
                    <Route path="addMenuRecipe" element={<AddMenuRecipe />} />
                </Route>
            </Route>
            <Route path="/orders">
                <Route index element={<OrdiniRicevuti />}/>
            </Route>
        </Routes>
    )
}