import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListBeans from "./ListBeans";
import ListCombinations from "./ListCombinations";
import ListRecipes from "./ListRecipes";
import Header from "./Header";

function AppRouter() {

    return(
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<ListBeans/>} />
                <Route path="/recipes" element={<ListRecipes/>} />
                <Route path="/combos" element={<ListCombinations/>} />
            </Routes>
        </Router>
    )

}

export default AppRouter
