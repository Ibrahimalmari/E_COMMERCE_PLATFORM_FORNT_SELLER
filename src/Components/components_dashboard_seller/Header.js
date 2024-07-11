import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillBellFill, BsPerson, BsJustify, BsChevronDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import "./css.css";

function Header({ OpenSidebar }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotificationAlert, setShowNotificationAlert] = useState(false);
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('id');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        axios.get(`http://127.0.0.1:8000/api/seller/notifications/${id}`)
            .then(response => {
                if (response.data.status === 200) {
                    setNotifications(response.data.notifications);

                    if (response.data.notifications.length > 0) {
                        setShowNotificationAlert(true);
                        setTimeout(() => {
                            setShowNotificationAlert(false);
                        }, 5000);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileOptions(false);
    };

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
        setShowNotifications(false);
    };

    const handleSearchChange = (e) => {
        // منطق البحث
    };

    const handleMarkAllAsRead = () => {
        axios.post('http://127.0.0.1:8000/api/notification/markAllAsRead', { sellerId: id })
            .then(response => {
                if (response.data.status === 200) {
                    fetchNotifications();
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error marking all notifications as read:', error);
            });
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="menu-icon">
                    <BsJustify onClick={OpenSidebar} />
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="بحث..."
                        className="search-input"
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div className="header-right">
                <div className="notification-wrapper" onClick={toggleNotifications}>
                    <BsFillBellFill className="notification-icon" />
                    {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
                    {showNotifications && (
                        <div className="notification-dropdown">
                            {notifications.length > 0 ? (
                                <>
                                    <div className="notification-list">
                                        {notifications.map((notification) => {
                                            const data = notification.data.rejectedData || {};
                                            return (
                                                <div key={notification.id} className="notification-item">
                                                    <div className="notification-message">
                                                        {notification.data.rejectReason && (
                                                            <div className="reject-reason">{notification.data.rejectReason}</div>
                                                        )}
                                                        {data.branch_name && (
                                                            <div className="rejected-data">branch: {data.branch_name}</div>
                                                        )}
                                                        {data.product_name && (
                                                            <div className="rejected-data">product:{data.product_name}</div>
                                                        )}
                                                        {data.category_name && (
                                                            <div className="rejected-data">category:{data.category_name}</div>
                                                        )}
                                                        <div className="message">{notification.data.message}</div>
                                                    </div>
                                                    <div className="notification-date">{new Date(notification.created_at).toLocaleString()}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="notification-footer">
                                        <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                                            تعليم الكل كمقروء
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="no-notifications">لا توجد إشعارات</div>
                            )}
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
                                <Link to="/seller/MyProfile/" className="profile-link">الملف الشخصي <BsPerson /></Link>
                                <hr />
                                <Link to="/seller/ChangePassword/" className="profile-link">تغيير كلمة المرور <BsJustify /></Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showNotificationAlert && (
                <div className={`notification-alert ${showNotificationAlert ? 'show' : ''}`}>
                    يوجد إشعارات جديدة
                </div>
            )}
        </header>
    );
}

export default Header;
