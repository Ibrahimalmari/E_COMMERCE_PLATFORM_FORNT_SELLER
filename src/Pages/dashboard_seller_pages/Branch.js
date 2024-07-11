import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import "../../App.css";
import { ClipLoader } from 'react-spinners';

export default function Branch() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const id = localStorage.getItem('id');
                console.log(id)
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/displaybranch/${id}`);
                if(response.data.branches){
                  setData(response.data.branches)
                  setLoading(false)
                }
                else{
                  setLoading(false); // تحديث الحالة في حالة عدم وجود بيانات
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

      // تابع لتنفيذ عملية البحث بناءً على الاسم
      const filteredData = data.filter(item => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
    const handleDelete = async (id) => {
      try {
          await axios.delete(`http://127.0.0.1:8000/api/deletebranch/${id}`);
          setData(data.filter(item => item.id !== id));
          // إضافة رسالة تأكيد حذف هنا
      } catch (error) {
          console.error('Error deleting category: ', error);
          // إضافة إشعار خطأ هنا
      }
  };

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedData = filteredData.slice(startIndex, endIndex);

    return (
        <div className='main-container'>
            {loading ? (
                <div className="loading-container">
                    <ClipLoader color="#1F3750" loading={loading} size={50} />
                </div>
            ) : (
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4 className='fw-bold '>
                                    <BsTable size={24} color="#1F3750" className="me-1 mb-1" />
                                    Branch
                                    <Link to="/Seller/Branch/Add" className='btn btn-secondary float-end'>Add Branch</Link>
                                </h4>
                            </div>
                            <div className='card-body'>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="table table-bordered table-striped">
                                        <thead className='text-white bg-dark'>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Category Name</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedData.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.category ? `${item.category.name}` : 'N/A'}</td>
                                                    <td>{item.status}</td>
                                                    <td>
                                                    <Link to={`EditBranch/${item.id}`} className='btn btn-primary me-2'>
                                                      <BsPencil size={20} color='#fff' />
                                                    </Link>
                                                    <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>
                                                      <BsTrash size={20} color='#fff' />
                                                    </button>
                                                  </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pagination justify-content-center">
                                    {[...Array(pageCount)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleChangePage(index)}
                                            className={`btn btn-primary ${index === page ? 'active' : ''}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
