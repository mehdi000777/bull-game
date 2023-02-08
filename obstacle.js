export class Obstacle {
    constructor(game) {
        this.game = game;
        this.collisionX = Math.random() * this.game.width;
        this.collisionY = Math.random() * this.game.height;
        this.collisionRadius = 40;
        this.spriteWidth = 250;
        this.spriteHeight = 250;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 70;
        this.image = document.getElementById('obstacle');
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 3);
    }

    update() {
        
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.width, this.width, this.height, this.spriteX, this.spriteY, this.width, this.height);
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