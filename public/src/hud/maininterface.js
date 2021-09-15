import { HudObject, SpawnObject, StageObject} from "../object.js";
import { ImageButton, ToggleButton } from "./button.js"
import { InventoryInterface } from "./maininterface/inventory.js";
import { SkillsInterface } from "./maininterface/skills.js";
import { EquipmentInterface } from "./maininterface/equipment.js";
import { SettingsInterface } from "./maininterface/settings.js";
import { Interface } from "./interface.js"
import { Player } from "../player.js";

const INTERFACE_BUTTON_OFFSETS = 
[
    {x:-120, y:-317},
    {x:-186, y:-317},
    {x:-87, y:-317},
    {x:-87, y:-19}
]

const INTERFACE_TAB =
{
    INVENTORY: 0,
    SKILLS: 1,
    EQUIPMENT: 2,
    SETTINGS: 3,

    MAX: 4,
}

const INTERFACE_TAB_TEXTURES =
[
    '777-0.png',
    '222-0.png',
    '778-0.png',
    '908-0.png',
]

const INTERFACE_TAB_TITLES =
[
    'Inventory',
    'Skills',
    'Equipment',
    'Settings',
]

const INTERFACE_BASE_OFFSETS = 
[
    {x:0,y:0},
    {x:0, y:-298},
    {x:0, y:0},
    {x:-212, y:-37},
    {x:-3, y:-37},
    {x:-120, y:-317}
]

const INTERFACE_BASE =
{
    BACKROUND: 0,
    TOP: 1,
    BOTTOM: 2,
    LEFT_PILLAR: 3,
    RIGHT_PILLAR: 4,

    SELECTED_TAB: 5,
    MAX: 6,
}

const INTERFACE_BASE_TEXTURES = 
[
    '', // background is just a color
    '1173-0.png',
    '1174-0.png',
    '1175-0.png',
    '1176-0.png',
    '1030-0.png',
]

// inventory, skills, equipment tabs etc...
export class MainInterface extends Interface
{
    constructor(name)
    {
        super(name)
        this.currentTab = INTERFACE_TAB.NONE;
        this.tabs = new Array(INTERFACE_TAB.MAX);
        this.buttons = new Array(INTERFACE_TAB.MAX);
        this.base = new Array(INTERFACE_BASE.MAX);
    }

    init()
    {
        APP.loader.baseUrl = 'img/ui/';

        for(var i = 0; i < INTERFACE_BASE_TEXTURES.length; i++)
        {
            if(INTERFACE_BASE_TEXTURES[i] == '')
                continue;
            APP.loader.add(INTERFACE_BASE_TEXTURES[i]);
        }

        for(var i = 0; i < INTERFACE_TAB_TEXTURES.length; i++)
        {
            //if(INTERFACE_TAB_TEXTURES[i] == '')
             //   continue;
            APP.loader.add(INTERFACE_TAB_TEXTURES[i]);
        }

        APP.loader.baseUrl = '';
    }

    onAssetsLoaded()
    {
        this.base[INTERFACE_BASE.BOTTOM] 

        for(var i = 0; i < INTERFACE_BASE.MAX; i++)
            this.base[i] = new HudObject("MainInterfaceBase");

        for(var i = 0; i < INTERFACE_TAB.MAX; i++)
            this.buttons[i] = new MainInterfaceButton(INTERFACE_TAB_TITLES[i], this, i);

        this.tabs[INTERFACE_TAB.INVENTORY] = new InventoryInterface("InventoryInterface");
        this.tabs[INTERFACE_TAB.SKILLS]    = new SkillsInterface("SkillsInterface");
        this.tabs[INTERFACE_TAB.EQUIPMENT] = new EquipmentInterface("EquipmentInterface");
        this.tabs[INTERFACE_TAB.SETTINGS]  = new SettingsInterface("SettingsInterface");
    
        for(var i = 0; i < INTERFACE_BASE_TEXTURES.length; i++)
        {
            if(INTERFACE_BASE_TEXTURES[i] == '')
                continue;

            this.base[i].graphic = new PIXI.Sprite(APP.loader.resources[INTERFACE_BASE_TEXTURES[i]].texture);
            this.base[i].setParent(this);
            this.base[i].setPosition(INTERFACE_BASE_OFFSETS[i].x, INTERFACE_BASE_OFFSETS[i].y);
        }

        this.setAnchor(1, 1);
        this.base[INTERFACE_BASE.BACKROUND].graphic = new PIXI.Graphics();

        for(var i = 0; i < INTERFACE_TAB_TEXTURES.length; i++)
        {
            if(INTERFACE_TAB_TEXTURES[i] == '')
                continue;

            this.buttons[i].graphic = new PIXI.Sprite(APP.loader.resources[INTERFACE_TAB_TEXTURES[i]].texture);
            this.buttons[i].setParent(this);
            this.buttons[i].setAnchor(0.5, 0.5);
            this.buttons[i].setPosition(INTERFACE_BUTTON_OFFSETS[i].x, INTERFACE_BUTTON_OFFSETS[i].y);
            this.buttons[i].interactable = true;
        }

        this.base[INTERFACE_BASE.BACKROUND].graphic.beginFill(0x7F6F6F);
        this.base[INTERFACE_BASE.BACKROUND].graphic.drawRect(-220, -305, 200, 300);
        this.base[INTERFACE_BASE.BACKROUND].graphic.endFill();
        this.base[INTERFACE_BASE.BACKROUND].graphic.alpha = 0.3;

        for(var i = 0; i < INTERFACE_TAB.MAX; i++)
            this.tabs[i].setParent(this);

        this.base[INTERFACE_BASE.SELECTED_TAB].setAnchor(0.5, 0.5);

        this.setPosition(window.innerWidth, window.innerHeight);
    
        this.openInterface(INTERFACE_TAB.INVENTORY);
    }

    openInterface(interfaceTab)
    {
        if(interfaceTab == this.currentTab)
            return;

        this.tabs[interfaceTab].update();

        for(var i = 0; i < INTERFACE_TAB.MAX; i++)
            this.tabs[i].setVisibility(false);

        this.tabs[interfaceTab].setVisibility(true);
        console.log("OPEN NEW INTERFACE: ", interfaceTab)
        var pos = this.gamePosition;
        this.base[INTERFACE_BASE.SELECTED_TAB].setPosition(pos.x + INTERFACE_BUTTON_OFFSETS[interfaceTab].x, pos.y + INTERFACE_BUTTON_OFFSETS[interfaceTab].y);

        this.currentTab = interfaceTab;
    }

    setVisibility(value)
    {
        for(var i = 0; i < INTERFACE_TAB.MAX; i++)
        {
            this.tabs[i].setVisibility(false);
            this.buttons[i].setVisibility(value);
        }

        for(var i = 0; i < INTERFACE_BASE.MAX; i++)
            this.base[i].setVisibility(value);

        this.tabs[this.currentTab].setVisibility(value);
    }

    onInterfaceTabClicked(interfaceTab)
    {
        this.openInterface(interfaceTab);
    }

    update()
    {
        if(!(SELECTED_OBJECT instanceof Player))
        {
            this.setVisibility(false);
            return;
        }

        this.tabs[this.currentTab].update();
        this.setVisibility(true);
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

    // anchored by 0.5 0.5
    getInteractableRect()
    {
        return {x: this.graphic.position.x - 16, y:this.graphic.position.y - 18, width: 32, height: 36}
    }

    onClick()
    {
        console.log(this.getInteractableRect());
        this.mainInterface.onInterfaceTabClicked(this.interfaceTab);
    }
}