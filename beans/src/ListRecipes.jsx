import React, { useState, useEffect, startTransition, useCallback } from "react";
import "./styles/ListRecipes.css"

function ListRecipes() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [filteredRecipes, setFilteredRecipes] = useState([])

    const handleChange = useCallback((event) => {
        const value = event.target.value;

        startTransition(() => {
            if (value === "") {
                setFilteredRecipes(data);
            } else {
                const newFilteredBeans = data.filter(recipe => 
                    recipe.name.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredRecipes(newFilteredBeans);
            }
            
        })
    }, [data]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const url = `https://jellybellywikiapi.onrender.com/api/recipes?pageIndex=${currentPage}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const result = await response.json();
                if (result && result.items && Array.isArray(result.items)) {
                    setData(result.items);
                    setTotalPages(result.totalPages); 
                    setFilteredRecipes(result.items)
                } else {
                    throw new Error("Unexpected data structure");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [currentPage, totalPages]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }, [currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="AppR">
            <h1 className="titRecipe">Recipe list</h1>
            <div className="container">
            <input
            className="searchRecipe" 
            type="text"
            onChange={handleChange}
            placeholder="filter recipes"
            />
            </div>
            <div className='paginationControl'>
                <button className="prev" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span className="current"> Page {currentPage} of {totalPages} </span>
                <button className="next" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            <ul className="cardRecipe">
                {filteredRecipes.map(recipe => (
                    <li
                        key={recipe.beanId}
                        className="recipeItem"
                    >
                        <img src={recipe.imageUrl} className="recipeImage" alt={recipe.flavorName} />
                        <div className="recipeName">{recipe.name}</div>
                        <div className="recipeDesc">{recipe.description}</div>
                    </li>
                ))}
            </ul>

            
        </div>
    );
}

export default ListRecipes;
