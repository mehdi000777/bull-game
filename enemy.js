export class Enemy {
    constructor(game) {
        this.game = game;
        this.collisionRadius = 40;
        this.margin = this.collisionRadius * 2;
        this.spriteWidth = 140;
        this.spriteHeight = 260;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.collisionX = this.game.width + this.width;
        this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin));
        this.frameY = Math.floor(Math.random() * 4);
        this.image = document.getElementById('toads');
        this.speedX = Math.random() * 3 + .5;
        this.spriteX;
        this.spriteY;
    }

    update() {
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height + 40;
        this.collisionX -= this.speedX;
        if (this.spriteX + this.width < 0 && !this.game.gameOver) {
            this.frameY = Math.floor(Math.random() * 4);
            this.speedX = Math.random() * 3 + .5;
            this.collisionX = this.game.width + this.width + Math.random() * this.game.width * .5;
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin));
        }

        let collisionObjects = [...this.game.obstacles, this.game.player];
        collisionObjects.forEach(object => {
            const [collision, dx, dy, destance, sumOfRadius] = this.game.checkCollision(this, object);
            if (collision) {
                const unit_x = dx / destance;
                const unit_y = dy / destance;
                this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x;
                this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y;
            }
        })
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, this.frameY * this.height, this.width, this.height, this.spriteX, this.spriteY, this.width, this.height);
        if (this.game.debug) {
            ctx.beginPath();
            ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            ctx.save();
            ctx.globalAlpha = .5;
            ctx.fill();
            ctx.restore();
            ctx.stroke();
        }
    }
}