import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { InputGroup, FormControl, Pagination, Card, Button, Col, Row } from 'react-bootstrap';
import "./product.css";

export default function Product() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // تعديل عدد المنتجات المعروضة في كل صفحة

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('id');
        const response = await axios.get(`http://127.0.0.1:8000/api/displayproduct/${id}`);
          if(response.data.products){
        setData(response.data.products);
        setLoading(false);
          }
         else{
          setLoading(false); 
         } 
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deleteproduct/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const filteredData = data.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toString().includes(searchTerm) ||
      item.store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.branch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <div className='main-container'>
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1F3750" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div className="search-container">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by name, price, store, category, or branch..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="product-list">
            {currentItems.map((item, index) => (
              <Card key={index} className="product-card">
                <Row>
                  <Col md={6} className="product-image-col">
                    {item.images.split(',').length > 1 ? (
                      <Slider {...sliderSettings}>
                        {item.images.split(',').map((image, index) => (
                          <div key={index}>
                            <img src={`http://127.0.0.1:8000/products/${image}`} alt={item.name} className="product-image" />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <img src={`http://127.0.0.1:8000/products/${item.images}`} alt={item.name} className="product-image" />
                    )}
                  </Col>
                  <Col md={6} className="product-details-col">
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        Price: {item.price}
                        <br />
                        Quantity: {item.quantity ? item.quantity : '-'}
                        <br />
                        Category: {item.category ? item.category.name : 'N/A'}
                        <br />
                        Branch: {item.branch ? item.branch.name : 'N/A'}
                        <br />
                        Store: {item.store ? item.store.name : 'N/A'}
                      </Card.Text>
                      <div className="product-buttons">
                        <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                        <Button variant="primary">
                          <Link to={`EditProduct/${item.id}`} style={{ color: '#fff', textDecoration: 'none' }}>Edit</Link>
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
                {index !== currentItems.length - 1 && <hr className="product-divider" />}
              </Card>
            ))}
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
    <Pagination className="justify-content-center">
      {pageNumbers.map(number => (
        <Pagination.Item key={number} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};
