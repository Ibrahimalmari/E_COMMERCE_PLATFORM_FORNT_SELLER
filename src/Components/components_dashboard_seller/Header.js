import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { BsFillBellFill, BsPerson, BsJustify, BsChevronDown, BsBell } from 'react-icons/bs'; // مثال على أيقونة جرس
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css.css';

function Header({ OpenSidebar }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [pusherNotification, setPusherNotification] = useState(null);
    const [pusherNotificationdata, setPusherNotificationdata] = useState(null);

    const [notificationError, setNotificationError] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null); // لحفظ معرف المؤقت
    const [timeLeft, setTimeLeft] = useState(30); // لحفظ الوقت المتبقي
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('id');

    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher('a7675dfaac8ec49f6511', { cluster: 'eu' });
        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function(data) {
            setPusherNotification(data.message);
            setPusherNotificationdata(data.order);
            console.log(data.order)
            fetchNotifications();
            startNotificationTimeout();
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const fetchNotifications = () => {
        axios.get(`http://127.0.0.1:8000/api/seller/notifications/${id}`)
            .then(response => {
                if (response.data.status === 200) {
                    setNotifications(response.data.notifications);
                    setNotificationError(null);
                }
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                setNotificationError('خطأ في جلب الإشعارات.');
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

    const startNotificationTimeout = () => {
        // إذا كان هناك مؤقت سابق، قم بإلغائه
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        setTimeLeft(30); // إعادة تعيين الوقت المتبقي

        const id = setTimeout(() => {
            setPusherNotification(null); // إخفاء الإشعار
        }, 30000); // 30 ثانية

        setTimeoutId(id); // حفظ معرف المؤقت

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const handleAccept = () => {
        // تأكد من صحة البيانات التي ترسلها
        console.log('Sending data:', pusherNotificationdata);
        
        axios.post('http://127.0.0.1:8000/api/accept-order-creation', pusherNotificationdata)
            .then(response => {
                console.log('Response data:', response.data); // عرض البيانات لتصحيح الأخطاء
                if (response.data.success) {
                    alert('تم قبول الطلب بنجاح.');
                } else {
                    alert('حدث خطأ أثناء قبول الطلب: ' + (response.data.message || 'رسالة غير محددة.'));
                }
            })
            .catch(error => {
                console.error('Error accepting order:', error.response ? error.response.data : error.message);
                alert('حدث خطأ أثناء قبول الطلب.');
            })
            .finally(() => {
                setPusherNotification(null);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            });
    };
    
    
    const handleReject = () => {
        axios.post('http://127.0.0.1:8000/api/reject-order-creation')
            .then(response => {
                if (response.data.success) {
                    alert('تم رفض الطلب بنجاح.');
                } else {
                    alert('حدث خطأ أثناء رفض الطلب.');
                }
            })
            .catch(error => {
                console.error('Error rejecting order:', error);
                alert('حدث خطأ أثناء رفض الطلب.');
            })
            .finally(() => {
                setPusherNotification(null);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            });
    };
    

    return (
        <header className="header">
            <div className="header-left">
                <div className="menu-icon" onClick={OpenSidebar}>
                    <BsJustify />
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
                                            const data = notification.data || {};
                                            return (
                                                <div key={notification.id} className="notification-item">
                                                    <div className="notification-message">
                                                        {data.message}
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
                                <Link to="/seller/MyProfile/" className="profile-link">
                                    الملف الشخصي <BsPerson />
                                </Link>
                                <hr />
                                <Link to="/seller/ChangePassword/" className="profile-link">
                                    تغيير كلمة المرور <BsJustify />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {pusherNotification && (
                <div className="notification-modal">
                    <div className="notification-backdrop" /> {/* خلفية نصف شفافة */}
                    <div className="notification-modal-content">
                        <BsBell className="notification-icon-modal" /> {/* استبدال الصورة بالأيقونة */}
                        <div className="notification-text">{pusherNotification}</div>
                        <div className="notification-timer">ستختفي في غضون: {timeLeft} ثانية</div> {/* عرض المؤقت */}
                        <div className="notification-actions">
                            <button className="btn-accept" onClick={handleAccept}>قبول</button>
                            <button className="btn-reject" onClick={handleReject}>رفض</button>
                        </div>
                    </div>
                </div>
            )}

            {notificationError && (
                <div className="notification-error">
                    {notificationError}
                </div>
            )}
        </header>
    );
}

export default Header;
