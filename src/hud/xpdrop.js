import { numberWithCommas } from "../helpers.js";
import { SpawnObject, DeleteObject, HudText, HudObject} from "../object.js";

const XP_DROP_LIFE = 2000;
const XP_DROP_OFFSET = 16; // when multiple drops spawn in same tick, how far off eachother should they be
const XP_DROP_TRAVEL_AMOUNT = 0.05;

const XPDROP_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#ffffff'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

export const XP_DROP_TEXTURES = 
[
    '3187-0.png',
    '3189-0.png',
    '3188-0.png',
    '3194-0.png',
    '3190-0.png',
    '3191-0.png',
    '3192-0.png',
    '3203-0.png',
    '3205-0.png',
    '3199-0.png',
    '3202-0.png',
    '3204-0.png',
    '3198-0.png',
    '3201-0.png',
    '3200-0.png',
    '3196-0.png',
    '3195-0.png',
    '3197-0.png',
    '3206-0.png',
    '3207-0.png',
    '3193-0.png',
    '3209-0.png',
    '3208-0.png',
]

export class XPDrop extends HudObject
{
    constructor(name, skillId, experience)
    {
        super(name);

        this.skillId = skillId;
        this.experience = experience;
        this.graphic = new PIXI.Sprite(APP.resourceManager.getTexture(XP_DROP_TEXTURES[this.skillId]));
        this.timeToKill = -1;
        this.graphic.zIndex = 1;
        this.graphic.anchor.set(1,0.5);

        this.xpdropLabel = new HudText("XPDropLabel", `${numberWithCommas(experience)}`, XPDROP_TEXT, 16);

        this.xpdropLabel.graphic.zIndex = 1;
        this.xpdropLabel.graphic.anchor.set(0,0);
        this.xpdropLabel.attachTo(this, false, 2, 6);
    }
}

export class XPDropper
{
    constructor()
    {
        this.dropQueue = [];
        this.activeDrops = [];

        APP.ticker.add(() => {this.update()})
    }

    init()
    {
        APP.resourceManager.add('img/world/', XP_DROP_TEXTURES);
    }

    addDrop(skillId, experience)
    {
        this.dropQueue.push(new XPDrop("XPDrop", skillId, experience));
    }

    clearDrops()
    {
        for(var i = 0; i < this.activeDrops.length; i++)
            DeleteObject(this.activeDrops[i]);
        
        this.activeDrops = [];
    }

    displayDrops(object)
    {
        // only display XP drops if the object is on same plane as the camera
        if(WORLD.currentPlane == object.plane)
        {
            for(var i = 0; i < this.dropQueue.length; i++)
            {
                this.dropQueue[i].attachTo(object, false, 0, XP_DROP_OFFSET * i)
    
                //this.dropQueue[i].setPosition(position.x, position.y - (XP_DROP_OFFSET * i));
                this.dropQueue[i].timeToKill = APP.elapsedTime + XP_DROP_LIFE;
                
                SpawnObject(this.dropQueue[i]);
    
                this.activeDrops.push(this.dropQueue[i]);
            }
        }
        
        this.dropQueue = [];
    }

    removeDrop(drop)
    {
        var index = this.activeDrops.indexOf(drop);
        if(index > -1)
        {
            DeleteObject(this.activeDrops[index]);
            this.activeDrops.splice(index, 1);
        }
    }

    update()
    {
        for(var i = this.activeDrops.length-1; i >= 0; i--)
        {
            if(this.activeDrops[i].timeToKill <= -1)
                continue;

            var prevPos = this.activeDrops[i].getPosition();
            
            var delta = XP_DROP_TRAVEL_AMOUNT * APP.ticker.elapsedMS;

            this.activeDrops[i].offset.y += delta;
            
            if(APP.elapsedTime >= this.activeDrops[i].timeToKill)
                this.removeDrop(this.activeDrops[i]);
        }
    }
}