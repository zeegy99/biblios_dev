import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";



const Lobby = ({ playerName, setPlayerName }) => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const room = localStorage.getItem("roomCode") || "biblios";
  const [copyConfirmation, setCopyConfirmation] = useState(false);

  useEffect(() => {
      socket.emit("join_game", { room, playerName });

      socket.on("player_list", (updatedPlayers) => {
            // console.log("📡 Received player list:", updatedPlayers);
            setPlayers(updatedPlayers);
          });

      socket.on("start_game", (data) => {
      console.log("📩 start_game received in lobby:", data);
      localStorage.setItem("start_game_payload", JSON.stringify(data));
      localStorage.setItem("playerName", playerName);
      setPlayerName(playerName);

      // ⏳ Give localStorage a moment to flush before navigating
      setTimeout(() => {
        console.log("🚪 Navigating to /game...");
        navigate("/game");
      }, 50);  // 50ms is usually enough
    });


      // ✅ THIS is what you were missing
      socket.on("game_state", (data) => {
        console.log("✅ game_state received in lobby. Navigating to game...");
        localStorage.setItem("playerName", playerName);
        navigate("/game");
      });

      return () => {
        socket.off("player_list");
        socket.off("start_game");
        socket.off("game_state");
      };
  }, [playerName]);

  useEffect(() => {
    console.log("")
    socket.on("name_conflict", (data) => {
      alert(data.message);
      localStorage.removeItem("playerName");
      navigate("/"); // send them back to home
    });

    return () => {
      socket.off("name_conflict");
    };
  }, []);


  const handleCopyLink = () => {
  const link = `${window.location.origin}/lobby?room=${room}`;
  navigator.clipboard.writeText(link);
  setCopyConfirmation(true);
  setTimeout(() => setCopyConfirmation(false), 2000); // Hide after 2 seconds
};

  const handleStartGame = () => {
    console.log("🚀 Start Game button clicked");
    socket.emit("start_game", { room: room });
  };

  const isHost = players.length > 0 && players[0].name === playerName;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Waiting Room</h2>
      <p>Room: <strong>{room}</strong></p>
      <h3>Players Joined:</h3>
      <ul style={{
  listStyleType: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px"  // ✅ even spacing between player names
}}>
        {players.map((p, i) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <div style={{ marginTop: "10px",  marginBottom: "10px"}}>
        <button onClick={handleCopyLink}>
          🔗 Get Shareable Link
        </button>
        {copyConfirmation && (
          <p style={{ color: "green", marginTop: "10px" }}>
            ✅ Link copied to clipboard!
          </p>
        )}
      </div>

      {players.length < 2 ? (
        <p>Waiting for more players...</p>
      ) : isHost ? (
        <>
        <button onClick={handleStartGame}>Start Game</button>
        </>
        
      ) : (
        <p>Waiting for host to start the game...</p>
      )}
    </div>
  );
};

export default Lobby;
