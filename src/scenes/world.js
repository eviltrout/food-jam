import config from "../config";
import { loadChef } from "../loaders/chef";
import Base from "./base";

const CHEF_VELOCITY = 200;

export default class World extends Base {
  constructor() {
    super({
      key: "World"
    });
  }

  create() {
    this.bg = this.add
      .tileSprite(0, 0, 320, 200, "everything", "bg-1.png")
      .setOrigin(0, 0);

    this.bg.scaleX = 4;
    this.bg.scaleY = 4;

    let chef = loadChef(this);
    chef.setSize(10, 8).setOffset(3, 24);

    chef.setCollideWorldBounds(true);

    let oven = this.addScaledSprite(config.width / 5, 220, "oven");
    let hole = this.addScaledSprite((config.width * 4) / 5, 220, "hole");

    this.cursors = this.input.keyboard.createCursorKeys();

    // Put some text on top
    this.add
      .bitmapText(config.width / 2, 50, "gameboy", "Cook or Collect?")
      .setOrigin(0.5);

    this.physics.add.collider(chef, oven, this.touchedThing, null, this);
    oven.body.immovable = true;

    this.physics.add.collider(chef, hole, this.touchedHole, null, this);
    hole.body.immovable = true;
  }

  touchedOven() {}

  touchedHole() {
    this.scene.start("Collect");
  }

  update() {
    let { cursors, chef } = this;

    if (cursors.left.isDown) {
      chef.setVelocityX(-CHEF_VELOCITY);
    } else if (cursors.right.isDown) {
      chef.setVelocityX(CHEF_VELOCITY);
    } else {
      chef.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      chef.setVelocityY(-CHEF_VELOCITY);
    } else if (cursors.down.isDown) {
      chef.setVelocityY(CHEF_VELOCITY);
    } else {
      chef.setVelocityY(0);
    }

    let v = chef.body.velocity;

    if (v.x === 0 && v.y === 0) {
      chef.anims.play("chef-idle");
    } else {
      if (v.x < 0) {
        chef.anims.play("chef-right", true);
        chef.flipX = true;
      } else if (v.x > 0) {
        chef.anims.play("chef-right", true);
        chef.flipX = false;
      } else if (v.y < 0) {
        chef.anims.play("chef-up", true);
      } else {
        chef.anims.play("chef-down", true);
      }
    }
  }
}
