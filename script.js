var plan = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var GOTCHA = false;
var UP = 38,
  DOWN = 40,
  LEFT = 37,
  RIGHT = 39;
var MAXX = 100;
var MAXY = 100;
var MAXROOMS_X = 4;
var MAXROOMS_Y = 4;
var MIN_ROOM_SIZE = 25;
var VIEWPORT_W = 30;
var VIEWPORT_H = 20;
var EMPTY_SPACE = '.';
var rooms = [];
var key = {x : 0, y:0, taken : false};

var door = {x : 0, y:0,locked : true};
function generate() {
var max_room_w = Math.floor(MAXX / MAXROOMS_X);

var startWidth = 0;
var startHeight = 0;
remainingWidth = MAXX;
remainingHeight = MAXY;
var x = 1;
for (i = 0; i < MAXROOMS_X; i++) {
  var max_room_h = Math.floor(MAXY / MAXROOMS_Y);
  remainingHeight = MAXY;
  y = 1;
  for (j = 0; j < MAXROOMS_Y; j++) {

    var roomHeight = Math.floor(Math.random() * max_room_h) + MIN_ROOM_SIZE;
    remainingHeight -= roomHeight;
    maxx2 = x + max_room_w;
    maxy2 = y + roomHeight;

    x1 = getRandomInt(x, x + Math.floor(max_room_w / 2));
    x2 = getRandomInt(x + Math.floor(max_room_w / 2) + 1, maxx2);
    y1 = getRandomInt(y, y + Math.floor(roomHeight / 2));
    y2 = getRandomInt(y + Math.floor(roomHeight / 2) + 1, maxy2);
    (y2 >= MAXY - 1) && (y2 = MAXY - 2);
    (x2 >= MAXX - 1) && (x2 = MAXX - 2);
    if ((x2 - x1) > 3 && (y2 - y1) > 3) {
      rooms.push([x1, y1, x2, y2]);
    }
    y = y + roomHeight + 1;
    max_room_h = remainingHeight / (MAXROOMS_X - i);
  }

  x += max_room_w+2;
}
for (j = 0; j < MAXY; j++) {
  var k = [];
  for (i = 0; i < MAXX; i++) {
    k.push("#");

  }
  plan.push(k);
}
k = 0;
while (k < rooms.length) {
  var coords = rooms[k];
  x1 = coords[0];
  y1 = coords[1];
  x2 = coords[2];
  y2 = coords[3];
  console.log(coords);
  for (var j = y1; j <= y2; j++) {
    for (var i = x1; i <= x2; i++) {

      plan[j][i] = EMPTY_SPACE;

    }

  }
  k++;
}
}

function test() {
generate();
//console.log(rooms);
halls();
init();
disp();
}

function checkEnemyPosition(x,y) {
 for(var i=0;i<enemies.length;i++) {
    if(enemies[i].x == x && enemies[i].y == y ) {
      return true;
    }
 }
 return false;
}
function viewportHandler() {

  startx = player_x - Math.floor(VIEWPORT_W / 2);
  if (startx < 0) {
    startx = 0;
  }
  endx = startx + VIEWPORT_W - 1;
  if (endx >= MAXX) {
    endx = MAXX - 1;
  }
  starty = player_y - Math.floor(VIEWPORT_H / 2);
  if (starty < 0) {
    starty = 0;
  }
  endy = starty + VIEWPORT_H - 1;
  if (endy >= MAXY) {
    endy = MAXY - 1;
  }
}
function disp() {
  var str = '';
  startx = 0;
  endx = MAXX - 1;
  starty = 0;
  endy = MAXY - 1;
 viewportHandler(startx,starty,endx,endy);
   str += '+'+Array(VIEWPORT_W+1).join('-')+'+\n';
  for (var j = starty; j <= endy; j++) {
     str +='|';
    for (var i = startx; i <= endx; i++) {
      if (player_x == i && player_y == j) {
        str += '@';
      } else if(checkEnemyPosition(i,j)) {
        str += '$';
      } else if (key.x == i && key.y == j && !key.taken) {
        str += 'k';
      } else if (door.x == i && door.y == j) {
        str += door.locked?'L':'D';
      } else {
        try {
          str += plan[j][i];
        } catch (e) {
          console.error(" player_x,player_y = " + player_x + "," + player_y);
          console.error(" VIEWPORT_W,VIEWPORT_H = " + VIEWPORT_W + "," + VIEWPORT_H);
          console.error(" i,j = " + i + "," + j + " -- " + e.description);
        }
      }

    }
    
    // PAD right with spaces
    if(endx < startx + VIEWPORT_W) {
      str+= Array(startx + VIEWPORT_W-endx).join(' ');
    }
    str += '|\n';
  }
  if(endy < starty + VIEWPORT_H) {
    var n = starty + VIEWPORT_H - endy - 1;
    for(i=0;i<n;i++) {
      str += '|'+Array(VIEWPORT_W+1).join(' ')+'|\n';
    }
  }
  str += '+'+Array(VIEWPORT_W+1).join('-')+'+\n';
  document.getElementById('plan').innerHTML = str;
}

