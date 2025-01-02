import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../home/Navbar.css";
import "./AdminProducts.css";

function AdminProducts() {

  const { adminId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsError, setProductsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductPanel, setShowAddProductPanel] = useState(false);
  const [showEditProductPanel, setShowEditProductPanel] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    stock: "",
    totalStock: "",
    price: "",
    picturePath: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);

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

  useEffect(() => {
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


  // Ürün ekleme panelini açma fonksiyonu
  const handleAddProductClick = () => {
    setShowAddProductPanel(true);
  };

  // Ürün ekleme panelini kapatma fonksiyonu
  const handleClosePanel = async () => {
    await fetch(`/products/${currentProductId}/unlock`, { method: "PUT" });
    setShowAddProductPanel(false);
    setShowEditProductPanel(false);
    setNewProduct({
      productName: "",
      stock: "",
      totalStock: "",
      price: "",
      picturePath: ""
    });
    setSelectedFile(null);
    setCurrentProductId(null);
  };

  // Formdaki değişiklikleri yönetme fonksiyonu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
      totalStock: name === "stock" ? value : prevProduct.totalStock // stock değiştiğinde totalStock'u da güncelle
    }));
  };

  // Dosya seçimini yönetme fonksiyonu
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Ürün ekleme fonksiyonu
  const handleAddProduct = async () => {
    if (!newProduct.productName || newProduct.stock === "" || newProduct.price ===" " ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    try {
      // Ürünü ekle
      const response = await fetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        // Fotoğrafı yükle
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("productName", newProduct.productName);
          formData.append("fileName", selectedFile.name);

          const uploadResponse = await fetch("/products/upload", {
            method: "POST",
            body: formData
          });

          if (!uploadResponse.ok) {
            alert("Fotoğraf yüklenemedi. Lütfen tekrar deneyin.");
          }
        }

        alert("Ürün başarıyla eklendi!");
        fetchProducts();
        handleClosePanel();
      } else {
        alert("Ürün eklenemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Ürün güncelleme panelini açma fonksiyonu
  const handleEditProductClick = async (product) => {
    setCurrentProductId(product.productID);
    setNewProduct({
      productName: product.productName,
      stock: product.stock,
      totalStock: product.stock,
      price: product.price,
      picturePath: product.picturePath
    });
    await fetch(`/products/${product.productID}/lock`, { method: "PUT" });
    setShowEditProductPanel(true);
  };

  // Ürün güncelleme fonksiyonu
  const handleUpdateProduct = async () => {
    if (!newProduct.productName || newProduct.stock ==="" || newProduct.price ===" " ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    try {
      // Ürünü güncelle
      const response = await fetch(`/products/${currentProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        // Fotoğrafı güncelle
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("productName", newProduct.productName);
          formData.append("fileName", selectedFile.name);

          const uploadResponse = await fetch("/products/upload", {
            method: "POST",
            body: formData
          });

          if (!uploadResponse.ok) {
            alert("Fotoğraf yüklenemedi. Lütfen tekrar deneyin.");
          }
        }

        alert("Ürün başarıyla güncellendi!");
        fetchProducts();
        handleClosePanel();
      } else {
        alert("Ürün güncellenemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Ürün silme fonksiyonu
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Ürünü silmek istediğinizden emin misiniz?"))
    {
      try {
        const response = await fetch(`/products/${productId}`, {
          method: "DELETE"
        });
  
        if (response.ok) {
          alert("Ürün başarıyla silindi!");
          fetchProducts();
        } else {
          alert("Ürün silinemedi. Lütfen tekrar deneyin.");
        }
      } catch (error) {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
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
    <div className="admin-products-page">
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

      <div className="admin-products-header">
        <input
          type="text"
          placeholder="Ürün Ara"
          className="admin-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1 className="admin-products-title">Ürünler</h1>    
        
        <button className="admin-addproduct-button" onClick={handleAddProductClick}>
              Ürün Ekle
        </button>   
      </div>

      {productsError && <p className="admin-error">{productsError}</p>}
      <div className="admin-products-container">
        {filteredProducts.map((product) => {
          const stockPercentage = calculateStockPercentage(product.stock, product.totalStock);

          return (
            <div className="admin-product-card" key={product.id}>
              <img src={`/${product.picturePath}`} alt={product.name} className="product-image" />
              <div className="admin-product-details">
                <h2>{product.productName}</h2>
                <p>Stok: {product.stock}</p>
                <p>Fiyat: {product.price} TL</p>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar ${getProgressBarColor(stockPercentage, product.stock)}`} 
                    style={{ width: `${stockPercentage > 0 ? stockPercentage : 100}%` }}
                  >
                    {(product.stock === 0 || product.totalStock === 0) ? "Stok Yok" : `${Math.round(stockPercentage)}%`}
                  </div>
                </div>
                <img
                  src={"/assets/editicon.png"}
                  alt="Edit"
                  className="admin-edit-icon"
                  onClick={() => handleEditProductClick(product)}
                />
                <img
                  src={"/assets/deleteicon.png"}
                  alt="Delete"
                  className="admin-delete-icon"
                  onClick={() => handleDeleteProduct(product.productID)}
                />
              </div>
            </div>
          );
        })}
      </div>

     {showAddProductPanel && (
        <div className="admin-add-product-panel">
          <div className="admin-add-product-content">
            <h2>Yeni Ürün Ekle</h2>
            <input
              type="text"
              name="productName"
              placeholder="Ürün İsmi"
              value={newProduct.productName}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Miktar"
              value={newProduct.stock}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Adet Fiyatı"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="file"
              name="picturePath"
              accept=".png"
              onChange={handleFileChange}
            />
            <button onClick={handleAddProduct}>Ekle</button>
            <button onClick={handleClosePanel}>İptal</button>
          </div>
        </div>
      )}

      {showEditProductPanel && (
        <div className="admin-add-product-panel">
          <div className="admin-add-product-content">
            <h2>Ürünü Güncelle</h2>
            <input
              type="text"
              name="productName"
              placeholder="Ürün İsmi"
              value={newProduct.productName}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Miktar"
              value={newProduct.stock}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Adet Fiyatı"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="file"
              name="picturePath"
              accept=".png"
              onChange={handleFileChange}
            />
            <button onClick={handleUpdateProduct}>Güncelle</button>
            <button onClick={handleClosePanel}>İptal</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;