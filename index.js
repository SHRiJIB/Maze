var { World, Engine, Runner, Render, Bodies } = Matter;

const engine = Engine.create();

const { world } = engine;

const width = 600;
const height = 600;

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
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];

World.add(world, walls);

//Maze generation
const N = 3;

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

const stepThroughCells = (row, col) => {
  //if the cell at [row,col] is visited ,then return
  if (grid[row][col]) return;
  //Mark this cell as being visited
  grid[row][col] = true;
  //For each neighbours
  //See if that neighbour is out of bounds
  //If we have visited that,continue to next neighbour
  //Remove a wall from either horizontals or verticals
  //visit that next cell
};
