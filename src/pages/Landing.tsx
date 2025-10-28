import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [gameCode, setGameCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const navigate = useNavigate();

  const generateGameCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleCreateGame = () => {
    const newGameCode = generateGameCode();
    navigate(`/game/${newGameCode}`);
  };

  const handleCreateAIGame = () => {
    navigate('/game/ai');
  };

  const handleJoinGame = () => {
    if (gameCode.length === 6) {
      navigate(`/game/${gameCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">象棋</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Chinese Chess</h2>
          <p className="text-white/80 text-lg">Play with friends online</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateGame}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Create New Game
          </button>

          <button
            onClick={handleCreateAIGame}
            className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Play vs AI
          </button>

          {!showJoinInput ? (
            <button
              onClick={() => setShowJoinInput(true)}
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Join Game
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleJoinGame}
                  disabled={gameCode.length !== 6}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Join
                </button>
                <button
                  onClick={() => {
                    setShowJoinInput(false);
                    setGameCode('');
                  }}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/60 text-sm">
          <p>Share the game code with your friend to play together</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
