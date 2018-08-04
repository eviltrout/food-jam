import Phaser from "phaser";
import config from "../config";

const FRAME_RATE = 10;

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

    let frames = this.anims.generateFrameNames("everything", {
      start: 1,
      end: 5,
      prefix: "chef-right",
      suffix: ".png"
    });

    this.anims.create({
      key: "chef-idle",
      frames: [{ key: "everything", frame: "chef-down1.png" }]
    });
    this.chef.anims.play("chef-idle", false);

    this.anims.create({
      key: "chef-up",
      frames: [
        { key: "everything", frame: "chef-up1.png" },
        { key: "everything", frame: "chef-up2.png" },
        { key: "everything", frame: "chef-up3.png" },
        { key: "everything", frame: "chef-up1.png" },
        { key: "everything", frame: "chef-up4.png" },
        { key: "everything", frame: "chef-up5.png" }
      ],
      frameRate: FRAME_RATE
    });

    this.anims.create({
      key: "chef-down",
      frames: [
        { key: "everything", frame: "chef-down1.png" },
        { key: "everything", frame: "chef-down2.png" },
        { key: "everything", frame: "chef-down3.png" },
        { key: "everything", frame: "chef-down1.png" },
        { key: "everything", frame: "chef-down4.png" },
        { key: "everything", frame: "chef-down5.png" }
      ],
      frameRate: FRAME_RATE
    });

    this.anims.create({
      key: "chef-right",
      frames: [
        { key: "everything", frame: "chef-right1.png" },
        { key: "everything", frame: "chef-right2.png" },
        { key: "everything", frame: "chef-right3.png" },
        { key: "everything", frame: "chef-right1.png" },
        { key: "everything", frame: "chef-right4.png" },
        { key: "everything", frame: "chef-right5.png" }
      ],
      frameRate: FRAME_RATE
    });
  }

  update() {
    let { cursors, chef } = this;

    if (cursors.left.isDown) {
      chef.setVelocityX(-160);
      chef.flipX = true;
      console.log("left is down");
    } else if (cursors.right.isDown) {
      chef.setVelocityX(160);
    } else {
      chef.setVelocityX(0);
      chef.flipX = false;
      // player.anims.play('turn');
    }

    if (cursors.up.isDown) {
      chef.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      chef.setVelocityY(160);
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
