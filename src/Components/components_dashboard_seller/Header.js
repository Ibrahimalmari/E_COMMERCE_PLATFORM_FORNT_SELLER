import React, { useState } from 'react';
import {
    BsFillBellFill,
    BsPerson,
    BsJustify,
    BsChevronDown,
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import "./css.css"

function Header({ OpenSidebar }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
    ]);
    const name = localStorage.getItem('name');

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileOptions(false);
    };

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
        setShowNotifications(false);
    };

    const handleSearchChange = (e) => {
        // يمكنك إضافة المنطق هنا للبحث أو استخدام قيمة e.target.value
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="menu-icon">
                    <BsJustify onClick={OpenSidebar} />
                </div>
                <div className="search-container">
                    <input type="text"
                        placeholder="Search..."
                        className="search-input"
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div className="header-right">
                <div className="notification-wrapper" onClick={toggleNotifications}>
                    <BsFillBellFill />
                    <span className="notification-count">{notifications.length}</span>
                    {showNotifications && (
                        <div className="notification-dropdown">
                            {notifications.map((notification) => (
                                <div key={notification.id}>{notification.message}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="profile-wrapper" onClick={toggleProfileOptions}>
                    <BsPerson />
                    <span className="profile-name">{name}</span>
                    <BsChevronDown className="arrow-icon" />
                    {showProfileOptions && (
                        <div className="profile-dropdown">
                            <div className="profile-info">
                                <Link to="/seller/MyProfile/">Profile <BsPerson /></Link>
                                <hr />
                                <Link to="/seller/ChangePassword/">ChangePassword <BsJustify /></Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
