var masterList;
var gameMode;
var b;
var taticek;
var mezery = 25;
var momentalniAutor = 0;
var sloup = 150;

function preload() {
  masterList = loadJSON("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/seznam2.json");
  taticek = loadImage("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/Tatíček%20hlava.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  //noCanvas();
  //background(255);
  gameMode = 0;
  displayAutor(0);
  b1 = new button(200,"Zobrazit přehled autorů");
  b2 = new button(280,"Přiřaď autory k dílům");
  b3 = new button(360,"Uhádni dílo");
  b4 = new button(800,"Zpět");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  b1.updatePos();
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
  rect(sloup,0,width - 2*sloup,height);
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
    displayAutor(momentalniAutor);
    b4.show();
    strokeWeight(15);
    stroke(255);
    line(sloup - 50, height/2, sloup - 20, height/2-30);
    line(sloup - 50, height/2, sloup - 20, height/2+30);
    line(width - sloup + 50, height/2, width - sloup + 20, height/2-30);
    line(width - sloup + 50, height/2, width - sloup + 20, height/2+30);
    stroke(0);
    strokeWeight(1);
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
  } else if (gameMode == 1) {
    if (mouseX < sloup && momentalniAutor > 0) {
      momentalniAutor--;
    } else if (mouseX > width - sloup && momentalniAutor < masterList.autori.length - 1) {
      momentalniAutor++;
    }
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b4.y - 30 && mouseY < b4.y + 30) {
      gameMode = 0;
    }
  } else if (gameMode == 2 || gameMode == 3) {
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b4.y - 30 && mouseY < b4.y + 30) {
      gameMode = 0;
    }
  }
}

class button {
  constructor(y_, text_) {
    this.y = y_;
    this.text = text_;
  }
  show() {
    stroke(1);
    fill(255);
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > this.y - 30 && mouseY < this.y + 30) {
      fill(220,220,220);
    }
    textSize(20);
    rect(width/2-150,this.y-30,300,60);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.text,width/2,this.y);
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
  text(masterList.autori[num].Narozeni + " - " + masterList.autori[num].Umrti, width/2, 115 + 0*mezery);
  textAlign(LEFT);
  textStyle(BOLD);
  text("Národnost: ", sloup + 40, 115 + 2*mezery);
  textStyle(NORMAL);
  text(masterList.autori[num].Narodnost, sloup + 130, 115 + 2*mezery);
  textStyle(BOLD);
  text("Umělecký směr: ", sloup + 40, 115 + 3*mezery);
  textStyle(NORMAL);
  text(masterList.autori[num].Styl, sloup + 170, 115 + 3*mezery);
  textStyle(BOLD);
  text("Povolání: ", sloup + 40, 115 + 4*mezery);
  textStyle(NORMAL);
  text(masterList.autori[num].Povolani, sloup + 115, 115 + 4*mezery);
  textStyle(BOLD);
  text("Žánry: ", sloup + 40, 115 + 5*mezery);
  textStyle(NORMAL);
  text(masterList.autori[num].Zanry, sloup + 90, 115 + 5*mezery);
  textStyle(BOLD);
  text("Popis: ", sloup + 40, 115 + 6*mezery);
  textStyle(NORMAL);
  text(masterList.autori[num].Zivotopis, sloup + 90, 115 + 6*mezery);
  textStyle(BOLD);
  text("Dílo: ", sloup + 40, 115 + 7*mezery);
  textStyle(NORMAL);
  for (var i = 0; i < masterList.autori[num].Dila.length; i ++) {
    text(masterList.autori[num].Dila[i].NazevDila + " (" + masterList.autori[num].Dila[i].RokVydani + ") \n\t\t" + masterList.autori[num].Dila[i].PopisDila, sloup + 60, 120 + 8*mezery + i*50);
  }
}
