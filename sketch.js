var masterList;
var gameMode;
var b;
var taticek;

function preload() {
  masterList = loadJSON("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/seznam2.json");
  taticek = loadImage("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/Tatíček%20hlava.png");
}

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  //noCanvas();
  //background(255);
  gameMode = 0;
  displayAutor(0);
  b1 = new button(width/2,200,"Zobrazit přehled autorů");
  b2 = new button(width/2,280,"Přiřaď autory k dílům");
  b3 = new button(width/2,360,"Uhádni dílo");
  b4 = new button(width/2,height - 100,"Zpět");
}

function draw() {
  background(255);
  stroke(0,0,250,30);
  strokeWeight(6);
  for (var i = 0; i < 500; i++) {
    line(i*8,0,i*8-100,height)
  }
  strokeWeight(1);
  fill(255,210);
  rect(width/4,0,width*(1/2),height);
  fill(0);

  if (gameMode == 0) {
    textAlign(CENTER);
    textSize(70);
    fill(200,200,200);
    text("Historie literatury",width/2+3,93)
    fill(0);
    text("Historie literatury",width/2,90)
    image(taticek,width/2 - 400,height/2 -mouseY/10,800,800);
    b1.show();
    b2.show();
    b3.show();
  } else if (gameMode == 1) {
    displayAutor(0);
    b4.show();
  } else if (gameMode == 2) {

    b4.show();
  } else if (gameMode == 3) {

    b4.show();
  }
}

function mousePressed() {
  if (gameMode == 0) {
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > 200 - 30 && mouseY < 200 + 30) {
      gameMode = 1;
    }
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > 280 - 30 && mouseY < 280 + 30) {
      gameMode = 2;
    }
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > 360 - 30 && mouseY < 360 + 30) {
      gameMode = 2;
    }
  } else if (gameMode == 1 || gameMode == 2 || gameMode == 3) {
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > height - 130 && mouseY < height - 70) {
      gameMode = 0;
    }
  }
}

class button {
  constructor(x_, y_, text_) {
    this.x = x_;
    this.y = y_;
    this.text = text_;
  }
  show() {
    stroke(1);
    fill(255);
    if (mouseX > this.x-150 && mouseX < this.x + 150 && mouseY > this.y - 30 && mouseY < this.y + 30) {
      fill(220,220,220);
    }
    textSize(20);
    rect(this.x-150,this.y-30,300,60);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.text,this.x,this.y);
  }
}

function displayAutor(num) {
  //createP(masterList.autori[num].Zivotopis);
  fill(0);
  textAlign(CENTER);
  textFont('Arial');
  textSize(50);
  text(masterList.autori[num].Jmeno, width/2, 80);
  textSize(16);
  text(masterList.autori[num].Narozeni + " - " + masterList.autori[num].Umrti, width/2, 115);
  textAlign(LEFT);
  textStyle(BOLD);
  text("Umělecký směr: ", width/4 + 40, 140);
  textStyle(NORMAL);
  text(masterList.autori[num].Styl, width/4 + 170, 140);
  textStyle(BOLD);
  text("Povolání: ", width/4 + 40, 165);
  textStyle(NORMAL);
  text(masterList.autori[num].Povolani, width/4 + 115, 165);
  textStyle(BOLD);
  text("Žánry: ", width/4 + 40, 190);
  textStyle(NORMAL);
  text(masterList.autori[num].Zanry, width/4 + 90, 190);
  textStyle(BOLD);
  text("Dílo: ", width/4 + 40, 215);
  textStyle(NORMAL);
  for (var i = 0; i < masterList.autori[num].Dila.length; i ++) {
    text(masterList.autori[num].Dila[i].NazevDila + " (" + masterList.autori[num].Dila[i].RokVydani + ") \n\t\t" + masterList.autori[num].Dila[i].PopisDila, width/4 + 60, 250 + i*50);
  }
}
