var { World, Engine, Runner, Render, Bodies } = Matter;

const engine = Engine.create();

const { world } = engine;

const N = 10;
const width = 600;
const height = 600;
const unitLength = width / N;
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

//N x N
const grid = Array(N)
  .fill(null)
  .map(() => Array(N).fill(false));

//N x (N-1)
const verticals = Array(N)
  .fill(null)
  .map(() => Array(N - 1).fill(false));

//(N-1) x N
const horizontals = Array(N - 1)
  .fill(null)
  .map(() => Array(N).fill(false));

const startRow = Math.floor(Math.random() * N);
const startCol = Math.floor(Math.random() * N);

const isValidCell = (row, col) => {
  return row >= 0 && col >= 0 && row < N && col < N;
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
      colIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      wallWidth,
      {
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
      colIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      wallWidth,
      unitLength,
      {
        isStatic: true,
      }
    );

    World.add(world, wall);
  });
});

const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    isStatic: true,
  }
);

World.add(world, goal);
