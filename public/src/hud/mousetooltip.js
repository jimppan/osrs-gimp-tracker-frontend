import { numberWithCommas } from "../helpers.js";
import { HudObject, HudText } from "../object.js";
import { SKILLS, SKILL_NAMES } from "../player.js";
import { InterfaceSkillSlot, GetGoalExperience, GetRemainingExperienceToGoal } from "./maininterface/skills.js";

const TOOLTIP_TEXT_LEFT = new PIXI.TextStyle({
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
        this.graphic.scale.y = -1;
        
        this.leftText  = new HudText("MouseTooltipLeftText", '', TOOLTIP_TEXT_LEFT, 16);
        this.rightText = new HudText("MouseTooltipRightText", '', TOOLTIP_TEXT_RIGHT, 16);

        this.leftText.setParent(this);
        this.rightText.setParent(this);

        this.setZIndex(2);
        this.leftText.setZIndex(3);
        this.rightText.setZIndex(3);
    }

    update()
    {
        if(MOUSE_OVER_OBJECT != null)
        {
            if(MOUSE_OVER_OBJECT instanceof InterfaceSkillSlot)
            {
                

                var currentXP = MOUSE_OVER_OBJECT.experience;
                var goalXP = GetGoalExperience(currentXP);
                var remainingXP = GetRemainingExperienceToGoal(currentXP);

                if(MOUSE_OVER_OBJECT.skillId == SKILLS.TOTAL)
                {
                    this.leftText.setText(`${SKILL_NAMES[MOUSE_OVER_OBJECT.skillId]} XP: `);
                    this.rightText.setText(`${numberWithCommas(currentXP)}`);
                }
                else
                {
                    this.leftText.setText(`${SKILL_NAMES[MOUSE_OVER_OBJECT.skillId]} XP: \nNext level at: \nRemaining XP: `);
                    this.rightText.setText(`${numberWithCommas(currentXP)}\n${numberWithCommas(goalXP)}\n${numberWithCommas(remainingXP)}`);
                }
                

                var pos = CAMERA.getInvertedCursorPosition();
                var bounds = this.getScreenBounds();
                var newPos = CAMERA.clampToView({x:pos.x, y:pos.y, width:bounds.width, height:bounds.height});

                this.setPosition(newPos.x, newPos.y + bounds.height);
                this.rightText.setPosition(this.leftText.getScreenBounds().x + this.leftText.getScreenBounds().width, this.rightText.getPosition().y);

                this.graphic.clear();
                this.graphic.beginFill(0xffffe6);
                this.graphic.lineStyle(1, 0x000000, 1, 1);
                this.graphic.drawRect(0, 0, this.leftText.getScreenBounds().width + this.rightText.getScreenBounds().width, this.leftText.getScreenBounds().height);
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