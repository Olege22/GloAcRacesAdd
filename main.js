const score = document.querySelector('.score'),
    bestScore = document.querySelector('.bestScore'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
car.classList.add('car');
bestScore.classList.add('score');
bestScore.style.left = '70%';
bestScore.style.top = '150px';

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

let previousBtn = '';
let previousScore = 0;

    for (i = 0; i < 3; i++){
        const speedBtn = document.createElement('div');
        speedBtn.classList.add('btn');
        speedBtn.style.top = 180 + (i + 1) * 50 + 'px';
        speedBtn.id = 'btn' + i;
        speedBtn.addEventListener('click', speedChoose);
        document.querySelector('.game').appendChild(speedBtn);
    }

function speedChoose(item){
    if (previousBtn !== '') {
        document.querySelector('#'+ previousBtn).style.background = 'green';
    }
    item.srcElement.style.background = 'red';
    previousBtn = item.srcElement.id
    switch(item.srcElement.id){
        case 'btn0':
        setting.speed = 1;
        break;
        case 'btn1':
        setting.speed = 3;
        break;
        case 'btn2':
        setting.speed = 5;
        break;

    }
}

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight 
        / heightElement;
}

function startGame(){
    start.classList.add('hide');
    gameArea.innerHTML='';
    for(let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add ('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        rnd = Math.random();
        enemy.style.left = Math.floor(rnd * (gameArea.offsetWidth-50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemyNumber = Math.round(Math.random() + 1);
        enemy.style.background = 'transparent url(./image/enemy' + enemyNumber + '.png) center / cover no-repeat';
        gameArea.appendChild(enemy);
    }


    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = (gameArea.offsetWidth - car.offsetWidth) / 2;//'125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
};

function playGame(){
    if (setting.start){
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        //score.z-index = 300;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < 
            (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }
        if(keys.ArrowDown && setting.y < 
            (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }
        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
};

function startRun (event){
    event.preventDefault();
    keys[event.key] = true;
    //document.removeEventListener('keydown', startRun);
};

function stopRun (event){
    event.preventDefault();
    keys[event.key] = false;
    //document.addEventListener('keydown', startRun);
};

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line, i){
        line.y += setting.speed
        line.style.top = line.y + 'px';
        if(line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
                setting.start = false;
                start.textContent = 'ДТП. Чтобы начать игру кликни сюда!';
                if (setting.score > previousScore) {
                    previousScore = setting.score;
                    bestScore.innerHTML = 'Best score:<br>' + previousScore;
                }

                start.classList.remove('hide');
                score.style.top = start.offsetHeight;
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            rnd = Math.random();
            item.style.left = Math.floor(rnd * (gameArea.offsetWidth-50)) + 'px';
           }
    });
}