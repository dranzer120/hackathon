import React, { Component } from "react";
//import logo from './logo.svg';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourHand: [],
      botHand: [],
      yourCardSum: [],
      botCardSum: [],
      yourSum: 0,
      botSum: 0,
      deckID: "",
      deckName: "",
      deckImage: "",
      cardValue: "",
      cardSuit: "",
      cardImage: "",
      show: true,
      busted: false,
    };

    this.getData = this.getData.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.pickPokemon = this.pickPokemon.bind(this);
    this.botDraw = this.botDraw.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.youDraw = this.youDraw.bind(this);
    this.changeToNumber = this.changeToNumber.bind(this);
    this.checkBusted = this.checkBusted.bind(this);
    this.botsTurn = this.botsTurn.bind(this);
  }

  checkBusted(you, bot) {
    if (you > 21) {
      return 1;
    }
    else if (bot > 21){
      return 2;
    }
    else{
      return 3;
    }
  }
  pickPokemon() {
    var num = Math.floor(Math.random() * 151 + 1);
    return fetch(`http://pokeapi.co/api/v2/pokemon/${num}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          deckName: data.name,
          deckImage: data.sprites.front_default
        });
      });
  }
  botDraw() {
    var botHand = this.state.botHand;
    var botTemp = this.state.botCardSum;
    return fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`
    )
      .then(response => response.json())
      .then(data => {
        var cardValue = data.cards[0].value;
        var cardSuit = data.cards[0].suit;

        botTemp.push(cardValue);

        botHand.push({
          cardValue: cardValue,
          cardSuit: cardSuit,
          cardImage: data.cards[0].image
        });

        return {
          botHand: botHand,
          botCardSum: botTemp
        };
      })
      .catch(error => {
        console.error(error);
      });
  }

  youDraw() {
    var yourHand = this.state.yourHand;
    var temp = this.state.yourCardSum;

    return fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`
    )
      .then(response => response.json())
      .then(data => {
        var cardValue = data.cards[0].value;
        var cardSuit = data.cards[0].suit;

        temp.push(cardValue);

        yourHand.push({
          cardValue: cardValue,
          cardSuit: cardSuit,
          cardImage: data.cards[0].image
        });

        return {
          yourHand: yourHand,
          yourCardSum: temp
        };
      })
      .catch(error => {
        console.error(error);
      });
  }

  getData() {
    return fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          deckID: data.deck_id,
          yourHand: [],
          botHand: [],
          yourCardSum: [],
          botCardSum: [],
          yourSum: 0,
          botSum: 0,
          show: true,
          busted: false
        });
      })
      .catch(error => {
        console.error(error);
      });
  }


  startNewGame() {
    this.getData();
    this.pickPokemon();
  }

  drawCard() {
    this.youDraw().then(state1 => {
      const state2 = this.changeToNumber();

      this.setState({
        ...state1,
        ...state2
      });
    });
    if(this.state.yourCardSum.length === 0){
      this.botDraw()
    }
    
  }

  botsTurn() {
    this.botDraw().then(state1 => {
      const state2 = this.changeToNumber();

      this.setState({
        ...state1,
        ...state2
      })
    })

  }

  changeToNumber() {
    let yourHand = this.state.yourCardSum;
    let botHand = this.state.botCardSum;

    for (var i = 0; i < this.state.yourHand.length; i++) {
      if (yourHand[i] === "ACE") {
        yourHand[i] = 11;
      } else if (yourHand[i] === "JACK") {
        yourHand[i] = 10;
      } else if (yourHand[i] === "QUEEN") {
        yourHand[i] = 10;
      } else if (yourHand[i] === "KING") {
        yourHand[i] = 10;
      } else {
        yourHand[i] = parseInt(yourHand[i], 10);
      }
    }

    for (var j = 0; j < this.state.botHand.length; j++) {
      if (botHand[j] === "ACE") {
        botHand[j] = 11;
      } else if (botHand[j] === "JACK") {
        botHand[j] = 10;
      } else if (botHand[j] === "QUEEN") {
        botHand[j] = 10;
      } else if (botHand[j] === "KING") {
        botHand[j] = 10;
      } else {
        botHand[j] = parseInt(botHand[j], 10);
      }
    }
    
    var yourSum = yourHand.reduce((a, b) => a + b, 0);
    var botSum = botHand.reduce((a, b) => a + b, 0);
    
    if(yourHand.includes(11) && yourSum > 21){
      for (var k = 0; k < this.state.yourHand.length; k++){
        if(yourHand[k] === 11){
          yourHand[k] = 1;
          yourSum = yourHand.reduce((a, b) => a + b, 0);
        }
      }
    }
    else if(botHand.includes(11) && botSum > 21){
      for (var r = 0; r < this.state.botHand.length; r++){
        if(botHand[r] === 11){
          botHand[r] = 1;
          botSum = botHand.reduce((a, b) => a + b, 0);
        }
      }
    }

    return {
      yourCardSum: yourHand,
      botCardSum: botHand,
      yourSum: yourSum,
      botSum: botSum
    };
  }

  render() {
    var sum = this.state.yourSum;
    var length = this.state.botCardSum.length;
    var temptotal = this.state.botSum;
    var checkb = this.checkBusted(sum,temptotal);
    var end = 0

    if (length >= 2 && temptotal < 17){
      this.botsTurn()
    }
    else if (length >= 2 && sum > temptotal){
      end = 2;
    }
    else if (length >= 2 && temptotal > sum && temptotal <22){
      end = 1;
    }
    
  
    //var length = this.state.yourHand.length;
    
    return (
      <div className="App">
        <div className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h2>BlackJack (2 cards Only)</h2>
          <h4>
            Deck Name: {this.state.deckName}
            <img src={this.state.deckImage} alt="" style={{ height: "4em" }} />
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <button
              className="btn btn-primary"
              onClick={() => this.startNewGame()}
              style={{ marginTop: "20px" }}
            >
              Start a New Game
            </button>
            <button
              className="btn btn-success"
              onClick={() => this.drawCard()}
              style={{
                marginTop: "20px",
              }}
            >
              Hit
            </button>
            <button
              className="btn btn-warning"
              onClick={() => this.botsTurn()}
              style={{ marginTop: "20px"}}
              >
              Stand
            </button>
          </div>
          <div className="row">
            <h2 style={{ display: checkb === 2 || end === 2? "inline-block" : "none" }}>
              You Win!
            </h2>
            <h2 style={{ display: end === 1 ? "inline-block" : "none" }}>
              You Lost!
            </h2>
            <h2 style={{ display: checkb === 1? "inline-block" : "none" }}>
              You Busted!
            </h2>
            <h3>Your Hand :{this.state.yourSum}</h3>
            <p>
              {this.state.yourHand.map(item => (
                <img
                  src={item.cardImage}
                  key={item.cardSuit + item.cardValue}
                  alt=""
                  style={{ width: "110px", height: "150px" }}
                />
              ))}
            </p>

            <h3>Bot's Hand :{this.state.botSum}</h3>
            <p>
              {this.state.botHand.map(item => (
                <img
                  src={item.cardImage}
                  key={item.cardSuit + item.cardValue}
                  alt=""
                  style={{ width: "110px", height: "150px" }}
                />
              ))}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
