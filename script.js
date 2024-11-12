// HTML Elements
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
const pendulum = document.getElementById('pendulum');
const angleSlider = document.getElementById('angleSlider');
const dampingSlider = document.getElementById('dampingSlider');
const angleValue = document.getElementById('angleValue');
const dampingValue = document.getElementById('dampingValue');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const timeElapsed = document.getElementById('timeElapsed');

// Variables
let angle = 0;
let angularVelocity = 0;
let angularAcceleration = 0;
let isRunning = false;
let startTime = null;
let stopCountingTime = false;
const trail = [];

// Pendulum constants
const gravity = 9.81; // Realistic gravity
const rodLength = 200; // Pixels
let damping = parseFloat(dampingSlider.value); // Adjustable damping coefficient
const maxTrailLength = 75; // Maximum trail length
const dt = 0.25; // Smaller time step for slower, realistic motion (approx 60 FPS)
const equilibriumThreshold = 0.01; // Threshold for angle and angular velocity to stop timer

// Set initial angle from slider
angleSlider.addEventListener('input', () => {
    angle = (angleSlider.value * Math.PI) / 180; // Convert to radians
    angleValue.textContent = angleSlider.value;
    updatePendulumPosition();
});

// Update damping value display
dampingSlider.addEventListener('input', () => {
    damping = parseFloat(dampingSlider.value);
    dampingValue.textContent = dampingSlider.value;
});

// Start animation
startButton.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now();
        stopCountingTime = false; // Reset stop condition
        animate();
    }
});

// Reset animation
resetButton.addEventListener('click', () => {
    isRunning = false;
    angle = 0;
    angularVelocity = 0;
    trail.length = 100; // Clear trail

    // Reset slider and display
    angleSlider.value = 0;
    angleValue.textContent = 0;
    dampingSlider.value = 0.05;
    dampingValue.textContent = 0.05;

    stopCountingTime = false; // Reset time stopping condition
    updatePendulumPosition();
    timeElapsed.textContent = '0.0';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear trail canvas
});

// Update pendulum physics and check for equilibrium condition
function updatePendulumPhysics() {
    // Passivity-based control: Apply damping torque proportional to the angular velocity
    angularAcceleration = (-gravity / rodLength) * Math.sin(angle) - damping * angularVelocity;
    angularVelocity += angularAcceleration * dt;
    angle += angularVelocity * dt;

    // Stop counting time if both angle and angular velocity are near zero
    if (Math.abs(angle) < equilibriumThreshold && Math.abs(angularVelocity) < equilibriumThreshold) {
        stopCountingTime = true;
    }
    
}

// Update pendulum position and draw trail
function updatePendulumPosition() {
    const angleInDegrees = angle * (180 / Math.PI);
    pendulum.style.transform = `rotate(${angleInDegrees}deg)`;

    const centerX = canvas.width / 2;
    const centerY = 0;
    const bobX = centerX + rodLength * Math.sin(angle);
    const bobY = centerY + rodLength * Math.cos(angle);

    trail.push({ x: bobX, y: bobY, opacity: 1.0 });

    if (trail.length > maxTrailLength) trail.shift();
}

// Draw fading trail
function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 71, 255, ${point.opacity})`;
        ctx.fill();
        point.opacity -= 0.05;
        if (point.opacity < 0) point.opacity = 0;
    });
}

// Animation loop
function animate() {
    if (isRunning) {
        updatePendulumPhysics();
        updatePendulumPosition();
        drawTrail();

        // Update time display only if the energy is not sufficiently low
        if (!stopCountingTime) {
            const elapsed = (Date.now() - startTime) / 1000;
            timeElapsed.textContent = elapsed.toFixed(1);
        }
        
        requestAnimationFrame(animate);
    }
}

// Initialize bob position
updatePendulumPosition();
