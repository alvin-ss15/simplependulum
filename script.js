let angle = 0;
let isAnimating = false;
let animationFrame;
const damping = 0.999; // Damping factor for gradual stopping
let angularVelocity = 0;
let angularAcceleration = 0;
const gravity = 9.81; // Gravitational constant (m/s^2)
const length = 200;   // Length of pendulum rod in pixels
const timeStep = 0.05; // Simulation time step

let startTime;
let elapsedTime = 0;

const pendulum = document.getElementById('pendulum');
const angleSlider = document.getElementById('angleSlider');
const angleValue = document.getElementById('angleValue');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const timeElapsedDisplay = document.getElementById('timeElapsed');

// Update angle when slider is moved
angleSlider.addEventListener('input', (e) => {
    angle = parseFloat(e.target.value);
    angleValue.textContent = angle;
    updatePendulumPosition();
});

// Set the initial angle visually
function updatePendulumPosition() {
    pendulum.style.transform = `rotate(${angle}deg)`;
}

// Start the pendulum animation
startButton.addEventListener('click', () => {
    if (!isAnimating) {
        isAnimating = true;
        angularVelocity = 0; // Reset velocity
        startTime = Date.now();
        animatePendulum();
    }
});

// Reset the pendulum to default position
resetButton.addEventListener('click', () => {
    isAnimating = false;
    cancelAnimationFrame(animationFrame);
    angle = 0;
    angularVelocity = 0;
    angleSlider.value = 0;
    angleValue.textContent = angle;
    timeElapsedDisplay.textContent = "0.0";
    elapsedTime = 0;
    updatePendulumPosition();
});

// Animation loop for pendulum motion
function animatePendulum() {
    if (!isAnimating) return;

    // Update elapsed time
    elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    timeElapsedDisplay.textContent = elapsedTime;

    // Physics: Calculate angular acceleration based on gravity, damping, and current angle
    const radians = angle * (Math.PI / 180); // Convert angle to radians
    angularAcceleration = (-gravity / length) * Math.sin(radians); // Angular acceleration
    angularVelocity += angularAcceleration * timeStep; // Update velocity
    angularVelocity *= damping; // Apply damping
    angle += angularVelocity * timeStep * (180 / Math.PI); // Update angle, convert to degrees

    // Update pendulum position visually
    updatePendulumPosition();

    // Stop the animation if the pendulum is nearly at rest near zero
    if (Math.abs(angularVelocity) < 0.001 && Math.abs(angle) < 0.5) {
        isAnimating = false;
    } else {
        animationFrame = requestAnimationFrame(animatePendulum);
    }
}
