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
import ProductionProductList from "../screens/Admin/ProductionProductList"
import { createContext, useEffect, useState } from "react"
import useScanDetection from "use-scan-detection"
import { scanProduct } from "../components/api/api"
import MyPdf from "../components/MyPdf"

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
        if (!barcode)
            return;
        if(!barcode.startsWith("Shift"))
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
                    <Route path="addIngredient" element={<AddIngredient />} />
                    <Route path="updateQuantity" element={<UpdateQuantity />}></Route>
                </Route>
                <Route path="/catalog">
                    <Route index element={<Catalog />} />
                    <Route path="productCatalog" >
                        <Route index element={<ProductCatalog />} />
                        <Route path="addProduct" element={<AddProduct />} />
                    </Route>
                    <Route path="menuCatalog">
                        <Route index element={<MenuCatalog />} />
                        <Route path="addMenuRecipe" element={<AddMenuRecipe />} />
                    </Route>
                </Route>
                <Route path="/orders">
                    <Route index element={<OrdiniRicevuti />} />
                    <Route path=":code" element={<ProductionProductList />}></Route>
                </Route>
                <Route path="/production">
                    <Route index element={<Produzione />} />
                </Route>

                <Route path="/evasi" >
                    <Route index element={<Evasi />} />
                </Route>

                <Route path="/pdfViewer">
                    <Route index element={<MyPdf />} />
                </Route>
            </Routes>
        </BarcodeContext.Provider >
    )
}