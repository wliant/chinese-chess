import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import type { Piece } from '../engine/ChineseChess';

const PIECE_NAMES = {
  red: {
    general: '帥',
    advisor: '仕',
    elephant: '相',
    horse: '傌',
    chariot: '俥',
    cannon: '炮',
    soldier: '兵'
  },
  black: {
    general: '將',
    advisor: '士',
    elephant: '象',
    horse: '馬',
    chariot: '車',
    cannon: '砲',
    soldier: '卒'
  }
};

interface ChessPieceProps {
  piece: Piece;
  onSelect: () => void;
  isSelected: boolean;
}

function ChessPiece({ piece, onSelect, isSelected }: ChessPieceProps) {
  const position: [number, number, number] = [
    piece.x - 4,
    0.1,
    4.5 - piece.y
  ];

  const color = piece.player === 'red' ? '#dc2626' : '#1e3a8a';
  const bgColor = piece.player === 'red' ? '#fef2f2' : '#eff6ff';

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial color={isSelected ? '#fbbf24' : bgColor} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {PIECE_NAMES[piece.player][piece.type]}
      </Text>
    </group>
  );
}

interface BoardSquareProps {
  x: number;
  y: number;
  onSelect: () => void;
  isValidMove: boolean;
}

function BoardSquare({ x, y, onSelect, isValidMove }: BoardSquareProps) {
  const position: [number, number, number] = [x - 4, 0, 4.5 - y];

  return (
    <group position={position}>
      {isValidMove && (
        <mesh onClick={(e) => { e.stopPropagation(); onSelect(); }} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
          <meshStandardMaterial color="#10b981" opacity={0.7} transparent />
        </mesh>
      )}
    </group>
  );
}

function Board() {
  return (
    <group>
      {/* Main board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[9, 10]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[9.4, 10.4]} />
        <meshStandardMaterial color="#8b5a3c" />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: 10 }).map((_, y) => (
        <group key={`h-${y}`}>
          <mesh position={[0, 0, 4.5 - y]}>
            <boxGeometry args={[8, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2817" />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 9 }).map((_, x) => (
        <group key={`v-${x}`}>
          {/* Outer columns (0 and 8) cross the river, middle columns (1-7) have a gap */}
          {x === 0 || x === 8 ? (
            <mesh position={[x - 4, 0, 0]}>
              <boxGeometry args={[0.02, 0.02, 10]} />
              <meshStandardMaterial color="#3a2817" />
            </mesh>
          ) : (
            <>
              {/* Top section - from y=0 to y=4 */}
              <mesh position={[x - 4, 0, 2.75]}>
                <boxGeometry args={[0.02, 0.02, 4.5]} />
                <meshStandardMaterial color="#3a2817" />
              </mesh>
              {/* Bottom section - from y=5 to y=9 */}
              <mesh position={[x - 4, 0, -2.75]}>
                <boxGeometry args={[0.02, 0.02, 4.5]} />
                <meshStandardMaterial color="#3a2817" />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* Palace diagonals */}
      {[3.5, -3.5].map((z) => (
        <group key={`palace-${z}`}>
          <mesh position={[0, 0, z]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[Math.sqrt(2) * 2, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2817" />
          </mesh>
          <mesh position={[0, 0, z]} rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[Math.sqrt(2) * 2, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2817" />
          </mesh>
        </group>
      ))}

      {/* River text */}
      <Text
        position={[-2, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="#3a2817"
        fontWeight={700}
      >
        楚河
      </Text>
      <Text
        position={[2, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="#3a2817"
        fontWeight={700}
      >
        漢界
      </Text>
    </group>
  );
}

export default function GameBoard() {
  const { engine, selectedPiece, validMoves, selectPiece, movePiece } = useGameStore();

  const isValidMove = (x: number, y: number) => {
    return validMoves.some(move => move.x === x && move.y === y);
  };

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 12, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />

        <Board />

        {/* Render all board squares for valid moves */}
        {Array.from({ length: 10 }).map((_, y) =>
          Array.from({ length: 9 }).map((_, x) => (
            <BoardSquare
              key={`${x}-${y}`}
              x={x}
              y={y}
              onSelect={() => movePiece({ x, y })}
              isValidMove={isValidMove(x, y)}
            />
          ))
        )}

        {/* Render all pieces */}
        {engine.board.map((row, y) =>
          row.map((piece, x) =>
            piece ? (
              <ChessPiece
                key={`${x}-${y}`}
                piece={piece}
                onSelect={() => selectPiece(x, y)}
                isSelected={selectedPiece?.x === x && selectedPiece?.y === y}
              />
            ) : null
          )
        )}

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}
