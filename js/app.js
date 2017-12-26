$(() => {

  const config = {
    numberOfSquares: 100
  };

  for(let i = 0; i < config.numberOfSquares; i++) {
    $('main').append(`<div class="square" id=${i}></div>`);
  }

});
