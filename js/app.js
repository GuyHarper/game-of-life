$(() => {

  const $main = $('main');
  const $startStopButton = $('button.start');
  const $clearButton = $('button.clear');
  const config = {
    squareSize: 10
  };
  let aliveSquares = [];
  let nextRoundAliveSquares = [];
  let neighbourDifferences = [];
  let running = false;
  let intervalId = null;

  function drawTitle() {
    const gCoordinates = [{x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 1,y: 2},{x: 1,y: 3},{x: 1,y: 4},{x: 3,y: 4},{x: 1,y: 5},{x: 2,y: 5},{x: 3,y: 5}];
    const aCoordinates = [{x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 1,y: 2},{x: 3,y: 2},{x: 1,y: 3},{x: 2,y: 3},{x: 3,y: 3},{x: 1,y: 4},{x: 3,y: 4},{x: 1,y: 5},{x: 3,y: 5}];
    const mCoordinates = [{x: 1,y: 1},{x: 3,y: 1},{x: 1,y: 2},{x: 2,y: 2},{x: 3,y: 2},{x: 1,y: 3},{x: 2,y: 3},{x: 3,y: 3},{x: 1,y: 4},{x: 3,y: 4},{x: 1,y: 5},{x: 3,y: 5}];
    const eCoordinates = [{x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 1,y: 2},{x: 1,y: 3},{x: 2,y: 3},{x: 1,y: 4},{x: 1,y: 5},{x: 2,y: 5},{x: 3,y: 5}];
    const oCoordinates = [{x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 1,y: 2},{x: 3,y: 2},{x: 1,y: 3},{x: 3,y: 3},{x: 1,y: 4},{x: 3,y: 4},{x: 1,y: 5},{x: 2,y: 5},{x: 3,y: 5}];
    const fCoordinates = [{x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 1,y: 2},{x: 1,y: 3},{x: 2,y: 3},{x: 1,y: 4},{x: 1,y: 5}];
    const lCoordinates = [{x: 1,y: 1},{x: 1,y: 2},{x: 1,y: 3},{x: 1,y: 4},{x: 1,y: 5},{x: 2,y: 5},{x: 3,y: 5}];
    const iCoordinates = [{x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 2,y: 2},{x: 2,y: 3},{x: 2,y: 4},{x: 1,y: 5},{x: 2,y: 5},{x: 3,y: 5}];
    const titleArray = [[gCoordinates,aCoordinates,mCoordinates,eCoordinates],[oCoordinates,fCoordinates],[lCoordinates,iCoordinates,fCoordinates,eCoordinates]];
    const centreX = Math.floor(config.numberOfColumns / 2);
    const centreY = Math.floor(config.numberOfRows / 2);
    let wordStartingPosition = 0;
    titleArray.forEach((wordArray, wordIndex) => {
      if(wordIndex > 0) wordStartingPosition += (titleArray[wordIndex - 1]).length * 4 + 2;
      wordArray.forEach((letterCoordinates, letterIndex) => {
        letterCoordinates.forEach((coordinatePair) => {
          aliveSquares.push(config.numberOfColumns * (centreY - 6 + coordinatePair['y']) + (centreX - 21 + ((coordinatePair['x'] + 4 * letterIndex) + wordStartingPosition)));
        });
      });
    });
  }

  function setup() {
    config.numberOfColumns = Math.floor(window.innerWidth / (config.squareSize + 2)) + 2;
    config.numberOfRows = Math.floor(0.9 * window.innerHeight / (config.squareSize + 2)) + 2;
    config.numberOfSquares = config.numberOfColumns * config.numberOfRows;
    neighbourDifferences = [1, config.numberOfColumns, config.numberOfColumns + 1, config.numberOfColumns - 1];
    drawTitle();
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
    },150);
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

  $clearButton.on('click', () => {
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
    console.log(e.target.id);
    if (aliveSquares.includes(parseInt(e.target.id))) {
      aliveSquares.splice(aliveSquares.indexOf(parseInt(e.target.id)), 1);
      $(e.target).removeClass('alive');
    } else {
      aliveSquares.push(parseInt(e.target.id));
      $(e.target).addClass('alive');
    }
  });

});
