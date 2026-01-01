import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { Howl } from 'howler';

class GameEngine {
    private app: PIXI.Application;

    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600 });
        document.body.appendChild(this.app.view);
        this.loadAssets();
    }

    private loadAssets() {
        // Load and setup game assets here
    }

    public playSound(soundPath: string) {
        const sound = new Howl({
            src: [soundPath],
        });
        sound.play();
    }

    public animate() {
        gsap.to(this.app.stage, { x: 100, duration: 2 });
    }
}

export default GameEngine;