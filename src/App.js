import {React  } from 'react'
import axios from 'axios';
import {BrowserRouter as Router,Routes , Route  ,Navigate } from 'react-router-dom';
import LoginSeller from './Components/components_register_login_seller/Login';
import MasterLayoutSeller from './Pages/dashboard_seller/MasterLayoutSeller';
import PageNotFound from './Pages/PageNotFound'; 
import ForgotPassword from './Pages/forgetpassword/ForgotPassword'; 
import ResetPasswordPage from './Pages/resetpassword/resetpassword';

axios.interceptors.request.use(function(config){
const token =localStorage.getItem("token");
config.headers.Authorization =token ? `Bearer ${token}` : '';
return config;
});

function App() {  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/Seller/Login" />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/ResetPassword/:token" element={<ResetPasswordPage />} />
      <Route path="/Seller/Login" element={<LoginSeller />} /> 
      <Route path="/Seller/*" element={<MasterLayoutSeller />} />
      <Route path="*" element={<PageNotFound />} />
      </Routes>
        </Router>
  )

}

export default App;
