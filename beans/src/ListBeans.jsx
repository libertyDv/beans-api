import React, { useState, useEffect, startTransition, useCallback } from 'react';
import './styles/ListBeans.css'

function ListBeans() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [filteredBeans, setFilteredBeans] = useState([]);

    const handleChange = useCallback((event) => {
        const value = event.target.value;

        startTransition(() => {
            if (value === "") {
                setFilteredBeans(data);

            } else {
                const newFilteredBeans = data.filter(bean =>
                    bean.flavorName.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredBeans(newFilteredBeans);

            }

        })
    }, [data]);


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
                    setFilteredBeans(result.items);
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
        <div className='App'>
            <h1 className='titBeans'>Bean list</h1>
            <div className='container'>
            <input
            className='searchBeans'
                type="text"
                onChange={handleChange}
                placeholder='filter beans'
            />
            </div>
            <div className='paginationControl'>
                <button className='prev' onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span className='current'> Page {currentPage} of {totalPages} </span>
                <button className='next' onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            <ul className='card'>
                {filteredBeans.map(bean => (
                    <li
                        key={bean.beanId}
                        className='beanItem'
                    >
                        <img src={bean.imageUrl} alt={bean.flavorName} className='beanImage' />
                        <div className='beanName'>{bean.flavorName}</div>
                        <div className='beanDesc'>{bean.description || 'No description available'}</div>
                    </li>
                ))}
            </ul>

           
        </div>
    );
}

export default ListBeans