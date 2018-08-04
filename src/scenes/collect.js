import Base from "./base";
import config from "../config";
import { loadChef } from "../loaders/chef";

const CHEF_VELOCITY = 260;
const GRAVITY = 1000;
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

    this.load.tilemapTiledJSON("level", "assets/collect-1.json");
  }

  create() {
    this.physics.world.gravity.y = GRAVITY;

    let chef = loadChef(this);
    chef.setSize(10, 22).setOffset(3, 10);
    chef.anims.play("chef-idle-right", false);
    this.bg = this.add
      .tileSprite(0, 0, 320, 200, "everything", "bg-2.png")
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
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels * config.spriteScale,
      map.heightInPixels * config.spriteScale
    );
    this.cameras.main.startFollow(chef);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.canJump = true;
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
