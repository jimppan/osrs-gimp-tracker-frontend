import { numberWithCommas } from "../helpers.js";
import { HudObject, HudText } from "../object.js";
import { InventorySlot, LEVELS, SKILLS, SKILL_NAMES } from "../player.js";
import { GetMapDefinition } from "../resource/mapdefinitions.js";
import { InterfaceEquipmentSlot } from "./maininterface/equipment.js";
import { InterfaceItemSlot } from "./maininterface/inventory.js";
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

const MAPTOOLTIP_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#FFFFFF'],
    //strokeThickness:1,
    lineHeight: 16,
    //align:'center',
    trim:true,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.8,
    dropShadowDistance: 32,
})

export class SkillTooltip extends HudObject
{
    constructor(name)
    {
        super(name);

        this.graphic = new PIXI.Graphics();
        this.graphic.scale.y = -1;
        
        this.leftText  = new HudText("SkillTooltipLeftText", '', TOOLTIP_TEXT_LEFT, 16);
        this.rightText = new HudText("SkillTooltipRightText", '', TOOLTIP_TEXT_RIGHT, 16);

        this.leftText.setParent(this);
        this.rightText.setParent(this);

        this.setZIndex(HUD_LAYERS.TOOLTIP_BACKGROUND);
        this.leftText.setZIndex(HUD_LAYERS.TOOLTIP_FOREGROUND);
        this.rightText.setZIndex(HUD_LAYERS.TOOLTIP_FOREGROUND);
    }

    update()
    {
        var currentXP = MOUSE_OVER_OBJECT.experience;
        var goalXP = GetGoalExperience(currentXP);
        var remainingXP = GetRemainingExperienceToGoal(currentXP);

        if(MOUSE_OVER_OBJECT.skillId == SKILLS.TOTAL || MOUSE_OVER_OBJECT.experience >= LEVELS[98])
        {
            this.leftText.setText(`${SKILL_NAMES[MOUSE_OVER_OBJECT.skillId]} XP: `);
            this.rightText.setText(`${numberWithCommas(currentXP)}`);
        }
        else
        {
            this.leftText.setText(`${SKILL_NAMES[MOUSE_OVER_OBJECT.skillId]} XP: \nNext level at: \nRemaining XP: `);
            this.rightText.setText(`${numberWithCommas(currentXP)}\n${numberWithCommas(goalXP)}\n${numberWithCommas(remainingXP)}`);
        }
        

        var pos = INPUT.getInvertedCursorPosition();
        var bounds = this.getScreenBounds();
        var newPos = CAMERA.clampToView({x:pos.x, y:pos.y, width:bounds.width, height:bounds.height});

        this.setPosition(newPos.x, newPos.y + bounds.height);
        this.rightText.setPosition(this.leftText.getScreenBounds().x + this.leftText.getScreenBounds().width, this.rightText.getPosition().y);

        this.graphic.clear();
        this.graphic.beginFill(0xffffe6);
        this.graphic.lineStyle(1, 0x000000, 1, 1);
        this.graphic.drawRect(0, 0, this.leftText.getScreenBounds().width + this.rightText.getScreenBounds().width, this.leftText.getScreenBounds().height);
        this.graphic.endFill();
    }
}

export class MapTooltip extends HudObject
{
    constructor(name)
    {
        super(name);

        this.graphic = new PIXI.Graphics();
        this.graphic.scale.y = -1;
        
        this.areaText  = new HudText("MapTooltipText", '', MAPTOOLTIP_TEXT, 16);
        this.areaText.setParent(this);

        this.setZIndex(HUD_LAYERS.TOOLTIP_BACKGROUND);
        this.areaText.setZIndex(HUD_LAYERS.TOOLTIP_FOREGROUND);
    }

    update()
    {
        var pos = INPUT.getInvertedCursorPosition();
        var bounds = this.getScreenBounds();
        var newPos = CAMERA.clampToView({x:pos.x, y:pos.y, width:bounds.width, height:bounds.height});

        this.setPosition(newPos.x, newPos.y + bounds.height);
        this.graphic.clear();
        this.graphic.beginFill(0x95959);
        this.graphic.lineStyle(1, 0x262626, 1, 1);
        this.graphic.drawRect(0, 0, this.areaText.getScreenBounds().width, this.areaText.getScreenBounds().height);
        this.graphic.alpha = 0.5;
        this.graphic.endFill();
    }

    setText(text)
    {
        this.areaText.setText(text);
    }
}

export class MouseTooltip extends HudObject
{
    constructor(name)
    {
        super(name);

        this.skillToolTip = new SkillTooltip();
        this.mapToolTip = new MapTooltip();

        this.skillToolTip.setParent(this);
        this.mapToolTip.setParent(this);
    }

    update()
    {
        this.setVisibility(false);

        if(MOUSE_OVER_OBJECT != null)
        {
            if(MOUSE_OVER_OBJECT instanceof InterfaceSkillSlot)
            {
                this.skillToolTip.update();
                this.skillToolTip.setVisibility(true);
            }
            else if(MOUSE_OVER_OBJECT instanceof InterfaceEquipmentSlot || MOUSE_OVER_OBJECT instanceof InterfaceItemSlot)
            {
                this.mapToolTip.setText(MOUSE_OVER_OBJECT.name);
                this.mapToolTip.update();
                this.mapToolTip.setVisibility(true);
            }
        }
        else
        {
            // if its not hovering over anything special, then we'll check for map areas
            var chunk = CAMERA.getMouseChunk();
            if(chunk != null)
            {
                var mapDef = chunk.getHighestLayerMapDefinition(WORLD.currentPlane);
                if(mapDef != null && !mapDef.hidden)
                {
                    var text = chunk.getDisplayName(WORLD.currentPlane);
                    this.mapToolTip.setText(text);
                    this.mapToolTip.update();
                    this.mapToolTip.setVisibility(true);
                } 
            }
        }
    }
}