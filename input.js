export class InputHandler {
    constructor(game) {
        this.game = game;
        this.mouse = {
            x: this.game.width / 2,
            y: this.game.height / 2,
            pressed: false,
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'd') this.game.debug = !this.game.debug;
            else if (e.key === 'r') this.game.restart();
        });

        this.game.canvas.addEventListener('mousedown', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = true;
        });

        this.game.canvas.addEventListener('mouseup', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = false;
        });

        this.game.canvas.addEventListener('mousemove', (e) => {
            if (this.mouse.pressed) {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
            }
        });
    }
}