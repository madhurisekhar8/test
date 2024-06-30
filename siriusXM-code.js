/*
  Mars Rover
  
  You are to build the backing logic behind an API to navigate a bidirectional rover along a two dimensional cartesian plain (x,y) representation of the planet Mars. Each point will include a topographical label designating the terrain at that location.
  
  Map Example:

  (0,0)
   	['P', 'P', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'C', 'P'], 
	  ['P', 'M', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'P', 'P'],
	  ['P', 'M', 'P', 'P', 'P']
                          (4,4)

  Details:
  
  - The rover when initialized will be provided an initial starting point (x, y) as well as a starting direction (N, S, E, W) that the rover is facing
  - The rover should receive its commands as a string array. e.g. ['F', 'B', 'L', R']
  - The rover may move forward and backward with the (F, B) character commands
  - The rover may turn left and right with the (L, R) character commands
  - The rover should execute all given commands in sequence
    - If: The rover is given a valid command
      - Then: Update the rovers direction or location
    - If: All commands have been executed 
      - Then: return an OK status along with the location and direction
    - If: The rover is provided a command that would result in the rover entering terrain that is an obstacle
      - Then: return an OBSTACLE status code along with the last successful location and direction of the rover
    - If: The rover is provided an invalid command
      - Then: return an INVALID_COMMAND status code along with the last successful location and direction of the rover
    - If: The rover is given a command that would result in leaving the edge of the world
      - Then: return an OBSTACLE status code along with the last successful location and direction of the rover
  
  Further Instructions:
  
  - Implement your code to make the below tests pass
  - Feel free to modify any code you wish to suit your preference. Also, don't feel limited to methods provided feel free add more (encouraged)
  - If you modify exercise code (i.e use functional instead of class based Rover) you'll need to modify the tests accordingly
  - Read the tests! They have helpful in better understanding the requirements 
  - add a moveTo() method that takes the (x,y) coordinates to move the rover along the most optimal path bypassing obstacles
  - https://en.wikipedia.org/wiki/A*_search_algorithm
  - https://en.wikipedia.org/wiki/Dijkstra's_algorithm
*/
const TERRAIN_TYPES = {
	'P': {
  	obstacle: false,
    description: 'plains'
  },
  'M': {
  	obstacle: true,
    description: 'mountains'
  },
  'C': {
  	obstacle: true,
    description: 'crevasse'
  }
};

const STATUS_CODES = ['OK', 'OBSTACLE', 'INVALID_COMMAND'];

// top left corner is (X:0, Y:0) 
// bottom right is (X:4, Y:4)
const WORLD = [
	['P', 'P', 'P', 'C', 'P'],
	['P', 'M', 'P', 'C', 'P'],
	['P', 'M', 'P', 'C', 'P'],
	['P', 'M', 'P', 'P', 'P'],
	['P', 'M', 'P', 'P', 'P']
];

const DIRECTIONS = ['N', 'S', 'E', 'W'];
const VALID_COMMANDS = ['L', 'R', 'F', 'B'];

// Start: Exercise Code (Your Code)
// YOUR CODE BELOW
// NOTE: cntrl + enter to run tests
// Note: integrated firebug for console logs

const MOVEMENT_OFFSETS = {
  'N': [0, -1],  // Up
  'S': [0, 1],   // Down
  'E': [1, 0],   // Right
  'W': [-1, 0]   // Left
};

class Rover {  
  constructor(location, direction) {
    this.location = location;
    this.direction = direction;
  }
  
  // given command  ["L", "Y", "F"]
//   execution starts here when command is called
  command(commands) {
    // it will take each command from the input array i.e "L"(to start with)
    for (let cmd of commands) {
// 
      if (!VALID_COMMANDS.includes(cmd)) {
        return {
          status: STATUS_CODES[2],
          loc: this.location,
          dir: this.direction
        };
      }

      let result = this.executeCommand(cmd);
      if (result.status !== STATUS_CODES[0]) {
        return result;
      }
    }
    
    return {
      status: STATUS_CODES[0],
      loc: this.location,
      dir: this.direction
    };
  }
  
  executeCommand(cmd) {
    if (cmd === 'L' || cmd === 'R') {
      this.turn(cmd);
    } else {
      let nextLocation = this.move(cmd);
      if (this.isOutOfBounds(nextLocation) || this.isObstacle(nextLocation)) {
        return {
          status: STATUS_CODES[1],
          loc: this.location,
          dir: this.direction
        };
      }
      this.location = nextLocation;
    }
    return {
      status: STATUS_CODES[0],
      loc: this.location,
      dir: this.direction
    };
  }
  
