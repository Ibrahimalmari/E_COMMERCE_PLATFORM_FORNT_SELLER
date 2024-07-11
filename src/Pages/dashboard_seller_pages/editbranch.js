import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';
import { useParams, useNavigate } from 'react-router-dom';

const EditBranch = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const id_user = localStorage.getItem('id');

            try {
                const [categoryRes, branchRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/displaycategory/${id_user}`), // fetch all categories
                    axios.get(`http://127.0.0.1:8000/api/branch/${id}`) // fetch branch by id
                ]);
                console.log()

                if (categoryRes.data.status === 200) {
                    setCategories(categoryRes.data.categories || []);
                }

                if (branchRes.data.status === 200) {
                    const branch = branchRes.data.branch;
                    setName(branch.name);
                    setSelectedCategory(branch.category_id);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                swal('error', 'Failed to fetch data', 'error');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const validateForm = () => {
        const validationErrors = {};

        if (!name.trim()) {
            validationErrors.name = 'Name is required';
        }

        if (!selectedCategory) {
            validationErrors.selectedCategory = 'Please select a category';
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();

        if (!isFormValid) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('_method', 'PUT');
        formDataToSend.append('name', name);
        formDataToSend.append('category_id', selectedCategory);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/updatebranch/${id}`, formDataToSend);
            if (response.data.status === 200) {
                swal('success', response.data.message, 'success').then(() => {
                    navigate('/seller/Branch/');
                });
            } else {
                swal('warning', response.data.message, 'warning');
            }
        } catch (error) {
            console.error(error.message);
            swal('error', 'Failed to update branch', 'error');
        }
    };

    return (
        <div className='main-container'>
            {loading ? (
                <div className='loading-container'>
                    <ClipLoader color='#1F3750' loading={loading} size={50} />
                </div>
            ) : (
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4>Edit Branch</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    <div className='col-md-6 mb-3'>
                                        <label>Name</label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <label>Select Category</label>
                                        <select
                                            className={`form-control ${
                                                errors.selectedCategory ? 'is-invalid' : ''
                                            }`}
                                            name='category_id'
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}>
                                            <option value=''>Select Category</option>
                                            {categories.length > 0 && categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.selectedCategory && (
                                            <div className='invalid-feedback'>{errors.selectedCategory}</div>
                                        )}
                                    </div>
                                    <div className='col-md-12 mb-3'>
                                        <button type='submit' className='btn btn-secondary float-end'>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditBranch;
