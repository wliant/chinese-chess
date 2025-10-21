import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import GameBoard from '../components/GameBoard';

function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { engine, setGameId, resetGame } = useGameStore();
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (gameId) {
      setGameId(gameId);
    }
  }, [gameId, setGameId]);

  const handleCopyCode = async () => {
    if (gameId) {
      await navigator.clipboard.writeText(gameId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleNewGame = () => {
    resetGame();
    navigate('/');
  };

  const gameStatus = engine.isGameOver();

  return (
    <div className="relative w-full h-screen">
      <GameBoard />

      {/* Game info overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 pointer-events-auto">
          <div className="text-white">
            <div className="text-sm opacity-80 mb-1">Game Code</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-wider">{gameId}</span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm"
              >
                {copiedCode ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 pointer-events-auto">
          <div className="text-white text-center">
            <div className="text-sm opacity-80 mb-1">Current Turn</div>
            <div className={`text-2xl font-bold ${engine.currentPlayer === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
              {engine.currentPlayer === 'red' ? '紅 Red' : '黑 Black'}
            </div>
          </div>
        </div>
      </div>

      {/* Game controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-auto">
        <button
          onClick={resetGame}
          className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all font-medium"
        >
          Reset Game
        </button>
        <button
          onClick={handleNewGame}
          className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all font-medium"
        >
          New Game
        </button>
      </div>

      {/* Game over modal */}
      {gameStatus.over && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 max-w-md w-full mx-4">
            <h2 className="text-4xl font-bold text-white text-center mb-4">
              Game Over!
            </h2>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${gameStatus.winner === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                {gameStatus.winner === 'red' ? '紅方' : '黑方'}
              </div>
              <div className="text-2xl text-white">
                {gameStatus.winner === 'red' ? 'Red' : 'Black'} Wins!
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                Play Again
              </button>
              <button
                onClick={handleNewGame}
                className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 text-white text-sm opacity-80 max-w-xs pointer-events-none">
        <p>Click a piece to select it, then click a highlighted position to move. Drag to rotate the board.</p>
      </div>
    </div>
  );
}

export default Game;
