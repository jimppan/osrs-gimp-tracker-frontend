import { HudObject, SpawnObject} from "../object.js";

// boottom, top and side pillars of the bototm right OSRS interface
const INTERFACE_PATH = 
{
    BASE_BOTTOM:'1174-0.png',
    BASE_TOP: '1173-0.png',
    BASE_LEFT_PILLAR: '1175-0.png',
    BASE_RIGHT_PILLAR:'1176-0.png',

    BUTTON_ON_EDGE_NOT_SELECTED: '1180-0.png',
    BUTTON_NON_EDGE_SELECTED: '1030-0.png',
    BUTTON_TL_SELECTED: '1026-0.png',
    BUTTON_TR_SELECTED: '1027-0.png',
    BUTTON_BL_SELECTED: '1028-0.png',
    BUTTON_BR_SELECTED: '1029-0.png',

    BUTTION_ICON_INVENTORY: '777-0.png',
}

// inventory, skills, equipment tabs etc...
export class MainInterface 
{
    constructor()
    {
        //var container = null;
    }

    init()
    {
        APP.loader.baseUrl = 'img/ui/';
        APP.loader.add(INTERFACE_PATH.BASE_BOTTOM);
        APP.loader.add(INTERFACE_PATH.BASE_TOP);
        APP.loader.add(INTERFACE_PATH.BASE_LEFT_PILLAR);
        APP.loader.add(INTERFACE_PATH.BASE_RIGHT_PILLAR);

        APP.loader.add(INTERFACE_PATH.BUTTON_ON_EDGE_NOT_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_NON_EDGE_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_TL_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_TR_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_BL_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_BR_SELECTED);

        APP.loader.add(INTERFACE_PATH.BUTTION_ICON_INVENTORY);
        APP.loader.baseUrl = '';
    }

    onAssetsLoaded()
    {
        //this.container = PIXI.Container();
        this.mainInterface   = new HudObject("MainInterface");

        this.baseBottom      = new HudObject("MainInterfaceBase");
        this.baseTop         = new HudObject("MainInterfaceBase");
        this.basePillarLeft  = new HudObject("MainInterfaceBase");
        this.basePillarRight = new HudObject("MainInterfaceBase");
        this.background      = new HudObject("MainInterfaceBase");

        this.baseBottom.graphic      = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_BOTTOM].texture);
        this.baseTop.graphic         = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_TOP].texture);
        this.basePillarLeft.graphic  = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_LEFT_PILLAR].texture);
        this.basePillarRight.graphic = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_RIGHT_PILLAR].texture);

        this.background.graphic      = new PIXI.Graphics();

        this.background.graphic.beginFill(0x7F6F6F);
        this.background.graphic.drawRect(-220, -305, 200, 300);
        this.background.graphic.endFill();
        this.background.graphic.alpha = 0.5;
        
        this.background.setParent(this.mainInterface);
        this.basePillarLeft.setParent(this.mainInterface);
        this.basePillarRight.setParent(this.mainInterface);
        this.baseBottom.setParent(this.mainInterface);
        this.baseTop.setParent(this.mainInterface);

        this.mainInterface.setAnchor(1, 1);
        
        this.baseBottom.setPosition(0, 0);
        this.basePillarRight.setPosition(-3, -37);
        this.basePillarLeft.setPosition(-212, -37);
        this.baseTop.setPosition(0, -298);

        this.mainInterface.setPosition(window.innerWidth, window.innerHeight);
        
        SpawnObject(this.mainInterface);
    }
}