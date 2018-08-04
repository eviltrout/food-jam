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
    this.load.spritesheet("tiles", "assets/tilesheet.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.physics.world.gravity.y = GRAVITY;

    let chef = loadChef(this);
    chef.setSize(10, 22).setOffset(3, 10);
    chef.anims.play("chef-idle-right", false);

    let level = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    let map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    let tiles = map.addTilesetImage("tiles");
    let layer = map.createStaticLayer(0, tiles, 0, 0);
    layer.scaleX = config.spriteScale;
    layer.scaleY = config.spriteScale;
    this.physics.add.collider(chef, layer);
    layer.setCollisionByExclusion(0);
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
    let { cursors, chef } = this;

    let onFloor = chef.body.onFloor();

    if (cursors.left.isDown) {
      chef.setVelocityX(-CHEF_VELOCITY);
    } else if (cursors.right.isDown) {
      chef.setVelocityX(CHEF_VELOCITY);
    } else {
      chef.setVelocityX(0);
    }

    if (this.canJump && cursors.up.isDown && onFloor) {
      this.canJump = false;
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
