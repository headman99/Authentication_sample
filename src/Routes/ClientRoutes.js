import { Route, Routes } from "react-router-dom"
import Home from "../screens/Client/Home"
import MenuPage from "../screens/Client/MenuPage"
import { createContext,useRef } from "react"

export const MenuAlternativesContext = createContext()

export function ClientRoutes() {

    const selectedRecipes = useRef([]);

    return (
        <MenuAlternativesContext.Provider value={{
            contextRecipe:selectedRecipes
        }}>
            <Routes>
                <Route index element={<Home />}></Route>
                <Route path="/menu/:id" element={<MenuPage />} />
            </Routes>
        </MenuAlternativesContext.Provider>

    )
}