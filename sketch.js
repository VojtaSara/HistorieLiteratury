var masterList;
var gameMode;

function preload() {
  masterList = loadJSON("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/seznam.json");
}

function setup() {
  createCanvas(window.innerWidth,window.innerHeight - 300);
  //noCanvas();
  //background(255);
  gameMode = 0;
  displayAutor(0);
}

function draw() {
  if (gameMode == 0) {
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
    textAlign(CENTER);
    textSize(80);
    fill(200,200,200);
    text("Historie literatury",width/2+3,93)
    fill(0);
    text("Historie literatury",width/2,90)

  } else if (gameMode == 1) {

  }
}

function mousePressed() {
  if (gameMode == 0) {


  } else if (gameMode == 1) {

  }
}

function displayAutor(num) {
  createP(masterList.autori[num].Zivotopis);
  fill(0,0,150,10);
  noStroke();
  for (var i = 0; i < 2000; i++) {
    ellipse(random(width),random(height),40,40);
  }
  fill(255,210);
  rect(width/4,0,width*(1/2),height);
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
    text(masterList.autori[num].Dila[i].NazevDila + " (" + masterList.autori[num].Dila[i].RokVydani + ") \n\t\t" + masterList.autori[num].Dila[i].PopisDila, width/4 + 60, 240 + i*50);
  }
}
