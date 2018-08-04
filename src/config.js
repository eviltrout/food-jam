import Phaser from "phaser";
import Scene from "./scenes/test";

export default {
  type: Phaser.AUTO,
  parent: "content",
  width: 640,
  height: 576,
  scene: [Scene],
  pixelArt: true,
  spriteScale: 4,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
};
