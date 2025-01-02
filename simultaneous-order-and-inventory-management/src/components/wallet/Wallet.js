import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './wallet.css';
import "../home/Navbar.css";

function Wallet() {
    const { userId } = useParams();
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const handleAddBalance = async () => {
        const currentYear = new Date().getFullYear() % 100; // Son iki hane
        const currentMonth = new Date().getMonth() + 1;

        if (cardNumber.length !== 16) {
            setError("Kredi kartı numarası 16 haneli olmalıdır.");
            return;
        }

        if (expiryYear.length !== 2 || expiryMonth.length < 1 || expiryMonth.length > 2) {
            setError("Son kullanma tarihi hatalı.");
            return;
        }

        if (parseInt(expiryYear) < currentYear || (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
            setError("Son kullanma tarihi bugünden eski olamaz.");
            return;
        }

        if (cvv.length !== 3) {
            setError("CVV 3 haneli olmalıdır.");
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError("Geçerli bir yükleme miktarı giriniz.");
            return;
        }

        try {
            const response = await fetch(`/customers/${userId}/balance`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amountToAdd: parseFloat(amount) }),
            });

            if (response.ok) {
                alert("Bakiye başarıyla eklendi!");
                setCardNumber("");
                setExpiryMonth("");
                setExpiryYear("");
                setCvv("");
                setAmount("");
                setError("");
            } else {
                setError("Bakiye güncellenemedi. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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

    return (
        <div className="wallet-page">
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

            <div className="wallet-container">
                <h1 className="wallet-header">Bakiye Yükle</h1>
                <div className="wallet-inputs">
                    <div className="wallet-input-group">
                        <label className="wallet-label-number">Kart Numarası</label>
                        <input
                            type="text"
                            className="wallet-input"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                    </div>

                    <div className="wallet-expiry-cvv">
                        <div className="wallet-input-group">
                            <label className="wallet-label">Son Kullanma Tarihi</label>
                            <div className="wallet-expiry">
                                <input
                                    type="text"
                                    placeholder="Ay"
                                    className="wallet-input expiry-input"
                                    value={expiryMonth}
                                    onChange={(e) => setExpiryMonth(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Yıl"
                                    className="wallet-input expiry-input"
                                    value={expiryYear}
                                    onChange={(e) => setExpiryYear(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="wallet-input-group">
                            <label className="wallet-label-cvv">CVV</label>
                            <input
                                type="text"
                                className="wallet-input cvv-input"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="wallet-input-group">
                        <label className="wallet-label-amount">Yüklemek İstediğiniz Miktar</label>
                        <input
                            type="text"
                            className="wallet-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                {error && <p className="wallet-error">{error}</p>}
                <button className="wallet-button" onClick={handleAddBalance}>
                    Bakiye Ekle
                </button>
            </div>
        </div>
    );
}

export default Wallet;