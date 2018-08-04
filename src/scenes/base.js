import config from "../config";
import Phaser from "phaser";

export default class Base extends Phaser.Scene {
  preload() {
    this.load.multiatlas("everything", "assets/everything.json", "assets");

    this.load.bitmapFont(
      "gameboy",
      "assets/gameboy-font.png",
      "assets/gameboy-font.fnt"
    );
    this.cameras.main.setBackgroundColor("#ffffb5");
  }

  scaleSprite(sprite) {
    sprite.scaleX = config.spriteScale;
    sprite.scaleY = config.spriteScale;
    return sprite;
  }

  addScaledSprite(x, y, name, opts = {}) {
    let source = opts.noPhysics ? this : this.physics;
    let sprite = source.add.sprite(x, y, "everything", `${name}.png`);
    return this.scaleSprite(sprite);
  }
}
