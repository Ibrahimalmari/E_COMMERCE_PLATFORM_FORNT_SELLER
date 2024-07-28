import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { InputGroup, FormControl } from 'react-bootstrap';
import './store.css';

export default function MyStore() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('id');
        const response = await axios.get(`http://127.0.0.1:8000/api/displaystore/${id}`);
        if (response.data && response.data.store) {
          setData(response.data.store);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => (
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.seller && item.seller.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="main-container">
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1F3750" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div className="search-container">
            <InputGroup className="mb-4">
              <FormControl
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </div>
          <div className="store-list">
            {currentItems.length ? (
              currentItems.map(item => (
                <div key={item.id} className="store-card">
                  <div className="store-cover">
                    <img src={`http://127.0.0.1:8000/stores/${item.coverPhoto}`} alt={item.name} className="cover-image" />
                  </div>
                  <div className="store-info">
                    <h4 className="store-name">{item.name}</h4>
                    <hr className="divider" />
                    <p className="store-description">{item.description}</p>
                    <p className="store-owner">
                      <strong>Store Owner:</strong> {item.seller ? item.seller.name : 'N/A'} <br />
                      <strong>Email:</strong> {item.seller ? item.seller.email : 'N/A'} <br />
                      <strong>Phone:</strong> {item.seller ? item.seller.phone : 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No results found</div>
            )}
          </div>
          <PaginationWrapper totalItems={filteredData.length} itemsPerPage={itemsPerPage} paginate={paginate} />
        </>
      )}
    </div>
  );
}

const PaginationWrapper = ({ totalItems, itemsPerPage, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
