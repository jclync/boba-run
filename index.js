let char1, char2, cookieChar;
let charSwitched = false;
let song;
let bobas, bobaHeight, ground, blobs;
let spriteX, spriteY, spriteSize, spriteSpeed;

let currentScore, highScore, lives, life, gameOver, currentTime; 
let noLives = "Lives: 💔 💔 💔";
let oneLife = "Lives: ❤️‍🔥 💔 💔";
let twoLives = "Lives: ❤️‍🔥 ❤️‍🔥 💔";
let threeLives = "Lives: ❤️‍🔥 ❤️‍🔥 ❤️‍🔥";

let messageSent = false;

function preload() {
    owSong = loadSound('audio/ow.mp3');
    collectSong = loadSound('audio/collect.mp3');
    song = loadSound('audio/music.mp3');
  
    bobas = new Group();
    bobas.img = 'images/boba.png';

  	char1 = new Sprite(80, 200, 74, 60);
	char1.spriteSheet = 'images/spriteSheet1.png';
    //char1.anis.offset.y = 2;
	char1.anis.frameDelay = 6;

	char1.addAnis({
		run: { row: 0, frames: 5},
        twoLives: {row: 1, frames: 5},
        oneLife: {row: 2, frames: 5},
        dead: {row: 3, frames: 5}
	});
	char1.ani = 'run';
  

    char2 = new Sprite(80, 200, 74, 60);
	char2.spriteSheet = 'images/spriteSheet2.png';
	char2.anis.frameDelay = 12;

	char2.addAnis({
		run: { row: 0, frames: 2},
        twoLives: {row: 1, frames: 2},
        oneLife: {row: 2, frames: 2},
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
    collectSong.setVolume(1);
    allSprites.pixelPerfect = true; // the sprite will be drawn at integer coordinates
    //createCanvas(125, 48, 'pixelated x4');

    spriteX = 80;
    spriteSize = 40;
    spriteY = height/2 - spriteSize/2;
    world.gravity.y = 10.8; 

    ground = new Sprite(0, height/4*3, width*3, 10, 'static');
    ceiling = new Sprite(0, -5, width*3, 1, 'static');
    ground.stroke = 'green';
    ground.color = 'green';
    blobs = new Group();
    cookieChar = new Sprite(spriteX, 315, 40, 40);
    char1.overlaps(cookieChar);
    char2.overlaps(cookieChar);
    cookieChar.visible = false;
    char2.visible = false;
    
    // set scores and stuff
    currentScore = 0;
    highScore = 0;
    lives = 3;
    gameOver = false;
    spriteSpeed = 0;
    currentTime = 0;
}

function draw() {
    if (!gameOver) {
        playGame();
    }
}

// play game
function playGame() { 
    currentTime = millis()/1000;
  
    //set game screen text
    setGameScreen();

    // randomize appearance of obstacles 
    if (random(1) < 0.01) {
        new blobs.Sprite(width, (height/4*3) - spriteSize/2, spriteSize/2);
      
        // randomize boba generation
        new bobas.Sprite(width + 50, bobaHeight, 'kinematic');
        bobaHeight = random(height/4*3);
        //boba.position = {x: width + 50, y: bobaHeight};
        bobas.move(width * 3, 'left', 3);
        bobas.overlaps(blobs);
    }
  
    char1.overlaps(bobas, collect);
    char2.overlaps(bobas, collect);
    cookieChar.overlaps(bobas, collect);
    console.log(currentTime);

    spriteSpeed = 2 + sqrt(currentTime)/5;
    blobs.move(width * 2, 'left', spriteSpeed);

    char1.overlaps(blobs, removeBlob);
    char2.overlaps(blobs, removeBlob);
    cookieChar.overlaps(blobs, removeBlob);
}

// collect boba
function collect(player, boba) {
    boba.remove();  
    collectSong.play();
    currentScore += 50;
}

// remove blob
function removeBlob(player, blob) {
    blob.remove();
    currentScore -= 10;
    updateLives();
    player.position = {x: 80, y: 300};
}

// set text of game screen
function setGameScreen() {
    textSize(15);
    background('#82DAF7');
    fill('green');
    rect(0, height/4*3, width, 200);
    fill(0);
    textAlign(LEFT);
    currentScore += 1/50;
    checkLives();
    text(life + '\nScore: ' + round(currentScore), 30, 30);
    textAlign(RIGHT);
    text('High Score: ' + highScore, width - 30, 30); 
    text('Press space or up arrow to jump. \n Press (c) to change character. \n Press (q) to quit.', width - 30, (height / 4 * 3) + 50);
}

// 'space' or uparrow to jump; enter or 'r' to restart; 'c' to change character; 'q' to quit game
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

// switch characters
//  ~ character 1: bobabee
//  ~ character 2: ladybug
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

// check how many lives you have left; change to corresponding character sprite animation state
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

// update lives and end game if no lives left
function updateLives() {
    owSong.play();
    lives--;
    
    if (lives == 0) {
        endGame();
    }
}

// end game
function endGame() {
    gameOver = true;
    background(0);
    fill('green');
    rect(0, height/4*3, width, 200);

    char1.sleeping = true;
    char1.ani = 'dead';
    char2.sleeping = true;
    char2.ani = 'dead';

    bobas.removeAll();
    blobs.removeAll();
    
    updateScore();
    
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

// update high score
function updateScore() {
    if (currentScore > highScore) {
        highScore = round(currentScore);
    }
}

// reset all variables and set everything back to default
function restart() {
    lives = 3;
    currentScore = 0;
    gameOver = false;
    messageSent = false;
    currentTime = 0;

    //reset character
    cookieChar.position = {x: 80, y: 315};
    world.gravity.y = 10.8; 
    char1.ani = 'run';
    char2.ani = 'run';
}