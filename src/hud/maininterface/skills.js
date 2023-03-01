import { HudObject, HudText } from "../../object.js";
import { Interface } from "../interface.js";
import { LEVELS, Player, SKILLS, SKILL_NAMES } from "../../player.js";

const SKILLS_OFFSETS =
[
    {x:0, y:0}, // att
    {x:0, y:2}, // def
    {x:0, y:1}, // str
    {x:1, y:0}, // hp
    {x:0, y:3}, // ranged
    {x:0, y:4}, // prayer
    {x:0, y:5}, // magic
    {x:2, y:3}, // cooking
    {x:2, y:5}, // wc
    {x:1, y:5}, // fletching
    {x:2, y:2}, // fishing
    {x:2, y:4}, // firemaking
    {x:1, y:4}, // crafting
    {x:2, y:1}, // smithing
    {x:2, y:0}, // mining
    {x:1, y:2}, // herb
    {x:1, y:1}, // agi
    {x:1, y:3}, // thieving
    {x:1, y:6}, // slayer
    {x:2, y:6}, // farming
    {x:0, y:6}, // rc
    {x:1, y:7}, // hunter
    {x:0, y:7}, // con
    
    {x:2, y:7}, // total
]

export const SKILLS_ICON_TEXTURES = 
[
    '197-0.png',
    '199-0.png',
    '198-0.png',
    '203-0.png',
    '200-0.png',
    '201-0.png',
    '202-0.png',
    '212-0.png',
    '214-0.png',
    '208-0.png',
    '211-0.png',
    '213-0.png',
    '207-0.png',
    '210-0.png',
    '209-0.png',
    '205-0.png',
    '204-0.png',
    '206-0.png',
    '216-0.png',
    '217-0.png',
    '215-0.png',
    '220-0.png',
    '221-0.png',
]

const SKILLS_BASE = 
{
    BACKGROUND_LEFT: 0,
    BACKGROUND_RIGHT: 1,

    TOTAL_LEFT: 2,
    TOTAL_RIGHT: 3,
}

const SKILLS_BASE_TEXTURES = 
[
    '174-0.png',
    '175-0.png',
    '183-0.png',
    '184-0.png',
]

function GetLevelFromExperience(xp)
{
    for(var i = LEVELS.length; i >= 0; i--)
    {
        if(xp >= LEVELS[i])
            return i + 1;
    }
    return 1;
}

export function GetGoalExperience(currentXP)
{
    for(var i = 0; i < LEVELS.length; i++)
    {
        if(LEVELS[i] >= currentXP)
        {
            if(i == LEVELS.length-1)
                return LEVELS[i];

            return LEVELS[i];
        }
    }
    return 1;
}

export function GetRemainingExperienceToGoal(currentXP)
{
    return GetGoalExperience(currentXP) - currentXP;
}

const SKILLS_ICON_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#ffff00'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

const SKILLS_OFFSET = {x:-184, y:281};

export class InterfaceSkillSlot extends HudObject
{
    constructor(name, skillId, experience)
    {
        super(name);

        this.interactable = true;

        this.skillId = skillId;
        this.experience = experience;

        this.backgroundLeft  = new HudObject("InterfaceSkillBG1");
        this.backgroundRight = new HudObject("InterfaceSkillBG2");
        this.text1           = new HudText("InterfaceSkillText1", '1', SKILLS_ICON_TEXT, 16);
        this.text2           = new HudText("InterfaceSkillText2", '1', SKILLS_ICON_TEXT, 16);

        if(skillId == SKILLS.TOTAL)
            return;

        this.skillIcon = new HudObject("InterfaceSkillIcon");
        
    }

    getScreenRect()
    {
        return {x: this.backgroundLeft.getPosition().x, y:this.backgroundLeft.getPosition().y - 14, width: 63, height: 30}
    }

    isVisible()
    {
        return this.backgroundLeft.isVisible();
    }

