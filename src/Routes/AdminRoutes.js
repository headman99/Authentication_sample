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
import Produzione from "../screens/Admin/Produzione"
import Evasi from "../screens/Admin/Evasi"
import OrdersProductList from "../screens/Admin/OrdersProductList"
import { createContext, useEffect, useState } from "react"
import useScanDetection from "use-scan-detection"
import { scanProduct } from "../components/api/api"
import MyPdf from "../components/MyPdf"
import ProductionProductList from "../screens/Admin/ProductionProductList"
import HandleTeams from "../screens/Admin/HandleTeams"
import AddIngredientToTeam from "../screens/Admin/AddIngredientToTeam"
import IngredientsProductList from "../screens/Admin/IngredientsProductList"
import Calculator from "../screens/Admin/Calculator"
import OrdersCalculator from "../screens/Admin/OrdersCalculator"
import ProductRecipe from "../screens/Admin/ProductRecipe"
import AddProductRecipe from "../screens/Admin/AddProductRecipe"
import Users from "../screens/Admin/Users"
import AddUser from "../screens/Admin/AddUser"
import ProductAlternatives from "../screens/Admin/ProductAlternatives"
import AddProductAlternative from "../screens/Admin/AddProductAlternative"

export const BarcodeContext = createContext()

export function AdminRoutes() {
    const [barcode, setBarcode] = useState("")
    const [contextBarcode, setContextBarcode] = useState('')

    useScanDetection({
        onComplete: setBarcode,
        minLength: 3
    })

    const handleReadBarcode = (bar) => {
        scanProduct({
            barcode: bar
        }).then(resp => {
            if (resp.data?.state === 1)
                setContextBarcode(bar)
        }).catch(e => {
            console.log(e)
            alert(e.response.data.message)
        })
    }

    useEffect(() => {
        console.log(barcode)
        if (!barcode)
            return;
        if (!barcode.startsWith("Shift"))
            return;
        const newBar = barcode.split("Shift").join("")
        if (newBar)
            handleReadBarcode(newBar)
    }, [barcode])


    return (
        <BarcodeContext.Provider value={{
            contextBarcode: contextBarcode,
            setContextBarcode: setContextBarcode
        }}>
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/magazzino">
                    <Route index element={<Magazzino />} />
                    <Route path="handleTeams" >
                        <Route index element={<HandleTeams />} />
                        <Route path=":code" element={<AddIngredientToTeam />}></Route>
                    </Route>
                    <Route path="addIngredient" element={<AddIngredient />} />
                    <Route path="updateQuantity" element={<UpdateQuantity />}></Route>
                </Route>
                <Route path="/catalog">
                    <Route index element={<Catalog />} />
                    <Route path="productCatalog" >
                        <Route index element={<ProductCatalog />} />
                        <Route path=':code'>
                            <Route index element={<ProductRecipe />} />
                            <Route path="addRecipe" element={<AddProductRecipe />} />
                        </Route>
                        <Route path="addProduct" element={<AddProduct />} />
                    </Route>
                    <Route path="menuCatalog">
                        <Route index element={<MenuCatalog />} />
                        <Route path="addMenuRecipe" element={<AddMenuRecipe />} />
                        <Route path="alternatives">
                            <Route index element={<ProductAlternatives />} />
                            <Route path='addAlternative' element={<AddProductAlternative />} />
                        </Route>
                        
                    </Route>
                </Route>
                <Route path="/orders">
                    <Route index element={<OrdiniRicevuti />} />
                    <Route path=":code" element={<OrdersProductList />}></Route>
                </Route>
                <Route path="/production">
                    <Route index element={<Produzione />} />
                    <Route path=":code">
                        <Route index element={<ProductionProductList />} />
                        <Route path=":ing" element={<IngredientsProductList />} />
                    </Route>
                </Route>

                <Route path="/evasi" >
                    <Route index element={<Evasi />} />
                    <Route path=":code" element={<OrdersProductList />}></Route>
                </Route>

                <Route path="/pdfViewer">
                    <Route index element={<MyPdf />} />
                </Route>

                <Route path="/calculator" >
                    <Route index element={<OrdersCalculator />} />
                    <Route path=":code" element={<Calculator />} />
                </Route>
                <Route path="/users" >
                    <Route index element={<Users />} />
                    <Route path="addUser" element={<AddUser />} />
                </Route>
            </Routes>
        </BarcodeContext.Provider >
    )
}