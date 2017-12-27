$(() => {

  const $main = $('main');
  const $button = $('button');
  const config = {
    numberOfColumns: 100,
    numberOfSquares: 1000
  };
  let aliveSquares = [124, 224, 324];
  let nextRoundAliveSquares = [];
  const neighbourDifferences = [1, config.numberOfColumns, config.numberOfColumns + 1, config.numberOfColumns - 1];
  let running = false;
  let intervalId = null;

  function setup() {
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
        $button.text('Start');
      }
    },200);
  }

  $button.on('click', () => {
    if (running) {
      clearInterval(intervalId);
      $button.text('Start');
      running = false;
    } else {
      runLife();
      $button.text('Stop');
      running = true;
    }
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
