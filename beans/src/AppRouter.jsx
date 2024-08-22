import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import { lazy, Suspense } from "react";

const ListBeans = lazy(() => import("./ListBeans"));
const ListCombinations = lazy(() => import("./ListCombinations"));
const ListRecipes = lazy(() => import("./ListRecipes"));

const Loading = () => <div>Loading...</div>

function AppRouter() {

    return (
        <Router>
            <Header />
            <Suspense fallback={Loading}>
                <Routes>
                    <Route path="/" element={<ListBeans />} />
                    <Route path="/recipes" element={<ListRecipes />} />
                    <Route path="/combos" element={<ListCombinations />} />
                </Routes>
            </Suspense>
        </Router>
    )

}

export default AppRouter
