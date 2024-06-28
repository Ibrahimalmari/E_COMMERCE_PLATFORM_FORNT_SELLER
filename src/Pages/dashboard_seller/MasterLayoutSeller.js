import {React,useState ,useEffect} from 'react'
import {  Routes ,Navigate ,Route } from "react-router-dom"
import swal from "sweetalert";
import Header from '../../Components/components_dashboard_seller/Header'
import Sidebar from '../../Components/components_dashboard_seller/Sidebar'
import "./MasterLayoutSeller.css"
import PageNotFound from '../PageNotFound';
import routes from '../routes_dashboard_seller/routes'
export default function MasterLayoutSeller() {
  const [loading, setLoading] = useState(false);

const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

 const OpenSidebar = () => {
   setOpenSidebarToggle(!openSidebarToggle)
 }
 useEffect(() => {
  const checkInactivityAndDeleteToken = () => {
    const lastActivity = localStorage.getItem('lastActivity');
    const currentTime = new Date().getTime();
    const inactiveDuration = 20 * 60 * 1000;

    if (lastActivity && (currentTime - parseInt(lastActivity) > inactiveDuration)) {
      swal({
        title: "Your session has expired!",
        text: "Please login again.",
        icon: "warning",
        button: "OK",
        closeOnClickOutside: false, // هذا الخيار يمنع إغلاق الرسالة عند النقر خارجها
      });
      localStorage.removeItem('token');
      localStorage.removeItem("name");
      localStorage.removeItem("role_auth");
      localStorage.removeItem("id");
      localStorage.removeItem("lastActivity");
    }
  };
  checkInactivityAndDeleteToken();

}, []); 
  return (
    <div className='grid-container'>
     <Header OpenSidebar={OpenSidebar}/>
     <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/> 
     {loading && <div className="loading-overlay">Loading...</div>}

     <Routes>
            {routes.filter(route => route.component)
              .map(({ path, component: Component }, idx ,name ) => (
                <Route
                  key={idx}
                  path={path}
                  name={name}
                  element={<Component setLoading={setLoading} />}
                />
              ))}
            <Route
              path="/"
              element={<Navigate to="/seller/dashboard"/>}
            />
              {/* Route for Page Not Found */}
            <Route 
            path="*" 
            element={<PageNotFound />} />
            
          </Routes>
    </div>
  )
}
