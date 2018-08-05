import Base from "./base";
import config from "../config";
import { loadChef } from "../loaders/chef";
import ingredients from "../db/ingredients";

const CHEF_VELOCITY = 500;
const GRAVITY = 2000;
const JUMP_VELOCITY = 800;

export default class Collect extends Base {
  constructor() {
    super({
      key: "Collect"
    });
  }

  preload() {
    super.preload();
    this.load.spritesheet("blocks", "assets/tilesheet.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.audio("jump", "assets/jump.wav");
    this.load.audio("collect", "assets/collect.wav");
    this.load.audio("death", "assets/death.wav");

    this.load.tilemapTiledJSON("level", "assets/collect-1.json");
  }

  create() {
    this.inventory = [];
    this.dead = false;

    this.physics.world.gravity.y = GRAVITY;

    this.jumpSound = this.sound.add("jump");
    this.jumpSound.volume = config.volume;
    this.collectSound = this.sound.add("collect");
    this.collectSound.volume = config.volume;
    this.deathSound = this.sound.add("death");
    this.deathSound.volume = config.volume;

    let chef = loadChef(this);
    chef.setSize(10, 22).setOffset(3, 10);
    chef.anims.play("chef-idle-right", false);
    chef.body.setCollideWorldBounds(true);
    chef.body.onWorldBounds = true;

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

    this.physics.world.on("worldbounds", this.collideBounds, this);

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
        case "fire":
          let fire = this.addScaledSprite(mx, my, "fire");
          fire.body.allowGravity = false;
          fire.setSize(11, 11).setOffset(3, 4);
          this.physics.add.collider(fire, chef, this.playerDied, null, this);
          this.tweens.add({
            targets: fire,
            scaleY: config.spriteScale * 0.9,
            alpha: 0.8,
            scaleX: config.spriteScale * 0.9,
            duration: 200,
            delay: Math.random() * 200,
            ease: "Sinusoidal",
            yoyo: true,
            loop: -1
          });
          break;
      }
    });

    // Put some text on top
    this.score = this.add
      .bitmapText(config.width - 10, 10, "gameboy", "Items: 0")
      .setOrigin(1, 0)
      .setScrollFactor(0);

    this.cameras.main.startFollow(chef, false, 0.2, 0.2, 0, 100);
    this.canJump = true;
  }

  playerDied() {
    if (this.dead) {
      return;
    }

    this.dead = true;
    this.physics.pause();
    this.deathSound.play();

    this.cameras.main.stopFollow();
    this.chef.anims.play("chef-death", false);
    this.tweens.add({
      targets: this.chef,
      y: this.chef.y - config.height,
      duration: 2000,
      ease: "Cubic",
      yoyo: false,
      loop: 0,
      onComplete: () => {
        this.scene.start("Dead");
      }
    });
    this.cameras.main.fade(2000, 255, 255, 181);
  }

  collideBounds(world, up, down) {
    if (down) {
      this.playerDied();
    }
  }

  collect(thing, chef) {
    if (this.dead) {
      return;
    }

    if (chef === this.chef) {
      this.inventory.push(thing.data.get("id"));
      thing.destroy();

      this.collectSound.play();

      this.score.text = "Items: " + this.inventory.length;
    }
  }

  handleInput(chef, onFloor) {
    if (this.dead) {
      return;
    }

    let { cursors } = this;

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
  }

  handleChefDisplay(chef, onFloor) {
    if (this.dead) {
      return;
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

  update() {
    this.bg.tilePositionX = this.cameras.main.worldView.x / 20;
    this.bg.tilePositionY = this.cameras.main.worldView.y / 20;

    let { chef } = this;
    let onFloor = chef.body.onFloor();

    this.handleInput(chef, onFloor);
    this.handleChefDisplay(chef, onFloor);
  }
}
