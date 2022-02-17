const grid = document.querySelector('.grid')
let currentRocketIndex = 202
let width = 15
let direction = 1
let junkId
let goingRight = true
let aliensRemoved = []

const HIT = new Audio();
HIT.src = "sounds/hit.mp3";


for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienJunk = [

  0,2,4,6,8,
  16,18,19,20,22,
  31,32,33,35,36,37,
  45,46,48,49,50,52,53
]

function draw() {
  for (let i = 0; i < alienJunk.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienJunk[i]].classList.add('junk')
    }
  }
}

draw()

function remove() {
  for (let i = 0; i < alienJunk.length; i++) {
    squares[alienJunk[i]].classList.remove('junk')
  }
}

squares[currentRocketIndex].classList.add('rocket')


function moveRocket(e) {
  squares[currentRocketIndex].classList.remove('rocket')
  switch(e.key) {
    case 'ArrowLeft':
      if (currentRocketIndex % width !== 0) currentRocketIndex -=1
      break
    case 'ArrowRight' :
      if (currentRocketIndex % width < width -1) currentRocketIndex +=1
      break
  }
  squares[currentRocketIndex].classList.add('rocket')
}
document.addEventListener('keydown', moveRocket)

function moveJunk() {
  const leftEdge = alienJunk[0] % width === 0
  const rightEdge = alienJunk[alienJunk.length - 1] % width === width -1
  remove()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienJunk.length; i++) {
      alienJunk[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienJunk.length; i++) {
      alienJunk[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienJunk.length; i++) {
    alienJunk[i] += direction
  }

  draw()

  if (squares[currentRocketIndex].classList.contains('junk', 'rocket')) {
    showYouLose();
    clearInterval(junkId)
  }

  for (let i = 0; i < alienJunk.length; i++) {
    if(alienJunk[i] > (220)) {
      showYouLose();
      clearInterval(junkId)
    }
  }
  if (aliensRemoved.length === alienJunk.length) {
    showYouWin();
    clearInterval(junkId)
  }
}
junkId = setInterval(moveJunk, 150)

function shoot(e) {
  let laserId
  let currentLaserIndex = currentRocketIndex
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('junk')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('junk')
      squares[currentLaserIndex].classList.add('boom')

      HIT.play();

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      const alienRemoved = alienJunk.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)

      console.log(aliensRemoved)
    }
  }
  switch(e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100)
  }
}

document.addEventListener('keydown', shoot)

const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

restart.addEventListener("click", function(){
    location.reload(); 
})

function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}
