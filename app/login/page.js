'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("loggedIn", "true");
        router.push("/main");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "peer block w-full rounded-xl border border-gray-300 px-3 pt-2 pb-2 text-sm text-gray-900 placeholder-transparent " +
    "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 focus:ring-purple-400 " +
    "transition duration-300 shadow-sm focus:shadow-lg";

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#ffffffff",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <form 
        onSubmit={handleLogin} 
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          width: "400px"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          Login
        </h1>
        
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input 
          type="text" 
          placeholder="Enter Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className={inputClass}
          required
          disabled={isLoading}
        />
        
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={inputClass}
          required
          disabled={isLoading}
        />

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "3vh",
          backgroundColor: "#ffffffff",
          fontFamily: "'Poppins', sans-serif"
        }} />

        <button 
          type="submit"
          disabled={isLoading}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: isLoading ? "#ccc" : "#0070f3",
            color: "#fff",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.5s"
          }}
          onMouseOver={e => {
            if (!isLoading) e.target.style.backgroundColor = "#0054a8ff";
          }}
          onMouseOut={e => {
            if (!isLoading) e.target.style.backgroundColor = "#0070f3";
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        {error && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
}