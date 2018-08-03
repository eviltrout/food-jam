import Phaser from "phaser";
export default class Test extends Phaser.Scene {
  constructor() {
    super({
      key: "TestScene"
    });
  }

  preload() {
    this.load.bitmapFont(
      "gameboy",
      "assets/gameboy-font.png",
      "assets/gameboy-font.fnt"
    );
    this.cameras.main.setBackgroundColor("#ffffb5");
  }

  create() {
    let text = this.add.bitmapText(10, 10, "gameboy", "Hello world!");
  }
}
