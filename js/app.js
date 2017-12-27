$(() => {

  const $button = $('button');
  const config = {
    numberOfColumns: 100,
    numberOfSquares: 1000,
    activeSquares: [124, 224, 324],
    nextRoundActiveSquares: []
  };
  const neighbourDifferences = [1, config.numberOfColumns, config.numberOfColumns + 1, config.numberOfColumns - 1];
  let running = false;
  let intervalId = null;

  function setup() {
    $('main').css('width', `${config.numberOfColumns * 12}`);
    for(let i = 0; i < config.numberOfSquares; i++) {
      let activeSignifier = '';
      if(config.activeSquares.includes(i)) activeSignifier = ' alive';
      const element = `<div class="square${activeSignifier}" id=${i}></div>`;
      $('main').append(element);
    }
  }

  function checkNeighbours(squareId) {
    const numberOfActiveNeighbours = config.activeSquares.reduce((accumulator, currentSquareId) => {
      const difference = Math.abs(squareId - currentSquareId);
      if(neighbourDifferences.includes(difference)) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    },0);
    if(config.activeSquares.includes(squareId)) {
      if(numberOfActiveNeighbours <= 3 && numberOfActiveNeighbours >= 2) {
        config.nextRoundActiveSquares.push(squareId);
      }
    } else if (numberOfActiveNeighbours === 3) {
      config.nextRoundActiveSquares.push(squareId);
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
      config.activeSquares.forEach((square) => {
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
      config.activeSquares = config.nextRoundActiveSquares;
      config.activeSquares.forEach((square) => {
        $(`#${square}`).addClass('alive');
      });
      config.nextRoundActiveSquares = [];
      if(config.activeSquares.length === 0) {
        clearInterval(intervalId);
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

});
