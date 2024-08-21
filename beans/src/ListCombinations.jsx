import React, { useState, useEffect } from "react"
import './App.css';


function ListCombinations() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const url = `https://jellybellywikiapi.onrender.com/api/combinations?pageIndex=${currentPage}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Error");

                }

                const result = await response.json();
                if (result && result.items && Array.isArray(result.items)) {
                    setData(result.items)
                    setTotalPages(result.totalPages);
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

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="App">
            <ul className="card">
                {data.map(combo => (
                    <li
                        key={combo.combinationId}
                    >
                        <div>{combo.name}</div>
                        <div className="recipeTags">
                            {combo.tag.map((tag, i) => (
                                <span key={i} className="tagItem">
                                    {tag}
                                    {i < combo.tag.length - 1 && <span className="tagSeparator"> + </span>}
                                </span>
                            ))}
                        </div>
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
    )

}

export default ListCombinations