window.onload = function(){
  //sprites
  const sprites = new Image();
  sprites.src = "midia/sprite-sheet.png";
  const sprites2 = new Image();
  sprites2.src = "midia/sprite-sheet2.png";

  var myFont = new FontFace('myFont', 'url(midia/8-BIT.woff)');

  myFont.load().then(function(font){

    document.fonts.add(font);
    console.log('Font loaded');

  });

  //canvas
  const canvas = document.getElementById("Snake");
  const ctx = canvas.getContext("2d");
  let borda = document.getElementById("container");

  let scoreElemente = document.getElementById("score");
  let score = 0;
  let contador;

  let box; // tamanho dos quadrados
  const boxes = 16; // quantidade de quadrados

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const screenHalfWidth = screenWidth / 2;
  const screenHalfdHeight = screenHeight / 2;

  //compatibilidade com telas menores
  if (screenWidth < 512){
    canvas.width = Math.floor(screenWidth - 10);
    canvas.height = Math.floor(screenHeight - 10);
    box = Math.floor((screenWidth - 10) / 16);
  }else{
    canvas.width = 512;
    canvas.height = 512;
    box = 32
  }


  const snake = {
    x: 1,
    y: 8,
    direction: {
      x:1,
      y:0,
    }
  }

  //spawn dos ratos
  const food = {
    x: Math.floor(Math.random() * 15 + 1),
    y: Math.floor(Math.random() * 15 + 1),
  }

   //spawn veneno
  
   const poison = {
    x: 0,
    y: -1,
       }
       

  const trail = [];
  let tail = 2;

  const interval = setInterval(game, 1000/10); //iniciar o jogo

  function game(){
    tick();
    render();
    loop();
  }

  let haveMovementBuffer = false

  // controles touch screen
  document.addEventListener("touchstart", handleTouchPad)
  function handleTouchPad(event){

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    if(!haveMovementBuffer){

      if(snake.direction.x !== 0){
          if(touchY < screenHalfdHeight && snake.direction.y !== 1){
          snake.direction = { x: 0, y: -1};
          haveMovementBuffer = true
          }
          else if (touchY > screenHalfdHeight && snake.direction.y !== -1){
          snake.direction = { x: 0, y: 1};
          haveMovementBuffer = true;
          }
      }
      else if (snake.direction.y !== 0){
          if(touchX < screenHalfWidth && snake.direction.x !== 1){
            snake.direction = { x: -1, y: 0}
          }
          else if (touchX > screenHalfWidth && snake.direction.x !== -1){
            snake.direction = {x: 1, y: 0};
            haveMovementBuffer = true;
          }
      }
    }
  }

  //controles teclado
  document.addEventListener("keydown", moveSnake);
  function moveSnake(e){

    if(!haveMovementBuffer){

              // SETAS
              if(e.keyCode === 39 && snake.direction.x !== -1 ){ 
                snake.direction = { x: 1, y: 0};
                haveMovementBuffer = true;
              }
              else if(e.keyCode === 40 && snake.direction.y !== -1) {
                snake.direction = { x: 0, y: 1};
                haveMovementBuffer = true;
              }
              else if(e.keyCode === 37 && snake.direction.x !== 1) {
                snake.direction = { x: -1, y: 0};
                haveMovementBuffer = true;
              }
              else if(e.keyCode === 38 && snake.direction.y !== 1) {
                snake.direction = { x: 0, y: -1};
                haveMovementBuffer = true;
              }
              // W A S D
               else if(e.keyCode === 68 && snake.direction.x !== -1 ){ 
                snake.direction = { x: 1, y: 0};
                haveMovementBuffer = true;
              }
              else if(e.keyCode === 83 && snake.direction.y !== -1){
                snake.direction = { x: 0, y:1};
                haveMovementBuffer = true;
              }
              else if(e.keyCode === 65 && snake.direction.x !== 1){
                snake.direction = {x: -1, y: 0}
                haveMovementBuffer = true;
              }
              else if(e.keyCode === 87 && snake.direction.y !== 1){
                snake.direction = { x: 0, y: -1};
                haveMovementBuffer = true;
              }
    }

  }

  //logistica
  function tick(){

    //movimento da cauda
    trail.push({
      x: snake.x,
      y: snake.y,
      anchor: snake.direction
    });

    //movimento da cabeça
    snake.x += snake.direction.x;
    snake.y += snake.direction.y;


    if(score<25){
    //teleporte limites do mapa
    if(snake.x < 0) snake.x = boxes - 1;
    else if(snake.x > boxes - 1 ) snake.x = 0;
    else if(snake.y < 0 ) snake.y = boxes - 1;
    else if(snake.y > boxes - 1 ) snake.y = 0;
    }else{
    //muda cor da borda

    canvas.style.cssText = "border-color: red;";
    //colisão na borda
     if(snake.x < 0 || snake.x > boxes - 1 || snake.y < 0 || snake.y > boxes - 1){
       
      gameOver();
      ctx.fillStyle = "#00000065"
    ctx.fillRect(0,0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    ctx.font = "30px myFont";
    const gameOverText = "Game Over",
          gameOverTextWidth = ctx.measureText(gameOverText).width;

    ctx.fillText(gameOverText, canvas.width/2 - gameOverTextWidth/2, canvas.height/2 - 15);

    ctx.font = "15px myFont";
    const pressButtonText = "Aperte qualquer botão para continuar",
          pressButtonTextWidth = ctx.measureText(pressButtonText).width;

    ctx.fillText(pressButtonText, canvas.width/2 - pressButtonTextWidth/2, canvas.height/2 + 40);

    setTimeout(reload,1000);w
     }
    }
  }
  
  //renderizar graficos
  function render(){

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    //fundo
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ratos
    ctx.drawImage(
      sprites,
      0, 192,
      64, 64,
      food.x * box, food.y * box,
      box,box
    );

    //veneno
    ctx.drawImage(
      sprites2,
      0, 192,
      64, 64,
      poison.x * box, poison.y * box,
      box,box
    );

    //cabeça cobra
    drawHead();

    //corpo cobra
    if(trail.length)
    drawBody();

    //cauda cobra
    ctx.fillStyle = "#888";
    if(trail.length)
    drawTail();

    haveMovementBuffer = false;
  }

  //game loop
  function loop(){

    //colisão do corpo
      for (i=0; i < trail.length; i++){
        if(trail[i].x === snake.x && trail[i].y === snake.y){
          snake.direction ={
            x:0,
            y:0,
          }
          gameOver();
        }
      }

      //spawn veneno
    if (score == 15) contador = 0;
    if(contador == 0 && snake.x === food.x && snake.y === food.y && score>=1){
      contador += 1;
      let randomX2;
      let randomY2;

        let isCLearForDrawPoison;
        do{
          isCLearForDrawPoison = true;
          randomX2 = Math.floor(Math.random() * 15 + 1);
          randomY2 = Math.floor(Math.random() * 15 + 1);
          for(i=0; i < trail.length; i++){
            
            if(randomX2 === trail[i].x && randomY2 === trail[i].y){
              isCLearForDrawPoison = false;
            }
            else if (randomX2 === snake.x && randomY2 === snake.y){
              isCLearForDrawPoison = false;
            }
          }
        }while(!isCLearForDrawPoison);

        poison.x = randomX2;
        poison.y = randomY2;
        
    }else if (0 < contador < 100){
      contador++
      if(contador == 50){
        poison.x = 0;
        poison.y = -1;
      }
      if (contador == 100){
        contador = 0;
      let randomX2;
      let randomY2;

        let isCLearForDrawPoison;
        do{
          isCLearForDrawPoison = true;
          randomX2 = Math.floor(Math.random() * 15 + 1);
          randomY2 = Math.floor(Math.random() * 15 + 1);
          for(i=0; i < trail.length; i++){
            
            if(randomX2 === trail[i].x && randomY2 === trail[i].y){
              isCLearForDrawPoison = false;
            }
            else if (randomX2 === snake.x && randomY2 === snake.y){
              isCLearForDrawPoison = false;
            }
          }
        }while(!isCLearForDrawPoison);

        poison.x = randomX2;
        poison.y = randomY2;
      }
    }
    console.log(contador);
    //comer veneno
      if(snake.x === poison.x && snake.y === poison.y){
        gameOver();
      }

    //comer ratos
    if(snake.x === food.x && snake.y === food.y){
      let randomX;
      let randomY;

      let isCLearForDrawFood;
      do{
        isCLearForDrawFood = true;
        randomX = Math.floor(Math.random() * 15 + 1);
        randomY = Math.floor(Math.random() * 15 + 1);
        for(i=0; i < trail.length; i++){
          
          if(randomX === trail[i].x && randomY === trail[i].y){
            isCLearForDrawFood = false;
          }
          else if (randomX === snake.x && randomY === snake.y){
            isCLearForDrawFood = false;
          }
        }
      }while(!isCLearForDrawFood);

      food.x = randomX;
      food.y = randomY;
      tail++;
      score += 1
      scoreElemente.innerText =" " + score.toLocaleString('pt-Br', {minimumIntegerDigits: 4, useGrouping:false});
      
    }

    
    

    while(trail.length > tail){
      trail.shift();
    }

  }

  //cabeça
  function drawHead(){
    let spritePath = {
      x:256,
      y:0
    }
    const {x, y} = snake.direction;

    if( x === 1) spritePath = { x:256,y:0}
    else if( x === -1) spritePath = { x:192,y:64}
    else if( y === 1) spritePath = { x:256,y:64}
    else if( y === -1) spritePath = { x:192,y:0}

    ctx.drawImage(
      sprites,
      spritePath.x, spritePath.y,
      64, 64,
      snake.x * box, snake.y * box,
      box, box
    );
  }

  //rabo
  function drawTail(){
    let spritePath = {
      x:0,
      y:128,
    }   

    const {x,y} = trail[0].anchor

    if( x > 0) spritePath = { x:256,y:128 } 
    else if( x < 0) spritePath = { x:192,y:192 }
    else if( y > 0) spritePath = { x:256,y:192 }
    else if( y < 0) spritePath = { x:192,y:128 }

    ctx.drawImage(
      sprites,
      spritePath.x, spritePath.y,
      64, 64,
      trail[0].x * box, trail[0].y * box,
      box,box
    );
  }

  //corpo
  function drawBody(){
    let spritePath = {
      x:0,
      y:128,
    } 

    for(i=1; i < trail.length ;i++) {
      let  haveRight = haveLeft = haveUp = haveDown = false; //the adjacent positions

      const { x , y } = trail[i].anchor
      let {x:beforeX, y:beforeY} = trail[i-1].anchor 

      //inverte valores
      beforeX *= -1;
      beforeY *= -1;

      //next snake node direction
      if(x > 0) haveRight = true;
      else if(x < 0) haveLeft = true;
      else if(y < 0) haveUp = true;
      else if(y > 0) haveDown = true;
      
      //prev snake node direction
      if(beforeX < 0) haveLeft = true;
      else if(beforeX > 0 ) haveRight = true;
      else if(beforeY < 0) haveUp = true;
      else if(beforeY  > 0) haveDown = true;  

      //set sprite path
      if( haveLeft && haveRight) spritePath = { x:64,y:0 }; 
      else if( haveUp && haveDown) spritePath = { x:128,y:64 }; 
      else if( haveLeft && haveDown) spritePath = { x:128,y:0 };
      else if( haveLeft && haveUp) spritePath = { x:128,y:128 }; 
      else if( haveRight && haveDown) spritePath = { x:0,y:0 }; 
      else if( haveRight && haveUp) spritePath = { x:0,y:64 };       
      
      ctx.drawImage(
        sprites,
        spritePath.x, spritePath.y,
        64, 64,
        trail[i].x * box, trail[i].y * box,
        box,box
      );
    } 
  }

  function gameOver(){
    ctx.fillStyle = "#00000065"
    ctx.fillRect(0,0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    ctx.font = "30px myFont";
    const gameOverText = "Game Over",
          gameOverTextWidth = ctx.measureText(gameOverText).width;

    ctx.fillText(gameOverText, canvas.width/2 - gameOverTextWidth/2, canvas.height/2 - 15);

    ctx.font = "15px myFont"
    const pressButtonText = "Aperte qualquer tecla para continuar",
          pressButtonTextWidth = ctx.measureText(pressButtonText).width;

    ctx.fillText(pressButtonText, canvas.width/2 - pressButtonTextWidth/2, canvas.height/2 + 40);

    setTimeout(reload,1000);
    
    clearInterval(interval);
    snake.direction={
      x:0,
      y:0
    }

    function reload(){
      document.addEventListener("keydown",()=>location.reload())
      document.addEventListener("touchstart",()=>location.reload())
    }

    document.removeEventListener("keydown", moveSnake);

    
  }

}
