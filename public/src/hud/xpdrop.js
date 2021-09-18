import { numberWithCommas } from "../helpers.js";
import { StageObject, SpawnObject, DeleteObject} from "../object.js";
import { CHUNK_TILE_HEIGHT } from "../world.js";
import { SKILLS_ICON_TEXTURES } from "./maininterface/skills.js";

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

export class XPDrop extends StageObject
{
    constructor(name, skillId, experience)
    {
        super(name);

        // magic for keeping position and zoom
        this.spawnPos = {x:0, y:0}
        this.spawnIndex = 0;
        this.amountTravelled = 0;

        this.skillId = skillId;
        this.experience = experience;
        this.graphic = new PIXI.Sprite(APP.loader.resources[XP_DROP_TEXTURES[this.skillId]].texture);
        this.timeToKill = -1;
        this.keepScale = true;
        this.graphic.zIndex = 1;
        this.graphic.anchor.set(1,0.5);

        this.xpdropLabel = new StageObject("XPDropLabel");
        this.xpdropLabel.keepScale = true;
        
        this.xpdropLabel.graphic = new PIXI.Text(`${numberWithCommas(experience)}`, XPDROP_TEXT); 
        this.xpdropLabel.graphic.resolution = 16;
        this.xpdropLabel.graphic.zIndex = 1;
        
        this.xpdropLabel.graphic.scale.x = (1 / CAMERA.zoom.x);
        this.xpdropLabel.graphic.scale.y = (-1 / CAMERA.zoom.y);

        this.xpdropLabel.graphic.anchor.set(0,0.5);
        this.xpdropLabel.setWorldPosition((1 / CAMERA.zoom.x) * 6, (1 / CAMERA.zoom.y) * -8);

        this.xpdropLabel.setParent(this);

        this.graphic.scale.x = (1 / CAMERA.zoom.x);
        this.graphic.scale.y = (1 / CAMERA.zoom.y);
    }

    onZoom(x, y)
    {
        if(this.keepScale)
        {
            this.graphic.scale.x = (1 / x);
            this.graphic.scale.y = (this.graphic.scale.y > 0?(1 / y):(-1 / y));

            this.setWorldPosition(this.getWorldPosition().x, this.amountTravelled + (this.spawnPos.y - ((-1 / y) * (XP_DROP_OFFSET * this.spawnIndex))));
            this.xpdropLabel.setWorldPosition(this.getWorldPosition().x + (1 / x) * 6, this.getWorldPosition().y + (1 / y) * -8);
        }
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
        APP.loader.baseUrl = 'img/world/';
        APP.loader.add(XP_DROP_TEXTURES);
        APP.loader.baseUrl = '';
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

    displayDrops(position)
    {
        for(var i = 0; i < this.dropQueue.length; i++)
        {
            this.dropQueue[i].amountTravelled = 0;
            this.dropQueue[i].spawnIndex = i;
            this.dropQueue[i].spawnPos = {x:position.x, y:position.y};
            this.dropQueue[i].setWorldPosition(position.x, position.y - (-1 / CAMERA.zoom.y) * (XP_DROP_OFFSET * i));
            this.dropQueue[i].timeToKill = APP.elapsedTime + XP_DROP_LIFE;
            
            SpawnObject(this.dropQueue[i]);

            this.activeDrops.push(this.dropQueue[i]);
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

            var prevPos = this.activeDrops[i].getWorldPosition();
            
            var delta = XP_DROP_TRAVEL_AMOUNT * APP.ticker.elapsedMS * (1 / CAMERA.zoom.y);
            this.activeDrops[i].amountTravelled += delta;
            this.activeDrops[i].setWorldPosition(prevPos.x, prevPos.y + delta)
            
            if(APP.elapsedTime >= this.activeDrops[i].timeToKill)
                this.removeDrop(this.activeDrops[i]);
        }
    }
}