    onAssetsLoaded()
    {
        if(this.skillId == SKILLS.TOTAL)
        {
            this.backgroundLeft.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(SKILLS_BASE_TEXTURES[SKILLS_BASE.TOTAL_LEFT])));
            this.backgroundRight.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(SKILLS_BASE_TEXTURES[SKILLS_BASE.TOTAL_RIGHT])));

            this.text1.setText(`Total level:`);
            this.text2.setText(`0`);
        }
        else
        {
            this.backgroundLeft.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(SKILLS_BASE_TEXTURES[SKILLS_BASE.BACKGROUND_LEFT])));
            this.backgroundRight.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(SKILLS_BASE_TEXTURES[SKILLS_BASE.BACKGROUND_RIGHT])));
            this.skillIcon.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(SKILLS_ICON_TEXTURES[this.skillId])));

            this.skillIcon.setVisibility(false);
            this.skillIcon.setAnchor(0.5, 0.5);
            this.skillIcon.setPosition(-15, -1);
            this.skillIcon.setParent(this);
            this.skillIcon.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);
        }

        this.text1.setAnchor(0.5, 0.5);
        this.text2.setAnchor(0.5, 0.5);

        this.backgroundLeft.setVisibility(false);
        this.backgroundRight.setVisibility(false);
        this.text1.setVisibility(false);
        this.text2.setVisibility(false);

        this.backgroundLeft.setAnchor(0, 0.5);
        this.backgroundRight.setAnchor(0, 0.5);

        this.backgroundLeft.setPosition(-31, 0);
        this.backgroundRight.setPosition(0, 0);

        if(this.skillId == SKILLS.TOTAL)
        {
            this.text1.setPosition(9, -4);
            this.text2.setPosition(9, -14);  
        }
        else
        {
            this.text1.setPosition(16, -2);
            this.text2.setPosition(28, -14);
        }

        this.backgroundLeft.setParent(this);
        this.backgroundRight.setParent(this);
        this.text1.setParent(this);
        this.text2.setParent(this);
        
        this.backgroundLeft.setZIndex(HUD_LAYERS.INTERFACE_BACKGROUND);
        this.backgroundRight.setZIndex(HUD_LAYERS.INTERFACE_BACKGROUND);
        this.text1.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);
        this.text2.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);
    }
}

export class SkillsInterface extends Interface
{
    constructor(name)
    {
        super(name);

        this.skillSlots = new Array(SKILLS.TOTAL+1);
        for(var i = 0; i < SKILLS.TOTAL+1; i++)
            this.skillSlots[i] = new InterfaceSkillSlot(SKILL_NAMES[i], i, 0);
    }

    init()
    {
        APP.resourceManager.add('img/ui/', SKILLS_ICON_TEXTURES);
        APP.resourceManager.add('img/ui/', SKILLS_BASE_TEXTURES);
    }

    onAssetsLoaded()
    {
        for(var i = 0; i < SKILLS.TOTAL+1; i++)
        {
            this.skillSlots[i].onAssetsLoaded();
            this.skillSlots[i].setParent(this);
            this.skillSlots[i].setPosition(SKILLS_OFFSET.x + (63 * SKILLS_OFFSETS[i].x), SKILLS_OFFSET.y - (32 * SKILLS_OFFSETS[i].y));
        }
    }

    isVisible()
    {
        return this.skillSlots[SKILLS.TOTAL].isVisible();
    }

    getSlot(slot)
    {
        return this.skillSlots[slot];
    }

    setExperience(skillId, experience)
    {
        var slot = this.getSlot(skillId);
        slot.experience = experience;

        var xp = GetLevelFromExperience(slot.experience);
        slot.text1.setText(`${xp}`);
        slot.text2.setText(`${xp}`);
    }

    getTotal()
    {
        var count = 0;
        for(var i = 0; i < SKILLS.TOTAL; i++)
        {
            var skillInterfaceSlot = this.getSlot(i);
            count += GetLevelFromExperience(skillInterfaceSlot.experience);
        }
        return count;
    }

    getTotalExperience()
    {
        var count = 0;
        for(var i = 0; i < SKILLS.TOTAL; i++)
        {
            var skillInterfaceSlot = this.getSlot(i);
            count += skillInterfaceSlot.experience;
        }
        return count;
    }

    update()
    {
        if(SELECTED_OBJECT == null)
            return;

        if(!(SELECTED_OBJECT instanceof Player))
            return;

        for(var i = 0; i < SKILLS.TOTAL; i++)
            this.setExperience(i, SELECTED_OBJECT.skills[i].experience);

        this.getSlot(SKILLS.TOTAL).experience = this.getTotalExperience();
        this.getSlot(SKILLS.TOTAL).text2.setText(`${this.getTotal()}`);
    }
}