import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AdminOrders.css';
import "../home/Navbar.css";

function AdminOrders() {

    const { adminId } = useParams();
    const [orderProducts, setOrderProducts] = useState([]);
    const [pastOrderProducts, setPastOrderProducts] = useState([]);
    const [orderProductsError, setOrderProductsError] = useState("");
    const [pastOrderProductsError, setPastOrderProductsError] = useState("");

    // Siparişleri getiren fonksiyon
    const fetchOrderProducts = async () => {
        try {
            const response = await fetch('/orders/admin');
            if (response.ok) {
                const data = await response.json();
                setOrderProducts(data);
            } else {
                setOrderProductsError("Sipariş bilgileri alınamadı.");
            }
        } catch (error) {
            setOrderProductsError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    // Geçmiş siparişleri getiren fonksiyon
    const fetchPastOrderProducts = async () => {
        try {
            const response = await fetch('/orders/adminPastOrders');
            if (response.ok) {
                const data = await response.json();
                setPastOrderProducts(data);
            } else {
                setPastOrderProductsError("Sipariş bilgileri alınamadı.");
            }
        } catch (error) {
            setOrderProductsError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    // Hepsini Onayla butonuna basıldığında çalışacak fonksiyon
    const handleApproveAll = async () => {
        if (window.confirm("Siparişleri onaylamak istediğinizden emin misiniz?")) 
        {
            try {
                // Siparişleri öncelik skoruna göre sırala
                const sortedOrders = [...sortedOrderProducts].sort((a, b) => b.priorityScore - a.priorityScore);
                
                // Sırayla her siparişi onayla
                for (const order of sortedOrders) {
                    const response = await fetch('/orders/approve', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(order),
                    });

                    if (!response.ok) {
                        alert('Siparişler onaylanırken bir hata oluştu. Lütfen tekrar deneyin.');
                        return;
                    }
                }
                
                alert('Tüm siparişler onaylandı!');
                // Siparişleri yeniden yükle
                fetchOrderProducts();
            } catch (error) {
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    // Tek bir siparişi onaylayan fonksiyon
    const handleApprove = async (orderProduct) => {
        if (window.confirm("Siparişi onaylamak istediğinizden emin misiniz?")) 
        {
            try {
                const response = await fetch('/orders/approve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderProduct),
                });
    
                if (response.ok) {
                    alert('Sipariş onaylandı!');
                    // Siparişleri yeniden yükle
                    fetchOrderProducts();
                } else {
                    alert('Sipariş onaylanamadı. Lütfen tekrar deneyin.');
                }
            } catch (error) {
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    // Tek bir siparişi reddeden fonksiyon
    const handleDecline = async (orderProduct) => {
        if (window.confirm("Siparişi reddetmek istediğinizden emin misiniz?")) 
        {
            try {
                const response = await fetch('/orders/decline', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderProduct),
                });
    
                if (response.ok) {
                    alert('Sipariş iptal edildi!');
                    // Siparişleri yeniden yükle
                    fetchOrderProducts();
                } else {
                    alert('Sipariş onaylanamadı. Lütfen tekrar deneyin.');
                }
            } catch (error) {
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    useEffect(() => {
        fetchOrderProducts();
        fetchPastOrderProducts();
    
        // WebSocket bağlantısı oluştur
        const ws = new WebSocket('ws://localhost:8080/ws/orders');
    
        // WebSocket olaylarını dinle
        ws.onopen = () => {
            console.log('WebSocket bağlantısı açıldı');
        };
    
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_ORDER') {
                // Yeni sipariş geldiğinde siparişleri güncelle
                fetchOrderProducts();
            }
        };
    
        ws.onclose = () => {
            console.log('WebSocket bağlantısı kapandı');
        };
    
        ws.onerror = (error) => {
            console.error('WebSocket hatası:', error);
        };
    
        // Component unmount olduğunda WebSocket bağlantısını kapat
        return () => {
            ws.close();
        };
    }, [adminId]);

    // Bekleme süresi ve öncelik skorunu belirli aralıklarla güncelle
    useEffect(() => {
        const interval = setInterval(() => {
            setOrderProducts((prevOrderProducts) => {
                return prevOrderProducts.map((orderProduct) => {
                    const waitingTime = calculateWaitingTime(orderProduct.orderDate);
                    const priorityScore = calculatePriorityScore(orderProduct.customerType, waitingTime.totalSeconds);
                    return { ...orderProduct, waitingTime, priorityScore };
                }).sort((a, b) => b.priorityScore - a.priorityScore);
            });
        }, 1000); // Her 1 saniyede bir güncelle

        return () => clearInterval(interval);
    }, []);
    

    // Login sayfasına yönlendiren çalışacak fonksiyon
    const handleLogout = () => {
        window.location.href = 'http://localhost:3000/login';
    };

    // Profil sayfasına yönlendiren çalışacak fonksiyon
    const handleProfile = () => {
        window.location.href = `http://localhost:3000/adminprofile/${adminId}`;
    };

    // Cüzdan sayfasına yönlendiren çalışacak fonksiyon
    const handleWallet= () => {
        window.location.href = `http://localhost:3000/adminwallet/${adminId}`;
    };

    // Ürünler sayfasına yönlendiren çalışacak fonksiyon
    const handleProduct= () => {
        window.location.href = `http://localhost:3000/adminproducts/${adminId}`;
    };

    // Siparişler sayfasına yönlendiren çalışacak fonksiyon
    const handleOrders= () => {
        window.location.href = `http://localhost:3000/adminorders/${adminId}`;
    };

    // Log sayfasına yönlendiren çalışacak fonksiyon
    const handleLog= () => {
        window.location.href = `http://localhost:3000/adminlogs/${adminId}`;
    };

    if (orderProductsError) {    
    }

    if (pastOrderProductsError) {    
    }

    //Bekleme süresi
    const calculateWaitingTime = (orderDate) => {
        const orderTime = new Date(orderDate);
        const currentTime = new Date();
        const diff = currentTime - orderTime;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            formatted: `${hours} saat ${minutes} dakika ${seconds} saniye`,
            totalSeconds: diff / 1000
        };
    };
    
    //Öncelik skoru
    const calculatePriorityScore = (customerType, waitingTimeInSeconds) => {
        const basePriorityScore = customerType === "Premium" ? 15 : 10;
        const waitingTimeWeight = 0.5;
        return basePriorityScore + (waitingTimeInSeconds * waitingTimeWeight);
    };

    //Öncelik skoruna göre sıralama
    const sortedOrderProducts = orderProducts.map((orderProduct) => {
        const waitingTime = calculateWaitingTime(orderProduct.orderDate);
        const priorityScore = calculatePriorityScore(orderProduct.customerType, waitingTime.totalSeconds);
        return { ...orderProduct, waitingTime, priorityScore };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
   

    return (
        <div className="admin-orders-page">
            <nav className="navbar">
                <div className="navbar-left">
                <div className="navbar-item" onClick={handleProfile}>
                        <img src={"/assets/profileicon.png"} alt="Profile" className="navbar-icon-profileicon" />
                        <span>Profil</span>
                </div>
                <div className="navbar-item" onClick={handleProduct}>
                        <img src={"/assets/producticon.png"} alt="Product" className="navbar-icon-profileicon" />
                        <span>Ürünler</span>
                </div>
                <div className="navbar-item" onClick={handleOrders}>
                        <img src={"/assets/ordericon.png"} alt="Order" className="navbar-icon-profileicon" />
                        <span>Siparişler</span>
                </div>
                <div className="navbar-item" onClick={handleLog}>
                        <img src={"/assets/logicon.png"} alt="Log" className="navbar-icon-profileicon" />
                        <span>Kayıtlar</span>
                </div>
                </div>
                <div className="navbar-right">
                <div className="navbar-item" onClick={handleWallet}>
                    <img src={"/assets/walleticon.png"} alt="Wallet" className="navbar-icon" />
                    <span>Cüzdan</span>
                </div>
                <div className="navbar-item" onClick={handleLogout}>
                    <img src={"/assets/logoutlogo.png"} alt="Exit" className="navbar-icon" />
                    <span>Çıkış</span>
                </div>
                </div>
            </nav>

            <div className="admin-orders-card">
                <div className="admin-card-header">
                    <h2 className="admin-orders-title">Verilen Siparişler</h2>
                    <button className="approve-button" onClick={handleApproveAll}>Hepsini Onayla</button>
                </div>
                <div className="admin-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Müşteri ID</th>
                                <th>Müşteri İsmi</th>                       
                                <th>Müşteri Türü</th>
                                <th>Ürün ID</th>
                                <th>Ürün İsmi</th>
                                <th>Ürün</th>
                                <th>Miktar</th>
                                <th>Bekleme Süresi</th>
                                <th>Öncelik Skoru</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrderProducts.map((orderProduct) => (
                                <tr key={orderProduct.orderID}>
                                    <td>{orderProduct.customerID}</td>
                                    <td>{orderProduct.customerName}</td>
                                    <td>{orderProduct.customerType}</td>
                                    <td>{orderProduct.productID}</td>
                                    <td>{orderProduct.productName}</td>
                                    <td>
                                        <img src={`/${orderProduct.picturePath}`} alt="User"  />
                                    </td>
                                    <td>{orderProduct.quantity}</td>                     
                                    <td>{orderProduct.waitingTime.formatted}</td>
                                    <td>{orderProduct.priorityScore.toFixed(2)}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleApprove(orderProduct)}>Onayla</button>
                                        <button className="action-button2" onClick={() => handleDecline(orderProduct)}>Reddet</button>
                                    </td>
                                </tr>
                            ))}    
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="admin-orders-card2">
                <h2 className="admin-orders-title">Geçmiş Siparişler</h2>
                <div className="admin-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Müşteri ID</th>
                                <th>Müşteri İsmi</th>                       
                                <th>Müşteri Türü</th>
                                <th>Ürün ID</th>
                                <th>Ürün İsmi</th>
                                <th>Ürün</th>
                                <th>Miktar</th>
                                <th>İşlem Süresi</th>
                                <th>Sipariş Durumu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastOrderProducts.map((pastOrderProduct) => (
                                <tr key={pastOrderProduct.orderID}>
                                    <td>{pastOrderProduct.customerID}</td>
                                    <td>{pastOrderProduct.customerName}</td>
                                    <td>{pastOrderProduct.customerType}</td>
                                    <td>{pastOrderProduct.productID}</td>
                                    <td>{pastOrderProduct.productName}</td>
                                    <td>
                                        <img src={`/${pastOrderProduct.picturePath}`} alt="User"  />
                                    </td>
                                    <td>{pastOrderProduct.quantity}</td>                    
                                    <td>{pastOrderProduct.duration} saniye</td>
                                    <td>{pastOrderProduct.orderStatus}</td>   
                                </tr>
                            ))}    
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default AdminOrders;