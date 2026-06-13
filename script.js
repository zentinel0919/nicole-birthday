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
let targetPos = null; // For magnetic snap

// Boundaries
const minPos = 0;
const maxPos = 8000;

function startMusic() {
    if (!musicStarted) {
        musicStarted = true;
        bgMusic.volume = 0.5; 
        bgMusic.play().catch(e => {
            console.log("Audio play prevented", e);
            musicStarted = false;
        });
    }
}

function checkProximity() {
    const charWorldPos = worldPos + (window.innerWidth / 2);
    let nearestDist = Infinity;
    let nearestCenter = null;
    
    paintings.forEach((painting) => {
        const paintingCenter = parseInt(painting.style.left);
        const dist = Math.abs(charWorldPos - paintingCenter);
        
        if (dist < 300) {
            painting.classList.add('active');
        } else {
            painting.classList.remove('active');
        }
        
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestCenter = paintingCenter;
        }
    });
    
    return { nearestDist, nearestCenter };
}

function handleStop() {
    if (!isMovingLeft && !isMovingRight) {
        const { nearestDist, nearestCenter } = checkProximity();
        // If within 250px of center, magnetically snap to the exact center!
        if (nearestDist < 250) {
            targetPos = nearestCenter - (window.innerWidth / 2);
        }
    }
}

function updateMovement() {
    let moved = false;
    let manualMove = isMovingLeft || isMovingRight;

    if (manualMove) {
        targetPos = null; // Cancel snap if user starts moving manually
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
    } else if (targetPos !== null) {
        // Auto-snap to center
        const diff = targetPos - worldPos;
        if (Math.abs(diff) > speed) {
            worldPos += Math.sign(diff) * speed;
            moved = true;
            if (diff < 0) character.classList.add('facing-left');
            else character.classList.remove('facing-left');
        } else {
            worldPos = targetPos;
            targetPos = null;
            // Force face right when snapped
            character.classList.remove('facing-left'); 
        }
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

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') isMovingLeft = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') isMovingRight = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') isMovingLeft = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') isMovingRight = false;
    handleStop();
});

touchLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMovingLeft = true;
    startMusic();
});
touchLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    isMovingLeft = false;
    handleStop();
});

touchRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMovingRight = true;
    startMusic();
});
touchRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    isMovingRight = false;
    handleStop();
});

window.addEventListener('click', startMusic, { once: true });
window.addEventListener('touchstart', startMusic, { once: true });

checkProximity();
requestAnimationFrame(updateMovement);
