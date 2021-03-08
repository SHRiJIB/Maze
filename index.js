var { World, Engine, Runner, Render, Bodies, Body, Events } = Matter;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;

const cellsHorizontal = 10;
const cellsVertical = 8;
const width =
  cellsHorizontal * Math.floor(window.innerWidth / cellsHorizontal) -
  Math.floor(window.innerWidth / cellsHorizontal) * 0.5;
const height =
  cellsVertical * Math.floor(window.innerHeight / cellsVertical) -
  Math.floor(window.innerHeight / cellsVertical) * 0.2;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const wallWidth = 5;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, walls);

//Maze generation

//array shuffle function
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizontal);

const isValidCell = (row, col) => {
  return row >= 0 && col >= 0 && row < cellsVertical && col < cellsHorizontal;
};
const stepThroughCells = (row, col) => {
  //if the cell at [row,col] is visited ,then return
  if (grid[row][col]) return;
  //Mark this cell as being visited
  grid[row][col] = true;
  //For each neighbours
  const neighbours = shuffle([
    [row - 1, col, "U"],
    [row + 1, col, "D"],
    [row, col - 1, "L"],
    [row, col + 1, "R"],
  ]);
  for (let neighbour of neighbours) {
    let [nRow, nCol, direction] = neighbour;
    //See if that neighbour is out of bounds
    if (!isValidCell(nRow, nCol)) continue;
    //If we have visited that,continue to next neighbour
    if (grid[nRow][nCol]) continue;
    //Remove a wall from either horizontals or verticals
    if (direction === "L") {
      verticals[row][col - 1] = true;
    } else if (direction === "R") {
      verticals[row][col] = true;
    } else if (direction === "U") {
      horizontals[row - 1][col] = true;
    } else if (direction === "D") {
      horizontals[row][col] = true;
    }

    //visit that next cell
    stepThroughCells(nRow, nCol);
  }
};

stepThroughCells(startRow, startCol);

//Drawing Walls

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, colIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      colIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      wallWidth,
      {
        label: "wall",
        isStatic: true,
      }
    );

    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, colIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      colIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      wallWidth,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
      }
    );

    World.add(world, wall);
  });
});

//Goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    label: "goal",
    isStatic: true,
  }
);

World.add(world, goal);

//Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
});
World.add(world, ball);

//handling key presses

document.addEventListener("keydown", (e) => {
  const { x, y } = ball.velocity;

  if (e.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y - 5 });
  }

  if (e.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y });
  }

  if (e.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }

  if (e.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});

//Win Condition

Events.on(engine, "collisionStart", (e) => {
  e.pairs.forEach((c) => {
    const labels = ["ball", "goal"];
    if (labels.includes(c.bodyA.label) && labels.includes(c.bodyB.label)) {
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
