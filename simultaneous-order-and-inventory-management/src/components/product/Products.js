import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./Product.css";
import "../home/Navbar.css";

function Products() {

  const { userId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsError, setProductsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProductsError("Ürün bilgileri alınamadı.");
        }
      } catch (error) {
        setProductsError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  // Login sayfasına yönlendiren çalışacak fonksiyon
  const handleLogout = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  // Profil sayfasına yönlendiren çalışacak fonksiyon
  const handleProfile = () => {
    window.location.href = `http://localhost:3000/profile/${userId}`;
  };

  // Cüzdan sayfasına yönlendiren çalışacak fonksiyon
  const handleWallet = () => {
    window.location.href = `http://localhost:3000/wallet/${userId}`;
  };

  // Ürünler sayfasına yönlendiren çalışacak fonksiyon
  const handleProduct = () => {
    window.location.href = `http://localhost:3000/products/${userId}`;
  };

  
  // Stok yüzdesini hesaplayan fonksiyon
  const calculateStockPercentage = (stock, totalStock) => {
    if (totalStock === 0 || stock === 0) return 0;
    return (stock / totalStock) * 100;
  };

  // Progress bar rengini belirleyen fonksiyon
  const getProgressBarColor = (percentage, stock) => {
    if (stock === 0 || percentage === 0) return "zero";
    if (percentage <= 30) return "red";
    if (percentage <= 70) return "yellow";
    return "green";
  };

  return (
    <div className="products-page">
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

      <div className="products-header">
      <input
          type="text"
          placeholder="Ürün Ara"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1 className="products-title">Ürünler</h1>    
      </div>
      {productsError && <p className="error">{productsError}</p>}
      <div className="products-container">
        {filteredProducts.map((product) => {
          const stockPercentage = calculateStockPercentage(product.stock, product.totalStock);

          return (
            <div className="product-card" key={product.id}>
              <img src={`/${product.picturePath}`} alt={product.name} className="product-image" />
              <div className="product-details">
                <h2>{product.productName}</h2>
                <p>Fiyat: {product.price} TL</p>
                <p>Stok: {product.stock}</p>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar ${getProgressBarColor(stockPercentage, product.stock)}`} 
                    style={{ width: `${stockPercentage > 0 ? stockPercentage : 100}%` }}
                  >
                    {(product.stock === 0 || product.totalStock === 0) ? "Stok Yok" : `${Math.round(stockPercentage)}%`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;