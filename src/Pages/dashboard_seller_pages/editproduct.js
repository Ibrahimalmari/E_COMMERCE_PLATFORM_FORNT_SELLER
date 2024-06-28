import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [image, setImage] = useState([]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
              const id = localStorage.getItem('id');
        const fetchData = async () => {
            try {
                const categoryRes = await axios.get(`http://127.0.0.1:8000/api/displaycategory/${id}`);
                if (categoryRes.data.status === 200) {
                    setCategories(categoryRes.data.categories);
                }
            } catch (error) {
                console.error(error);
                swal('error', 'Failed to fetch categories', 'error');
            }
        };
        fetchData();
    }, [id]);
    
    useEffect(() => {
        const id = localStorage.getItem('id');

        const fetchData = async () => {
            try {
                const branchRes = await axios.get(`http://127.0.0.1:8000/api/displaybranch/${id}`);
                if (branchRes.data.status === 200) {
                    setBranches(branchRes.data.branch);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);
    
    useEffect(() => {
        const id = localStorage.getItem('id');

        const fetchData = async () => {
            try {
                const storeRes = await axios.get(`http://127.0.0.1:8000/api/displaystore/${id}`);
                if (storeRes.data.status === 200) {
                    setStores(storeRes.data.store);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await axios.get(`http://127.0.0.1:8000/api/product/${id}`);
                if (productRes.data.status === 200) {
                    const productData = productRes.data.product;
                    setName(productData.name);
                    setDescription(productData.description);
                    setPrice(productData.price);
                    setQuantity(productData.quantity);
                    setSelectedCategory(productData.category_id);
                    setSelectedBranch(productData.branch_id);
                    setSelectedStore(productData.store_id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const validationErrors = {};

        // Check if price is not empty and then trim it
        if (!price) {
            validationErrors.price = "Price is required";
        }
        
        // Check if name is not empty and then trim it
        if (!name || !name.trim()) {
            validationErrors.name = 'Name is required';
        }
    
        // Check if description is not empty and then trim it
        if (!description || !description.trim()) {
            validationErrors.description = 'Description is required';
        }
    
        if (!selectedStore) {
            validationErrors.selectedStore = 'Please select a store';
        }
    
        setErrors(validationErrors);
    
        return Object.keys(validationErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        setImage([...image, ...selectedFiles]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = validateForm();

        if (!isFormValid) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('_method', 'PUT');
        formDataToSend.append('name', name);
        formDataToSend.append('description', description);
        formDataToSend.append('price', price);
        formDataToSend.append('quantity', quantity);
        formDataToSend.append('category_id', selectedCategory);
        formDataToSend.append('branch_id', selectedBranch);
        formDataToSend.append('store_id', selectedStore);
        
        image.forEach((image) => {
            formDataToSend.append('images[]', image);
          });

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/updateproduct/${id}`, formDataToSend);
            if (response.data.status === 401 ||response.data.status === 500) {
                swal('warning', response.data.message, 'warning');
            } else {
                swal('success', response.data.message, 'success').then(() => {
                    navigate('/seller/Product');
                });
            }
        } catch (error) {
            console.error(error.message);
            swal('error', error.message, 'error');
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
                                <h4>Edit Product</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    <div className='row align-items-center mt-4'>
                                        <div className='col mb-3'>
                                            <label>Name</label>
                                            <input
                                                type='text'
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                name='name'
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                }}
                                            />
                                            {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                                        </div>
                                        <div className='col mb-3'>
                                            <label>Description</label>
                                            <input
                                                type='text'
                                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                name='description'
                                                value={description}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                }}
                                            />
                                            {errors.description && (
                                                <div className='invalid-feedback'>{errors.description}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='row align-items-center mt-4'>
                                        <div className='col mb-3'>
                                            <label>Price</label>
                                            <input
                                                type='text'
                                                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                                name='price'
                                                value={price}
                                                onChange={(e) => {
                                                    setPrice(e.target.value);
                                                }}
                                            />
                                            {errors.price && <div className='invalid-feedback'>{errors.price}</div>}
                                        </div>
                                        <div className='col mb-3'>
                                            <label>Image</label>
                                            <input
                                                type='file'
                                                multiple
                                                name="images[]" 
                                                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                                onChange={handleFileChange}
                                            />
                                            {errors.image && (
                                                <div className='invalid-feedback'>{errors.image}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='row align-items-center mt-4'>
                                        <div className='col mb-3'>
                                            <label>Quantity</label>
                                            <input
                                                type='number'
                                                name='quantity'
                                                className='form-control'
                                                value={quantity}
                                                onChange={(e) => {
                                                    setQuantity(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label>Select Category</label>
                                            <select
                                                className={`form-control `}
                                                name='category_id'
                                                value={selectedCategory}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                }}
                                            >
                                                <option value=''>Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                           
                                        </div>
                                    </div>
                                    <div className='row align-items-center mt-4'>
                                        <div className='col-md-6 mb-3'>
                                            <label>Select Branch</label>
                                            <select
                                                className={`form-control ${errors.selectedBranch ? 'is-invalid' : ''}`}
                                                name='category_id'
                                                value={selectedBranch}
                                                onChange={(e) => {
                                                    setSelectedBranch(e.target.value);
                                                }}
                                            >
                                                <option value=''>Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.selectedBranch && (
                                                <div className='invalid-feedback'>{errors.selectedBranch}</div>
                                            )}
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label>Select Store</label>
                                            <select
                                                className={`form-control ${
                                                    errors.selectedStore ? 'is-invalid' : ''
                                                }`}
                                                name='category_id'
                                                value={selectedStore}
                                                onChange={(e) => {
                                                    setSelectedStore(e.target.value);
                                                }}
                                            >
                                                <option value=''>Select Store</option>
                                                {stores.map((store) => (
                                                    <option key={store.id} value={store.id}>
                                                        {store.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.selectedStore && (
                                                <div className='invalid-feedback'>{errors.selectedStore}</div>
                                            )}
                                        </div>
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

export default EditProduct;