function halls() {
  var size = rooms.length;
  for (var i = 0; i < size - 1; i++) {
    for (var j = i + 1; j < size; j++) {
     // console.log("Room 1 " + rooms[i]);
     // console.log("Room 2 " + rooms[j]);
      var cords1 = midpoint(rooms[i]);
      var cords2 = midpoint(rooms[j]);
     // console.log('Midpoint 1 ' + cords1);
     // console.log('Midpoint 2 ' + cords2);
      lineItH(cords1[0], cords2[0], cords1[1], ' ');
      lineItV(cords1[1], cords2[1], cords1[0], ' ');
      lineItH(cords1[0], cords2[0], cords2[1], ' ');
      lineItV(cords1[1], cords2[1], cords2[0], ' ');

    }
  }
}

function lineItH(x1, x2, y, ch) {
  if (x1 > x2) {
    startx = x2;
    endx = x1;
  } else {
    startx = x1;
    endx = x2;
  }

  for (var i = startx; i <= endx; i++) {

    plan[y][i] = EMPTY_SPACE;

  }


}

function lineItV(y1, y2, x, ch) {
  if (y1 > y2) {
    starty = y2;
    endy = y1;
  } else {
    starty = y1;
    endy = y2;
  }

  for (var i = starty; i <= endy; i++) {

    plan[i][x] = EMPTY_SPACE;

  }
}

function midpoint(c) {

  return [Math.floor((c[0] + c[2]) / 2), Math.floor((c[1] + c[3]) / 2)];
}

//console.log("Rooms generated " + rooms.length);

function init() {
  var playerRoom = getRandomInt(0, rooms.length - 1);
  var coords = rooms[playerRoom];
  var xy = midpoint(coords);
  player_x = xy[0];
  player_y = xy[1];
  enemies = [];
  do {
  keyRoomIndx = getRandomInt(0, rooms.length - 1);
  }while(keyRoomIndx==playerRoom);
  coords = rooms[keyRoomIndx];
  key = {
   x :getRandomInt(coords[0],coords[2]),
   y :getRandomInt(coords[1],coords[3]),
   taken : false
  }; 
  
   do {
  doorRoomIndx = getRandomInt(0, rooms.length - 1);
  }while(doorRoomIndx==playerRoom || doorRoomIndx==keyRoomIndx);
  coords = rooms[doorRoomIndx];
  door = {
   x :getRandomInt(coords[0],coords[2]),
   y :getRandomInt(coords[1],coords[3]),
   locked : true
  }; 
  
  
  for(var i=0;i<rooms.length;i++) {
        if(playerRoom != i) {
           var xy = midpoint(rooms[i]);
            enemies.push({
              x : xy[0],
              y : xy[1] 
            });
        }
  }
  GOTCHA = false;
}

