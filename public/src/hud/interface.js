import { HudObject, SpawnObject} from "../object.js";
import { ImageButton, ToggleButton } from "./button.js"
import { InventoryInterface } from "./inventory.js";

// boottom, top and side pillars of the bototm right OSRS interface
const INTERFACE_PATH = 
{
    BASE_BOTTOM:'1174-0.png',
    BASE_TOP: '1173-0.png',
    BASE_LEFT_PILLAR: '1175-0.png',
    BASE_RIGHT_PILLAR:'1176-0.png',

    BUTTON_NON_EDGE_SELECTED: '1030-0.png',
    /* BUTTON_TL_SELECTED: '1026-0.png',
    BUTTON_TR_SELECTED: '1027-0.png',
    BUTTON_BL_SELECTED: '1028-0.png',
    BUTTON_BR_SELECTED: '1029-0.png', */

    BUTTON_ICON_INVENTORY: '777-0.png',
    BUTTON_ICON_SKILLS: '222-0.png',
    BUTTON_ICON_EQUIPMENT: '778-0.png',
    BUTTON_ICON_SETTINGS: '908-0.png',
}

const INTERFACE_BUTTON_OFFSETS = 
[
    {x:0,y:0},
    {x:-120, y:-317},
    {x:-186, y:-317},
    {x:-87, y:-317},
    {x:-87, y:-19}
]

const INTERFACE_TAB =
{
    NONE: 0,
    INVENTORY: 1,
    SKILLS: 2,
    EQUIPMENT: 3,
    SETTINGS: 4,
}

// inventory, skills, equipment tabs etc...
export class MainInterface 
{
    constructor()
    {
        this.currentTab = INTERFACE_TAB.NONE;
        this.inventoryInterface = null;
    }

    init()
    {
        APP.loader.baseUrl = 'img/ui/';
        APP.loader.add(INTERFACE_PATH.BASE_BOTTOM);
        APP.loader.add(INTERFACE_PATH.BASE_TOP);
        APP.loader.add(INTERFACE_PATH.BASE_LEFT_PILLAR);
        APP.loader.add(INTERFACE_PATH.BASE_RIGHT_PILLAR);

        APP.loader.add(INTERFACE_PATH.BUTTON_NON_EDGE_SELECTED);

        // not using for now
        /* APP.loader.add(INTERFACE_PATH.BUTTON_TL_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_TR_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_BL_SELECTED);
        APP.loader.add(INTERFACE_PATH.BUTTON_BR_SELECTED); */

        APP.loader.add(INTERFACE_PATH.BUTTON_ICON_INVENTORY);
        APP.loader.add(INTERFACE_PATH.BUTTON_ICON_SKILLS);
        APP.loader.add(INTERFACE_PATH.BUTTON_ICON_EQUIPMENT);
        APP.loader.add(INTERFACE_PATH.BUTTON_ICON_SETTINGS);
        APP.loader.baseUrl = '';
    }

