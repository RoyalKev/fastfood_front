//import React from 'react'
import '@/styles/css/custom.css';
const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

    

    const goToNextPage = () => {
            if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const goToPrevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }
    return (
        <nav className="paginationBlock">
            <ul className='pagination justify-content-center'>
                <li className="page-item">
                    <a className="btn btn-outline-warning"
                        onClick={goToPrevPage} 
                        href='#'>
                        <font color="#000"><span aria-hidden="true">&laquo;</span> Précédent</font>
                    </a>
                </li>
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber} 
                        className= {`page-item ${currentPage == pgNumber ? 'active' : ''} `} >

                        <a onClick={() => setCurrentPage(pgNumber)}  
                            className={`page-item ${currentPage == pgNumber ? 'btn btn-warning' : 'btn btn-outline-warning'} `} 
                            href='#'>
                            
                            {pgNumber}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a className="btn btn-outline-warning" 
                        onClick={goToNextPage}
                        href='#'> <font color="#000">Suivant <span aria-hidden="true">&raquo;</span></font>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination