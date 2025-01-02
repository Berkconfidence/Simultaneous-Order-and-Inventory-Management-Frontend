import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './AdminLogs.css';
import "../home/Navbar.css";

function AdminLogs() {
    
    const { adminId } = useParams();
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchType, setSearchType] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [logsError, setLogsError] = useState("");

    const fetchLogs = async () => {
        try {
            const response = await fetch(`/logs`);
            if (response.ok) {
                const data = await response.json();
                const reversedData = data.reverse();
                setLogs(reversedData);
                setFilteredLogs(reversedData);
            } else {
                setLogsError("Log bilgileri alınamadı.");
            }
        } catch (error) {
            setLogsError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    useEffect(() => {
        fetchLogs();

        // WebSocket bağlantısı oluştur
        const ws = new WebSocket('ws://localhost:8080/ws/logs');

        // WebSocket olaylarını dinle
        ws.onopen = () => {
            console.log('WebSocket bağlantısı açıldı');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_LOG') {
                // Yeni log geldiğinde logları güncelle
                fetchLogs();
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
        

    // Arama işlemini gerçekleştiren fonksiyon
    const handleSearch = useCallback(() => {
        const filtered = logs.filter((log) => {
            if (!searchType || !searchValue) return true; // Eğer arama türü veya değer boşsa, tüm verileri döndür
            if (searchType === "logID") return log.logID.toString() === searchValue;
            if (searchType === "customerID") return log.customerID.toString() === searchValue;
            if (searchType === "logType") return log.logType.toLowerCase().includes(searchValue.toLowerCase());
            if (searchType === "customerType") return log.customerType.toLowerCase().includes(searchValue.toLowerCase());
            if (searchType === "productName") return log.productName.toLowerCase().includes(searchValue.toLowerCase());
            if (searchType === "quantity") return log.quantity.toString() === searchValue;
            return false;
        });
        setFilteredLogs(filtered);
    }, [logs, searchType, searchValue]);

    useEffect(() => {
        handleSearch();
    }, [searchType, searchValue, handleSearch]);


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

    if (logsError) {  
    }


    return (
        <div className="admin-logs-page">
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

            <div className="admin-header">
                <input
                    type="text"
                    placeholder="Kayıt Ara"
                    className="admin-search-input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} // Arama değerini güncelle
                />
                <select
                    className="admin-select-input"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)} // Arama türünü güncelle
                >
                    <option value="" disabled hidden>
                        Tür Seç
                    </option>
                    <option value="logID">Log ID</option>
                    <option value="customerID">Müşteri ID</option>
                    <option value="logType">Log Türü</option>
                    <option value="customerType">Müşteri Türü</option>
                    <option value="productName">Ürün</option>
                    <option value="quantity">Miktar</option>
                </select>
                <h3 className="admin-logs-title">Kayıtlar</h3>
            </div>

            <div className="admin-table-container">
                <table className="admin-logs-table">
                    <thead>
                        <tr>
                            <th>Log ID</th>
                            <th>Müşteri ID</th>
                            <th>Log Türü</th>
                            <th>Müşteri Türü</th>
                            <th>Ürün</th>
                            <th>Miktar</th>
                            <th>İşlem Zamanı</th>
                            <th>İşlem Sonucu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.logID}>
                                <td>{log.logID}</td>
                                <td>{log.customerID}</td>
                                <td>{log.logType}</td>
                                <td>{log.customerType}</td>
                                <td>{log.productName}</td>
                                <td>{log.quantity}</td>
                                <td>{log.orderDate.replace('T', ' ').slice(0, -7)}</td>
                                <td>{log.logDetails}</td>                         
                            </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminLogs;