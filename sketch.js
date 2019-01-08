var masterList;
var gameMode;
var b;
var taticek;
var mezery = 25;
var momentalniAutor = 0;
var sloup = 150;
// GuessGrid gamemode
var tempMasterList = [];
var sadaAutoru = [];
var sadaAutoru2 = [];
var sadaDel = [];
var autorSelected;
var diloSelected;
var immidiateScore = 0;
var score = 0;
var immidiateCorrect = 0;
var globallyCorrect = 0;
var immidiateWrong = 0;
var hadaciBoxy = [];
var progress;

function preload() {
  masterList = loadJSON("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/seznam.json");
  taticek = loadImage("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/Tatíček%20hlava.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  gameMode = 0;
  displayAutor(0);
  b1 = new button(200,"Zobrazit přehled autorů");
  b2 = new button(280,"Přiřaď autory k dílům");
  b3 = new button(360,"Uhádni dílo");
  b4 = new button(800,"Zpět");
  tempMasterList = JSON.parse(JSON.stringify(masterList));
  createGuessGrid();
  for(i = 0; i < 5; i++) {
    hadaciBoxy[i] = new hadaciBox(i,true);
  }
  for(i = 5; i < 10; i++) {
    hadaciBoxy[i] = new hadaciBox(i - 5,false);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (i = 0; i < hadaciBoxy.length; i++) {
     hadaciBoxy[i].updatePos();
  }
}

function draw() {
  background(255);
  stroke(0,0,250,30);
  strokeWeight(6);
  for (var i = 0; i < 500; i++) {
    line(i*8,0,i*8-100,height)
  }
  strokeWeight(1);
  fill(255);
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
    for (i = 0; i < hadaciBoxy.length; i++) {
       if(!hadaciBoxy[i].disabled) {
         hadaciBoxy[i].update();
       }
    }
    if (autorSelected != null && diloSelected != null) {
      if (sadaAutoru[autorSelected].Jmeno == sadaAutoru2[diloSelected].Jmeno) {
        immidiateCorrect++;
        globallyCorrect++;
        hadaciBoxy[autorSelected].disable();
        hadaciBoxy[diloSelected + 5].disable();
        autorSelected = null;
        diloSelected = null;
      } else {
        immidiateWrong++;
        autorSelected = null;
        diloSelected = null;
      }
    }
    immidiateScore = immidiateCorrect - immidiateWrong;
    if (immidiateCorrect == 5) {
      score += immidiateScore;
      immidiateCorrect = 0;
      immidiateWrong = 0;
      immidiateScore = 0;
      if (globallyCorrect > masterList.autori.length-masterList.autori.length%5 - 1) {
        text("Konec!", width/2, height/2 - 100);
      } else {
        createGuessGrid();
        hadaciBoxy = [];
        for(i = 0; i < 5; i++) {
          hadaciBoxy[i] = new hadaciBox(i,true);
        }
        for(i = 5; i < 10; i++) {
          hadaciBoxy[i] = new hadaciBox(i - 5,false);
        }
      }
    }
    displayProgress();
    textAlign(CENTER);
    textSize(32);
    noStroke();
    text("Skóre:\n" + (score + immidiateScore), width/2, height/2 - mezery*3);
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
  } else if (gameMode == 2) {
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b4.y - 30 && mouseY < b4.y + 30) {
      gameMode = 0;
    }
    for (i = 0; i < hadaciBoxy.length; i++) {
       if (hadaciBoxy[i].mouseIn() && !hadaciBoxy[i].disabled) {
         hadaciBoxy[i].select();
       } else {
         hadaciBoxy[i].deselect();
       }
    }
  } else if (gameMode == 3) {
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

class hadaciBox {
  constructor(id_, type_) {
    this.id = id_;
    this.type = type_;
    if (this.type) {
      this.x = sloup + mezery/2;
      this.x2 = width/2 - mezery*3;
    } else {
      this.x = width/2 + mezery*3;
      this.x2 = width - sloup - mezery/2;
    }
    this.y = 115 + 5*mezery*this.id - mezery;
    this.selected = false;
    this.disabled = false;
  }

  update() {
    fill(255,30);
    stroke(0);
    rectMode(CORNERS);
    rect(this.x, this.y, this.x2, this.y + 2*mezery);
    if ((this.type && autorSelected == this.id) || (!this.type && diloSelected == this.id)) {
      fill(20,20,20,25);
      rect(this.x, this.y, this.x2, this.y + 2*mezery);
      this.selected = true;
    }
    rectMode(CORNER);
    fill(0);
    noStroke();
    textSize(15);
    if (this.type) {
      textAlign(LEFT);
      text(sadaAutoru[this.id].Jmeno, sloup + mezery, 115 + 5*mezery*this.id);
    }
    else {
      textAlign(RIGHT);
      text(sadaDel[this.id], width - sloup - mezery, 115 + 5*mezery*this.id);
    }
  }

  disable() {
    this.disabled = true;
  }

  select() {
    if (this.type) {
      autorSelected = this.id;
    } else {
      diloSelected = this.id;
    }
  }

  deselect() {
    this.selected = false;
  }

  mouseIn() {
    if (mouseX > this.x && mouseX < this.x2 && mouseY > this.y && mouseY < this.y + 2*mezery) {
      return true;
    } else {
      return false;
    }
  }

  updatePos() {
    if (this.type) {
      this.x = sloup + mezery/2;
      this.x2 = width/2 - mezery*3;
    } else {
      this.x = width/2 + mezery*3;
      this.x2 = width - sloup - mezery/2;
    }
    this.y = 115 + 5*mezery*this.id - mezery;
  }
}

function displayProgress() {
  rectMode(CORNERS);
  fill(255);
  stroke(0);
  rect(sloup + mezery, mezery, width - sloup - mezery, mezery*2);
  fill(255, 0, 0);
  rectMode(CORNER);
  rect(sloup + mezery, mezery, (width - sloup - mezery)*(globallyCorrect/masterList.autori.length), mezery);
  fill(0);

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

function createGuessGrid() {
  progress = (tempMasterList.autori.length/masterList.autori.length);
  for(i = 0; i < 5; i++) {
    var randomNum = floor(random(tempMasterList.autori.length));
    if (tempMasterList.autori.length > 1) {
      sadaAutoru[i] = tempMasterList.autori[randomNum];
      tempMasterList.autori.splice(randomNum,1);
    } else {
      sadaAutoru[i] = masterList.autori[randomNum];
    }
  }
  sadaAutoru2 = shuffleArray(JSON.parse(JSON.stringify(sadaAutoru)));
  for (i = 0; i < sadaAutoru2.length; i++) {
    sadaDel[i] = sadaAutoru2[i].Dila[floor(random(sadaAutoru2[i].Dila.length))].NazevDila;
  }
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
