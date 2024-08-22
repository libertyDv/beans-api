import React, { useState, useEffect, startTransition, useCallback } from "react";
import './App.css';

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
        <div className="App">
            <h1 className="titRecipe">Recipe list</h1>
            <input
            className="buscador" 
            type="text"
            onChange={handleChange}
            placeholder="filter recipes"
            />
            <ul className="card">
                {filteredRecipes.map(recipe => (
                    <li
                        key={recipe.beanId}
                        className="beanItem"
                    >
                        <img src={recipe.imageUrl} className="beanImage" alt={recipe.flavorName} />
                        <div>{recipe.name}</div>
                        <div>{recipe.description}</div>
                    </li>
                ))}
            </ul>

            <div className='paginationControl'>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default ListRecipes;
