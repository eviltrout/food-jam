import config from "../config";
import { loadChef } from "../loaders/chef";
import Base from "./base";

export default class Dead extends Base {
  constructor() {
    super({
      key: "Dead"
    });
  }

  create() {
    this.add
      .bitmapText(config.width / 2, 50, "gameboy", "Sorry, you Died :(")
      .setOrigin(0.5);
    this.add
      .bitmapText(
        config.width / 2,
        (config.height * 4) / 5,
        "gameboy",
        "(press any key)"
      )
      .setOrigin(0.5, 1);
    let chef = loadChef(this);
    chef.anims.play("chef-sad", true);
    this.input.keyboard.on("keydown", () => {
      this.scene.start("World");
    });
  }

  update() {}
}
