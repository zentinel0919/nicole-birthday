const world = document.getElementById('museum-world');
const character = document.getElementById('character');
const paintings = document.querySelectorAll('.painting-zone');
const instruction = document.getElementById('instruction');

const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');

let worldPos = 0;
const speed = 6;
let isMovingLeft = false;
let isMovingRight = false;

// Boundaries
const minPos = 0;
const maxPos = 5800; // Matches world width minus some buffer

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
        character.classList.add('walking');
        world.style.transform = `translateX(${-worldPos}px)`;
        checkProximity();
        instruction.style.opacity = '0'; // Hide instruction once they move
    } else {
        character.classList.remove('walking');
    }

    requestAnimationFrame(updateMovement);
}

function checkProximity() {
    // The character is fixed at center screen (window.innerWidth / 2)
    // The world moves around it.
    const charWorldPos = worldPos + (window.innerWidth / 2);
    
    paintings.forEach(painting => {
        // Get the absolute left position defined in inline style
        const paintingLeft = parseInt(painting.style.left);
        const paintingCenter = paintingLeft + 150; // 300px width / 2
        
        // If character is within 300px of the painting center
        if (Math.abs(charWorldPos - paintingCenter) < 250) {
            painting.classList.add('active');
        } else {
            painting.classList.remove('active');
        }
    });
}

// Keyboard controls (Desktop)
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') isMovingLeft = true;
    if (e.key === 'ArrowRight' || e.key === 'd') isMovingRight = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') isMovingLeft = false;
    if (e.key === 'ArrowRight' || e.key === 'd') isMovingRight = false;
});

// Touch controls (Mobile)
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

// Initial check to light up first painting if needed
checkProximity();

// Start game loop
requestAnimationFrame(updateMovement);
