import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';

const SellerProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [DateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [NationalNumber, setNationalNumber] = useState('');
  const [image, setImage] = useState(null);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellerResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/seller/${id}`),
          setLoading(false)
        ]);

        if (sellerResponse.data.status === 200) {
          const sellerData = sellerResponse.data.seller;
          setData(sellerData);
          setName(sellerData.name || '');
          setEmail(sellerData.email || '');
          setAddress(sellerData.address || '');
          setGender(sellerData.gender || '');
          setDateOfBirth(sellerData.DateOfBirth || '');
          setPhone(sellerData.phone || '');
          setNationalNumber(sellerData.NationalNumber || '');
          setImage(sellerData.PhotoOfPersonalID || null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const calculateMaxDateOfBirth = () => {
    const today = new Date();
    const maxDateOfBirth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDateOfBirth.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email address is invalid';
    }

    if (!address.trim()) {
      validationErrors.address = 'Address is required';
    }

    if (!gender) {
      validationErrors.gender = 'Gender is required';
    }

    if (!DateOfBirth) {
      validationErrors.DateOfBirth = 'Birthday is required';
    }

    if (!phone.trim()) {
      validationErrors.phone = 'Phone is required';
    }

    if (!NationalNumber.trim()) {
      validationErrors.NationalNumber = 'National Number is required';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isFormValid = validateForm();

    if (!isFormValid) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('address', address);
    formDataToSend.append('gender', gender);
    formDataToSend.append('phone', phone);
    formDataToSend.append('image', image || null);
    formDataToSend.append('DateOfBirth', DateOfBirth);
    formDataToSend.append('NationalNumber', NationalNumber);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/updatesellerprofile/${id}`, formDataToSend);

      if (response.data.status === 401 || response.data.status === 500) {
        console.log(response.data);
        swal("warning", response.data.message, "warning");
      } else {
        console.log(response.data);
        swal("success", response.data.message, "success");
      }
    } catch (error) {
      console.error(error.message);
      swal("error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-container'>
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1F3750" loading={loading} size={50} />
        </div>
      ) : (
        <div className='row justify-content-center'>
          <div>
            <h2 className="text-center mt-3">Seller Profile</h2>
            <div className="card shadow p-3">
              <div className='card-body'>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row align-items-center">
                    <div className="mb-3">
                      <label>Name:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  {/* Email */}
                  <div className="col">
                    <label>Email:</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <br />
                  {/* Address */}
                  <div className="col">
                    <label>Address:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  {/* Gender */}
                  <div className="col">
                    <label>Gender:</label>
                    <select
                      className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                  </div>
                  {/* Phone */}
                  <div className="col">
                    <label>Phone:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? "is-invalid" : ""} `}
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  {/* DateOfBirth */}
                  <div className="col">
                    <label>DateOfBirth:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.DateOfBirth ? "is-invalid" : ""} `}
                      name="DateOfBirth"
                      value={DateOfBirth}
                      max={calculateMaxDateOfBirth()}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    {errors.DateOfBirth && <div className="invalid-feedback">{errors.DateOfBirth}</div>}
                  </div>
                  {/* Personal Number */}
                  <div className="col">
                    <label>National Number:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.NationalNumber ? "is-invalid" : ""}  `}
                      name="NationalNumber"
                      value={NationalNumber}
                      onChange={(e) => setNationalNumber(e.target.value)}
                    />
                    {errors.NationalNumber && <div className="invalid-feedback">{errors.NationalNumber}</div>}
                  </div>
                  {/* Identity Photo */}
                  <div className="mb-3">
                    <label htmlFor="PhotoOfPersonalID" className="form-label">Photo Of Personal ID</label>
                    <input type="file" className="form-control"  name="image" onChange={handleFileChange} />
                    {image ? (
                      <div>
                        <label>Old Personal ID Photo:</label><br />
                        <img src={`http://127.0.0.1:8000/seller_men/${image}`} alt="Old Personal ID" className="mt-2 img-fluid" style={{ maxWidth: '200px' }} />
                      </div>
                    ) : (
                      <p>No old personal ID photo available</p>
                    )}
                  </div>
                  <br />
                  {/* Submit Button */}
                  <div className="form-group">
                    <button type="submit" className="btn btn-secondary">
                      Update
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

export default SellerProfile;
