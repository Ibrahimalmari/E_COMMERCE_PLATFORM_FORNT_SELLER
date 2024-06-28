import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';

const EditCategory = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [selectedStore, setSelectedStore] = useState('');
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/category/${id}`);
                const { category } = response.data;
                setName(category.name);
                setSlug(category.slug);
                setDescription(category.description);
                setSelectedStore(category.store_id);

                setLoading(false);
            } catch (error) {
                console.error(error);
                swal('error', 'Failed to fetch category details', 'error');
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    useEffect(() => {
        const id = localStorage.getItem('id');
  
        axios.get(`http://127.0.0.1:8000/api/displaystore/${id}`).then(res =>{
           if(res.data.status === 200 ){
            setStores(res.data.store)
           console.log(res.data.store)
           setLoading(false);
           }
        })
      }, []);

    const validateForm = () => {
        const validationErrors = {};

        if (!name.trim()) {
            validationErrors.name = 'Name is required';
        }

        if (!slug.trim()) {
            validationErrors.slug = 'Slug is required';
        }
        
        if (!description.trim()) {
            validationErrors.description = 'Description is required';
        }

        if (!selectedStore) {
            validationErrors.selectedStore = 'Please select a store';
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
        formDataToSend.append('slug', slug);
        formDataToSend.append('description', description);
        formDataToSend.append('store_id', selectedStore);
        
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/updatecategory/${id}`, formDataToSend);
            if (response.data.status === 200) {
                console.log(response.data);
                swal('success', response.data.message, 'success');
            } else {
                swal('warning', response.data.message, 'warning');
            }
        } catch (error) {
            console.error(error.message);
            swal('error', 'Failed to update category', 'error');
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
                                <h4>Edit Category</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    <div className='col-md-6 mb-3'>
                                        <label>Name</label>
                                        <input
                                            type='text'
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            name='name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <label>Slug</label>
                                        <input
                                            type='text'
                                            className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                                            name='slug'
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                        />
                                        {errors.slug && <div className='invalid-feedback'>{errors.slug}</div>}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <label>Description</label>
                                        <input
                                            type='text'
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            name='description'
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        {errors.description && (
                                            <div className='invalid-feedback'>{errors.description}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Select Store</label>
                                        <select
                                        className={`form-control  ${errors.selectedStore ? "is-invalid" : ""}`}
                                        name="store_id"
                                        value={selectedStore}
                                        onChange={(e) => { setSelectedStore(e.target.value) }} >
                                        <option value="">Select Store</option>
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>
                                            {store.name}
                                            </option>
                                        ))}
                                        </select>
                                        {errors.selectedStore && (
                                            <div className='invalid-feedback'>
                                            {errors.selectedStore}
                                            </div>
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

export default EditCategory;
