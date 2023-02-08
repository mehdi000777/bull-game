import { Player } from "./player.js";
import { InputHandler } from './input.js';
import { Obstacle } from './obstacle.js';
import { Egg } from './egg.js';
import { Enemy } from "./enemy.js";

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.font = '40px Bangers';
    ctx.textAlign = 'center';

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.numberOfObstacles = 10;
            this.topMargin = 260;
            this.obstacles = [];
            this.maxEggs = 5;
            this.eggs = [];
            this.gameObjects = [];
            this.enemies = [];
            this.particles = [];
            this.debug = false;
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000 / this.fps;
            this.eggTimer = 0;
            this.eggInterval = 1000;
            this.larvas = [];
            this.score = 0;
            this.lostLarva = 0;
            this.winnigScore = 30;
            this.gameOver = false;
        }

        render(ctx, deltaTime) {
            if (this.timer > this.interval) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.gameObjects = [...this.eggs, ...this.obstacles, this.player, ...this.enemies, ...this.larvas, ...this.particles];
                this.gameObjects.sort((a, b) => {
                    return a.collisionY - b.collisionY;
                });
                this.gameObjects.forEach(object => {
                    object.draw(ctx);
                    object.update(deltaTime);
                });
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }

            //Egg handler
            if (this.eggTimer > this.eggInterval && !this.gameOver) {
                this.addEgg();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime;
            }

            //draw Status Text
            ctx.save();
            ctx.textAlign = 'left';
            ctx.fillText('Score: ' + this.score, 25, 50);
            if (this.debug) ctx.fillText('Lost: ' + this.lostLarva, 25, 100);
            ctx.restore();

            //win or lost Text
            if (this.score >= this.winnigScore) {
                this.gameOver = true;
                ctx.save()
                ctx.fillStyle = 'rgba(0,0,0,.5)'
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                let message1;
                let message2;
                if (this.lostLarva <= 5) {
                    message1 = 'Bullseye!!!';
                    message2 = 'You bullied the bullies!';
                } else {
                    message1 = 'Lose!!!';
                    message2 = 'You lost ' + this.lostLarva + ' Lost Larvas';
                }
                ctx.font = '130px Bangers';
                ctx.fillText(message1, this.width / 2, this.height / 2 - 20);
                ctx.font = '40px Bangers';
                ctx.fillText(message2, this.width / 2, this.height / 2 + 50);
                ctx.fillText('Final score ' + this.score + '. Press "R" to restart game', this.width / 2, this.height / 2 + 100)
                ctx.restore();
            }
        }

        restart() {
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.particles = [];
            this.score = 0;
            this.lostLarva = 0;
            this.input.mouse = {
                x: this.width / 2,
                y: this.height / 2,
                pressed: false,
            }
            this.gameOver = false;
            this.init();
        }

        checkCollision(a, b) {
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            const sumOfRadius = a.collisionRadius + b.collisionRadius;
            return [
                (distance < sumOfRadius),
                dx,
                dy,
                distance,
                sumOfRadius
            ]
        }

        addEgg() {
            if (this.eggs.length < this.maxEggs) {
                this.eggs.push(new Egg(this));
            }
        }

        addEnemy() {
            this.enemies.push(new Enemy(this));
        }

        removeGameObjects() {
            this.eggs = this.eggs.filter(egg => !egg.markedForDeletion);
            this.larvas = this.larvas.filter(larva => !larva.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
        }

        init() {
            // enemys
            for (let i = 0; i < 5; i++) {
                this.addEnemy();
            }

            //obstacles
            let attempts = 0;
            while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
                let obstacleTest = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = obstacleTest.collisionX - obstacle.collisionX;
                    const dy = obstacleTest.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 100;
                    const sumOfRadius = obstacleTest.collisionRadius + obstacle.collisionRadius + distanceBuffer;
                    if (distance < sumOfRadius) {
                        overlap = true;
                    }
                });
                const margin = obstacleTest.collisionRadius * 3;
                if (!overlap && obstacleTest.spriteX > 0
                    && obstacleTest.spriteX < this.width - obstacleTest.spriteWidth
                    && obstacleTest.collisionY > this.topMargin + margin
                    && obstacleTest.collisionY < this.height - margin) {
                    this.obstacles.push(obstacleTest);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas);
    game.init();

    let lastTime = 0;
    const animate = (timeStamp) => {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
})