import { Game, Types } from 'phaser';
import { LoadingScene, MainScene } from './scenes';

declare global {
    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
    }
}

const gameConfig: Types.Core.GameConfig = {
    title: 'Slash&Clash',
    version: "0.1",
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#000000',
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    callbacks: {
        postBoot: () => {
            window.sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, MainScene],
};

window.sizeChanged = () => {
    if (window.game.isBooted) {
        setTimeout(() => {
            window.game.scale.resize(window.innerWidth, window.innerHeight);
            window.game.canvas.setAttribute(
                'style',
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
            );
        }, 100);
    }
};
window.onresize = () => window.sizeChanged();

const game = new Game(gameConfig);
window.game = game;
export default gameConfig;