$(() => {

  const config = {
    numberOfSquares: 100,
    activeSquares: [37,39]
  };

  for(let i = 0; i < config.numberOfSquares; i++) {
    let activeSignifier = '';
    if(config.activeSquares.includes(i)) activeSignifier = ' active';
    const element = `<div class="square${activeSignifier}" id=${i}></div>`;
    $('main').append(element);
  }

  const squares = $('div.square');


});
