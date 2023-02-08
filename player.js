export class Player {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('player');
        this.spriteWidth = 255;
        this.spriteHeight = 256;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.collisionX = this.game.width / 2;
        this.collisionY = this.game.height / 2;
        this.collisionRadius = 40;
        this.spriteX = 0;
        this.spriteY = 0;
        this.frameX = 0;
        this.frameY = 4;
        this.maxFrame = 59;
        this.speedX = 0;
        this.speedY = 0;
        this.dx = 0;
        this.dy = 0;
        this.speedModifier = 5;
    }

    restart() {
        this.collisionX = this.game.width / 2;
        this.collisionY = this.game.height / 2;
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 100;
    }

    update() {
        //animation
        this.frameX++;
        if (this.frameX >= this.maxFrame) this.frameX = 0;

        //horizental and vertical boundaries
        if (this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius;
        else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;
        else if (this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
        else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;

        this.dx = this.game.input.mouse.x - this.collisionX;
        this.dy = this.game.input.mouse.y - this.collisionY;

        //sprite animation
        const angle = Math.atan2(this.dy, this.dx);
        if (angle < -1.17) this.frameY = 0;
        else if (angle < -0.39) this.frameY = 1;
        else if (angle < 0.39) this.frameY = 2;
        else if (angle < 1.17) this.frameY = 3;
        else if (angle < 1.96) this.frameY = 4;
        else if (angle < 2.74) this.frameY = 5;
        else if (angle < -2.74 || angle > 2.74) this.frameY = 6;
        else if (angle < -1.96) this.frameY = 7;

        //player movment
        const distance = Math.hypot(this.dy, this.dx);
        if (distance > this.speedModifier) {
            this.speedX = this.dx / distance || 0;
            this.speedY = this.dy / distance || 0;
        } else {
            this.speedX = 0;
            this.speedY = 0;
        }
        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 100;

        //collision
        this.game.obstacles.forEach(obstacle => {
            const [collision, dx, dy, distance, sumOfRadius] = this.game.checkCollision(this, obstacle)
            if (collision) {
                const unit_x = dx / distance;
                const unit_y = dy / distance;
                this.collisionX = obstacle.collisionX + (sumOfRadius + 1) * unit_x;
                this.collisionY = obstacle.collisionY + (sumOfRadius + 1) * unit_y;
            }
        })
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.spriteX, this.spriteY, this.width, this.height)
        if (this.game.debug) {
            ctx.beginPath();
            ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            ctx.save();
            ctx.globalAlpha = .5;
            ctx.fill();
            ctx.restore();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.collisionX, this.collisionY);
            ctx.lineTo(this.game.input.mouse.x, this.game.input.mouse.y);
            ctx.stroke();
        }
    }
}