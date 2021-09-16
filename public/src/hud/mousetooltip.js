import { numberWithCommas } from "../helpers.js";
import { HudObject } from "../object.js";
import { SKILL_NAMES } from "../player.js";
import { InterfaceSkillSlot, GetGoalExperience, GetRemainingExperienceToGoal } from "./maininterface/skills.js";

const TOOLTIP_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain 2',
    fontSize:'16px',
    fill: ['#000000'],
    //strokeThickness:1,
    lineHeight: 12,
})

const TOOLTIP_TEXT_RIGHT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain 2',
    fontSize:'16px',
    fill: ['#000000'],
    //strokeThickness:1,
    lineHeight: 12,
    align:'right'
})

export class MouseTooltip extends HudObject
{
    constructor(name)
    {
        super(name);

        this.graphic = new PIXI.Graphics();
        this.graphic.zIndex = 2;

        this.leftText  = new HudObject("MouseTooltipLeftText");
        this.rightText = new HudObject("MouseTooltipRightText");

        this.leftText.graphic = new PIXI.Text(``, TOOLTIP_TEXT);
        this.leftText.graphic.resolution = 16;
        this.leftText.graphic.zIndex = 3;

        this.rightText.graphic = new PIXI.Text(`8,653,933\n8,771,558\n117,625`, TOOLTIP_TEXT_RIGHT);
        this.rightText.graphic.resolution = 16;
        this.rightText.graphic.zIndex = 3;

        this.leftText.setParent(this);
        this.rightText.setParent(this);
    }

    update()
    {
        if(MOUSE_OVER_OBJECT != null)
        {
            if(MOUSE_OVER_OBJECT instanceof InterfaceSkillSlot)
            {
                this.leftText.graphic.text = `${SKILL_NAMES[MOUSE_OVER_OBJECT.skillId]} XP:\nNext level at:\nRemaining XP:`;

                var currentXP = MOUSE_OVER_OBJECT.experience;
                var goalXP = GetGoalExperience(currentXP);
                var remainingXP = GetRemainingExperienceToGoal(currentXP);

                this.rightText.graphic.text = `${numberWithCommas(currentXP)}\n${numberWithCommas(goalXP)}\n${numberWithCommas(remainingXP)}`;

                var pos = CAMERA.getCursorPosition();
                var bounds = this.graphic.getBounds();
                var newPos = CAMERA.clampToView({x:pos.x, y:pos.y, width:bounds.width, height:bounds.height});

                this.setPosition(newPos.x, newPos.y - bounds.height);
                this.rightText.setPosition(this.leftText.getBounds().x + this.leftText.getBounds().width, this.rightText.graphic.position.y);

                this.graphic.clear();
                this.graphic.beginFill(0xffffe6);
                this.graphic.lineStyle(1, 0x000000, 1, 1);
                this.graphic.drawRect(0, 0, this.leftText.getBounds().width + this.rightText.getBounds().width, this.leftText.getBounds().height);
                this.graphic.endFill();

                this.setVisibility(true);
            }
            else
            {
                this.setVisibility(false);
            }
        }
        else
        {
            this.setVisibility(false);
        }
    }
}