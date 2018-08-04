import config from "../config";

const FRAME_RATE = 10;

function createFrame(filename) {
  return { key: "everything", frame: `${filename}.png` };
}

function chefFramesFor(prefix) {
  return [1, 2, 3, 1, 4, 5].map(n => createFrame(`${prefix}${n}`));
}

export function loadChef(target) {
  let chef = target.addScaledSprite(
    config.width / 2,
    config.height / 2,
    "chef-right1"
  );
  chef.scaleX = config.spriteScale;
  chef.scaleY = config.spriteScale;

  target.anims.create({
    key: "chef-idle",
    frames: [createFrame("chef-down1")]
  });

  target.anims.create({
    key: "chef-idle-right",
    frames: [createFrame("chef-right1")]
  });

  target.anims.create({
    key: "chef-jump",
    frames: [createFrame("chef-right2")]
  });

  target.anims.create({
    key: "chef-up",
    frames: chefFramesFor("chef-up"),
    frameRate: FRAME_RATE
  });

  target.anims.create({
    key: "chef-down",
    frames: chefFramesFor("chef-down"),
    frameRate: FRAME_RATE
  });

  target.anims.create({
    key: "chef-right",
    frames: chefFramesFor("chef-right"),
    frameRate: FRAME_RATE
  });

  // Default to idle facing forward chef
  chef.anims.play("chef-idle", false);

  chef.setDepth(50);

  target.chef = chef;
  return chef;
}
