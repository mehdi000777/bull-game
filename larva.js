import { FireFly, Spark } from "./particle.js";

export class Larva {
    constructor(game, x, y) {
        this.game = game;
        this.collisionX = x;
        this.collisionY = y;
        this.collisionRadius = 30;
        this.spriteWidth = 150;
        this.spriteHeight = 150;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.frameY = Math.floor(Math.random() * 2);
        this.spriteX;
        this.spriteY;
        this.image = document.getElementById('larva');
        this.speedY = Math.random() + 1;
        this.markedForDeletion = false;
    }

    update() {
        this.collisionY -= this.speedY;
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 50;

        //larva go to safty
        if (this.collisionY < this.game.topMargin) {
            for (let i = 0; i < 3; i++) {
                this.game.particles.push(new FireFly(this.game, this.collisionX, this.collisionY, 'yellow'));
            }
            this.markedForDeletion = true;
            this.game.removeGameObjects();
            if (!this.game.gameOver) this.game.score++;
        }

        //collision objects
        let collisionObjects = [...this.game.obstacles, this.game.player, ...this.game.eggs];
        collisionObjects.forEach(object => {
            let [collision, dx, dy, destance, sumOfRadius] = this.game.checkCollision(this, object);
            if (collision) {
                const unit_x = dx / destance;
                const unit_y = dy / destance;
                this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x;
                this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y;
            }
        })

        //collision enemy
        this.game.enemies.forEach(enemy => {
            let [collision] = this.game.checkCollision(this, enemy);
            if (collision) {
                for (let i = 0; i < 3; i++) {
                    this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'red'));
                }
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                if (!this.game.gameOver) this.game.lostLarva++;
            }
        })
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, this.frameY * this.width, this.width, this.height, this.spriteX, this.spriteY, this.width, this.height);
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