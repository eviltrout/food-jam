import Phaser from "phaser";
import World from "./scenes/world";
import Collect from "./scenes/collect";
import Dead from "./scenes/dead";

export default {
  type: Phaser.AUTO,
  parent: "content",
  width: 640,
  height: 576,
  scene: [Collect, World, Dead],
  pixelArt: true,
  spriteScale: 4,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true
    }
  }
};
