import React, { useState, useEffect } from 'react';
import axios from "axios";
import swal from "sweetalert";
import { useNavigate, useParams } from 'react-router-dom';
import "../../App.css";
import { ClipLoader } from 'react-spinners';

const AddProduct = () => {
    const navigate = useNavigate();


    const [name, setName] = useState('');
    const [image, setImage] = useState([]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategory] = useState([]);
    const [selectedcategory, setSelectedCategory] = useState();
    const [stores, setStore] = useState([]);
    const [selectedstore, setSelectedStore] = useState();
    const [branches, setBranch] = useState([]);
    const [selectedbranch, setSelectedBranch] = useState();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
      const id = localStorage.getItem('id');
  
      const fetchStore = async () => {
          try {
              const storeRes = await axios.get(`http://127.0.0.1:8000/api/displaystore/${id}`);
              if (storeRes.data.status === 200) {
                  setStore(storeRes.data.store);
              }
          } catch (error) {
              console.error(error);
          }
      };
  
      const fetchCategory = async () => {
          try {
              const categoryRes = await axios.get(`http://127.0.0.1:8000/api/displaycategory/${id}`);
              if (categoryRes.data.status === 200) {
                  setCategory(categoryRes.data.categories);
              }
          } catch (error) {
              console.error(error);
          }
      };
  
    //   const fetchBranch = async () => {
    //     try {
    //         const branchRes = await axios.get(`http://127.0.0.1:8000/api/displaybranch/${id}`);
    //         if (branchRes.data.status === 200 && branchRes.data.branch) {
    //             setBranch(branchRes.data.branch);
    //         } else {
    //             // يمكنك تعيين قيمة افتراضية هنا إذا كانت branch غير موجودة
    //             setBranch(null); // أو أي قيمة افتراضية أخرى تناسب احتياجاتك
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         // يمكنك التعامل مع الخطأ هنا إذا لزم الأمر
    //     }
    // };
  
      const fetchData = async () => {
          setLoading(true);
          await Promise.all([fetchStore(), fetchCategory()]);
          setLoading(false);
      };
  
      fetchData();
  }, []);
  

    const validateForm = () => {
        const validationErrors = {};

        if (image.length === 0) {
            validationErrors.image = 'Please upload at least one image';
        }

        if (!price.trim()) {
            validationErrors.price = "Price is required";
        }

        if (!name.trim()) {
            validationErrors.name = "Name is required";
        }

        if (!description.trim()) {
            validationErrors.description = "Description is required";
        }

        if (!selectedstore) {
            validationErrors.selectedstore = 'Please select a store';
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
        const id = localStorage.getItem('id');

        const isFormValid = validateForm();

        if (!isFormValid) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('description', description);
        formDataToSend.append('price', price);
        formDataToSend.append('quantity', quantity);
        formDataToSend.append('category_id', selectedcategory);
        formDataToSend.append('branch_id', selectedbranch);
        formDataToSend.append('store_id', selectedstore);
        console.log(selectedstore)
        image.forEach((image) => {
            formDataToSend.append('images[]', image);
          });
             console.log(image)
         try {
        const response = await axios.post(`http://127.0.0.1:8000/api/ProductAdd/${id}`, formDataToSend);
            if(response.data.status === 401 ||response.data.status === 500 ){
            console.log(response.data);
            swal("warning",response.data.message,"warning")
            }
            else{
            console.log(response.data);
            swal("success",response.data.message,"success").then(() => {
                // navigate('/seller/Product');
              })
            }
            } catch (error) {
            console.error(error.message);
            swal("error",error.message,"error")
            }
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
                <h4>Add Product
                </h4>
            </div>
            <div className='card-body'>
                <form  onSubmit={handleSubmit}  >
                <div className="row align-items-center mt-4">
                    <div className='col  mb-3'>
                        <label>Name</label>
                        <input type="text"
                        className={`form-control  ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                         value={name}  
                         onChange={(e) =>{setName(e.target.value)}}
                          />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                          
                    </div>
                    <div className='col  mb-3'>
                        <label>Description</label>
                        <input type="text" name="description" 
                        className={`form-control  ${errors.description ? "is-invalid" : ""}`}
                         value={description}  
                         onChange={(e) =>{setDescription(e.target.value)}}/>
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                         
                     </div>
                    </div>
                    <div className="row align-items-center mt-4">
                    <div className='col  mb-3'>
                        <label>Price</label>
                        <input type="text" name="price" 
                        className={`form-control  ${errors.price ? "is-invalid" : ""}`}
                        value={price}  
                         onChange={(e) =>{setPrice(e.target.value)}}/>
                         {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                    <div className='col  mb-3'>
                        <label>Image</label>
                        <input type="file" multiple name="image[]" 
                        className={`form-control  ${errors.image ? "is-invalid" : ""}`}
                        onChange={handleFileChange}/>
                          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                     </div>  
                    </div>
                    <div className="row align-items-center mt-4">
                    <div className='col  mb-3'>
                        <label>Quantity</label>
                        <input type="number" name="quantity" 
                        className={`form-control `}
                        value={quantity}  
                         onChange={(e) =>{setQuantity(e.target.value)}}/>
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
                   
                     </div>
                     <div className="row align-items-center mt-4">
                     <div className="col-md-6 mb-3">
                        <label>Select Branch</label>
                        <select
                        className={`form-control`}
                        name="branch_id"
                        value={selectedbranch}
                        onChange={(e) =>{setSelectedBranch(e.target.value)}} >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                            {branch.name}
                            </option>
                        ))}
                        </select>
                       
                       </div>
                       <div className="col-md-6 mb-3">
                        <label>Select Category</label>
                        <select
                        className={`form-control  `}
                        name="category_id"
                        value={selectedcategory}
                        onChange={(e) =>{setSelectedCategory(e.target.value)}} >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                            {category.name}
                            </option>
                        ))}
                        </select>
                    </div>
                     </div>
                     {/* <div class="col form-check form-switch mt-3 ml-5 ">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                        <label class="form-check-label " for="flexSwitchCheckDefault">Active /InAcive</label>
                    </div> */}
                    <div className='col-md-12 mb-3'>
                        <button type="submit" className="btn btn-secondary float-end">Sava</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </div>
      )}
    </div> 
  )
}

export default AddProduct;