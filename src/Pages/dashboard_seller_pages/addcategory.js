import React , { useState  ,useEffect } from 'react';
import axios from "axios";
import swal from "sweetalert";
import {useNavigate} from "react-router-dom";
import "../../App.css";
import { ClipLoader } from 'react-spinners';


  const AddCategory = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [selectedstore, setSelectedStore] = useState();
    const [stores, setStore] = useState([]);



    useEffect(() => {
      const id = localStorage.getItem('id');

      axios.get(`http://127.0.0.1:8000/api/displaystore/${id}`).then(res =>{
         if(res.data.status === 200 ){
          setStore(res.data.store)
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

        if (!selectedstore) {
          validationErrors.selectedstore = 'Please select a store';
      }
        


        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem('id');

        const isFormValid = validateForm();

        if (!isFormValid) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('slug', slug);
        formDataToSend.append('description', description);
        formDataToSend.append('store_id', selectedstore);


        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/CategoryAdd/${id}`, formDataToSend);
            if (response.data.status === 401 || response.data.status === 500) {
                console.log(response.data);
                swal('warning', response.data.message, 'warning');
            } else {
                console.log(response.data);
                swal('success', response.data.message, 'success');
                navigate('/seller/Category/');
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
                                <h4>Add Category</h4>
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
                                            onChange={(e) => {
                                                setName(e.target.value);
                                            }}
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
                                            onChange={(e) => {
                                                setSlug(e.target.value);
                                            }}
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
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                            }}
                                        />
                                        {errors.description && <div className='invalid-feedback'>{errors.description}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Select Store</label>
                                        <select
                                        className={`form-control  ${errors.selectedstore ? "is-invalid" : ""}`}
                                        name="store_id"
                                        value={selectedstore}
                                        onChange={(e) =>{setSelectedStore(e.target.value)}} >
                                        <option value="">Select Store</option>
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>
                                            {store.name}
                                            </option>
                                        ))}
                                        </select>
                                        {errors.selectedstore && (
                                            <div className='invalid-feedback'>
                                            {errors.selectedstore}
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

export default AddCategory;
