import React , { useState ,useEffect  } from 'react';
import axios from "axios";
import swal from "sweetalert";
import { ClipLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import "../../App.css";

const  AddBranch = () => {  
    
    const navigate = useNavigate();

    const [name ,setName] = useState('')
    const [categories, setCategory] = useState([]);
    const [selectedcategory, setSelectedCategory] = useState();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);



       
  useEffect(() => {
    const id = localStorage.getItem('id');

    axios.get(`http://127.0.0.1:8000/api/displaycategory/${id}`).then(res =>{
       if(res.data.status === 200 ){
        setCategory(res.data.categories)
       console.log(res.data.categories)
       setLoading(false);
       }
    })
 }, [])
 

 const validateForm = () => {
    const validationErrors = {};



    if (!name.trim()) {
        validationErrors.name = 'Name is required';
      }
  
      if (!selectedcategory ) {
        validationErrors.selectedcategory = 'Please select a category';
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
            formDataToSend.append('category_id', selectedcategory);
         
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/BranchAdd/${id}`, formDataToSend);
                   if(response.data.status === 401 || response.data.status === 500  ){
                console.log(response.data);
                 swal("warning",response.data.message,"warning")
                }
                else{
                console.log(response.data);
                swal("success",response.data.message,"success").then(() => {
                  navigate('/seller/Branch/');
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
                <h4>Add Branch
                </h4>
            </div>
            <div className='card-body'>
                <form  onSubmit={handleSubmit} >
                    <div className='col-md-6 mb-3'>
                        <label>Name</label>
                        <input type="text" name="name" 
                         value={name}  
                        onChange={(e) =>{setName(e.target.value)}}
                         className={`form-control  ${errors.name ? "is-invalid" : ""}`} />
                         {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Select Category</label>
                        <select
                        className={`form-control ${
                          errors.selectedcategory ? 'is-invalid' : ''
                        }`}
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
                        {errors.selectedcategory && (
                    <div className='invalid-feedback'>
                      {errors.selectedcategory}
                        </div>
                      )}
                       
                    </div>
                    {/* <div class="form-check form-switch mt-3 ml-5">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                        <label class="form-check-label " for="flexSwitchCheckDefault">Active</label>
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
export default AddBranch;