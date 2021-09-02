const GAME_OVER = "game_over";
const GAME_RUNNING = "game_running";
const PLAYER_1 = "player1";
const PLAYER_2 = "player2";
const TIE = "tie";
const GAME_STOPPED = "gamce_stopped";

//player factory function
const createPlayer = (userName, playerMark = "") => {
  let name = userName;
  let mark = playerMark;
  let wins = 0;
  const getName = () => name;
  const setName = (newName) => {
    name = newName;
  };
  const setMark = (newMark) => {
    mark = newMark;
  };
  const getMark = () => mark;

  const setWins = (newWins) => {
    wins = newWins;
  };

  const getWins = () => wins;

  return { name, getName, setName, setMark, getMark, setWins, getWins };
};

//game board module
const gameBoard = (function () {
  let board = new Array(9).fill(undefined);
  const getBoard = () => board;
  const setBoard = (newBoard) => {
    board = [...newBoard];
  };
  return { getBoard, setBoard };
})();

//display controler module
const displayControler = (function () {
  let squares = [];
  let radios = [];
  let turnIndicators = [];
  let playerNameInputs = [];
  let player1WinsDisplay = null;
  let player2WinsDisplay = null;
  let startButton = null;

  //set the mode of the interface elements
  const setInterfaceMode = (mode) => {
    radios.forEach((radio) => {
      if (mode === GAME_RUNNING) {
        radio.disabled = true;
      } else {
        radio.disabled = false;
      }
    });

    playerNameInputs.forEach((input) => {
      if (mode === GAME_RUNNING) {
        input.classList.remove("editing");
        input.disabled = true;
      } else {
        input.classList.add("editing");
        input.disabled = false;
      }
    });
    if (mode === GAME_RUNNING) {
      startButton.innerHTML = "RESET GAME";
      startButton.style.backgroundColor = "red";
    } else {
      startButton.innerHTML = "START NEW GAME";
      startButton.style.backgroundColor = "darkgreen";
    }
  };

  const setSquares = (selector) => {
    squares = document.querySelectorAll(selector);
  };

  const inactivateSquares = () => {
    squares.forEach((square) => {
      square.disabled = true;
      square.style.cursor = "not-allowed";
    });
  };
  const activateSquares = () => {
    squares.forEach((square) => {
      square.disabled = false;
      square.style.cursor = "pointer";
    });
  };

  const setRadios = (selector) => {
    radios = document.querySelectorAll(selector);
  };

  const setTurnIndicators = (selector) => {
    turnIndicators = document.querySelectorAll(selector);
  };

  const setPlayersWinsDisplays = (htmlEl1, htmlEl2) => {
    player1WinsDisplay = htmlEl1;
    player2WinsDisplay = htmlEl2;
  };

  const setPlayerNameInputs = (selector) => {
    playerNameInputs = document.querySelectorAll(selector);
  };

  const getPlayer1NameInput = (name) => playerNameInputs[0];
  const getPlayer2NameInput = (name) => playerNameInputs[1];

  const setStartButton = (selector) => {
    startButton = document.querySelector(selector);
  };

  const getStartButton = () => startButton;

  const displayBoard = (board) => {
    squares.forEach((square, idx) => {
      if (board[idx]) {
        square.innerHTML = board[idx];
      } else {
        square.innerHTML = "";
      }
    });
  };

  const setPlayer1Wins = (wins) => {
    player1WinsDisplay.innerText = wins;
  };
  const setPlayer2Wins = (wins) => {
    player2WinsDisplay.innerText = wins;
  };

  const setSquareListeners = (listener) => {
    squares.forEach((square) => {
      square.addEventListener("click", listener);
    });
  };

  const setRadioListeners = (listener) => {
    radios.forEach((radio) => {
      radio.addEventListener("click", listener);
    });
  };

  const swapNextPlayer = (nextPlayer) => {
    if (nextPlayer === PLAYER_1) {
      turnIndicators[0].classList.remove("invisible");
      turnIndicators[1].classList.add("invisible");
      turnIndicators[2].classList.add("invisible");
      turnIndicators[3].classList.remove("invisible");
    } else {
      turnIndicators[0].classList.add("invisible");
      turnIndicators[1].classList.remove("invisible");
      turnIndicators[2].classList.remove("invisible");
      turnIndicators[3].classList.add("invisible");
    }
  };

  const displayWinner = (winner) => {
    const backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");
    const winnerElement = document.createElement("h1");
    if (winner === TIE) {
      winnerElement.innerText = "It'a a Tie! You are both very good!";
    } else {
      winnerElement.innerText = "...And the winner is: " + winner;
    }
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "CLOSE";
    closeBtn.classList.add("start-button");
    closeBtn.addEventListener("click", () => {
      winnerElement.remove();
      closeBtn.remove();
      backdrop.remove();
    });
    backdrop.appendChild(winnerElement);
    backdrop.appendChild(closeBtn);
    document.body.appendChild(backdrop);
  };

  return {
    displayBoard,
    setSquares,
    setSquareListeners,
    setRadios,
    setRadioListeners,
    inactivateSquares,
    activateSquares,
    setTurnIndicators,
    swapNextPlayer,
    displayWinner,
    setPlayersWinsDisplays,
    setPlayer1Wins,
    setPlayer2Wins,
    setPlayerNameInputs,
    getPlayer1NameInput,
    getPlayer2NameInput,
    setInterfaceMode,
    setStartButton,
    getStartButton,
  };
})();

