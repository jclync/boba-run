let char1, char2;
let charSwitched = false;
let song;

let cookieChar, ground, blobs;
let spriteX, spriteY, spriteSize, spriteSpeed;

let currentScore, highScore, lives, life, gameOver; 
let noLives = "Lives: 💔 💔 💔";
let oneLife = "Lives: ❤️‍🔥 💔 💔";
let twoLives = "Lives: ❤️‍🔥 ❤️‍🔥 💔";
let threeLives = "Lives: ❤️‍🔥 ❤️‍🔥 ❤️‍🔥";

let messageSent = false;

function preload() {
    owSong = loadSound('audio/ow.mp3');
    wrongSong = loadSound('audio/wrong.mp3');
    song = loadSound('audio/music.mp3');

  	char1 = new Sprite(80, 200, 74, 60);
	char1.spriteSheet = 'images/spriteSheet1.png';
    char1.anis.offset.y = 2;
	char1.anis.frameDelay = 8;

	char1.addAnis({
		run: { row: 0, frames: 5},
        twoLives: {row: 1, frames: 5},
        oneLife: {row: 2, frames: 5},
        dead: {row: 3, frames: 5}
	});
	char1.ani = 'run';
  

    char2 = new Sprite(80, 200, 74, 60);
	char2.spriteSheet = 'images/spriteSheet2.png';
	char2.anis.frameDelay = 8;

	char2.addAnis({
		run: { row: 0, frames: 5},
        twoLives: {row: 1, frames: 5},
        oneLife: {row: 2, frames: 5},
        dead: {row: 3, frames: 5}
	});
    
	char1.ani = 'run';
    char2.ani = 'run';
    char1.overlaps(char2);
}

function setup() {
    createCanvas(800, 450);
    textFont('Courier New');
    song.play();
    song.setVolume(0.6);
    owSong.setVolume(1);
    allSprites.pixelPerfect = true; // the sprite will be drawn at integer coordinates
    //createCanvas(125, 48, 'pixelated x4');

    spriteX = 80;
    spriteSize = 40;
    spriteY = height/2 - spriteSize/2;
    ground = new Sprite(0, height/4*3, width*3, 10, 'static');
    ground.color = 'green';
    blobs = new Group();
    cookieChar = new Sprite(spriteX, 315, 40, 40);
    char1.overlaps(cookieChar);
    char2.overlaps(cookieChar);
    cookieChar.visible = false;
    char2.visible = false;
    world.gravity.y = 10.8; 
    
    // set scores and stuff
    currentScore = 0;
    highScore = 0;
    lives = 3;
    gameOver = false;
    spriteSpeed = 0;
}

function draw() {
    if (!gameOver) {
        playGame();
    }
}

function playGame() {  
    //set game screen text
    setGameScreen();

    // randomize appearance of obstacles 
    if (random(1) < 0.01) {
        new blobs.Sprite(width, (height/4*3) - spriteSize/2, spriteSize/2);
    }

    spriteSpeed = 2 + sqrt(currentScore)/5;
    blobs.move(width*2, 'left', spriteSpeed);

    if (blobs.overlapping(char1) || blobs.overlapping(char2)) {
        if (cookieChar.collides(blobs)) {
            blobs.removeAll();
            char1.position = {x: 80, y: 300};
            cookieChar.position = {x: 80, y: 315};
            char2.position = {x: 80, y: 300};
          
            updateLives();
        }
    }
}

function setGameScreen() {
    textSize(15);
    background(240);
    fill(0);
    textAlign(LEFT);
    currentScore += 1/50;
    checkLives();
    text(life + '\nScore: ' + round(currentScore), 30, 30);
    textAlign(RIGHT);
    text('High Score: ' + highScore, width - 30, 30); 
    text('Press space or up arrow to jump. \n Press (c) to change character. \n Press (q) to quit.', width - 30, (height / 4 * 3) + 50);
}

// 'space' or uparrow to jump; enter or 'r' to restart
function keyPressed() {
    if (!gameOver) {
        if (keyCode == UP_ARROW) { // up arrow
            char1.move(125, 'up', 6.5);
            char2.move(125, 'up', 6.5);
            cookieChar.move(125, 'up', 6.5);
        } else if (key == ' ') { // space
            char1.move(125, 'up', 6.5);
            char2.move(125, 'up', 6.5);
            cookieChar.move(125, 'up', 6.5);
        } 
    } else {
        if (keyCode == '13') { // enter
            restart();
            playGame();
        }
    }
    
    if (keyCode == '82') { // 'r' key
        restart();
        playGame();
    } else if (keyCode == '81') { // 'q' key
        endGame();
    } else if (keyCode == '67') { // 'c' key
        switchCharacter();
    }
    return false;
}

function switchCharacter() {
    //count++;
  if (!charSwitched) {
      char1.visible = true;
      char2.visible = false;
      charSwitched = true;
  } else {
      char1.visible = false;
      char2.visible = true;
      charSwitched = false;
  }
}

function checkLives() {
    if (lives == 3) {
        life = threeLives;
    } else if (lives == 2) {
        life = twoLives;
        char1.ani = 'twoLives';
        char2.ani = 'twoLives';
    } else if (lives == 1) {
        life = oneLife;
        char1.ani = 'oneLife';
        char2.ani = 'oneLife';
    } else {
        life = noLives;
    }
}

function updateLives() {
    owSong.play();
    lives--;
    
    if (lives == 0) {
        endGame();
    }
}

function endGame() {
    gameOver = true;

    char1.sleeping = true;
    char1.ani = 'dead';
    char2.sleeping = true;
    char2.ani = 'dead';

    blobs.removeAll();
    background(0);
    
    checkScore();
    
    textAlign(CENTER);
    textSize(40);
    fill('red');
    textStyle(BOLD);
    text("Game Over 😔", width / 2, height / 5);
    textSize(20);
    fill(255);
    textStyle(NORMAL);
    text("Your Score: " + round(currentScore) + "\n Your High Score: " + round(highScore) + "\n \n \n Press enter to play again!", width / 2, height / 3);
    
    /* FIREBASE
    //if (!messageSent) {
    //  window.sendScore(highScore);
    //  messageSent = true;
    //}
    */
}

function checkScore() {
    if (currentScore > highScore) {
        highScore = round(currentScore);
    }
}

function restart() {
    lives = 3;
    currentScore = 0;
    gameOver = false;
    messageSent = false;

    //reset character
    cookieChar.position = {x: 80, y: 315};
    world.gravity.y = 10.8; 
    char1.ani = 'run';
    char2.ani = 'run';
}
