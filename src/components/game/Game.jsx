import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utilities/authCheck";
import { RefreshCw, Trophy } from "lucide-react";

function Game() {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 27) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("🎯 Guess a number between 1 and 27");
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    fetchWithAuth("https://guess-game-server.onrender.com/user/bestScore")
      .then((res) => res.json())
      .then((data) => {console.log("best score ",data.bestScore); setBestScore(data.bestScore)})
      .catch(() => console.warn("Failed to load best score"));
  }, []);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 27) return setFeedback("⚠️ Please enter 1–27");

    const tries = attempts + 1;
    setAttempts(tries);

    if (num === targetNumber) {
      setFeedback(`🎉 Correct in ${tries} tries!`);
      setGameWon(true);
      if (!bestScore || tries < bestScore) {
        setBestScore(tries);
        fetchWithAuth("https://guess-game-server.onrender.com/user/bestScore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bestScore: tries }),
        });
      }
    } else setFeedback(num < targetNumber ? "📈 Go Higher!" : "📉 Go Lower!");

    setGuess("");
  };

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 27) + 1);
    setAttempts(0);
    setFeedback("🎯 Guess a number between 1 and 27");
    setGameWon(false);
  };

  const handleLogout = async () => {
    await fetch("https://guess-game-server.onrender.com/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    sessionStorage.removeItem("accessToken");
    window.location.href = "/signUp";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Guess the Number</h1>

        {bestScore && (
          <p className="flex justify-center items-center gap-2 text-yellow-600 mb-2 font-semibold">
            <Trophy /> Best Score: {bestScore} tries
          </p>
        )}

        <p className="text-gray-700 mb-4">{feedback}</p>

        {!gameWon ? (
          <>
           <input
  value={guess}
  onChange={(e) => setGuess(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleGuess()}
  placeholder="Enter guess"
  className="border rounded-md p-2 text-center w-full mb-3"
  type="number"
/>
            <button
              onClick={handleGuess}
              className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
            >
              Guess
            </button>
          </>
        ) : (
          <button
            onClick={startNewGame}
            className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700 flex justify-center items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Play Again
          </button>
        )}

        <button
          onClick={handleLogout}
          className="mt-4 text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Game;
