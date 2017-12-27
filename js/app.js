$(() => {

  const $main = $('main');
  const $startStopButton = $('button.start');
  const $resetButton = $('button.reset');
  const config = {
    squareSize: 10
  };
  let aliveSquares = [];
  let nextRoundAliveSquares = [];
  let neighbourDifferences = [];
  let running = false;
  let intervalId = null;

  function setup() {
    config.numberOfColumns = Math.floor(window.innerWidth / (config.squareSize + 2)) + 2;
    config.numberOfRows = Math.floor(0.9 * window.innerHeight / (config.squareSize + 2)) + 2;
    config.numberOfSquares = config.numberOfColumns * config.numberOfRows;
    neighbourDifferences = [1, config.numberOfColumns, config.numberOfColumns + 1, config.numberOfColumns - 1];
    $main.css('width', `${config.numberOfColumns * 12}`);
    for(let i = 0; i < config.numberOfSquares; i++) {
      let aliveSignifier = '';
      if(aliveSquares.includes(i)) aliveSignifier = ' alive';
      const element = `<div class="square${aliveSignifier}" id=${i}></div>`;
      $main.append(element);
    }
  }

  function checkNeighbours(squareId) {
    const numberOfAliveNeighbours = aliveSquares.reduce((accumulator, currentSquareId) => {
      const difference = Math.abs(squareId - currentSquareId);
      if(neighbourDifferences.includes(difference)) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    },0);
    if(aliveSquares.includes(squareId)) {
      if(numberOfAliveNeighbours <= 3 && numberOfAliveNeighbours >= 2) {
        nextRoundAliveSquares.push(squareId);
      }
    } else if (numberOfAliveNeighbours === 3) {
      nextRoundAliveSquares.push(squareId);
    }
  }

  function identifySurroundingSquares(squareId) {
    const surroundingSquares = [];
    neighbourDifferences.forEach((difference) => {
      surroundingSquares.push(squareId + difference);
      surroundingSquares.push(squareId - difference);
    });
    return surroundingSquares;
  }

  setup();

  function runLife() {
    intervalId = setInterval(() => {
      const squaresToCheck = [];
      aliveSquares.forEach((square) => {
        $(`#${square}`).removeClass('alive');
        squaresToCheck.push(square);
        const surroundingSquares = identifySurroundingSquares(square);
        surroundingSquares.forEach((square) => {
          squaresToCheck.push(square);
        });
      });
      const uniqueSquaresToCheck = squaresToCheck.filter((element, index) => {
        return squaresToCheck.indexOf(element) === index;
      });
      uniqueSquaresToCheck.forEach((square) => {
        checkNeighbours(square);
      });
      aliveSquares = nextRoundAliveSquares;
      aliveSquares.forEach((square) => {
        $(`#${square}`).addClass('alive');
      });
      nextRoundAliveSquares = [];
      if(aliveSquares.length === 0) {
        clearInterval(intervalId);
        running = false;
        $startStopButton.text('Start');
      }
    },200);
  }

  $startStopButton.on('click', () => {
    if (running) {
      clearInterval(intervalId);
      $startStopButton.text('Start');
      running = false;
    } else {
      runLife();
      $startStopButton.text('Stop');
      running = true;
    }
  });

  $resetButton.on('click', () => {
    clearInterval(intervalId);
    $startStopButton.text('Start');
    running = false;
    aliveSquares.forEach((squareId) => {
      $(`#${squareId}`).removeClass('alive');
    });
    aliveSquares = [];
    nextRoundAliveSquares = [];
  });

  $main.on('click', '.square', (e) => {
    if (aliveSquares.includes(parseInt(e.target.id))) {
      aliveSquares.splice(aliveSquares.indexOf(parseInt(e.target.id)), 1);
      $(e.target).removeClass('alive');
    } else {
      aliveSquares.push(parseInt(e.target.id));
      $(e.target).addClass('alive');
    }
  });

});