function enemyMove(enemy) {
  var dx = 0,dy = 0;
  if(enemy.x > player_x) {
    dx= -1;
  } else if(enemy.x < player_x) {
    dx= 1;
  }
  else if(enemy.y > player_y) {
    dy= -1;
  } else if(enemy.y < player_y) {
    dy= 1;
  }
  if(plan[enemy.y+dy][enemy.x+dx] == EMPTY_SPACE) {
   enemy.y+=dy;
   enemy.x+=dx;
  } 
  if(enemy.y == player_y && enemy.x == player_x) {
    GOTCHA = true;
  }
  return enemy;
}


document.addEventListener('keydown', function(evt) {
  if(GOTCHA) return;
  if (evt.keyCode == DOWN && player_y < MAXY - 1 && plan[player_y + 1][player_x] == EMPTY_SPACE) {
    player_y++;
  } else if (evt.keyCode == UP && player_y > 0 && plan[player_y - 1][player_x] == EMPTY_SPACE) {
    player_y--;
  } else if (evt.keyCode == LEFT && player_x > 0 && plan[player_y][player_x - 1] == EMPTY_SPACE) {
    player_x--;
  } else if (evt.keyCode == RIGHT && player_x < MAXX - 1 && plan[player_y][player_x + 1] == EMPTY_SPACE) {
    player_x++;
  }
  for(var i=0;i<enemies.length;i++) {
  	enemies[i] = enemyMove(enemies[i]);
  }
  
  
 // console.log(" player_x,player_y = " + player_x + "," + player_y );
  disp();
  if(!key.taken && player_x == key.x &&  player_y == key.y) {
    key.taken = true;
    door.locked = false;
  }
  if(!door.locked && player_x == door.x &&  player_y == door.y) {
    alert('3X1T!');
  }
  if(GOTCHA) {
    alert('D34D!');
  }
});
// Gaurds always turns anticlockwise, so if facing LEFT turns to face 'UP'
var turnReference = {'LEFT':'UP','UP':'RIGHT','RIGHT':'DOWN','DOWN':'LEFT'};
var moveMatrix = {
 'LEFT' : new Position(-1,0),
 'UP' : new Position(0,-1),
 'RIGHT' : new Position(1,0),
 'DOWN' : new Position(0,1)
};

function Position(x,y) {
 this.x = x;
 this.y = y;
 this.add = function(other) {
   return new Position(x+other.x,y+other.y);
 };
 this.equals = function(other) {
   return (x==other.x && y==other.y);
 };
}
// Enemy AI 
// states PATROL,CHASE,RETURN,LOOK_AROUND
function Enemy(x,y) {
 this.pos = new Position(x,y);
 this.state = 'PATROL';
 this.facing = 'UP';
 this.startPos = {}; // Patrol start pos
 this.endPos = {}; // Patrol end pos
 this.dx = 0;
 this.dy = 0;
 this.playerPos = {};
 this.path = [];
 this.turn = function(){
    this.turn = turnReference[this.turn];
 };
 this.forward = function() {
    
    this.pos = this.pos.add(moveMatrix[this.facing]); 
 };
 this.tick = function() {
 
   if(this.state == 'PATROL') {
     this.playerPos = this.scanForPlayer();
     // State change
     if(this.playerPos) {
       this.state == 'CHASE';
       this.destination = playerPos;
     }
     this.move();
   } else if(this.state == 'CHASE') {
      var path = this.findBestPath(this.playerPos);
      this.x = path[0].x;
      this.y = path[0].y;
      if(this.x == this.destination.x && this.y == this.destination.y ) {
         this.state == 'LOOK_AROUND';
      }
      
   } else if(this.state == 'LOOK_AROUND') {
     ;
   }
 
 };
 
 this.scanForPlayer = function() {
   // Depending on facing,e.g. facing right, scan lines are as below
   //      ___________
   //     /
   //    P------------
   //     \___________
   //
   var scanLimit = 6;//Max number of spaces for line of sight
   
   return null;
 };
 
}
