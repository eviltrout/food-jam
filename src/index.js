import Phaser from "phaser";
import Scene from "./scenes/test";

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 640,
  height: 576,
  scene: [Scene]
};

let game = new Phaser.Game(config);
console.log(game);
