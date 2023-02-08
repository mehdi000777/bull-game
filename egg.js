import { Larva } from "./larva.js";

export class Egg {
    constructor(game) {
        this.game = game;
        this.collisionRadius = 40;
        this.margin = this.collisionRadius * 2;
        this.collisionX = this.margin + (Math.random() * (this.game.width - (this.margin * 2)));
        this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin));
        this.spriteWidth = 110;
        this.spriteHeight = 135;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.image = document.getElementById('egg');
        this.hatchTimer = 0;
        this.hatchInterval = 5000;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 30;

        let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
        collisionObjects.forEach(object => {
            const [collision, dx, dy, destance, sumOfRadius] = this.game.checkCollision(this, object);
            if (collision) {
                const unit_x = dx / destance;
                const unit_y = dy / destance;
                this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x;
                this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y;
            }
        })

        //hatch Handler
        if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin) {
            this.game.larvas.push(new Larva(this.game, this.collisionX, this.collisionY));
            this.markedForDeletion = true;
            this.game.removeGameObjects();
            this.hatchTimer = 0;
        } else {
            this.hatchTimer += deltaTime;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);
        if (this.game.debug) {
            ctx.beginPath();
            ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            ctx.save();
            ctx.globalAlpha = .5;
            ctx.fill();
            ctx.restore();
            ctx.stroke();
            let displayTime = (this.hatchTimer * .001).toFixed(0);
            ctx.fillText(displayTime, this.collisionX, this.collisionY - this.collisionRadius * 2.5);
        }
    }
}