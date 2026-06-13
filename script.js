const world = document.getElementById('museum-world');
const backgroundPillars = document.getElementById('background-pillars');
const character = document.getElementById('character');
const paintings = document.querySelectorAll('.painting-zone');
const instruction = document.getElementById('instruction');

const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');

const bgMusic = document.getElementById('bg-music');
let musicStarted = false;

let worldPos = 0;
const speed = 7;
let isMovingLeft = false;
let isMovingRight = false;

// Boundaries
const minPos = 0;
const maxPos = 7000;

function startMusic() {
    if (!musicStarted) {
        musicStarted = true;
        bgMusic.volume = 0.5; 
        bgMusic.play().catch(e => console.log("Audio play prevented", e));
    }
}

function updateMovement() {
    let moved = false;

    if (isMovingLeft && worldPos > minPos) {
        worldPos -= speed;
        moved = true;
        character.classList.add('facing-left');
    }
    if (isMovingRight && worldPos < maxPos) {
        worldPos += speed;
        moved = true;
        character.classList.remove('facing-left');
    }

    if (moved) {
        startMusic();
        character.classList.add('walking');
        world.style.transform = `translateX(${-worldPos}px)`;
        
        backgroundPillars.style.backgroundPosition = `${-worldPos * 0.3}px 0, ${-worldPos * 0.3 - 10}px 0`;
        
        checkProximity();
        instruction.style.opacity = '0';
    } else {
        character.classList.remove('walking');
    }

    requestAnimationFrame(updateMovement);
}

function checkProximity() {
    const charWorldPos = worldPos + (window.innerWidth / 2);
    
    paintings.forEach((painting) => {
        const paintingCenter = parseInt(painting.style.left);
        if (Math.abs(charWorldPos - paintingCenter) < 300) {
            painting.classList.add('active');
        } else {
            painting.classList.remove('active');
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') isMovingLeft = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') isMovingRight = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') isMovingLeft = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') isMovingRight = false;
});

touchLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMovingLeft = true;
});
touchLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    isMovingLeft = false;
});

touchRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMovingRight = true;
});
touchRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    isMovingRight = false;
});

window.addEventListener('click', startMusic, { once: true });
window.addEventListener('touchstart', startMusic, { once: true });

checkProximity();
requestAnimationFrame(updateMovement);
