import Phaser from "phaser";
import config from "../config";

const FRAME_RATE = 10;
const CHEF_VELOCITY = 200;

function chefFramesFor(prefix) {
  return [1, 2, 3, 1, 4, 5].map(n => {
    return { key: "everything", frame: `${prefix}${n}.png` };
  });
}

export default class Test extends Phaser.Scene {
  constructor() {
    super({
      key: "TestScene"
    });
  }

  preload() {
    this.load.multiatlas("everything", "assets/everything.json", "assets");

    this.load.bitmapFont(
      "gameboy",
      "assets/gameboy-font.png",
      "assets/gameboy-font.fnt"
    );
    this.cameras.main.setBackgroundColor("#ffffb5");
  }

  create() {
    // Create the background layer. Perhaps use a tilemap in the future?
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 8; j++) {
        let bg = this.add
          .sprite(
            i * 30 * config.spriteScale,
            j * 20 * config.spriteScale,
            "everything",
            "bg-1.png"
          )
          .setOrigin(0, 0);
        bg.scaleX = config.spriteScale;
        bg.scaleY = config.spriteScale;
      }
    }

    this.add
      .bitmapText(config.width / 2, 50, "gameboy", "Hello world!")
      .setOrigin(0.5);

    this.chef = this.physics.add.sprite(
      config.width / 2,
      config.height / 2,
      "everything",
      "chef-right1.png"
    );
    this.chef.scaleX = config.spriteScale;
    this.chef.scaleY = config.spriteScale;
    this.chef.setBounce(0.2);
    this.chef.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "chef-idle",
      frames: [{ key: "everything", frame: "chef-down1.png" }]
    });

    this.anims.create({
      key: "chef-up",
      frames: chefFramesFor("chef-up"),
      frameRate: FRAME_RATE
    });

    this.anims.create({
      key: "chef-down",
      frames: chefFramesFor("chef-down"),
      frameRate: FRAME_RATE
    });

    this.anims.create({
      key: "chef-right",
      frames: chefFramesFor("chef-right"),
      frameRate: FRAME_RATE
    });

    // Default to idle chef
    this.chef.anims.play("chef-idle", false);
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
