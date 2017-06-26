//@@@@@@@@@@@@@@@@@@@@@@@@@@
//Node Javascript
//@@@@@@@@@@@@@@@@@@@@@@@@@@

const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

app.engine('mustache', mustacheExpress());
app.set('views','./views');
app.set('view engine','mustache');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: 'oranges',
  resave: false,
  saveUninitialized: false
}));

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.get("/", function(req, res){
  res.redirect('/game');
});

app.get("/game", function(req,res){
  if(!req.session.word){
    let word = words[Math.floor(Math.random()*words.length)];
    word = word.toUpperCase();
    word = processWord(word);
    req.session.word = word;
    req.session.guesses = 8;
  }
  res.render("index", {
    keys: keys,
    word: req.session.word,
    guesses: req.session.guesses
  });
});

app.post("/key", function(req, res){
  let keyID = req.body.key;
  if(keyID < 10){
    keys.row1[keyID].guessed = true;
    if(!isMatch(keys.row1[keyID], req.session.word)){
      req.session.guesses--;
    }
    checkGame(req.session.word, req.session.guesses, res)();
  }
  else if(keyID < 19){
    keys.row2[keyID-10].guessed = true;
    if(!isMatch(keys.row2[keyID-10], req.session.word)){
      req.session.guesses--;
    }
    checkGame(req.session.word, req.session.guesses, res)();
  }
  else{
    keys.row3[keyID-19].guessed = true;
    if(!isMatch(keys.row3[keyID-19], req.session.word)){
      req.session.guesses--;
    }
    checkGame(req.session.word, req.session.guesses, res)();
  }
})

app.get("/win", function(req, res){
  res.render("end", {win: true})
});

app.get("/lose", function(req, res){
  res.render("end", {win: false})
});

app.post("/", function(req, res){
  if(parseInt(req.body.playagain)){
    req.session.destroy(function(err){
    });
    res.redirect("/");
  }
  else {
    res.redirect("/end")
  }
});

app.get("/end", function(req, res){
  res.send("Thanks for playing!")
});


app.listen(3000, function(){
  console.log("App running on localhost:3000")
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//Functions Javascript
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


function processWord(word){
  let Arr = word.split("");
  word= [];
  for(let i = 0; i < Arr.length; i++){
    let letter = {
      value: Arr[i],
      guessed: false,
      display: '_'
    };
    word.push(letter);
  }
  return word;
}

function isMatch(key, word){
  let letter = key.keyvalue;
  let match = false;
  for(let i = 0; i < word.length; i++){
    if(letter === word[i].value && !word[i].guessed){
      word[i].guessed = true;
      word[i].display = word[i].value;
      match = true;
    }
  }
  return match;
}

function checkGame(word, guesses, res){
  if(wordGuessed(word)){
    return (function(){ res.redirect("/win")});
  }
  else if(guesses === 0){
    return (function(){ res.redirect("lose")});
  }
  else{
    return (function(){ res.redirect("/game")});
  }
}

function wordGuessed(word){
  let guessed = true;
  for(let i = 0; i < word.length; i++){
    guessed &= word[i].guessed;
  }
  return guessed;
}

const keys = {
  row1: [
  {keyvalue: 'Q', guessed: false, id: 0},
  {keyvalue: 'W', guessed: false, id: 1},
  {keyvalue: 'E', guessed: false, id: 2},
  {keyvalue: 'R', guessed: false, id: 3},
  {keyvalue: 'T', guessed: false, id: 4},
  {keyvalue: 'Y', guessed: false, id: 5},
  {keyvalue: 'U', guessed: false, id: 6},
  {keyvalue: 'I', guessed: false, id: 7},
  {keyvalue: 'O', guessed: false, id: 8},
  {keyvalue: 'P', guessed: false, id: 9},
  ],
  row2: [
  {keyvalue: 'A', guessed: false, id: 10},
  {keyvalue: 'S', guessed: false, id: 11},
  {keyvalue: 'D', guessed: false, id: 12},
  {keyvalue: 'F', guessed: false, id: 13},
  {keyvalue: 'G', guessed: false, id: 14},
  {keyvalue: 'H', guessed: false, id: 15},
  {keyvalue: 'J', guessed: false, id: 16},
  {keyvalue: 'K', guessed: false, id: 17},
  {keyvalue: 'L', guessed: false, id: 18},
  ],
  row3: [
  {keyvalue: 'Z', guessed: false, id: 19},
  {keyvalue: 'X', guessed: false, id: 20},
  {keyvalue: 'C', guessed: false, id: 21},
  {keyvalue: 'V', guessed: false, id: 22},
  {keyvalue: 'B', guessed: false, id: 23},
  {keyvalue: 'N', guessed: false, id: 24},
  {keyvalue: 'M', guessed: false, id: 25},
  ]
};
