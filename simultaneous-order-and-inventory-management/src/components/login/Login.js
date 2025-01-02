import React, { useState } from "react";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("/customers/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (username.toLowerCase() === "berk") {
                    window.location.href = `http://localhost:3000/adminprofile/${data.userId}`;
                } else {
                    window.location.href = `http://localhost:3000/profile/${data.userId}`;
                }
            } else {
                setError("Kullanıcı adı veya şifre yanlış.");
            }
        } catch (error) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="login-body">
            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Giriş Yap</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
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
                        {error && <p className="login-error">{error}</p>}
                        <button className="login-button" onClick={handleLogin}>
                            Giriş Yap
                        </button>
                    </form>
                    <p className="signup-prompt">
                        Hesabın yok mu?{" "}
                        <a
                            href="http://localhost:3000/signup"
                            className="signup-link"
                        >
                            Kaydol
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
