import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../home/Navbar.css";
import "./Card.css";
import "./User.css";
import "./ProgressCircle.css";
import "./Order.css";

function Profile() {
    
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [orderProducts, setOrderProducts] = useState([]);
    const [userError, setUserError] = useState("");
    const [productsError, setProductsError] = useState("");
    const [orderProductsError, setOrderProductsError] = useState("");
    const [quantities, setQuantities] = useState([]);

    useEffect(() => {
        setQuantities(products.map(() => ""));
    }, [products]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/customers/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setUserError("Kullanıcı bilgileri alınamadı.");
                }
            } catch (error) {
                setUserError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(`/products`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    setProductsError("Ürün bilgileri alınamadı.");
                }
            } catch (error) {
                setProductsError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };

        const fetchOrderProducts = async () => {
            try {
                const response = await fetch(`/orders/customer/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                    setOrderProducts(sortedData);
                } else {
                    setOrderProductsError("Sipariş bilgileri alınamadı.");
                }
            } catch (error) {
                setOrderProductsError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };

        fetchUser();
        fetchProducts();
        fetchOrderProducts();
    }, [userId], [products], [orderProducts]);


    // Ürün miktarı değiştiğinde bu fonksiyon çalışacak
    const handleQuantityChange = (index, value) => {
        const newQuantities = [...quantities];
        newQuantities[index] = value;
        setQuantities(newQuantities);
    };

    // Sipariş oluşturma fonksiyonu
    const handleOrder = async (productId, quantity) => {
        if (quantity <= 0) {
            alert("Miktar 0'dan büyük olmalıdır.");
            return;
        }

        if (window.confirm("Sipariş vermek istediğinizden emin misiniz?")) {
            try {
                // Ürünün kilitli olup olmadığını kontrol et
                const productResponse = await fetch(`/products/${productId}/islocked`);
                const productData = await productResponse.json();

                if (productData) {
                    alert("Bu ürün şu anda işleme kapalı. Lütfen daha sonra tekrar deneyin.");
                    return;
                }

                // Sipariş oluştur
                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerId: userId,
                        productId: productId,
                        quantity: quantity,
                    }),
                });

                if (response.ok) {
                    alert("Sipariş başarıyla oluşturuldu!");
                } else {
                    alert("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
                }
            } catch (error) {
                alert("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }
    };


    // Login sayfasına yönlendiren çalışacak fonksiyon
    const handleLogout = () => {
        window.location.href = 'http://localhost:3000/login';
    };

    // Profil sayfasına yönlendiren çalışacak fonksiyon
    const handleProfile = () => {
        window.location.href = `http://localhost:3000/profile/${userId}`;
    };

    // Cüzdan sayfasına yönlendiren çalışacak fonksiyon
    const handleWallet= () => {
        window.location.href = `http://localhost:3000/wallet/${userId}`;
    };

    // Ürünler sayfasına yönlendiren çalışacak fonksiyon
    const handleProduct= () => {
        window.location.href = `http://localhost:3000/products/${userId}`;
    };


    if (userError) {
        return <div>{userError}</div>;
    }

    if (productsError) {  
    }

    if (orderProductsError) {    
    }

    if (!user) {
        return <div>Yükleniyor...</div>;
    }

    // Harcanan miktar yüzdesini hesapla
    const maxAmount = 2000;
    const spentPercentage = Math.min(((user.totalSpent / maxAmount) * 100).toFixed(2), 100);

    let userPoint = 10;
    let userPointPercentage = 65;
    if(user.customerType==="Premium"){
        userPoint = 15;
        userPointPercentage = 100;
    }
    
    return (
        <div className="">
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
            
            {/* USER BİLGİLER VE ÜRÜNLER*/}
            <div className="card-container">

                <div className="card card-1">
                    <h2>{user.customerName}</h2>
                    <div className="profile-divider"></div>
            
                    <div className="user-info">          
                        <div className="user-photo">
                            <img src={"/assets/defaultpp.png"} alt="User" style={{ width: '175px', height: '175px' }} />
                        </div>
                        <div className="user-details">
                            <p><strong>ID:</strong> {user.customerID}</p>
                            <p><strong>İsim:</strong> {user.customerName}</p>
                            <p><strong>Bütçe:</strong> {user.budget}TL</p>
                            <p><strong>Tür:</strong> {user.customerType}</p>
                            <p><strong>Harcanan Miktar:</strong> {user.totalSpent}TL</p>
                        </div>
                    </div>
                </div>
        
                
                <div className="card card-2">
                    <h2>Ürün Tablosu</h2>
                    <div className="profile-divider"></div>
                    <div className="table-container">
                        <table className="product-table">
                        <thead>
                            <tr>
                            <th>Ürün</th>
                            <th>Ürün İsmi</th>
                            <th>Stok</th>
                            <th>Fiyat(TL)</th>
                            <th>Miktar</th>
                            <th>Sipariş Oluştur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                            <tr key={product.productID}>
                                <td>
                                    <img src={`/${product.picturePath}`} alt="product" />
                                </td>
                                <td>{product.productName}</td>
                                <td>{product.stock}</td>
                                <td>{product.price}</td>
                                <td>
                                    <select
                                        value={quantities[index]}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        className="quantity-select"
                                    >
                                        <option value="" disabled hidden>
                                            Miktar
                                        </option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </td>
                                <td className="order-cell">
                                <button onClick={() => handleOrder(product.productID, quantities[index])}>
                                    Sipariş Ver
                                </button>                                
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
        
            </div>

            {/* HARCANAN MİKTAR VE VERİLEN SİPARİŞLER*/}
            <div className="card-container-2">

                <div className="card card-3">
                    <div className="progress-header">
                        <h3>Harcanan Miktar</h3>
                        <h3>Temel Öncelik Skoru</h3>
                    </div>
                    <div className="profile-divider"></div>
                    <div className="progress-container">
                        <div className="progress-circle" style={{ '--progress': `${spentPercentage}` }} data-progress={`${spentPercentage}%`}></div>
                        <div className="progress-circle" style={{ '--progress': `${userPointPercentage}` }} data-progress={`${userPoint}`}></div>
                    </div>
                
                </div>

                <div className="card card-4">
                    <h2>Sipariş Geçmişi</h2>
                    <div className="profile-divider"></div>
                    <div className="table-container">
                        <table className="product-table">
                        <thead>
                            <tr>
                            <th>Ürün</th>
                            <th>Ürün İsmi</th>
                            <th>Miktar</th>
                            <th>Toplam Fiyat</th>
                            <th>Durum</th>
                            <th>Tarih</th>
                            <th>İşlem Süresi (s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderProducts.map((orderProduct) => (
                            <tr key={orderProduct.orderID}>
                                <td>
                                    <img src={`/${orderProduct.picturePath}`} alt="User"  />
                                </td>
                                <td>{orderProduct.productName}</td>
                                <td>{orderProduct.quantity}</td>
                                <td>{orderProduct.totalPrice}</td>
                                <td>
                                    <span className={`order-status ${orderProduct.orderStatus === 'Tamamlandı' ? 'completed' : orderProduct.orderStatus === 'İşleniyor' ? 'processing' : 'cancelled'}`}>
                                        {orderProduct.orderStatus}
                                    </span>
                                </td>
                                <td>{orderProduct.orderDate.replace('T', ' ').slice(0, -7)}</td>
                                <td>{orderProduct.duration}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    );
    }

export default Profile;