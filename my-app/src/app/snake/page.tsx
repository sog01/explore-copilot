"use client";
import { useRef, useEffect, useState } from "react";

type Point = { x: number; y: number };
const CELL_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const INITIAL_SNAKE: Point[] = [{ x: 5, y: 5 }];

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [gameOver, setGameOver] = useState<boolean>(false);

  // New timer state
  const [time, setTime] = useState<number>(0);

  const moveSnake = () => {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    // Check boundaries or self-collision
    if (
      newHead.x < 0 ||
      newHead.x * CELL_SIZE >= CANVAS_WIDTH ||
      newHead.y < 0 ||
      newHead.y * CELL_SIZE >= CANVAS_HEIGHT ||
      snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
    ) {
      setGameOver(true);
      return;
    }
    const newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      const newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE)),
      };
      setFood(newFood);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  useEffect(() => {
    if (gameOver) return;
    const intervalId = setInterval(moveSnake, 200);
    return () => clearInterval(intervalId);
  }, [snake, direction, gameOver]);

  // New timer effect updating every second
  useEffect(() => {
    if (gameOver) return;
    const timerId = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw a more visible wall
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw snake
    ctx.fillStyle = "green";
    snake.forEach(seg => {
      ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }, [snake, food, gameOver]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game {gameOver && "- Game Over"}</h2>
      {/* New timer display */}
      <p>Time: {time} s</p>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "none" }} /* Removed default border; wall is drawn on canvas */
      />
      {gameOver && (
        <div>
          <button
            onClick={() => {
              setSnake(INITIAL_SNAKE);
              setDirection({ x: 1, y: 0 });
              setFood({ x: 10, y: 10 });
              setGameOver(false);
              setTime(0);
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;