  turn(cmd) {
    let currentIndex = DIRECTIONS.indexOf(this.direction);
    if (cmd === 'L') {
      this.direction = DIRECTIONS[(currentIndex + 3) % 4]; // turn left
    } else {
      this.direction = DIRECTIONS[(currentIndex + 2) % 4]; // turn right
    }
  }
  
  move(cmd) {
    let [x, y] = this.location;
    const [dx, dy] = MOVEMENT_OFFSETS[this.direction];
    if (cmd === 'F') {
      x += dx;
      y += dy;
    } else if (cmd === 'B') {
      x -= dx;
      y -= dy;
    }
    return [x, y];
  }
  
  isOutOfBounds([x, y]) {
    return x < 0 || x >= WORLD[0].length || y < 0 || y >= WORLD.length;
  }
  
  isObstacle([x, y]) {
    return TERRAIN_TYPES[WORLD[y][x]].obstacle;
  }
  
  moveTo(target) {
    const [targetX, targetY] = target;
    const [startX, startY] = this.location;

    const queue = [{ x: startX, y: startY, path: [] }];
    const visited = new Set([`${startX},${startY}`]);
    const distances = Array.from({ length: WORLD.length }, () => Array(WORLD[0].length).fill(Infinity));
    distances[startY][startX] = 0;

    while (queue.length > 0) {
      const { x, y, path } = queue.shift();

      if (x === targetX && y === targetY) {
        this.followPath(path);
        return { status: STATUS_CODES[0], loc: this.location, dir: this.direction };
      }

      for (let [dx, dy] of Object.values(MOVEMENT_OFFSETS)) {
        const adjacentX = x + dx;
        const adjacentY = y + dy;

        if (this.isOutOfBounds([adjacentX, adjacentY]) || this.isObstacle([adjacentX, adjacentY])) {
          continue;
        }

        const newCost = distances[y][x] + 1;
        if (newCost < distances[adjacentY][adjacentX]) {
          distances[adjacentY][adjacentX] = newCost;
          queue.push({
            x: adjacentX,
            y: adjacentY,
            path: [...path, [adjacentX, adjacentY]]
          });
          visited.add(`${adjacentX},${adjacentY}`);
        }
      }
    }

    return { status: STATUS_CODES[1], loc: this.location, dir: this.direction };
  }

  followPath(path) {
  console.log(path)
    for (let [x, y] of path) {
      this.location = [x, y];
    }
  }
}

// End: Exersize Code (Your code)

// Test Specs
mocha.setup('bdd');

const expect = chai.expect;

describe('Mars Rover', function() {
  let rover1 = null;
  beforeEach(function() {
    rover1 = new Rover([2,2], 'N');
  });
  
 describe('When the Mars Rover is initialized', function() {
   it('should set the starting location', function() {
     expect(rover1.location).to.deep.equal([2,2]);
   });
   it('should set the starting direction', function() {
     expect(rover1.direction).to.equal('N');
   });
 });
  describe('When the rover receives commands', function() {
    it('should store the commands', function() {
      rover1.command(['F', 'F', 'B']);
      expect(rover1.commands).to.deep.equal(['F', 'F', 'B']);
    });
    it('should handle invalid commands', function() {
      const status = rover1.command(['X']);

      expect(status).to.deep.equal({
        status: 'INVALID_COMMAND',
        loc: [2,2],
        dir: 'N'
      });
    });
  });
  describe('When the rover executes valid commands', function() {
  	describe('When facing north', function() {
    	describe('When moving forward', function() {
      	it('should move north one tile', function() {
          const status = rover1.command(['F']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,1],
            dir: 'N'
          });
        });
      });
      describe('When moving backward', function() {
      	it('should move south one tile', function() {
          const status = rover1.command(['B']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,3],
            dir: 'N'
          });
        });
      });
      describe('When turning left', function() {
      	it('should be facing west', function() {
          const status = rover1.command(['L']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,2],
            dir: 'W'
          });
        });
      });
      describe('When turning right', function() {
      	it('should be facing east', function() {
          const status = rover1.command(['R']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,2],
            dir: 'E'
          });
        });
      });
    });
  });
  describe('When the rover encounters obstacles', function() {
    describe('When encountering a mountain', function() {
      it('should stop and return status', function() {
        const status = rover1.command(['L', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,2],
          dir: 'W'
        });
      });
    });
    describe('When encountering a crevasse', function() {
      it('should stop and return status', function() {
        const status = rover1.command(['F', 'F', 'R', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,0],
          dir: 'E' 
        });
      });
    })
    describe('When encountering the edge of the world', function() {
      it('should stop and return status', function() {
        const status = rover1.command(['F', 'F', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,0],
          dir: 'N'
        });
      });
    });
  }); 
});

mocha.run();