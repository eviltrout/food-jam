import Phaser from "phaser";
import World from "./scenes/world";
import Collect from "./scenes/collect";

export default {
  type: Phaser.AUTO,
  parent: "content",
  width: 640,
  height: 576,
  scene: [Collect, World],
  pixelArt: true,
  spriteScale: 4,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
};
