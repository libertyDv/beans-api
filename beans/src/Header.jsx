import { useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate()

   const navigateTo = (path) => () => {
    navigate(path)
   }

    return (
        <>
            <header className="header">
                <button className="btnHeader" onClick={navigateTo("/")}>Beans</button>
                <button className="btnHeader" onClick={navigateTo("/recipes")}>Recipes</button>
                <button className="btnHeader" onClick={navigateTo("/combos")}>Combos</button>
            </header>
        </>
    )

}

export default Header