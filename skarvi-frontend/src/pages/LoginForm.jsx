import React, { useState } from "react";
import { loginUser } from "./login"; // 

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);

      console.log(response.data);

      // Save tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      setTokens(response.data);
      setError("");

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {tokens && (
        <div className="mt-4">
          <h2 className="text-green-600">Login Successful!</h2>
          <p><strong>Access Token:</strong> {tokens.access}</p>
          <p><strong>Refresh Token:</strong> {tokens.refresh}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
