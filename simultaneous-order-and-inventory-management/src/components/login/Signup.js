import React, { useState } from "react";
import "./Signup.css";

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        try {
            const response = await fetch("/customers/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert("Kayıt başarılı! Giriş yapabilirsiniz.");
                window.location.href = "http://localhost:3000/login";
            } else {
                setError("Kayıt başarısız. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="signup-body">
            <div className="signup-container">
                <div className="signup-card">
                    <h2 className="signup-title">Kayıt Ol</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSignup();
                        }}
                    >
                        <div className="input-group">
                            <label htmlFor="username">Kullanıcı Adı</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Şifre</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Şifreyi Onayla</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="signup-error">{error}</p>}
                        <button className="signup-button" onClick={handleSignup}>
                            Kayıt Ol
                        </button>
                    </form>
                    <p className="login-prompt">
                        Zaten hesabınız var mı?{" "}
                        <a
                            href="http://localhost:3000/login"
                            className="login-link"
                        >
                            Giriş Yap
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
