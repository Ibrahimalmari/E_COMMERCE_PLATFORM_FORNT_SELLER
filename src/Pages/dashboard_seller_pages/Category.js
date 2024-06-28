import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import "../../App.css";
import { ClipLoader } from 'react-spinners';

export default function Category() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(0); // الصفحة الحالية
    const itemsPerPage = 5; // عدد العناصر في كل صفحة

    useEffect(() => {

        const fetchData = async () => {
            try {
              const id = localStorage.getItem('id');
                const response = await axios.get(`http://127.0.0.1:8000/api/displaycategory/${id}`);
                if(response.data.categories){
                setData(response.data.categories);
                console.log(response.data.categories);
                setLoading(false); 
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/deletecategory/${id}`);
            setData(data.filter(item => item.id !== id));
            // إضافة رسالة تأكيد حذف هنا
        } catch (error) {
            console.error('Error deleting category: ', error);
            // إضافة إشعار خطأ هنا
        }
    };

    // تابع لتنفيذ عملية البحث بناءً على الاسم
    const filteredData = data.filter(item => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // حساب العناصر المعروضة في الصفحة الحالية
    const itemsDisplayed = filteredData.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

    // حساب عدد الصفحات الإجمالي
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    // تغيير الصفحة
    const goToPage = (page) => {
        setPageNumber(page);
    };

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
                            <h4>
                                Category
                                <Link to="/seller/Category/Add" className='btn btn-secondary float-end'>Add Category</Link>
                            </h4>
                        </div>
                        <div className='card-body'>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                           <div style={{ overflowX: 'auto' }}>
                             <table className='table table-bordered table-striped'>
                                <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Slug</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Store Name</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsDisplayed.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.slug}</td>
                                            <td>{item.description}</td>
                                            <td>{item.store.name}</td>
                                            <td>{item.status}</td>
                                            <td>
                                          <Link to={`EditCategory/${item.id}`} className='btn btn-primary me-2'>
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
                                        onClick={() => goToPage(index)}
                                        className={`btn btn-primary ${index === pageNumber ? 'active' : ''}`}
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
    )
}
