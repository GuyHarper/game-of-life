$(() => {

  const config = {
    numberOfColumns: 10,
    numberOfSquares: 100,
    activeSquares: [28, 37, 39]
  };

  for(let i = 0; i < config.numberOfSquares; i++) {
    let activeSignifier = '';
    if(config.activeSquares.includes(i)) activeSignifier = ' active';
    const element = `<div class="square${activeSignifier}" id=${i}></div>`;
    $('main').append(element);
  }

  const squares = $('div.square');
  const neighbourDifferences = [1, config.numberOfColumns, config.numberOfColumns + 1, config.numberOfColumns - 1];
  console.log(neighbourDifferences);

  function checkNeighbours(squareId) {
    const numberOfActiveNeighbours = config.activeSquares.reduce((accumulator, currentSquareId) => {
      const difference = Math.abs(squareId - currentSquareId);
      console.log('currentSquareId', currentSquareId);
      console.log('difference', difference);
      if(neighbourDifferences.includes(difference)) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    },0);
    console.log(numberOfActiveNeighbours);
    if(config.activeSquares.includes(squareId)) {
      if(numberOfActiveNeighbours > 3 || numberOfActiveNeighbours < 2) {
        config.activeSquares.splice(config.activeSquares.indexOf(squareId), 1);
      }
    } else if (numberOfActiveNeighbours === 3) {
      config.activeSquares.push(squareId);
    }
    console.log(config.activeSquares);
  }

});
