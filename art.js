// art.js
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
  initCanvas();
  drawShapes();
});

initCanvas();
drawShapes();

function drawShapes() {
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];
  
  // Draw 20 random shapes
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 80 + 20;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shapeType = Math.floor(Math.random() * 3); // 0 = circle, 1 = square, 2 = triangle

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if (shapeType === 0) {
      // Draw Circle
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shapeType === 1) {
      // Draw Square
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else {
      // Draw Triangle
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
}
