import Phaser from "phaser";

export default class Collect extends Phaser.Scene {
  constructor() {
    super({
      key: "Collect"
    });
  }

  preload() {
    this.cameras.main.setBackgroundColor("#ffffb5");
  }

  create() {}
}
