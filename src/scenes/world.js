import Phaser from "phaser";
import config from "../config";

const FRAME_RATE = 10;
const CHEF_VELOCITY = 200;

function chefFramesFor(prefix) {
  return [1, 2, 3, 1, 4, 5].map(n => {
    return { key: "everything", frame: `${prefix}${n}.png` };
  });
}

export default class World extends Phaser.Scene {
  constructor() {
    super({
      key: "World"
    });
  }

  addScaledSprite(x, y, name, opts = {}) {
    let source = opts.noPhysics ? this : this.physics;
    let sprite = source.add.sprite(x, y, "everything", `${name}.png`);
    sprite.scaleX = config.spriteScale;
    sprite.scaleY = config.spriteScale;
    return sprite;
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
        this.addScaledSprite(
          i * 30 * config.spriteScale,
          j * 20 * config.spriteScale,
          "bg-1",
          { noPhysics: true }
        ).setOrigin(0, 0);
      }
    }

    let oven = this.addScaledSprite(config.width / 5, 220, "oven");
    let hole = this.addScaledSprite((config.width * 4) / 5, 220, "hole");

    this.chef = this.addScaledSprite(
      config.width / 2,
      config.height / 2,
      "chef-right1"
    );
    this.chef.scaleX = config.spriteScale;
    this.chef.scaleY = config.spriteScale;
    this.chef.setCollideWorldBounds(true);

    this.chef.setSize(16, 10).setOffset(0, 22);
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

    // Put some text on top
    this.add
      .bitmapText(config.width / 2, 50, "gameboy", "Cook or Collect?")
      .setOrigin(0.5);

    this.physics.add.collider(this.chef, oven, this.touchedThing, null, this);
    oven.body.immovable = true;

    this.physics.add.collider(this.chef, hole, this.touchedHole, null, this);
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
