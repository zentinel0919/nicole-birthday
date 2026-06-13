const world = document.getElementById('museum-world');
const backgroundPillars = document.getElementById('background-pillars');
const character = document.getElementById('character');
const paintings = document.querySelectorAll('.painting-zone');
const instruction = document.getElementById('instruction');

// UI Elements
const uiMessageBox = document.getElementById('ui-message-box');
const uiTitle = document.getElementById('ui-title');
const uiDesc = document.getElementById('ui-desc');

const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');

const bgMusic = document.getElementById('bg-music');
let musicStarted = false;

let worldPos = 0;
const speed = 7;
let isMovingLeft = false;
let isMovingRight = false;
let activePaintingId = null;

// Boundaries
const minPos = 0;
const maxPos = 6600; // Updated boundary

function startMusic() {
    if (!musicStarted) {
        musicStarted = true;
        // The volume is kept low to be chilling but not overpowering
        bgMusic.volume = 0.4; 
        bgMusic.play().catch(e => console.log("Audio play prevented by browser interaction policy"));
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
        startMusic(); // Start music on first movement
        character.classList.add('walking');
        world.style.transform = `translateX(${-worldPos}px)`;
        
        // Parallax effect for the background pillars
        backgroundPillars.style.backgroundPosition = `${-worldPos * 0.3}px 0, ${-worldPos * 0.3 - 10}px 0`;
        
        checkProximity();
        instruction.style.opacity = '0'; // Hide instruction once they move
    } else {
        character.classList.remove('walking');
    }

    requestAnimationFrame(updateMovement);
}

function checkProximity() {
    const charWorldPos = worldPos + (window.innerWidth / 2);
    let foundActive = false;
    
    paintings.forEach((painting, index) => {
        // Since we centered the painting zone with transform: translateX(-50%),
        // the left style is exactly the center of the painting
        const paintingCenter = parseInt(painting.style.left);
        
        // If character is within 300px of the painting center
        if (Math.abs(charWorldPos - paintingCenter) < 300) {
            if (!painting.classList.contains('active')) {
                painting.classList.add('active');
                
                // Update the fixed UI message box
                uiTitle.innerHTML = painting.getAttribute('data-title');
                uiDesc.innerHTML = painting.getAttribute('data-desc');
                uiMessageBox.classList.add('visible');
            }
            foundActive = true;
        } else {
            painting.classList.remove('active');
        }
    });

    if (!foundActive) {
        uiMessageBox.classList.remove('visible');
    }
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

// Also start music if they just tap the screen generally
window.addEventListener('click', startMusic, { once: true });
window.addEventListener('touchstart', startMusic, { once: true });

// Initial check
checkProximity();

// Start game loop
requestAnimationFrame(updateMovement);
