const canvas = document.getElementById('gameCanvas');  
const ctx = canvas.getContext('2d');  
  
canvas.width = 1000;  
canvas.height = 800;  
  
const balls = [];  
  
// 控制圆的属性  
let controlCircle = {  
    x: canvas.width / 2,  
    y: canvas.height / 2,  
    radius: 100,  
    color: 'black',  
    dx: 0, // 横向移动速度  
    dy: 0  // 纵向移动速度  
};  
  
// 键盘事件监听器  
document.addEventListener('keydown', (e) => {  
    if (e.key === 'ArrowUp') {  
        controlCircle.dy = -5;  
    } else if (e.key === 'ArrowDown') {  
        controlCircle.dy = 5;  
    } else if (e.key === 'ArrowLeft') {  
        controlCircle.dx = -5;  
    } else if (e.key === 'ArrowRight') {  
        controlCircle.dx = 5;  
    }  
});  
  
document.addEventListener('keyup', (e) => {  
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {  
        controlCircle.dy = 0;  
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {  
        controlCircle.dx = 0;  
    }  
});  
  
function Ball(x, y, radius, color, dx, dy) {  
    this.x = x;  
    this.y = y;  
    this.radius = radius;  
    this.color = color;  
    this.dx = dx;  
    this.dy = dy;  
  
    this.draw = function() {  
        ctx.beginPath();  
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);  
        ctx.fillStyle = this.color;  
        ctx.fill();  
        ctx.closePath();  
    };  
  
    this.update = function() {  
        if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {  
            this.dx = -this.dx;  
        }  
        if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {  
            this.dy = -this.dy;  
        }  
  
        // 检查与控制圆的碰撞  
        if (collision(this, controlCircle)) {  
            // 从balls数组中移除当前小球  
            let index = balls.indexOf(this);  
            if (index > -1) {  
                balls.splice(index, 1);  
            }  
        }  
  
        // 简单的碰撞检测（处理其他小球的碰撞）  
        for (let other of balls) {  
            if (this !== other &&  
                Math.abs(this.x - other.x) < this.radius + other.radius &&  
                Math.abs(this.y - other.y) < this.radius + other.radius) {  
                this.color = getRandomColor();  
                other.color = getRandomColor();  
            }  
        }  
  
        this.x += this.dx;  
        this.y += this.dy;  
    };  
}  
  
function collision(ball, circle) {  
    return Math.hypot(ball.x - circle.x, ball.y - circle.y) <= ball.radius + circle.radius;  
}  
  
function getRandomColor() {  
    let letters = '0123456789ABCDEF';  
    let color = '#';  
    for (let i = 0; i < 6; i++) {  
        color += letters[Math.floor(Math.random() * 16)];  
    }  
    return color;  
}  
  
function init() {  
    for (let i = 0; i < 20; i++) {  
        balls.push(new Ball(  
            Math.random() * (canvas.width - 40) + 20, // 留出空间避免立即反弹  
            Math.random() * (canvas.height - 40) + 20,  
            10,  
            getRandomColor(),  
            (Math.random() - 0.5) * 4, // 速度的x分量  
            (Math.random() - 0.5) * 4  // 速度的y分量  
        ));  
    }  
  
    setInterval(draw, 10);  
}  
  
function draw() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
  
    // 绘制控制圆  
    ctx.beginPath();  
    ctx.arc(controlCircle.x, controlCircle.y, controlCircle.radius, 0, Math.PI * 2, true);  
    ctx.fillStyle = controlCircle.color;  
    ctx.fill();  
    ctx.closePath();  
  
    balls.forEach(ball => {  
        ball.draw();  
        ball.update();  
    });  
  
    // 更新控制圆的位置  
    controlCircle.x += controlCircle.dx;  
    controlCircle.y += controlCircle.dy;  
  
    // 防止控制圆超出画布边界  
    if (controlCircle.x < controlCircle.radius) controlCircle.x = controlCircle.radius;  
    if (controlCircle.x > canvas.width - controlCircle.radius) controlCircle.x = canvas.width - controlCircle.radius;  
    if (controlCircle.y < controlCircle.radius) controlCircle.y = controlCircle.radius;  
    if (controlCircle.y > canvas.height - controlCircle.radius) controlCircle.y = canvas.height - controlCircle.radius;  
}  
  
init();