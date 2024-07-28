import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, Spinner, Form, Button, Pagination, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import './order.css';

const orderStatusOptions = [
  { value: 'تم استلام الطلب', label: 'تم استلام الطلب' },
  { value: 'الطلب قيد التجهيز', label: 'الطلب قيد التجهيز' },
  { value: 'الطلب جاهز للتوصيل', label: 'الطلب جاهز للتوصيل' },
  { value: 'الطلب في مرحلة التوصيل', label: 'الطلب في مرحلة التوصيل' },
  { value: 'تم تسليم الطلب', label: 'تم تسليم الطلب' },
];

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const id = localStorage.getItem('id');
        if (!id) {
          setError('لم يتم العثور على معرف الطلب');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`);
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError('لم يتم العثور على الطلبات');
        }
      } catch (error) {
        setError('لا يوجد طلبات حاليا');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, selectedOption) => {
    try {
      const updatedStatus = selectedOption.value;
      await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}`, {
        order_status: updatedStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: updatedStatus } : order
        )
      );
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب', error);
    }
  };

  const handleSearch = () => {
    // Perform filtering based on searchDate and selectedStatus
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  // Filter orders based on search criteria
  const filteredOrders = orders.filter(order => {
    const matchesDate = searchDate ? new Date(order.created_at).toLocaleDateString() === searchDate : true;
    const matchesStatus = selectedStatus ? order.order_status === selectedStatus.value : true;
    return matchesDate && matchesStatus;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <Container className="main-container">
      <h3 className="order-title">تفاصيل الطلبات</h3>
      
      {/* Search Form */}
      <Form className="search-form mb-4">
        <Row>
          <Col md={6}>
            <Form.Group controlId="formSearchDate">
              <Form.Label>البحث حسب التاريخ</Form.Label>
              <Form.Control
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formSearchStatus">
              <Form.Label>البحث حسب الحالة</Form.Label>
              <Select
                value={selectedStatus}
                onChange={(option) => setSelectedStatus(option)}
                options={orderStatusOptions}
                isClearable
                placeholder="اختر الحالة"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleSearch} className="mt-3">بحث</Button>
      </Form>
      
      <div className="order-grid">
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => {
            const hasOrder = order && order.customer;
            const hasCartItems = order && order.cart && order.cart.items;

            return (
              <div key={order.id} className="order-card">
                <div className="order-section">
                  <h5>تفاصيل الطلب</h5>
                  <table className="order-table">
                    <tbody>
                      <tr>
                        <th>رقم الطلب:</th>
                        <td>{order.order_numbers || '-'}</td>
                      </tr>
                      <tr>
                        <th>الحالة:</th>
                        <td>
                          <Select
                            value={orderStatusOptions.find(option => option.value === order.order_status)}
                            onChange={(selectedOption) => handleStatusChange(order.id, selectedOption)}
                            options={orderStatusOptions}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>تاريخ الإنشاء:</th>
                        <td>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString() + ' ' + new Date(order.created_at).toLocaleTimeString()
                            : '-'}
                        </td>
                      </tr>
                      <tr>
                        <th>طريقة الدفع:</th>
                        <td>{order.pay_way || '-'}</td>
                      </tr>
                      <tr>
                        <th>معلومات إضافية:</th>
                        <td>{order.additional_info || '-'}</td>
                      </tr>
                      <tr>
                        <th>ملاحظات التوصيل:</th>
                        <td>{order.delivery_notes || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="order-section">
                  <h5>تفاصيل المالية</h5>
                  <table className="order-table">
                    <tbody>
                      <tr>
                        <th>مبلغ الفاتورة:</th>
                        <td>{order.invoice_amount ? order.invoice_amount.toLocaleString('ar-SY') + ' ل.س' : '-'}</td>
                      </tr>
                      <tr>
                        <th>الضريبة:</th>
                        <td>{order.tax ? order.tax.toLocaleString('ar-SY') + ' ل.س' : '-'}</td>
                      </tr>
                      <tr>
                        <th>البقشيش:</th>
                        <td>{order.tip ? order.tip.toLocaleString('ar-SY') + ' ل.س' : '-'}</td>
                      </tr>
                      <tr>
                        <th>رسوم التوصيل:</th>
                        <td>{order.delivery_fee ? order.delivery_fee.toLocaleString('ar-SY') + ' ل.س' : '-'}</td>
                      </tr>
                      <tr>
                        <th>الخصم:</th>
                        <td>{order.discount ? order.discount.toLocaleString('ar-SY') + ' ل.س' : '-'}</td>
                      </tr>
                      <tr>
                        <th>المجموع:</th>
                        <td>
                          {order.invoice_amount && order.tax && order.delivery_fee
                            ? (order.invoice_amount + order.tax + order.delivery_fee - order.discount).toLocaleString('ar-SY') + ' ل.س'
                            : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="order-section">
                  <h5>معلومات العميل</h5>
                  <table className="order-table">
                    <tbody>
                      <tr>
                        <th>اسم العميل:</th>
                        <td>{hasOrder ? order.customer.name : '-'}</td>
                      </tr>
                      <tr>
                        <th>رقم الهاتف:</th>
                        <td>{hasOrder ? order.customer.phone : '-'}</td>
                      </tr>
                      <tr>
                        <th>العنوان:</th>
                        <td>{hasOrder ? order.address.area : '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="order-section">
                  <h5>عناصر السلة</h5>
                  {hasCartItems && hasCartItems.length > 0 ? (
                    hasCartItems.map((item, index) => (
                      <div key={index} className="order-item">
                        {item.product?.images && (
                          <img
                            src={`http://127.0.0.1:8000/products/${item.product.images}`}
                            alt={item.product.name}
                            className="order-item-image"
                          />
                        )}
                        <div className="order-item-details">
                          <div><strong>{item.product?.name || '-'}</strong></div>
                          <div className="item-quantity">الكمية: {item.quantity}</div>
                          <div className="item-price">السعر: {item.product?.price.toLocaleString('ar-SY') || '-'} ل.س</div>
                          <div className="item-notes">ملاحظات: {item.notes || '-'}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="order-empty-message">لا توجد عناصر في السلة.</div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-orders-message">
            <div className="no-orders-icon">📦</div>
            <div>لا توجد طلبات حاليًا.</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="pagination mt-4">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </Container>
  );
}
