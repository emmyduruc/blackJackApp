// ::::::::::::CHALLENGE: 1 BLACK JACK:::::::::::::::

let blackjackGame = {
       you: { scoreSpan: "#your-scores", div: "#your-box", scores: 0 },
       dealer: { scoreSpan: "#dealer-scores", div: "#dealer-box", scores: 0 },
       cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
       cardsMap: {
         2: 2,
         3: 3,
         4: 4,
         5: 5,
         6: 6,
         7: 7,
         8: 8,
         9: 9,
         10: 10,
         K: 10,
         J: 10,
         Q: 10,
         A: [1, 11],
       },
       wins: 0,
       losses: 0,
       draws: 0,
       isStand: false,
       turnsOver: false,
     };
     const YOU = blackjackGame["you"];
     const DEALER = blackjackGame["dealer"];
     const hitSound = new Audio("sounds/swish.m4a");
     const winSound = new Audio("sounds/cash.mp3");
     const lossSound = new Audio("sounds/aww.mp3");
     document
       .querySelector("#blackjack-hit-button")
       .addEventListener("click", blackjackHit);
     
     document
       .querySelector("#blackjack-stand-button")
       .addEventListener("click", dealerLogic);
     
     document
       .querySelector("#blackjack-deal-button")
       .addEventListener("click", blackjackDeal);
     
     function blackjackHit() {
       if (blackjackGame["isStand"] === false) {
         let card = randomCard();
         // console.log(card);
         showCard(card, YOU);
         updateScore(card, YOU);
         console.log(YOU["scores"]);
         showScore(YOU);
       }
     }
     
     function randomCard() {
       let randomIndex = Math.floor(Math.random() * 13);
       return blackjackGame["cards"][randomIndex];
     }
     
     function showCard(card, activePlayer) {
       // if (activePlayer['score'] <=21 ) {}
       let cardImage = document.createElement("img");
       cardImage.src = `blackjack_img/${card}.png`;
       document.querySelector(activePlayer["div"]).appendChild(cardImage);
       hitSound.play();
     }
     
     function blackjackDeal() {
       // let winner = computeWinner();
       // showResult(winner);
       // showResult(computeWinner());
       if (blackjackGame["turnsOver"] === true) {
         blackjackGame["isStand"] = false;
         let yourImages = document
           .querySelector("#your-box")
           .querySelectorAll("img");
         let dealerImages = document
           .querySelector("#dealer-box")
           .querySelectorAll("img");
     
         for (let i = 0; i < yourImages.length; i++) {
           yourImages[i].remove();
         }
     
         for (let i = 0; i < dealerImages.length; i++) {
           dealerImages[i].remove();
         }
         YOU["scores"] = 0;
         DEALER["scores"] = 0;
     
         document.querySelector("#your-scores").textContent = 0;
         document.querySelector("#dealer-scores").textContent = 0;
     
         document.querySelector("#your-scores").style.color = "turquoise";
         document.querySelector("#dealer-scores").style.color = "red";
     
         document.querySelector("#blackjackresult-display").textContent =
           "Let's play";
         document.querySelector("#blackjackresult-display").style.color = "black";
     
         blackjackGame["turnsOver"] = true;
       }
     }
     function updateScore(card, activePlayer) {
       if (card === "A") {
         //if adding 11 keeps me below 21, and 11 otherwise, add 1
         if (activePlayer["scores"] + blackjackGame["cardsMap"][card][1] <= 21) {
           activePlayer["scores"] += blackjackGame["cardsMap"][card][1];
         } else {
           activePlayer["scores"] += blackjackGame["cardsMap"][card][0];
         }
       } else {
         activePlayer["scores"] += blackjackGame["cardsMap"][card];
       }
     }
     function showScore(activePlayer) {
       if (activePlayer["scores"] > 21) {
         document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
         document.querySelector(activePlayer["scoreSpan"]).style.color = "Yellow";
       } else {
         document.querySelector(activePlayer["scoreSpan"]).textContent =
           activePlayer["scores"];
       }
     }
     //this func makes the boot (stand) to display its card slowly with regards to timeout set 
     function sleep(ms){
       return new Promise(resolve => setTimeout(resolve, ms)); 
     }
     async function dealerLogic() {
       blackjackGame["isStand"] = true;
     
       while (DEALER["scores"] < 16 && blackjackGame["isStand"] === true) {
         let card = randomCard();
         showCard(card, DEALER);
         updateScore(card, DEALER);
         showScore(DEALER);
         await sleep(1000); //the timeout set in ms
         // showResult(computeWinner());
       }
     
       // if (DEALER["scores"] > 15) {
       blackjackGame["turnsOver"] = true;
       let winner = computeWinner();
       showResult(winner);
     }
     // }
     
     //help computes winner and returnd who just Won
     //update the wins, losses and draws
     function computeWinner() {
       let winner;
       if (YOU["scores"] <= 21) {
         if (YOU["scores"] > DEALER["scores"] || DEALER["scores"] > 21) {
           blackjackGame["wins"]++;
           winner = YOU;
         } else if (YOU["scores"] < DEALER["scores"]) {
           blackjackGame["losses"]++;
           winner = DEALER;
         } else if (YOU["scores"] === DEALER["scores"]) {
           blackjackGame["draws"]++;
         }
         //condition when user busts but dealer does not
       } else if (YOU["scores"] > 21 && DEALER["scores"] <= 21) {
         blackjackGame["losses"]++;
         winner = DEALER;
     
         //condition when you and dealer burst
       } else if (YOU["scores"] > 21 && DEALER["scores"] > 21) {
         blackjackGame["draws"]++;
       }
       console.log("Winner is", winner);
       return winner;
     }
     function showResult(winner) {
       let message, messageColor;
     
       if (blackjackGame["turnsOver"] === true) {
         if (winner === YOU) {
           document.querySelector("#wins").textContent = blackjackGame["wins"];
           message = "You won!";
           messageColor = "green";
           winSound.play();
         } else if (winner === DEALER) {
           document.querySelector("#losses").textContent = blackjackGame["losses"];
           message = "You lost!";
           messageColor = "Red";
           lossSound.play();
         } else {
           document.querySelector("#draws").textContent = blackjackGame["draws"];
           message = "You drew!";
           messageColor = "green";
         }
         document.querySelector("#blackjackresult-display").textContent = message;
         document.querySelector("#blackjackresult-display").style.color =
           messageColor;
       }
     }
     