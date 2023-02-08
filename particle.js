class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.floor(Math.random() * 10 + 5);
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 2 + .5;
        this.angle = 0;
        this.va = Math.random() * .1 + .01;
        this.markedForDeletion = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

export class FireFly extends Particle {
    update() {
        this.angle += this.va;
        this.x += Math.cos(this.angle) * this.speedX;
        this.y -= this.speedY;
        if (this.y < -this.size) {
            this.markedForDeletion = true;
            this.game.removeGameObjects();
        }
    }
}

export class Spark extends Particle {
    update() {
        this.angle += this.va * .5;
        this.x -= Math.sin(this.angle) * this.speedX;
        this.y -= Math.cos(this.angle) * this.speedY;
        if (this.size > .1) this.size -= .05;
        if (this.size < .2) {
            this.markedForDeletion = true;
            this.game.removeGameObjects();
        }
    }
}