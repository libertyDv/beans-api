import React, { useState, useEffect } from 'react';
import './App.css';

function ListBeans() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const url = `https://jellybellywikiapi.onrender.com/api/beans?pageIndex=${currentPage}`; // para ir cambiando de pag
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.items && result.totalPages !== undefined) {
                    setData(result.items);
                    setTotalPages(result.totalPages);
                } else {
                    throw new Error('Unexpected data structure');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [currentPage]); // se ejecuta cuando currentPage cambie

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
        <div className='App'>
            <ul className='card'>
                {data.map(bean => (
                    <li
                        key={bean.beanId}
                        className='beanItem'
                        style={{ backgroundColor: bean.backgroundColor }}
                    >
                        <img src={bean.imageUrl} alt={bean.flavorName} className='beanImage' />
                        <div>{bean.flavorName}</div>
                        <div>{bean.description || 'No description available'}</div>
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

export default ListBeans