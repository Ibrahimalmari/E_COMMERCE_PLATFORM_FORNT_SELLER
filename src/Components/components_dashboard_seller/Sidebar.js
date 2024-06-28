import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import {
  BsFillBarChartFill,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsChevronRight
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();

  const [showProductSublinks, setShowProductSublinks] = useState(false);
  const toggleProductSublinks = () => {
    setShowProductSublinks(!showProductSublinks);
  };
  
  const [showCategorySublinks, setShowCategorySublinks] = useState(false);
  const toggleCategorySublinks = () => {
    setShowCategorySublinks(!showCategorySublinks);
  };
  
  const [showStoreSublinks, setShowStoreSublinks] = useState(false);
  const toggleStoreSublinks = () => {
    setShowStoreSublinks(!showStoreSublinks);
  };
  
  const [showBranchSublinks, setShowBranchSublinks] = useState(false);
  const toggleBranchSublinks = () => {
    setShowBranchSublinks(!showBranchSublinks);
  };

  const [showSectionSublinks, setShowSectionSublinks] = useState(false);
  const toggleSectionSublinks = () => {
    setShowSectionSublinks(!showSectionSublinks);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/Seller/Login');
    }
  }, []);

  const logoutSubmit = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem('id');
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/sellerlogout/${id}`);
      if (response.data.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('role_auth');
        localStorage.removeItem('id');
        console.log(response.data);
        swal('success', response.data.message, 'success');
        navigate('/Seller/Login');
      }
    } catch (error) {
      swal('error', error.message, 'error');
      console.error(error.message);
    }
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsFillBarChartFill className="icon_header" /> YAM
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/seller/Dashboard">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <div className="sidebar-sublink-header" onClick={toggleProductSublinks}>
            <span className="main-product">
              <BsFillArchiveFill className="icon" /> Product
            </span>
            <span className="arrow-icon">
              <BsChevronRight />
            </span>
          </div>
          {showProductSublinks && (
            <ul className="sidebar-sublist gray-background">
              <li className="sidebar-sublist-item">
                <Link to="/seller/Product/" className="sublink">
                  All Products
                </Link>
              </li>
              <li className="sidebar-sublist-item">
                <Link to="/seller/Product/Add" className="sublink">
                  Add Product
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="sidebar-list-item">
  <div className="sidebar-sublink-header" onClick={toggleCategorySublinks}>
    <span className="main-category">
      <BsFillGrid3X3GapFill className="icon" /> Category
    </span>
    <span className="arrow-icon">
      <BsChevronRight />
    </span>
  </div>
  {showCategorySublinks && (
    <ul className="sidebar-sublist gray-background">
      <li className="sidebar-sublist-item">
        <Link to="/seller/Category/" className="sublink">
          All Categories
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/seller/Category/Add" className="sublink">
          Add Category
        </Link>
      </li>
    </ul>
  )}
</li>
<li className="sidebar-list-item">
  <div className="sidebar-sublink-header" onClick={toggleStoreSublinks}>
    <span className="main-store">
      <BsPeopleFill className="icon" /> Store
    </span>
    <span className="arrow-icon">
      <BsChevronRight />
    </span>
  </div>
  {showStoreSublinks && (
    <ul className="sidebar-sublist gray-background">
      <li className="sidebar-sublist-item">
        <Link to="/seller/MyStore/" className="sublink">
          My Stores
        </Link>
      </li>
    </ul>
  )}
</li>
<li className="sidebar-list-item">
  <div className="sidebar-sublink-header" onClick={toggleBranchSublinks}>
    <span className="main-branch">
      <BsFillGearFill className="icon" /> Branch
    </span>
    <span className="arrow-icon">
      <BsChevronRight />
    </span>
  </div>
  {showBranchSublinks && (
    <ul className="sidebar-sublist gray-background">
      <li className="sidebar-sublist-item">
        <Link to="/seller/Branch/" className="sublink">
          All Branches
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/seller/Branch/Add" className="sublink">
          Add Branch
        </Link>
      </li>
    </ul>
  )}
</li>
        <li className="sidebar-list-item">
          <Link to="seller/Inventory">
            <BsListCheck className="icon" /> Inventory
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="seller/Report">
            <BsMenuButtonWideFill className="icon" /> Reports
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link onClick={logoutSubmit}>
            <BsFillGearFill className="icon" /> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