    onAssetsLoaded()
    {
        //this.container = PIXI.Container();
        this.mainInterface     = new HudObject("MainInterface");

        this.baseBottom                       = new HudObject("MainInterfaceBase");
        this.baseTop                          = new HudObject("MainInterfaceBase");
        this.basePillarLeft                   = new HudObject("MainInterfaceBase");
        this.basePillarRight                  = new HudObject("MainInterfaceBase");
        this.background                       = new HudObject("MainInterfaceBase");
        this.inventoryButton                  = new MainInterfaceButton("Inventory", this, INTERFACE_TAB.INVENTORY);
        this.skillsButton                     = new MainInterfaceButton("Skills", this, INTERFACE_TAB.SKILLS);
        this.equipmentButton                  = new MainInterfaceButton("Worn Equipment", this, INTERFACE_TAB.EQUIPMENT);
        this.settingsButton                   = new MainInterfaceButton("Settings", this, INTERFACE_TAB.SETTINGS);
        this.buttonSelectBackground           = new HudObject("Background");
        this.inventoryInterface               = new InventoryInterface("InventoryInterface");

        this.baseBottom.graphic                       = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_BOTTOM].texture);
        this.baseTop.graphic                          = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_TOP].texture);
        this.basePillarLeft.graphic                   = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_LEFT_PILLAR].texture);
        this.basePillarRight.graphic                  = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BASE_RIGHT_PILLAR].texture);
        this.background.graphic                       = new PIXI.Graphics();
        this.inventoryButton.graphic                  = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BUTTON_ICON_INVENTORY].texture);
        this.skillsButton.graphic                     = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BUTTON_ICON_SKILLS].texture);
        this.equipmentButton.graphic                  = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BUTTON_ICON_EQUIPMENT].texture);
        this.settingsButton.graphic                   = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BUTTON_ICON_SETTINGS].texture);
        this.buttonSelectBackground.graphic           = new PIXI.Sprite(APP.loader.resources[INTERFACE_PATH.BUTTON_NON_EDGE_SELECTED].texture);

        this.background.graphic.beginFill(0x7F6F6F);
        this.background.graphic.drawRect(-220, -305, 200, 300);
        this.background.graphic.endFill();
        this.background.graphic.alpha = 0.3;
        
        this.background.setParent(this.mainInterface);
        this.baseBottom.setParent(this.mainInterface);
        this.baseTop.setParent(this.mainInterface);
        this.basePillarLeft.setParent(this.mainInterface);
        this.basePillarRight.setParent(this.mainInterface);
        this.buttonSelectBackground.setParent(this.mainInterface);
        this.mainInterface.setAnchor(1, 1);
        
        this.baseBottom.setPosition(0, 0);
        this.basePillarRight.setPosition(-3, -37);
        this.basePillarLeft.setPosition(-212, -37);
        this.baseTop.setPosition(0, -298);

        this.inventoryButton.setParent(this.mainInterface);
        this.skillsButton.setParent(this.mainInterface);
        this.equipmentButton.setParent(this.mainInterface);
        this.settingsButton.setParent(this.mainInterface);
        this.inventoryInterface.setParent(this.mainInterface);

        this.inventoryButton.setAnchor(0.5, 0.5);
        this.skillsButton.setAnchor(0.5, 0.5);
        this.equipmentButton.setAnchor(0.5, 0.5);
        this.settingsButton.setAnchor(0.5, 0.5);
        this.buttonSelectBackground.setAnchor(0.5, 0.5);
        this.inventoryInterface.setAnchor(0.5, 0.5);

        this.inventoryButton.setPosition(INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.INVENTORY].x, INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.INVENTORY].y);
        this.skillsButton.setPosition(INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.SKILLS].x, INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.SKILLS].y);
        this.equipmentButton.setPosition(INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.EQUIPMENT].x, INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.EQUIPMENT].y);
        this.settingsButton.setPosition(INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.SETTINGS].x, INTERFACE_BUTTON_OFFSETS[INTERFACE_TAB.SETTINGS].y);

        this.mainInterface.setPosition(window.innerWidth, window.innerHeight);
        
        this.inventoryButton.interactable = true;
        this.skillsButton.interactable = true;
        this.equipmentButton.interactable = true;
        this.settingsButton.interactable = true;
        
        SpawnObject(this.mainInterface);
        this.openInterface(INTERFACE_TAB.INVENTORY);
    }

    openInterface(interfaceTab)
    {
        if(interfaceTab == this.currentTab)
            return;

        var pos = this.mainInterface.gamePosition;

        this.currentTab = interfaceTab;
        this.buttonSelectBackground.setPosition(pos.x + INTERFACE_BUTTON_OFFSETS[interfaceTab].x, pos.y + INTERFACE_BUTTON_OFFSETS[interfaceTab].y);
    }

    onInterfaceTabClicked(interfaceTab)
    {
        this.openInterface(interfaceTab);
    }

    update()
    {
        switch(this.currentTab)
        {
            case INTERFACE_TAB.INVENTORY:
                this.inventoryInterface.update();
                break;
        }
    }
}

class MainInterfaceButton extends ImageButton
{
    constructor(name, mainInterface, interfaceTab)
    {
        super(name);
        this.mainInterface = mainInterface;
        this.interfaceTab = interfaceTab;
    }

    onClick()
    {
        this.mainInterface.onInterfaceTabClicked(this.interfaceTab);
    }
}