const game = (function () {
  let player1 = createPlayer("New Player 1", "X");
  let player2 = createPlayer("New Player 2", "0");
  let nextPlayer = player1;
  let winner = TIE;

  gameState = GAME_OVER;

  const setGameOver = () => {
    gameState = GAME_OVER;
  };
  const setGameRunning = () => {
    gameState = GAME_RUNNING;
  };

  const getGameState = () => gameState;

  const setPlayers = (newPlayer1, newPlayer2) => {
    player1 = newPlayer1;
    player2 = newPlayer2;
  };

  const setNextPlayer = () => {
    if (nextPlayer === player1) {
      nextPlayer = player2;
    } else {
      nextPlayer = player1;
    }
  };

  //this function handles choosing player marks logic
  function changePlayerMarkHandler(e) {
    const player1Xradio = document.querySelector("#X1");
    const player1Oradio = document.querySelector("#O1");
    const player2Xradio = document.querySelector("#X2");
    const player2Oradio = document.querySelector("#O2");
    switch (e.target.value) {
      case "X1":
        player1.setMark("X");
        player2.setMark("O");
        player2Oradio.checked = true;
        break;
      case "01":
        player1.setMark("O");
        player2.setMark("X");
        player2Xradio.checked = true;
        break;
      case "X2":
        player1.setMark("O");
        player2.setMark("X");
        player1Oradio.checked = true;
        break;
      case "02":
        player1.setMark("X");
        player2.setMark("O");
        player1Xradio.checked = true;
        break;
    }
  }

  const checkBoard = () => {
    let gameOver = true;
    board.forEach((position) => {
      if (position === undefined) {
        gameOver = false;
      }
    });

    if (board[0] !== undefined) {
      if (
        (board[0] === board[1] && board[0] === board[2]) ||
        (board[0] === board[3] && board[0] === board[6])
      ) {
        if (board[0] === player1.getMark()) {
          winner = player1;
        } else {
          winner = player2;
        }
        gameOver = true;
      }
    }

    if (board[8] !== undefined) {
      if (
        (board[6] === board[7] && board[6] === board[8]) ||
        (board[2] === board[5] && board[2] === board[8])
      ) {
        if (board[8] === player1.getMark()) {
          winner = player1;
        } else {
          winner = player2;
        }
        gameOver = true;
      }
    }

    if (board[4] !== undefined) {
      if (
        (board[0] === board[4] && board[0] === board[8]) ||
        (board[2] === board[4] && board[2] === board[6]) ||
        (board[1] === board[4] && board[1] === board[7]) ||
        (board[3] === board[4] && board[3] === board[5])
      ) {
        if (board[4] === player1.getMark()) {
          winner = player1;
        } else {
          winner = player2;
        }
        gameOver = true;
      }
    }

    if (gameOver) {
      gameState = GAME_OVER;
      return;
    }
  };

  const play = (e) => {
    if (e.target.disabled) {
      return;
    }
    if (gameState === GAME_OVER) {
      return;
    }
    const index = +e.target.attributes["data-index"].value;

    board = gameBoard.getBoard();
    board[index] = nextPlayer.getMark();
    gameBoard.setBoard(board);
    displayControler.displayBoard(board);
    setNextPlayer();
    if (nextPlayer === player1) {
      displayControler.swapNextPlayer(PLAYER_1);
    } else {
      displayControler.swapNextPlayer(PLAYER_2);
    }

    e.target.disabled = true;
    e.target.style.cursor = "not-allowed";

    checkBoard();
    if (gameState === GAME_OVER) {
      displayControler.setInterfaceMode(GAME_STOPPED);
      if (winner === TIE) {
        displayControler.displayWinner(winner);
      } else {
        displayControler.displayWinner(winner.getName());
        winner.setWins(winner.getWins() + 1);
      }
      displayControler.setPlayer1Wins(player1.getWins());
      displayControler.setPlayer2Wins(player2.getWins());
    }
  };

  const initListeners = () => {
    displayControler.setSquareListeners(play);
  };

  const initGame = () => {
    setGameRunning();
    displayControler.activateSquares();
    initListeners();
    gameBoard.setBoard(new Array(9));
    displayControler.displayBoard(gameBoard.getBoard());
    winner = TIE;
    displayControler.setPlayer1Wins(player1.getWins());
    displayControler.setPlayer2Wins(player2.getWins());
    player1.setName(displayControler.getPlayer1NameInput().value);
    player2.setName(displayControler.getPlayer2NameInput().value);
  };

  const resetGame = () => {
    setGameOver();
    displayControler.inactivateSquares();
  };

  return {
    setPlayers,
    initListeners,
    getGameState,
    initGame,
    resetGame,
    changePlayerMarkHandler,
  };
})();

function startButtonClickHandler(e) {
  if (gameState === GAME_OVER) {
    game.initGame();
    displayControler.setInterfaceMode(GAME_RUNNING);
  } else {
    displayControler.setInterfaceMode(GAME_STOPPED);
    game.resetGame();
  }
}

//hook the UI to the display controller
displayControler.setSquares(".board-square");
displayControler.inactivateSquares();
displayControler.setRadios("input[type=radio]");
displayControler.setRadioListeners(game.changePlayerMarkHandler);
displayControler.setTurnIndicators("#turnindicator");
displayControler.setPlayersWinsDisplays(
  document.getElementById("p1wins"),
  document.getElementById("p2wins")
);
displayControler.setPlayerNameInputs("input[type=text]");
displayControler.setStartButton("#startbtn");
displayControler
  .getStartButton()
  .addEventListener("click", startButtonClickHandler);
//displayControler.displayBoard(gameBoard.getBoard());
