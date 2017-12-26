$(() => {

  const config = {
    numberOfColumns: 10,
    numberOfSquares: 100,
    activeSquares: [28, 37, 39]
  };
  const neighbourDifferences = [1, config.numberOfColumns, config.numberOfColumns + 1, config.numberOfColumns - 1];

  function setup() {
    for(let i = 0; i < config.numberOfSquares; i++) {
      let activeSignifier = '';
      if(config.activeSquares.includes(i)) activeSignifier = ' active';
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
      if(numberOfActiveNeighbours > 3 || numberOfActiveNeighbours < 2) {
        config.activeSquares.splice(config.activeSquares.indexOf(squareId), 1);
      }
    } else if (numberOfActiveNeighbours === 3) {
      config.activeSquares.push(squareId);
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
  setInterval(() => {
    const squaresToCheck = [];
    config.activeSquares.forEach((square) => {
      squaresToCheck.push(square);
      const surroundingSquares = identifySurroundingSquares(square);
      surroundingSquares.forEach((square) => {
        squaresToCheck.push(square);
      });
    });
    const uniques = squaresToCheck.filter((element, index) => {
      return squaresToCheck.indexOf(element) === index;
    });
    console.log(uniques);
  },1000);

});
