import Base from "./base";
import config from "../config";
import { loadChef } from "../loaders/chef";
import ingredients from "../db/ingredients";

const CHEF_VELOCITY = 500;
const GRAVITY = 2000;
const JUMP_VELOCITY = 800;
const VOLUME = 0.05;

export default class Collect extends Base {
  constructor() {
    super({
      key: "Collect"
    });

    this.inventory = [];
  }

  preload() {
    super.preload();
    this.load.spritesheet("blocks", "assets/tilesheet.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.audio("jump", "assets/jump.wav");
    this.load.audio("collect", "assets/collect.wav");

    this.load.tilemapTiledJSON("level", "assets/collect-1.json");
  }

  create() {
    this.physics.world.gravity.y = GRAVITY;

    this.jumpSound = this.sound.add("jump");
    this.jumpSound.volume = VOLUME;
    this.collectSound = this.sound.add("collect");
    this.collectSound.volume = VOLUME;

    let chef = loadChef(this);
    chef.setSize(10, 22).setOffset(3, 10);
    chef.anims.play("chef-idle-right", false);
    chef.body.setCollideWorldBounds(true);
    this.bg = this.add
      .tileSprite(0, 0, 320, 200, "everything", "bg-1.png")
      .setOrigin(0, 0);

    this.bg.scaleX = 3;
    this.bg.scaleY = 3;
    this.bg.setScrollFactor(0);

    let map = this.make.tilemap({ key: "level" });
    let tiles = map.addTilesetImage("blocks");
    let layer = map.createStaticLayer(0, tiles, 0, 0);
    layer.scaleX = config.spriteScale;
    layer.scaleY = config.spriteScale;
    this.physics.add.collider(chef, layer);
    layer.setCollisionByExclusion([-1]);

    let fullWidth = map.widthInPixels * config.spriteScale;
    let fullHeight = map.heightInPixels * config.spriteScale;

    this.cameras.main.setBounds(0, 0, fullWidth, fullHeight);
    this.physics.world.setBounds(0, 0, fullWidth, fullHeight);

    this.cameras.main.startFollow(chef, false, 0.2, 0.2, 0, 100);

    this.cursors = this.input.keyboard.createCursorKeys();

    map.filterObjects("Entities", obj => {
      if (!obj.rectangle) {
        return;
      }

      let mx = (obj.x + obj.width / 2) * config.spriteScale;
      let my = (obj.y + obj.height / 2) * config.spriteScale;

      switch (obj.name) {
        case "spawn-ingredient":
          let idx = Math.floor(Math.random() * ingredients.length);
          let ingredient = ingredients[idx];
          let item = this.addScaledSprite(mx, my, ingredient.id);
          item.setDataEnabled();
          item.data.set("id", item.id);
          item.body.allowGravity = false;
          this.physics.add.collider(item, chef, this.collect, null, this);
          this.tweens.add({
            targets: item,
            y: my - 16,
            duration: 500,
            ease: "Sinusoidal",
            yoyo: true,
            loop: -1
          });

          break;
        case "chef-enter":
          chef.x = mx;
          chef.y = my;
          break;
      }
    });

    // Put some text on top
    this.score = this.add
      .bitmapText(config.width - 10, 10, "gameboy", "Items: 0")
      .setOrigin(1, 0)
      .setScrollFactor(0);

    this.canJump = true;
  }

  collect(thing, chef) {
    if (chef === this.chef) {
      this.inventory.push(thing.data.get("id"));
      thing.destroy();

      this.collectSound.play();

      this.score.text = "Items: " + this.inventory.length;
    }
  }

  update() {
    this.bg.tilePositionX = this.cameras.main.worldView.x / 20;
    this.bg.tilePositionY = this.cameras.main.worldView.y / 20;

    let { cursors, chef } = this;

    let onFloor = chef.body.onFloor();

    if (cursors.left.isDown) {
      chef.setVelocityX(-CHEF_VELOCITY);
    } else if (cursors.right.isDown) {
      chef.setVelocityX(CHEF_VELOCITY);
    } else {
      chef.setVelocityX(0);
    }

    if (!onFloor) {
      this.canJump = false;
    }

    if (this.canJump && cursors.up.isDown && onFloor) {
      this.jumpSound.play();
      chef.setVelocityY(-JUMP_VELOCITY);
    }

    // To avoid holding the jump button, make sure
    // it has been released before the player can jump
    // again.
    if (cursors.up.isUp) {
      this.canJump = true;
    }

    let v = chef.body.velocity;

    if (v.x < 0) {
      chef.flipX = true;
    } else if (v.x > 0) {
      chef.flipX = false;
    }

    if (onFloor) {
      if (v.x !== 0) {
        chef.anims.play("chef-right", true);
      } else {
        chef.anims.play("chef-idle-right");
      }
    } else {
      chef.anims.play("chef-jump", true);
    }
  }
}
