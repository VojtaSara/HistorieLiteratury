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
var guessGridEnded = false;
// Flashcard gameMode
var typKarticky = null;
var tempMasterList2 = [];
var kartickaFlipped = false;
var currentFlashcard = 0;
var diloAutor = [];
var diloAutor2 = [];
var diloPopis = [];
var diloPopis2 = [];
var diloAutorRealismusPlus = [];
var masterListRealismusPlus;

function preload() {
  masterList = loadJSON("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/seznam.json");
  taticek = loadImage("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/Tatíček%20hlava.png");
  masterListRealismusPlus = loadJSON("https://raw.githubusercontent.com/VojtaSara/HistorieLiteratury/master/autoriRealismusPlus.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameMode = 0;
  b1 = new button(200,"Zobrazit přehled autorů");
  b2 = new button(280,"Přiřaď autory k dílům");
  b3 = new button(360,"Flashcards");
  b4 = new button(800,"Zpět");
  b5 = new button(200,"Autor / země");
  b6 = new button(280,"Autor / etapa");
  b7 = new button(360,"Dílo / autor");
  b8 = new button(440,"Popis / dílo");
  b9 = new button(440,"PŘIPOUŠŤÁK 2");
  masterList.autori.sort((a, b) => (a.Narozeni > b.Narozeni) ? 1 : -1);
  for(i = 0; i < masterList.autori.length; i++) {
    for(j = 0; j < masterList.autori[i].Dila.length; j++) {
      diloAutor.push(masterList.autori[i].Jmeno + "*" + masterList.autori[i].Dila[j].NazevDila);
      diloPopis.push(masterList.autori[i].Dila[j].RokVydani + "\n" + masterList.autori[i].Dila[j].PopisDila + "*" + masterList.autori[i].Dila[j].NazevDila);
    }
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
    text("Historie literatury",width/2+3,93);
    fill(0);
    text("Historie literatury",width/2,90);
    image(taticek,width/2 - 400,height/2 -mouseY/10,800,800);
    b1.show();
    b2.show();
    b3.show();
    textSize(20);
    textAlign(RIGHT);
    noStroke();
    text("Vytvořili Vojta a Anička",width - sloup - 10, height - 20);
    textAlign(CENTER);
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
        fill(0);
        guessGridEnded = true;
      } else {
        createRandomList(true);
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
    if (!guessGridEnded) {
      text("Skóre:\n" + (score + immidiateScore) + "\n z " + masterList.autori.length, width/2, height/2 - mezery*3);
    } else {
      var procento = round(((score + immidiateScore) / masterList.autori.length) * 100);
      var znamka = round(map(procento, 70, 100, 1, 10, true));
      text("Konec! Máte správně " + procento + "%", width/2, height/2 - 100);
      image(taticek,width/2 - 400,height/2 -mouseY/10,800,800);
      text("MÁTE ZA " + znamka + "!!!", width*2/3, height/2 + mezery -mouseY/10);
      stroke(1);
      line(width*2/3, height/2 + mezery*2 - mouseY/10,  width*2/3 - mezery*2, height/2 -mouseY/10 + mezery*4);
    }
    b4.show();
  } else if (gameMode == 3) {
    textSize(32);
    if (typKarticky == null) {
      text("Typy kartiček:", width/2, 120);
      b5.show();
      b6.show();
      b7.show();
      b8.show();
      b9.show();
    } else {
      rectMode(CENTER);
      if (kartickaFlipped) {
        fill(214);
      } else {
        fill(255);
      }
      stroke(1);
      rect(width/2,height/2 - mezery*6, width/3,mezery*10);
      rectMode(CORNER);
      fill(0);
      noStroke();
      if (typKarticky == 1) {
        text("Autor / země", width/2, 120);
        if (!kartickaFlipped) {text(sadaAutoru[currentFlashcard].Jmeno, width/2, 320);}
        else {text(sadaAutoru[currentFlashcard].Narodnost, width/2, 320);}
      } else if(typKarticky == 2) {
        text("Autor / etapa", width/2, 120);
        if (!kartickaFlipped) {text(sadaAutoru[currentFlashcard].Jmeno, width/2, 320);}
        else {text(sadaAutoru[currentFlashcard].Styl, width/2, 320);}
      } else if(typKarticky == 3) {
        text("Dílo / autor", width/2, 120);
        textSize(22);
        if (!kartickaFlipped) {text(diloAutor2[currentFlashcard].substring(diloAutor2[currentFlashcard].indexOf("*") + 1,diloAutor2[currentFlashcard].length), width/2, 320);}
        else {text(diloAutor2[currentFlashcard].substring(0,diloAutor2[currentFlashcard].indexOf("*")), width/2, 320);}
      } else if(typKarticky == 4) {
        text("Popis / dílo", width/2, 120);
        textSize(12);
        if (!kartickaFlipped) {text(diloPopis2[currentFlashcard].substring(0,diloPopis2[currentFlashcard].indexOf("*")), width/2, 320);}
        else {textSize(22); text(diloPopis2[currentFlashcard].substring(diloPopis2[currentFlashcard].indexOf("*") + 1,diloPopis2[currentFlashcard].length), width/2, 320);}
      }
      else if(typKarticky == 5) {
        text("Dílo / autor", width/2, 120);
        textSize(18);
        if (!kartickaFlipped) {text(Object.keys(diloAutorRealismusPlus[currentFlashcard]), width/2, 320);}
        else {textSize(22); text(Object.values(diloAutorRealismusPlus[currentFlashcard]), width/2, 320);}
      }
      strokeWeight(4);
      stroke(0);
      line(width/2 + width/6 + mezery*2, 320, width/2 + width/6 + mezery, 320 + mezery);
      line(width/2 + width/6 + mezery*2, 320, width/2 + width/6 + mezery, 320 - mezery);
      line(width/2 - width/6 - mezery*2, 320, width/2 - width/6 - mezery, 320 + mezery);
      line(width/2 - width/6 - mezery*2, 320, width/2 - width/6 - mezery, 320 - mezery);
      strokeWeight(1);
    }
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
      tempMasterList = [];
      tempMasterList = JSON.parse(JSON.stringify(masterList));
      sadaAutoru = [];
      sadaAutoru2 = [];
      sadaDel = [];
      guessGridEnded = false;
      createRandomList(true);
      for(i = 0; i < 5; i++) {
        hadaciBoxy[i] = new hadaciBox(i,true);
      }
      for(i = 5; i < 10; i++) {
        hadaciBoxy[i] = new hadaciBox(i - 5,false);
      }

      immidiateScore = 0;
      score = 0;
      immidiateCorrect = 0;
      globallyCorrect = 0;
      immidiateWrong = 0;
    }
    if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > 360 - 30 && mouseY < 360 + 30) {
      gameMode = 3;
      tempMasterList = JSON.parse(JSON.stringify(masterList));
      diloAutor2 = shuffleArray(diloAutor);
      diloPopis2 = shuffleArray(diloPopis);
      diloAutorRealismusPlus = shuffleArray(masterListRealismusPlus.autoriRealismusPlus);
      console.log(diloAutorRealismusPlus);
      createRandomList(false);
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
    if (typKarticky == null) {
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b5.y - 30 && mouseY < b5.y + 30) {
        typKarticky = 1;
      }
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b6.y - 30 && mouseY < b6.y + 30) {
        typKarticky = 2;
      }
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b7.y - 30 && mouseY < b7.y + 30) {
        typKarticky = 3;
      }
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b8.y - 30 && mouseY < b8.y + 30) {
        typKarticky = 4;
      }
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b9.y - 30 && mouseY < b9.y + 30) {
        typKarticky = 5;
      }
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b4.y - 30 && mouseY < b4.y + 30) {
        gameMode = 0;
        typKarticky = null;
        kartickaFlipped = false;
      }
    } else {
      if (mouseX > width/2 - (width/3)/2 && mouseY > height/2 - mezery*11 && mouseX < width/2 + (width/3)/2 && mouseY < height/2 - mezery) {
        kartickaFlipped = !kartickaFlipped;
      }
      if(mouseX > sloup && mouseX < width/2 - width/6 && mouseY > 200 && mouseY < height/2) {
        if (currentFlashcard > 0) {
          currentFlashcard--;
        } else {
          currentFlashcard = sadaAutoru.length - 1;
        }
        kartickaFlipped = false;
      }
      if(mouseX < width - sloup && mouseX > width/2 + width/6 && mouseY > 200 && mouseY < height/2) {
        if (currentFlashcard < sadaAutoru.length - 1) {
          currentFlashcard++;
        } else {
          currentFlashcard = 0;
        }
        kartickaFlipped = false;
      }
      if (mouseX > width/2-150 && mouseX < width/2 + 150 && mouseY > b4.y - 30 && mouseY < b4.y + 30) {
        typKarticky = null;
        tempMasterList = JSON.parse(JSON.stringify(masterList));
        diloAutor2 = shuffleArray(diloAutor);
        diloPopis2 = shuffleArray(diloPopis);
        diloAutorRealismusPlus = shuffleArray(JSON.parse(JSON.stringify(masterListRealismusPlus)));
        console.log(diloAutorRealismusPlus);
        createRandomList(false);
        kartickaFlipped = false;
      }
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
    stroke(120,120,120);
    text(this.text,width/2,this.y);
    stroke(0);
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
  fill(206, 66, 87);
  rectMode(CORNER);
  rect(sloup + mezery, mezery, map((globallyCorrect/masterList.autori.length), 0, 1, 0, width - sloup*2 - mezery*2, true), mezery);

  fill(0);
}

function displayAutor(num) {
  fill(0);
  textAlign(CENTER);
  textFont('Arial');
  textSize(50);
  text(masterList.autori[num].Jmeno, width/2, 80);
  textSize(16);
  text(masterList.autori[num].Narozeni + " až " + masterList.autori[num].Umrti, width/2, 115 + 0*mezery);
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

function createRandomList(listConstrained) {
  if (listConstrained) {var max = 5;}
  else {var max = masterList.autori.length}
  for(i = 0; i < max; i++) {
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

function keyPressed() {
  if (gameMode == 3 && typKarticky != null) {
    if (keyCode === LEFT_ARROW && currentFlashcard > 0) {
      currentFlashcard--;
      kartickaFlipped = false;
    }
    if (keyCode === RIGHT_ARROW && currentFlashcard < sadaAutoru.length - 1) {
      currentFlashcard++;
      kartickaFlipped = false;
    }
    if(keyCode === UP_ARROW) {
      kartickaFlipped = !kartickaFlipped;
    }
    if(keyCode === DOWN_ARROW) {
      kartickaFlipped = !kartickaFlipped;
    }
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
