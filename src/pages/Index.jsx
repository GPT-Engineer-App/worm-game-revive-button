import { Box, Button, Container, useBoolean } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const cellSize = 20; // Size of each cell in the grid
const numRows = 20; // Number of rows in the grid
const numCols = 20; // Number of columns in the grid

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const Index = () => {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [isGameOver, setIsGameOver] = useBoolean(false);

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== DIRECTIONS.DOWN) setDirection(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          if (direction !== DIRECTIONS.UP) setDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          if (direction !== DIRECTIONS.RIGHT) setDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          if (direction !== DIRECTIONS.LEFT) setDirection(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    },
    [direction],
  );

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Check for collisions with walls
      if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
        setIsGameOver.on();
        return prevSnake;
      }

      // Check for collisions with itself
      for (const segment of newSnake) {
        if (segment.x === head.x && segment.y === head.y) {
          setIsGameOver.on();
          return prevSnake;
        }
      }

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        newSnake.unshift(head);
        placeFood();
      } else {
        newSnake.unshift(head);
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, setIsGameOver]);

  const placeFood = useCallback(() => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
      };
    } while (snake.some((segment) => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    const gameInterval = setInterval(moveSnake, 200);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
    };
  }, [handleKeyDown, moveSnake]);

  const restartGame = () => {
    setSnake([{ x: 8, y: 8 }]);
    setFood({ x: 5, y: 5 });
    setDirection(DIRECTIONS.RIGHT);
    setIsGameOver.off();
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box width={`${numCols * cellSize}px`} height={`${numRows * cellSize}px`} bg="gray.700" position="relative">
        {snake.map((segment, index) => (
          <Box key={index} position="absolute" left={`${segment.x * cellSize}px`} top={`${segment.y * cellSize}px`} width={`${cellSize}px`} height={`${cellSize}px`} bg="green.500" />
        ))}
        <Box position="absolute" left={`${food.x * cellSize}px`} top={`${food.y * cellSize}px`} width={`${cellSize}px`} height={`${cellSize}px`} bg="red.500" />
      </Box>
      <Button colorScheme="blue" mt="4" onClick={moveSnake}>
        Move Snake
      </Button>
      {isGameOver && (
        <Button colorScheme="teal" mt="4" onClick={restartGame}>
          Restart Game
        </Button>
      )}
    </Container>
  );
};

export default Index;
