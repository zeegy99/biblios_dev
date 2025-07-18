import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NamePrompt = ({ setPlayerName }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = new URLSearchParams(location.search).get("room");

  const handleJoin = () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    localStorage.setItem("playerName", name);
    localStorage.setItem("roomCode", roomCode);
    setPlayerName(name);
    navigate("/lobby");
  };

  return (
    <div style={{
      marginTop: "100px",
      textAlign: "center",
      padding: "20px",
      borderRadius: "15px",
      backgroundColor: "#fff",
      width: "300px",
      margin: "100px auto",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)"
    }}>
      <h2>Welcome to Biblios</h2>
      <p>To join room <strong>{roomCode}</strong>, enter your name:</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "80%",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid gray"
        }}
      />
      <br />
      <button
        onClick={handleJoin}
        style={{
          backgroundColor: "limegreen",
          border: "none",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Join the Room
      </button>
    </div>
  );
};

export default NamePrompt;
