let bricks, tilesGroup, cat, food, text;
let score = 1;

function preload() {
    soundFormats('mp3', 'ogg');
    KittyImg = loadImage('assets/kitty.png');
    ShurikenSpin = loadImage('assets/shuriken.png');
    Pixel = loadFont('assets/Pixel.TTF')
    ambient = loadSound('assets/ambient.mp3');
    dead = loadSound('assets/dead.mp3');
    pop = loadSound('assets/food.mp3');
}


function setup() {

    new Canvas(840, 480, 'pixelatedx2');
    ambient.play();
    ambient.setVolume(0.2);
    world.gravity.y = 10
    allSprites.pixelPerfect = true;
  
    //background 
    bg = new Sprite(400, 230, "n");
    bg.img = 'assets/bg.png'
    bg.scale = 0.7

    //grass 
    grass = new Group();
    grass.w = 40;
    grass.h = 40;
    grass.tile = 'g';
    grass.collider = 'static'
    grass.bounciness = 0
    grass.img = 'assets/grass.png'
    grass.scale = 0.7
    
    // brick 
    brick = new Group();
    brick.w =50;
    brick.h = 50;
    brick.tile = 'b';
    brick.collider = 's'
    brick.bounciness = 0
    brick.img = 'assets/bricks.png'
    brick.scale = 0.7

    tilesGroup = new Tiles(
        ['b                   b.',//11
         'b                   b.',//10
         'b  gg    ggg    gg  b.',//9
         'b                   b.',//8
         'b                   b.',//7
         'b    ggg     ggg    b.',//6
         'b                   b.',//5
         'b                   b.',//4
         'b  gg    ggg    gg  b.',//3
         'b                   b.',//2
         'b                   b.',//1
         'ggggggggggggggggggggg' //0
        ],20,20,grass.w,grass.h);

    //cat
    cat = new Sprite(200, 400, 40, 40);
	cat.anis.w = 64;
	cat.anis.h = 64;
    cat.spriteSheet = 'assets/shuriken.png';
	cat.anis.frameDelay = 10;
    cat.spriteSheet = KittyImg;
	cat.addAnis({idle: { row: 0, frames: 1 },run: { row: 2, frames: 3 }, jump: { row: 1, frames: 3 },die: {row: 3, frames: 1}, fall: {row: 2, frames: 3}});
	cat.ani = 'idle';
	cat.rotationLock = true;
	cat.friction = 0;
    cat.bounciness = 0  
  
    groundSensor = new Sprite(200, 410, 30, 40);
    groundSensor.visible = false;
    groundSensor.overlaps(allSprites);

new GlueJoint(cat, groundSensor);
    
    //food
    food = new Group();
    food = new Sprite(500, 50, 50);
    food.img = 'assets/food.png'
    
    text = new Sprite(700, 30, 1, 1, 'none');
    text.textSize = 30;
    textFont(Pixel)
    text.text = ("Score");

    //projectiles  

    project = new Group()

    project.overlaps(project)
    project.overlaps(food)
    project.collider= 'k'
    project.vel.y= 0
    project.vel.x= 4
    project.scale = 0.1
    
    stone = new project.Sprite(900, 0,30)
    stone.img = 'assets/stone.png'
    stone.vel.y= 4
    stone.vel.x= 0
    stone.scale = 1
  
    arrow1 = new project.Sprite(0,600);
    arrow1.img = 'assets/FlechaRight.png'
    
    arrow2 = new project.Sprite(840,600);
    arrow2.img = 'assets/FlechaLeft.png'
    arrow2.vel.x = -4
  
    shuriken = new project.Sprite(200,300,40,'n')
    shuriken.scale = 1
    shuriken.vel.y= 2
    shuriken.vel.x= 2
    shuriken.anis.w = 64;
	shuriken.anis.h = 64;
    shuriken.spriteSheet = 'assets/shuriken.png';
	shuriken.anis.frameDelay = 10;
    shuriken.spriteSheet = ShurikenSpin;
	shuriken.addAnis({spin: { row: 0, frames: 3 }});
	shuriken.ani = 'spin';
    shuriken.visible = false
}

// function ambient(){
//   ambient.play();
// }

function draw() {
   
  allSprites.debug= false
    clear();
    spawn()
  
  score>5?stone.vel.y = 6:stone.vel.y = 4;
  score>10?arrow1.vel.x = 8:arrow1.vel.x = 4;
  score>10?arrow2.vel.x = -8:arrow2.vel.x = -4;

if (score>5){
  shuriken.collider='k';
  shuriken.visible = true
}
  
if (kb.pressing('w')&& groundSensor.overlapping(grass)>0
     ) {
        cat.ani = 'jump'        
        cat.vel.y = -6.5
    } else if (kb.pressing('a')) {
        
        cat.ani = 'run';
        cat.vel.x = -5;
      	cat.mirror.x = false; 
 
    } else if (kb.pressing('d')) {
        
        cat.ani = 'run';
        cat.vel.x = 5;
      	cat.mirror.x = true;    
 
    } else {
		cat.ani = 'idle';
		cat.vel.x = 0;
    }
  
let rebote1 = shuriken.vel.x
let rebote2 = shuriken.vel.y

if (shuriken.x > 840 || shuriken.x == 0) {
  shuriken.vel.x = rebote1 * (-1)
}
  
if (shuriken.y > 480 || shuriken.y == 0) {
  shuriken.vel.y = rebote2 * (-1)
}

  
  cat.vel.y<0?cat.overlaps(grass):cat.collides(grass);
  food.vel.y<0?food.overlaps(grass):food.collides(grass);
  
if (cat.collided(project) ){
    dead.play();
    ambient.stop();
    Fail = new Sprite(420,240,0,0,'n')
    Fail.textSize = 100;
    textFont(Pixel)
    Fail.text = ("Game Over")
    cat.ani= 'die'
    noLoop()
}
}


function spawn(){
   
    if (cat.overlaps(food)) { //food spawn
    pop.play()
    food.remove();
    text.text = ("Score: "+ score++);
    food = new Sprite(random(300, 700),   random(0, 400), 50);
    food.img = 'assets/food.png'
    }
  
   if (arrow1.x >900 && score > 8) { //arrow spawn
        arrow1.remove();
        arrow2.remove();
     
   arrow1 = new project.Sprite(0,random(0,400),500,100)
   arrow1.img = 'assets/FlechaRight.png'
  
   arrow2 = new project.Sprite(840,400,500,100);
   arrow2.img = 'assets/FlechaLeft.png'
   }
  
   if (stone.y >600) { //stone spawn
        stone.remove();
     
    stone = new project.Sprite(random(60,780),0,30)
    stone.img = 'assets/stone.png'
    stone.vel.y= 4
    stone.vel.x= 0
    stone.scale = 1
}
  
   if (food.collided(grass)) food.vel.y = -2.5;
}