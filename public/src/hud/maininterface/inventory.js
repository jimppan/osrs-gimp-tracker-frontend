import { GetItemComposition } from "../../resource/itemdatabase.js";
import { HudObject, HudText } from "../../object.js";
import { Player } from "../../player.js";
import { Interface } from "../interface.js";

export const INVENTORY_SIZE = 28;
export const INVALID_ITEM = -1;
const INVENTORY_ROWS = 4;

const ITEM_ICON_TEXT_M = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#00ff99'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

const ITEM_ICON_TEXT_K = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#ffffff'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

const ITEM_ICON_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#ffff00'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

const INVENTORY_OFFSET = {x:-180, y:275};

export class InterfaceItemSlot extends HudObject
{
    constructor(name, itemId, quantity)
    {
        super(name);

        this.itemId = itemId;
        this.quantity = quantity;
        this.icon = new HudObject("InterfaceItemSlotIcon");
        this.text = new HudText("InterfaceItemSlotText", `${quantity}`, ITEM_ICON_TEXT, 16);

        this.icon.setGraphic(new PIXI.Sprite());

        this.interactable = true;

        this.icon.setVisibility(false);
        this.text.setVisibility(false);

        this.icon.setAnchor(0.5, 0.5);
        this.text.setAnchor(0, 0.5);

        this.text.setPosition(-18, 4);
        this.text.setParent(this.icon);
        this.icon.setParent(this);

        this.icon.setZIndex(HUD_LAYERS.INTERFACE);
        this.text.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);
    }

    getScreenRect()
    {
        return this.icon.getScreenRect();
    }

    isVisible()
    {
        return this.parent.isVisible() && this.itemId != INVALID_ITEM;
    }

    setVisibility(value)
    {
        var visible = value;
        if(this.itemId == INVALID_ITEM)
            visible = false;

        this.icon.setVisibility(visible);

        var comp = GetItemComposition(this.itemId);
        this.text.setVisibility(this.itemId != INVALID_ITEM && this.quantity > 0 && comp.stackable && visible)
    }

    loadSprite()
    {
        if(this.itemId == INVALID_ITEM)
        {
            if(this.icon != null)
            {
                this.icon.graphic.texture = null;
                this.setVisibility(false);
            }
        }
        else
        {
            var comp = GetItemComposition(this.itemId);

            this.name = comp.name;
            
            var itemIconId = this.itemId;

            switch(this.itemId)
            {
                // theres 10 icons for coins, depending on quantity
                case 995:
                    if(this.quantity >= 10000) itemIconId = 1004;
                    else if(this.quantity >= 1000) itemIconId = 1003;
                    else if(this.quantity >= 250) itemIconId = 1002;
                    else if(this.quantity >= 100) itemIconId = 1001;
                    else if(this.quantity >= 25) itemIconId = 1000;
                    else if(this.quantity >= 5) itemIconId = 999;
                    else if(this.quantity >= 4) itemIconId = 998;
                    else if(this.quantity >= 3) itemIconId = 997;
                    else if(this.quantity >= 2) itemIconId = 996;
                    break;

                    //Arrow shaft
                case 52:
                    if(this.quantity >= 5) itemIconId = 6443;
                    else if(this.quantity >= 4) itemIconId = 6442;
                    else if(this.quantity >= 3) itemIconId = 6441;
                    else if(this.quantity >= 2) itemIconId = 6440;
                    break; 

                    //Headless arrow
                case 53:
                    if(this.quantity >= 5) itemIconId = 6447;
                    else if(this.quantity >= 4) itemIconId = 6446;
                    else if(this.quantity >= 3) itemIconId = 6445;
                    else if(this.quantity >= 2) itemIconId = 6444;
                    break; 

                    //Ogre arrow shaft
                case 2864:
                    if(this.quantity >= 5) itemIconId = 7926;
                    else if(this.quantity >= 4) itemIconId = 7925;
                    else if(this.quantity >= 3) itemIconId = 7924;
                    else if(this.quantity >= 2) itemIconId = 7923;
                    break;

                    //Flighted ogre arrow
                case 2865:
                    if(this.quantity >= 5) itemIconId = 11163;
                    else if(this.quantity >= 4) itemIconId = 11162;
                    else if(this.quantity >= 3) itemIconId = 11161;
                    else if(this.quantity >= 2) itemIconId = 11160;
                    break;  

                    //Bronze arrow
                case 882:
                    if(this.quantity >= 5) itemIconId = 897;
                    else if(this.quantity >= 4) itemIconId = 894;
                    else if(this.quantity >= 3) itemIconId = 895;
                    else if(this.quantity >= 2) itemIconId = 896;
                    break; 

                    //Iron arrow
                case 884:
                    if(this.quantity >= 5) itemIconId = 905;
                    else if(this.quantity >= 4) itemIconId = 902;
                    else if(this.quantity >= 3) itemIconId = 903;
                    else if(this.quantity >= 2) itemIconId = 904;
                    break; 

                    //Steel arrow
                case 886:
                    if(this.quantity >= 5) itemIconId = 913;
                    else if(this.quantity >= 4) itemIconId = 910;
                    else if(this.quantity >= 3) itemIconId = 911;
                    else if(this.quantity >= 2) itemIconId = 912;
                    break; 

                    //Mithri arrow
                case 888:
                    if(this.quantity >= 5) itemIconId = 921;
                    else if(this.quantity >= 4) itemIconId = 918;
                    else if(this.quantity >= 3) itemIconId = 919;
                    else if(this.quantity >= 2) itemIconId = 920;
                    break; 

                    //Adaman arrow
                case 890:
                    if(this.quantity >= 5) itemIconId = 929;
                    else if(this.quantity >= 4) itemIconId = 926;
                    else if(this.quantity >= 3) itemIconId = 927;
                    else if(this.quantity >= 2) itemIconId = 928;
                    break; 

                    //Rune arrow
                case 892:
                    if(this.quantity >= 5) itemIconId = 937;
                    else if(this.quantity >= 4) itemIconId = 934;
                    else if(this.quantity >= 3) itemIconId = 935;
                    else if(this.quantity >= 2) itemIconId = 936;
                    break; 

                    //Dragon arrow
                case 11212:
                    if(this.quantity >= 5) itemIconId = 11216;
                    else if(this.quantity >= 4) itemIconId = 11215;
                    else if(this.quantity >= 3) itemIconId = 11214;
                    else if(this.quantity >= 2) itemIconId = 11213;
                    break; 

                    //Amethyst arrow
                case 21326:
                    if(this.quantity >= 5) itemIconId = 4770;
                    else if(this.quantity >= 4) itemIconId = 4769;
                    else if(this.quantity >= 3) itemIconId = 4772;
                    else if(this.quantity >= 2) itemIconId = 4771;
                    break; 

                    //Bronze arrow(p)
                case 883:
                    if(this.quantity >= 5) itemIconId = 901;
                    else if(this.quantity >= 4) itemIconId = 898;
                    else if(this.quantity >= 3) itemIconId = 890;
                    else if(this.quantity >= 2) itemIconId = 900;
                    break; 

                    //Iron arrow(p)
                case 885:
                    if(this.quantity >= 5) itemIconId = 909;
                    else if(this.quantity >= 4) itemIconId = 906;
                    else if(this.quantity >= 3) itemIconId = 907;
                    else if(this.quantity >= 2) itemIconId = 908;
                    break; 

                    //Steel arrow(p)
                case 887:
                    if(this.quantity >= 5) itemIconId = 917;
                    else if(this.quantity >= 4) itemIconId = 914;
                    else if(this.quantity >= 3) itemIconId = 915;
                    else if(this.quantity >= 2) itemIconId = 916;
                    break; 

                    //Mithri arrow(p)
                case 889:
                    if(this.quantity >= 5) itemIconId = 925;
                    else if(this.quantity >= 4) itemIconId = 922;
                    else if(this.quantity >= 3) itemIconId = 923;
                    else if(this.quantity >= 2) itemIconId = 924;
                    break; 

                    //Adaman arrow(p)
                case 891:
                    if(this.quantity >= 5) itemIconId = 933;
                    else if(this.quantity >= 4) itemIconId = 930;
                    else if(this.quantity >= 3) itemIconId = 931;
                    else if(this.quantity >= 2) itemIconId = 932;
                    break; 

                    //Rune arrow(p)
                case 893:
                    if(this.quantity >= 5) itemIconId = 941;
                    else if(this.quantity >= 4) itemIconId = 938;
                    else if(this.quantity >= 3) itemIconId = 939;
                    else if(this.quantity >= 2) itemIconId = 940;
                    break; 

                    //Dragon arrow(p)
                case 11227:
                    if(this.quantity >= 5) itemIconId = 11216;
                    else if(this.quantity >= 4) itemIconId = 11215;
                    else if(this.quantity >= 3) itemIconId = 11214;
                    else if(this.quantity >= 2) itemIconId = 11213;
                    break; 

                    //Amethyst arrow(p)
                case 21332:
                    if(this.quantity >= 5) itemIconId = 4766;
                    else if(this.quantity >= 4) itemIconId = 4765;
                    else if(this.quantity >= 3) itemIconId = 4764;
                    else if(this.quantity >= 2) itemIconId = 4763;
                    break; 

                    //Bronze arrow(p+)
                case 5616:
                    if(this.quantity >= 5) itemIconId = 901;
                    else if(this.quantity >= 4) itemIconId = 898;
                    else if(this.quantity >= 3) itemIconId = 890;
                    else if(this.quantity >= 2) itemIconId = 900;
                    break; 

                    //Iron arrow(p+)
                case 5617:
                    if(this.quantity >= 5) itemIconId = 909;
                    else if(this.quantity >= 4) itemIconId = 906;
                    else if(this.quantity >= 3) itemIconId = 907;
                    else if(this.quantity >= 2) itemIconId = 908;
                    break; 

                    //Steel arrow(p+)
                case 5618:
                    if(this.quantity >= 5) itemIconId = 917;
                    else if(this.quantity >= 4) itemIconId = 914;
                    else if(this.quantity >= 3) itemIconId = 915;
                    else if(this.quantity >= 2) itemIconId = 916;
                    break; 

                    //Mithri arrow(p+)
                case 5619:
                    if(this.quantity >= 5) itemIconId = 925;
                    else if(this.quantity >= 4) itemIconId = 922;
                    else if(this.quantity >= 3) itemIconId = 923;
                    else if(this.quantity >= 2) itemIconId = 924;
                    break; 

                    //Adaman arrow(p+)
                case 5620:
                    if(this.quantity >= 5) itemIconId = 933;
                    else if(this.quantity >= 4) itemIconId = 930;
                    else if(this.quantity >= 3) itemIconId = 931;
                    else if(this.quantity >= 2) itemIconId = 932;
                    break; 

                    //Rune arrow(p+)
                case 5621:
                    if(this.quantity >= 5) itemIconId = 941;
                    else if(this.quantity >= 4) itemIconId = 938;
                    else if(this.quantity >= 3) itemIconId = 939;
                    else if(this.quantity >= 2) itemIconId = 940;
                    break; 

                    //Dragon arrow(p+)
                case 11228:
                    if(this.quantity >= 5) itemIconId = 11216;
                    else if(this.quantity >= 4) itemIconId = 11215;
                    else if(this.quantity >= 3) itemIconId = 11214;
                    else if(this.quantity >= 2) itemIconId = 11213;
                    break; 

                    //Amethyst arrow(p+)
                case 21334:
                    if(this.quantity >= 5) itemIconId = 4766;
                    else if(this.quantity >= 4) itemIconId = 4765;
                    else if(this.quantity >= 3) itemIconId = 4764;
                    else if(this.quantity >= 2) itemIconId = 4763;
                    break; 

                    //Bronze arrow(p++)
                case 5622:
                    if(this.quantity >= 5) itemIconId = 901;
                    else if(this.quantity >= 4) itemIconId = 898;
                    else if(this.quantity >= 3) itemIconId = 890;
                    else if(this.quantity >= 2) itemIconId = 900;
                    break; 

                    //Iron arrow(p++)
                case 5623:
                    if(this.quantity >= 5) itemIconId = 909;
                    else if(this.quantity >= 4) itemIconId = 906;
                    else if(this.quantity >= 3) itemIconId = 907;
                    else if(this.quantity >= 2) itemIconId = 908;
                    break; 

                    //Steel arrow(p++)
                case 5624:
                    if(this.quantity >= 5) itemIconId = 917;
                    else if(this.quantity >= 4) itemIconId = 914;
                    else if(this.quantity >= 3) itemIconId = 915;
                    else if(this.quantity >= 2) itemIconId = 916;
                    break; 

                    //Mithri arrow(p++)
                case 5625:
                    if(this.quantity >= 5) itemIconId = 925;
                    else if(this.quantity >= 4) itemIconId = 922;
                    else if(this.quantity >= 3) itemIconId = 923;
                    else if(this.quantity >= 2) itemIconId = 924;
                    break; 

                    //Adaman arrow(p++)
                case 5626:
                    if(this.quantity >= 5) itemIconId = 933;
                    else if(this.quantity >= 4) itemIconId = 930;
                    else if(this.quantity >= 3) itemIconId = 931;
                    else if(this.quantity >= 2) itemIconId = 932;
                    break; 

                    //Rune arrow(p++)
                case 5627:
                    if(this.quantity >= 5) itemIconId = 941;
                    else if(this.quantity >= 4) itemIconId = 938;
                    else if(this.quantity >= 3) itemIconId = 939;
                    else if(this.quantity >= 2) itemIconId = 940;
                    break; 

                    //Dragon arrow(p++)
                case 11229:
                    if(this.quantity >= 5) itemIconId = 11216;
                    else if(this.quantity >= 4) itemIconId = 11215;
                    else if(this.quantity >= 3) itemIconId = 11214;
                    else if(this.quantity >= 2) itemIconId = 11213;
                    break; 

                    //Amethyst arrow(p++)
                case 21337:
                    if(this.quantity >= 5) itemIconId = 4766;
                    else if(this.quantity >= 4) itemIconId = 4765;
                    else if(this.quantity >= 3) itemIconId = 4764;
                    else if(this.quantity >= 2) itemIconId = 4763;
                    break; 

                    //Bronze fire arrow
                case 598:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Bronze fire arrow (lit)
                case 942:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;

                    //Iron fire arrow
                case 2532:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Iron fire arrow (lit)
                case 2533:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;

                    //Steel fire arrow
                case 2534:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Steel fire arrow (lit)
                case 2535:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;

                    //Mithril fire arrow
                case 2536:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Mithril fire arrow (lit)
                case 2537:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;

                    //Adamant fire arrow
                case 2538:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Adamant fire arrow (lit)
                case 2539:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;

                    //Rune fire arrow
                case 2540:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Rune fire arrow (lit)
                case 2541:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;

                    //Amethyst fire arrow
                case 21328:
                    if(this.quantity >= 5) itemIconId = 2545;
                    else if(this.quantity >= 4) itemIconId = 2544;
                    else if(this.quantity >= 3) itemIconId = 2543;
                    else if(this.quantity >= 2) itemIconId = 2542;
                    break;

                    //Amethyst fire arrow (lit)
                case 21330:
                    if(this.quantity >= 5) itemIconId = 2549;
                    else if(this.quantity >= 4) itemIconId = 2548;
                    else if(this.quantity >= 3) itemIconId = 2547;
                    else if(this.quantity >= 2) itemIconId = 2546;
                    break;                                                            

                    //Dragon fire arrow
                case 11217:
                    if(this.quantity >= 5) itemIconId = 11221;
                    else if(this.quantity >= 4) itemIconId = 11220;
                    else if(this.quantity >= 3) itemIconId = 11219;
                    else if(this.quantity >= 2) itemIconId = 11218;
                    break;

                    //Dragon fire arrow (lit)
                case 11222:
                    if(this.quantity >= 5) itemIconId = 11226;
                    else if(this.quantity >= 4) itemIconId = 11225;
                    else if(this.quantity >= 3) itemIconId = 11224;
                    else if(this.quantity >= 2) itemIconId = 11223;
                    break;

                    //Ice arrow
                case 78:
                    if(this.quantity >= 5) itemIconId = 82;
                    else if(this.quantity >= 4) itemIconId = 79;
                    else if(this.quantity >= 3) itemIconId = 80;
                    else if(this.quantity >= 2) itemIconId = 81;
                    break;

                    //Bullet arrow
                case 22227:
                    if(this.quantity >= 5) itemIconId = 1651;
                    else if(this.quantity >= 4) itemIconId = 1650;
                    else if(this.quantity >= 3) itemIconId = 1649;
                    else if(this.quantity >= 2) itemIconId = 19500;
                    break;

                    //Field arrow
                case 22228:
                    if(this.quantity >= 5) itemIconId = 21828;
                    else if(this.quantity >= 4) itemIconId = 21823;
                    else if(this.quantity >= 3) itemIconId = 21830;
                    else if(this.quantity >= 2) itemIconId = 21827;
                    break;

                    //Blunt arrow
                case 22229:
                    if(this.quantity >= 5) itemIconId = 6203;
                    else if(this.quantity >= 4) itemIconId = 6201;
                    else if(this.quantity >= 3) itemIconId = 21834;
                    else if(this.quantity >= 2) itemIconId = 21831;
                    break;

                    //Barbed arrow
                case 22230:
                    if(this.quantity >= 5) itemIconId = 6210;
                    else if(this.quantity >= 4) itemIconId = 6381;
                    else if(this.quantity >= 3) itemIconId = 6207;
                    else if(this.quantity >= 2) itemIconId = 6205;
                    break;

                    //Ogre arrow
                case 2866:
                    if(this.quantity >= 5) itemIconId = 2867;
                    else if(this.quantity >= 4) itemIconId = 2868;
                    else if(this.quantity >= 3) itemIconId = 2869;
                    else if(this.quantity >= 2) itemIconId = 2870;
                    break;

                    //Broad arrow
                case 4160:
                    if(this.quantity >= 5) itemIconId = 4172;
                    else if(this.quantity >= 4) itemIconId = 4173;
                    else if(this.quantity >= 3) itemIconId = 4174;
                    else if(this.quantity >= 2) itemIconId = 4175;
                    break;

                    //Broad Arrowheads
                case 11874:
                    if(this.quantity >= 5) itemIconId = 4455;
                    else if(this.quantity >= 4) itemIconId = 4453;
                    else if(this.quantity >= 3) itemIconId = 4451;
                    else if(this.quantity >= 2) itemIconId = 4449;
                    break;

                    //Training arrows
                case 9706:
                    if(this.quantity >= 5) itemIconId = 9710;
                    else if(this.quantity >= 4) itemIconId = 9707;
                    else if(this.quantity >= 3) itemIconId = 9708;
                    else if(this.quantity >= 2) itemIconId = 9709;
                    break;

                    //Opal bolt tips
                case 45:
                    if(this.quantity >= 5) itemIconId = 9202;
                    else if(this.quantity >= 4) itemIconId = 9201;
                    else if(this.quantity >= 3) itemIconId = 9200;
                    else if(this.quantity >= 2) itemIconId = 9199;
                    break; 

                    //Pearl bolt tips
                case 46:
                    if(this.quantity >= 5) itemIconId = 9202;
                    else if(this.quantity >= 4) itemIconId = 9201;
                    else if(this.quantity >= 3) itemIconId = 9200;
                    else if(this.quantity >= 2) itemIconId = 9199;
                    break; 

                    //Amethyst bolt tips
                case 21338:
                    if(this.quantity >= 5) itemIconId = 4768;
                    else if(this.quantity >= 4) itemIconId = 4767;
                    else if(this.quantity >= 3) itemIconId = 4762;
                    else if(this.quantity >= 2) itemIconId = 3951;
                    break;

                    //Jade bolt tips
                case 9187:
                    if(this.quantity >= 5) itemIconId = 9198;
                    else if(this.quantity >= 4) itemIconId = 9197;
                    else if(this.quantity >= 3) itemIconId = 9196;
                    else if(this.quantity >= 2) itemIconId = 9195;
                    break;

                    //Topaz bolt tips
                case 9188:
                    if(this.quantity >= 5) itemIconId = 9210;
                    else if(this.quantity >= 4) itemIconId = 9209;
                    else if(this.quantity >= 3) itemIconId = 9208;
                    else if(this.quantity >= 2) itemIconId = 9207;
                    break;

                    //Sapphire bolt tips
                case 9189:
                    if(this.quantity >= 5) itemIconId = 9214;
                    else if(this.quantity >= 4) itemIconId = 9213;
                    else if(this.quantity >= 3) itemIconId = 9212;
                    else if(this.quantity >= 2) itemIconId = 9211;
                    break;

                    //Emerald bolt tips
                case 9190:
                    if(this.quantity >= 5) itemIconId = 9218;
                    else if(this.quantity >= 4) itemIconId = 9217;
                    else if(this.quantity >= 3) itemIconId = 9216;
                    else if(this.quantity >= 2) itemIconId = 9215;
                    break;

                    //Ruby bolt tips
                case 9191:
                    if(this.quantity >= 5) itemIconId = 9222;
                    else if(this.quantity >= 4) itemIconId = 9221;
                    else if(this.quantity >= 3) itemIconId = 9220;
                    else if(this.quantity >= 2) itemIconId = 9219;
                    break;

                    //Diamond bolt tips
                case 9192:
                    if(this.quantity >= 5) itemIconId = 9226;
                    else if(this.quantity >= 4) itemIconId = 9225;
                    else if(this.quantity >= 3) itemIconId = 9224;
                    else if(this.quantity >= 2) itemIconId = 9223;
                    break;

                    //Dragonstone bolt tips
                case 9193:
                    if(this.quantity >= 5) itemIconId = 9230;
                    else if(this.quantity >= 4) itemIconId = 9229;
                    else if(this.quantity >= 3) itemIconId = 9228;
                    else if(this.quantity >= 2) itemIconId = 9227;
                    break;

                    //Onyx bolt tips
                case 9194:
                    if(this.quantity >= 5) itemIconId = 9234;
                    else if(this.quantity >= 4) itemIconId = 9233;
                    else if(this.quantity >= 3) itemIconId = 9232;
                    else if(this.quantity >= 2) itemIconId = 9231;
                    break;

                    //Broad bolts
                case 11875:
                    if(this.quantity >= 5) itemIconId = 4296;
                    else if(this.quantity >= 4) itemIconId = 4282;
                    else if(this.quantity >= 3) itemIconId = 4280;
                    else if(this.quantity >= 2) itemIconId = 4036;
                    break;

                    //Unfinished broad bolts
                case 11876:
                    if(this.quantity >= 5) itemIconId = 5069;
                    else if(this.quantity >= 4) itemIconId = 4706;
                    else if(this.quantity >= 3) itemIconId = 4626;
                    else if(this.quantity >= 2) itemIconId = 4312;
                    break;

                    //Amethyst broad bolts
                case 21316:
                    if(this.quantity >= 5) itemIconId = 3902;
                    else if(this.quantity >= 4) itemIconId = 4177;
                    else if(this.quantity >= 3) itemIconId = 4076;
                    else if(this.quantity >= 2) itemIconId = 4000;
                    break;

                    //Bolt rack
                case 4740:
                    if(this.quantity >= 5) itemIconId = 4744;
                    else if(this.quantity >= 4) itemIconId = 4743;
                    else if(this.quantity >= 3) itemIconId = 4742;
                    else if(this.quantity >= 2) itemIconId = 4741;
                    break;

                    //Bone bolts
                case 8882:
                    if(this.quantity >= 5) itemIconId = 8886;
                    else if(this.quantity >= 4) itemIconId = 8885;
                    else if(this.quantity >= 3) itemIconId = 8884;
                    else if(this.quantity >= 2) itemIconId = 8883;
                    break;

                    //Bronze bolts (unf)
                case 9375:
                    if(this.quantity >= 5) itemIconId = 9386;
                    else if(this.quantity >= 4) itemIconId = 9385;
                    else if(this.quantity >= 3) itemIconId = 9384;
                    else if(this.quantity >= 2) itemIconId = 9383;
                    break;

                    //Bronze bolts
                case 877:
                    if(this.quantity >= 5) itemIconId = 3810;
                    else if(this.quantity >= 4) itemIconId = 3809;
                    else if(this.quantity >= 3) itemIconId = 3808;
                    else if(this.quantity >= 2) itemIconId = 3807;
                    break;

                    //Bronze bolts (p)
                case 878:
                    if(this.quantity >= 5) itemIconId = 3814;
                    else if(this.quantity >= 4) itemIconId = 3813;
                    else if(this.quantity >= 3) itemIconId = 3812;
                    else if(this.quantity >= 2) itemIconId = 3811;
                    break;

                    //Bronze bolts (p+)
                case 6061:
                    if(this.quantity >= 5) itemIconId = 3814;
                    else if(this.quantity >= 4) itemIconId = 3813;
                    else if(this.quantity >= 3) itemIconId = 3812;
                    else if(this.quantity >= 2) itemIconId = 3811;
                    break;

                    //Bronze bolts (p++)
                case 6062:
                    if(this.quantity >= 5) itemIconId = 3814;
                    else if(this.quantity >= 4) itemIconId = 3813;
                    else if(this.quantity >= 3) itemIconId = 3812;
                    else if(this.quantity >= 2) itemIconId = 3811;
                    break;

                    //Blurite bolts (unf)
                case 9376:
                    if(this.quantity >= 5) itemIconId = 9390;
                    else if(this.quantity >= 4) itemIconId = 9389;
                    else if(this.quantity >= 3) itemIconId = 9388;
                    else if(this.quantity >= 2) itemIconId = 9387;
                    break;

                    //Blurite bolts
                case 9139:
                    if(this.quantity >= 5) itemIconId = 9149;
                    else if(this.quantity >= 4) itemIconId = 9148;
                    else if(this.quantity >= 3) itemIconId = 9147;
                    else if(this.quantity >= 2) itemIconId = 9146;
                    break;

                    //Blurite bolts (p)
                case 9286:
                    if(this.quantity >= 5) itemIconId = 9310;
                    else if(this.quantity >= 4) itemIconId = 9309;
                    else if(this.quantity >= 3) itemIconId = 9308;
                    else if(this.quantity >= 2) itemIconId = 9307;
                    break;

                    //Blurite bolts (p+)
                case 9293:
                    if(this.quantity >= 5) itemIconId = 9310;
                    else if(this.quantity >= 4) itemIconId = 9309;
                    else if(this.quantity >= 3) itemIconId = 9308;
                    else if(this.quantity >= 2) itemIconId = 9307;
                    break;

                    //Blurite bolts (p++)
                case 9300:
                    if(this.quantity >= 5) itemIconId = 9310;
                    else if(this.quantity >= 4) itemIconId = 9309;
                    else if(this.quantity >= 3) itemIconId = 9308;
                    else if(this.quantity >= 2) itemIconId = 9307;
                    break;

                    //Iron bolts (unf)
                case 9377:
                    if(this.quantity >= 5) itemIconId = 9394;
                    else if(this.quantity >= 4) itemIconId = 9393;
                    else if(this.quantity >= 3) itemIconId = 9392;
                    else if(this.quantity >= 2) itemIconId = 9391;
                    break;

                    //Iron bolts
                case 9140:
                    if(this.quantity >= 5) itemIconId = 9153;
                    else if(this.quantity >= 4) itemIconId = 9152;
                    else if(this.quantity >= 3) itemIconId = 9151;
                    else if(this.quantity >= 2) itemIconId = 9150;
                    break;

                    //Iron bolts (p)
                case 9287:
                    if(this.quantity >= 5) itemIconId = 9314;
                    else if(this.quantity >= 4) itemIconId = 9313;
                    else if(this.quantity >= 3) itemIconId = 9312;
                    else if(this.quantity >= 2) itemIconId = 9311;
                    break;

                    //Iron bolts (p+)
                case 9294:
                    if(this.quantity >= 5) itemIconId = 9314;
                    else if(this.quantity >= 4) itemIconId = 9313;
                    else if(this.quantity >= 3) itemIconId = 9312;
                    else if(this.quantity >= 2) itemIconId = 9311;
                    break;

                    //Iron bolts (p++)
                case 9301:
                    if(this.quantity >= 5) itemIconId = 9314;
                    else if(this.quantity >= 4) itemIconId = 9313;
                    else if(this.quantity >= 3) itemIconId = 9312;
                    else if(this.quantity >= 2) itemIconId = 9311;
                    break;

                    //Steel bolts (unf)
                case 9378:
                    if(this.quantity >= 5) itemIconId = 9398;
                    else if(this.quantity >= 4) itemIconId = 9397;
                    else if(this.quantity >= 3) itemIconId = 9396;
                    else if(this.quantity >= 2) itemIconId = 9395;
                    break;

                    //Steel bolts
                case 9141:
                    if(this.quantity >= 5) itemIconId = 9157;
                    else if(this.quantity >= 4) itemIconId = 9156;
                    else if(this.quantity >= 3) itemIconId = 9155;
                    else if(this.quantity >= 2) itemIconId = 9154;
                    break;

                    //Steel bolts (p)
                case 9288:
                    if(this.quantity >= 5) itemIconId = 9318;
                    else if(this.quantity >= 4) itemIconId = 9317;
                    else if(this.quantity >= 3) itemIconId = 9316;
                    else if(this.quantity >= 2) itemIconId = 9315;
                    break;

                    //Steel bolts (p+)
                case 9295:
                    if(this.quantity >= 5) itemIconId = 9318;
                    else if(this.quantity >= 4) itemIconId = 9317;
                    else if(this.quantity >= 3) itemIconId = 9316;
                    else if(this.quantity >= 2) itemIconId = 9315;
                    break;

                    //Steel bolts (p++)
                case 9302:
                    if(this.quantity >= 5) itemIconId = 9318;
                    else if(this.quantity >= 4) itemIconId = 9317;
                    else if(this.quantity >= 3) itemIconId = 9316;
                    else if(this.quantity >= 2) itemIconId = 9315;
                    break;

                    //Mithril bolts (unf)
                case 9379:
                    if(this.quantity >= 5) itemIconId = 9402;
                    else if(this.quantity >= 4) itemIconId = 9401;
                    else if(this.quantity >= 3) itemIconId = 9400;
                    else if(this.quantity >= 2) itemIconId = 9399;
                    break;

                    //Mithril bolts
                case 9142:
                    if(this.quantity >= 5) itemIconId = 9161;
                    else if(this.quantity >= 4) itemIconId = 9160;
                    else if(this.quantity >= 3) itemIconId = 9159;
                    else if(this.quantity >= 2) itemIconId = 9158;
                    break;

                    //Mithril bolts (p)
                case 9289:
                    if(this.quantity >= 5) itemIconId = 9322;
                    else if(this.quantity >= 4) itemIconId = 9321;
                    else if(this.quantity >= 3) itemIconId = 9320;
                    else if(this.quantity >= 2) itemIconId = 9319;
                    break;

                    //Mithril bolts (p+)
                case 9296:
                    if(this.quantity >= 5) itemIconId = 9322;
                    else if(this.quantity >= 4) itemIconId = 9321;
                    else if(this.quantity >= 3) itemIconId = 9320;
                    else if(this.quantity >= 2) itemIconId = 9319;
                    break;

                    //Mithril bolts (p++)
                case 9303:
                    if(this.quantity >= 5) itemIconId = 9322;
                    else if(this.quantity >= 4) itemIconId = 9321;
                    else if(this.quantity >= 3) itemIconId = 9320;
                    else if(this.quantity >= 2) itemIconId = 9319;
                    break;

                    //Adamant bolts (unf)
                case 9380:
                    if(this.quantity >= 5) itemIconId = 9406;
                    else if(this.quantity >= 4) itemIconId = 9405;
                    else if(this.quantity >= 3) itemIconId = 9404;
                    else if(this.quantity >= 2) itemIconId = 9403;
                    break;

                    //Adamant bolts
                case 9143:
                    if(this.quantity >= 5) itemIconId = 9165;
                    else if(this.quantity >= 4) itemIconId = 9164;
                    else if(this.quantity >= 3) itemIconId = 9163;
                    else if(this.quantity >= 2) itemIconId = 9162;
                    break;

                    //Adamant bolts (p)
                case 9290:
                    if(this.quantity >= 5) itemIconId = 9326;
                    else if(this.quantity >= 4) itemIconId = 9325;
                    else if(this.quantity >= 3) itemIconId = 9324;
                    else if(this.quantity >= 2) itemIconId = 9323;
                    break;

                    //Adamant bolts (p+)
                case 9297:
                    if(this.quantity >= 5) itemIconId = 9326;
                    else if(this.quantity >= 4) itemIconId = 9325;
                    else if(this.quantity >= 3) itemIconId = 9324;
                    else if(this.quantity >= 2) itemIconId = 9323;
                    break;

                    //Adamant bolts (p++)
                case 9304:
                    if(this.quantity >= 5) itemIconId = 9326;
                    else if(this.quantity >= 4) itemIconId = 9325;
                    else if(this.quantity >= 3) itemIconId = 9324;
                    else if(this.quantity >= 2) itemIconId = 9323;
                    break;

                    //Rune bolts (unf)
                case 9381:
                    if(this.quantity >= 5) itemIconId = 9410;
                    else if(this.quantity >= 4) itemIconId = 9409;
                    else if(this.quantity >= 3) itemIconId = 9408;
                    else if(this.quantity >= 2) itemIconId = 9407;
                    break;

                    //Rune bolts
                case 9144:
                    if(this.quantity >= 5) itemIconId = 9169;
                    else if(this.quantity >= 4) itemIconId = 9168;
                    else if(this.quantity >= 3) itemIconId = 9167;
                    else if(this.quantity >= 2) itemIconId = 9166;
                    break;

                    //Rune bolts (p)
                case 9291:
                    if(this.quantity >= 5) itemIconId = 9320;
                    else if(this.quantity >= 4) itemIconId = 9329;
                    else if(this.quantity >= 3) itemIconId = 9328;
                    else if(this.quantity >= 2) itemIconId = 9327;
                    break;

                    //Rune bolts (p+)
                case 9298:
                    if(this.quantity >= 5) itemIconId = 9320;
                    else if(this.quantity >= 4) itemIconId = 9329;
                    else if(this.quantity >= 3) itemIconId = 9328;
                    else if(this.quantity >= 2) itemIconId = 9327;
                    break;

                    //Rune bolts (p++)
                case 9305:
                    if(this.quantity >= 5) itemIconId = 9320;
                    else if(this.quantity >= 4) itemIconId = 9329;
                    else if(this.quantity >= 3) itemIconId = 9328;
                    else if(this.quantity >= 2) itemIconId = 9327;
                    break;

                    //Silver bolts (unf)
                case 9382:
                    if(this.quantity >= 5) itemIconId = 9414;
                    else if(this.quantity >= 4) itemIconId = 9413;
                    else if(this.quantity >= 3) itemIconId = 9412;
                    else if(this.quantity >= 2) itemIconId = 9411;
                    break;

                    //Silver bolts
                case 9145:
                    if(this.quantity >= 5) itemIconId = 9173;
                    else if(this.quantity >= 4) itemIconId = 9172;
                    else if(this.quantity >= 3) itemIconId = 9171;
                    else if(this.quantity >= 2) itemIconId = 9170;
                    break;

                    //Silver bolts (p)
                case 9292:
                    if(this.quantity >= 5) itemIconId = 9334;
                    else if(this.quantity >= 4) itemIconId = 9333;
                    else if(this.quantity >= 3) itemIconId = 9332;
                    else if(this.quantity >= 2) itemIconId = 9331;
                    break;

                    //Silver bolts (p+)
                case 9299:
                    if(this.quantity >= 5) itemIconId = 9334;
                    else if(this.quantity >= 4) itemIconId = 9333;
                    else if(this.quantity >= 3) itemIconId = 9332;
                    else if(this.quantity >= 2) itemIconId = 9331;
                    break;

                    //Silver bolts (p++)
                case 9306:
                    if(this.quantity >= 5) itemIconId = 9334;
                    else if(this.quantity >= 4) itemIconId = 9333;
                    else if(this.quantity >= 3) itemIconId = 9332;
                    else if(this.quantity >= 2) itemIconId = 9331;
                    break;

                    //Dragon bolts (unf)
                case 21930:
                    if(this.quantity >= 5) itemIconId = 8471;
                    else if(this.quantity >= 4) itemIconId = 8469;
                    else if(this.quantity >= 3) itemIconId = 8467;
                    else if(this.quantity >= 2) itemIconId = 8465;
                    break;

                    //Dragon bolts
                case 21905:
                    if(this.quantity >= 5) itemIconId = 8479;
                    else if(this.quantity >= 4) itemIconId = 8477;
                    else if(this.quantity >= 3) itemIconId = 8475;
                    else if(this.quantity >= 2) itemIconId = 8473;
                    break;                    

                    //Dragon bolts (p)
                case 21924:
                    if(this.quantity >= 5) itemIconId = 8487;
                    else if(this.quantity >= 4) itemIconId = 8485;
                    else if(this.quantity >= 3) itemIconId = 8483;
                    else if(this.quantity >= 2) itemIconId = 8481;
                    break;

                    //Dragon bolts (p+)
                case 21926:
                    if(this.quantity >= 5) itemIconId = 8487;
                    else if(this.quantity >= 4) itemIconId = 8485;
                    else if(this.quantity >= 3) itemIconId = 8483;
                    else if(this.quantity >= 2) itemIconId = 8481;
                    break;                    

                    //Dragon bolts (p++)
                case 21928:
                    if(this.quantity >= 5) itemIconId = 8487;
                    else if(this.quantity >= 4) itemIconId = 8485;
                    else if(this.quantity >= 3) itemIconId = 8483;
                    else if(this.quantity >= 2) itemIconId = 8481;
                    break;

                    //Opal dragon bolts (e)
                case 21932:
                    if(this.quantity >= 5) itemIconId = 8729;
                    else if(this.quantity >= 4) itemIconId = 8727;
                    else if(this.quantity >= 3) itemIconId = 8725;
                    else if(this.quantity >= 2) itemIconId = 8723;
                    break;

                    //Jade dragon bolts (e)
                case 21934:
                    if(this.quantity >= 5) itemIconId = 8737;
                    else if(this.quantity >= 4) itemIconId = 8735;
                    else if(this.quantity >= 3) itemIconId = 8733;
                    else if(this.quantity >= 2) itemIconId = 8731;
                    break;

                    //Pearl dragon bolts (e)
                case 21936:
                    if(this.quantity >= 5) itemIconId = 8745;
                    else if(this.quantity >= 4) itemIconId = 8743;
                    else if(this.quantity >= 3) itemIconId = 8741;
                    else if(this.quantity >= 2) itemIconId = 8739;
                    break;

                    //Topaz dragon bolts (e)
                case 21938:
                    if(this.quantity >= 5) itemIconId = 8753;
                    else if(this.quantity >= 4) itemIconId = 8751;
                    else if(this.quantity >= 3) itemIconId = 8749;
                    else if(this.quantity >= 2) itemIconId = 8747;
                    break;

                    //Sapphire dragon bolts (e)
                case 21940:
                    if(this.quantity >= 5) itemIconId = 8761;
                    else if(this.quantity >= 4) itemIconId = 8759;
                    else if(this.quantity >= 3) itemIconId = 8757;
                    else if(this.quantity >= 2) itemIconId = 8755;
                    break;

                    //Emerald dragon bolts (e)
                case 21942:
                    if(this.quantity >= 5) itemIconId = 8769;
                    else if(this.quantity >= 4) itemIconId = 8767;
                    else if(this.quantity >= 3) itemIconId = 8765;
                    else if(this.quantity >= 2) itemIconId = 8763;
                    break;

                    //Ruby dragon bolts (e)
                case 21944:
                    if(this.quantity >= 5) itemIconId = 8777;
                    else if(this.quantity >= 4) itemIconId = 8775;
                    else if(this.quantity >= 3) itemIconId = 8773;
                    else if(this.quantity >= 2) itemIconId = 8771;
                    break;

                    //Diamond dragon bolts (e)
                case 21946:
                    if(this.quantity >= 5) itemIconId = 1690;
                    else if(this.quantity >= 4) itemIconId = 1689;
                    else if(this.quantity >= 3) itemIconId = 1688;
                    else if(this.quantity >= 2) itemIconId = 1687;
                    break;

                    //Dragonstone dragon bolts (e)
                case 21948:
                    if(this.quantity >= 5) itemIconId = 1668;
                    else if(this.quantity >= 4) itemIconId = 19504;
                    else if(this.quantity >= 3) itemIconId = 6566;
                    else if(this.quantity >= 2) itemIconId = 1691;
                    break;

                    //Onyx dragon bolts (e)
                case 21950:
                    if(this.quantity >= 5) itemIconId = 1672;
                    else if(this.quantity >= 4) itemIconId = 1671;
                    else if(this.quantity >= 3) itemIconId = 1670;
                    else if(this.quantity >= 2) itemIconId = 1669;
                    break;

                    //Opal dragon bolts
                case 21955:
                    if(this.quantity >= 5) itemIconId = 8495;
                    else if(this.quantity >= 4) itemIconId = 8493;
                    else if(this.quantity >= 3) itemIconId = 8491;
                    else if(this.quantity >= 2) itemIconId = 8489;
                    break;

                    //Jade dragon bolts
                case 21957:
                    if(this.quantity >= 5) itemIconId = 8657;
                    else if(this.quantity >= 4) itemIconId = 8655;
                    else if(this.quantity >= 3) itemIconId = 8653;
                    else if(this.quantity >= 2) itemIconId = 8651;
                    break;

                    //Pearl dragon bolts
                case 21959:
                    if(this.quantity >= 5) itemIconId = 8665;
                    else if(this.quantity >= 4) itemIconId = 8663;
                    else if(this.quantity >= 3) itemIconId = 8661;
                    else if(this.quantity >= 2) itemIconId = 8659;
                    break;

                    //Topaz dragon bolts
                case 21961:
                    if(this.quantity >= 5) itemIconId = 8673;
                    else if(this.quantity >= 4) itemIconId = 8671;
                    else if(this.quantity >= 3) itemIconId = 8669;
                    else if(this.quantity >= 2) itemIconId = 8667;
                    break;

                    //Sapphire dragon bolts
                case 21963:
                    if(this.quantity >= 5) itemIconId = 8681;
                    else if(this.quantity >= 4) itemIconId = 8679;
                    else if(this.quantity >= 3) itemIconId = 8677;
                    else if(this.quantity >= 2) itemIconId = 8675;
                    break;

                    //Emerald dragon bolts
                case 21965:
                    if(this.quantity >= 5) itemIconId = 8689;
                    else if(this.quantity >= 4) itemIconId = 8687;
                    else if(this.quantity >= 3) itemIconId = 8685;
                    else if(this.quantity >= 2) itemIconId = 8683;
                    break;

                    //Ruby dragon bolts
                case 21967:
                    if(this.quantity >= 5) itemIconId = 8697;
                    else if(this.quantity >= 4) itemIconId = 8695;
                    else if(this.quantity >= 3) itemIconId = 8693;
                    else if(this.quantity >= 2) itemIconId = 8691;
                    break;

                    //Diamond dragon bolts
                case 21969:
                    if(this.quantity >= 5) itemIconId = 8705;
                    else if(this.quantity >= 4) itemIconId = 8703;
                    else if(this.quantity >= 3) itemIconId = 8701;
                    else if(this.quantity >= 2) itemIconId = 8699;
                    break;

                    //Dragonstone dragon bolts
                case 21971:
                    if(this.quantity >= 5) itemIconId = 8713;
                    else if(this.quantity >= 4) itemIconId = 8711;
                    else if(this.quantity >= 3) itemIconId = 8709;
                    else if(this.quantity >= 2) itemIconId = 8707;
                    break;

                    //Onyx dragon bolts
                case 21973:
                    if(this.quantity >= 5) itemIconId = 8721;
                    else if(this.quantity >= 4) itemIconId = 8719;
                    else if(this.quantity >= 3) itemIconId = 8717;
                    else if(this.quantity >= 2) itemIconId = 8715;
                    break;

                    //Barbed bolts
                case 881:
                    if(this.quantity >= 5) itemIconId = 3826;
                    else if(this.quantity >= 4) itemIconId = 3825;
                    else if(this.quantity >= 3) itemIconId = 3824;
                    else if(this.quantity >= 2) itemIconId = 3823;
                    break;

                    //Opal bolts (e)
                case 9236:
                    if(this.quantity >= 5) itemIconId = 9249;
                    else if(this.quantity >= 4) itemIconId = 9248;
                    else if(this.quantity >= 3) itemIconId = 9247;
                    else if(this.quantity >= 2) itemIconId = 9246;
                    break;

                    //Jade bolts (e)
                case 9237:
                    if(this.quantity >= 5) itemIconId = 9257;
                    else if(this.quantity >= 4) itemIconId = 9256;
                    else if(this.quantity >= 3) itemIconId = 9255;
                    else if(this.quantity >= 2) itemIconId = 9254;
                    break;

                    //Pearl bolts (e)
                case 9238:
                    if(this.quantity >= 5) itemIconId = 9253;
                    else if(this.quantity >= 4) itemIconId = 9252;
                    else if(this.quantity >= 3) itemIconId = 9251;
                    else if(this.quantity >= 2) itemIconId = 9250;
                    break;

                    //Topaz bolts (e)
                case 9239:
                    if(this.quantity >= 5) itemIconId = 9261;
                    else if(this.quantity >= 4) itemIconId = 9260;
                    else if(this.quantity >= 3) itemIconId = 9259;
                    else if(this.quantity >= 2) itemIconId = 9258;
                    break;

                    //Sapphire bolts (e)
                case 9240:
                    if(this.quantity >= 5) itemIconId = 9265;
                    else if(this.quantity >= 4) itemIconId = 9264;
                    else if(this.quantity >= 3) itemIconId = 9263;
                    else if(this.quantity >= 2) itemIconId = 9262;
                    break;

                    //Emerald bolts (e)
                case 9241:
                    if(this.quantity >= 5) itemIconId = 9269;
                    else if(this.quantity >= 4) itemIconId = 9268;
                    else if(this.quantity >= 3) itemIconId = 9267;
                    else if(this.quantity >= 2) itemIconId = 9266;
                    break;

                    //Ruby bolts (e)
                case 9242:
                    if(this.quantity >= 5) itemIconId = 9273;
                    else if(this.quantity >= 4) itemIconId = 9272;
                    else if(this.quantity >= 3) itemIconId = 9271;
                    else if(this.quantity >= 2) itemIconId = 9270;
                    break;

                    //Diamond bolts (e)
                case 9243:
                    if(this.quantity >= 5) itemIconId = 9277;
                    else if(this.quantity >= 4) itemIconId = 9276;
                    else if(this.quantity >= 3) itemIconId = 9275;
                    else if(this.quantity >= 2) itemIconId = 9274;
                    break;

                    //Dragonstone bolts (e)
                case 9244:
                    if(this.quantity >= 5) itemIconId = 9281;
                    else if(this.quantity >= 4) itemIconId = 9280;
                    else if(this.quantity >= 3) itemIconId = 9279;
                    else if(this.quantity >= 2) itemIconId = 9278;
                    break;

                    //Onyx bolts (e)
                case 9245:
                    if(this.quantity >= 5) itemIconId = 9285;
                    else if(this.quantity >= 4) itemIconId = 9284;
                    else if(this.quantity >= 3) itemIconId = 9283;
                    else if(this.quantity >= 2) itemIconId = 9282;
                    break;

                    //Opal bolts
                case 879:
                    if(this.quantity >= 5) itemIconId = 3818;
                    else if(this.quantity >= 4) itemIconId = 3817;
                    else if(this.quantity >= 3) itemIconId = 3816;
                    else if(this.quantity >= 2) itemIconId = 3815;
                    break;

                    //Pearl bolts
                case 880:
                    if(this.quantity >= 5) itemIconId = 3822;
                    else if(this.quantity >= 4) itemIconId = 3821;
                    else if(this.quantity >= 3) itemIconId = 3820;
                    else if(this.quantity >= 2) itemIconId = 3819;
                    break;

                    //Jade bolts
                case 9335:
                    if(this.quantity >= 5) itemIconId = 9346;
                    else if(this.quantity >= 4) itemIconId = 9345;
                    else if(this.quantity >= 3) itemIconId = 9344;
                    else if(this.quantity >= 2) itemIconId = 9343;
                    break;

                    //Topaz bolts
                case 9336:
                    if(this.quantity >= 5) itemIconId = 9350;
                    else if(this.quantity >= 4) itemIconId = 9349;
                    else if(this.quantity >= 3) itemIconId = 9348;
                    else if(this.quantity >= 2) itemIconId = 9347;
                    break;

                    //Sapphire bolts
                case 9337:
                    if(this.quantity >= 5) itemIconId = 9354;
                    else if(this.quantity >= 4) itemIconId = 9353;
                    else if(this.quantity >= 3) itemIconId = 9352;
                    else if(this.quantity >= 2) itemIconId = 9351;
                    break;

                    //Emerald bolts
                case 9338:
                    if(this.quantity >= 5) itemIconId = 9358;
                    else if(this.quantity >= 4) itemIconId = 9357;
                    else if(this.quantity >= 3) itemIconId = 9356;
                    else if(this.quantity >= 2) itemIconId = 9355;
                    break;

                    //Ruby bolts
                case 9339:
                    if(this.quantity >= 5) itemIconId = 9362;
                    else if(this.quantity >= 4) itemIconId = 9361;
                    else if(this.quantity >= 3) itemIconId = 9360;
                    else if(this.quantity >= 2) itemIconId = 9359;
                    break;

                    //Diamond bolts
                case 9340:
                    if(this.quantity >= 5) itemIconId = 9366;
                    else if(this.quantity >= 4) itemIconId = 9365;
                    else if(this.quantity >= 3) itemIconId = 9364;
                    else if(this.quantity >= 2) itemIconId = 9363;
                    break;

                    //Dragonstone bolts
                case 9341:
                    if(this.quantity >= 5) itemIconId = 9370;
                    else if(this.quantity >= 4) itemIconId = 9369;
                    else if(this.quantity >= 3) itemIconId = 9368;
                    else if(this.quantity >= 2) itemIconId = 9367;
                    break;

                    //Onyx bolts
                case 9342:
                    if(this.quantity >= 5) itemIconId = 9374;
                    else if(this.quantity >= 4) itemIconId = 9373;
                    else if(this.quantity >= 3) itemIconId = 9372;
                    else if(this.quantity >= 2) itemIconId = 9371;
                    break;

                    //Bronze javelin heads
                case 19570:
                    if(this.quantity >= 5) itemIconId = 3072;
                    else if(this.quantity >= 4) itemIconId = 3070;
                    else if(this.quantity >= 3) itemIconId = 3068;
                    else if(this.quantity >= 2) itemIconId = 3066;
                    break;

                    //Iron javelin heads
                case 19572:
                    if(this.quantity >= 5) itemIconId = 3082;
                    else if(this.quantity >= 4) itemIconId = 3078;
                    else if(this.quantity >= 3) itemIconId = 3076;
                    else if(this.quantity >= 2) itemIconId = 3074;
                    break;

                    //Steel javelin heads
                case 19574:
                    if(this.quantity >= 5) itemIconId = 3090;
                    else if(this.quantity >= 4) itemIconId = 3088;
                    else if(this.quantity >= 3) itemIconId = 3086;
                    else if(this.quantity >= 2) itemIconId = 3084;
                    break;

                    //Mithril javelin heads
                case 19576:
                    if(this.quantity >= 5) itemIconId = 3246;
                    else if(this.quantity >= 4) itemIconId = 3244;
                    else if(this.quantity >= 3) itemIconId = 3242;
                    else if(this.quantity >= 2) itemIconId = 3092;
                    break;

                    //Adamant javelin heads
                case 19578:
                    if(this.quantity >= 5) itemIconId = 3909;
                    else if(this.quantity >= 4) itemIconId = 3907;
                    else if(this.quantity >= 3) itemIconId = 3905;
                    else if(this.quantity >= 2) itemIconId = 3248;
                    break;

                    //Rune javelin heads
                case 19580:
                    if(this.quantity >= 5) itemIconId = 3917;
                    else if(this.quantity >= 4) itemIconId = 3915;
                    else if(this.quantity >= 3) itemIconId = 3913;
                    else if(this.quantity >= 2) itemIconId = 3911;
                    break;

                    //Dragon javelin heads
                case 19582:
                    if(this.quantity >= 5) itemIconId = 3925;
                    else if(this.quantity >= 4) itemIconId = 3923;
                    else if(this.quantity >= 3) itemIconId = 3921;
                    else if(this.quantity >= 2) itemIconId = 3919;
                    break;

                    //Amethyst javelin heads
                case 21352:
                    if(this.quantity >= 5) itemIconId = 13220;
                    else if(this.quantity >= 4) itemIconId = 3967;
                    else if(this.quantity >= 3) itemIconId = 3965;
                    else if(this.quantity >= 2) itemIconId = 3963;
                    break;

                    //Javelin shaft
                case 19584:
                    if(this.quantity >= 5) itemIconId = 3933;
                    else if(this.quantity >= 4) itemIconId = 3931;
                    else if(this.quantity >= 3) itemIconId = 3929;
                    else if(this.quantity >= 2) itemIconId = 3927;
                    break;

                    //Purple Sweets
                case 10476:
                    if(this.quantity >= 100) itemIconId = 10483;
                    else if(this.quantity >= 25) itemIconId = 10482;
                    else if(this.quantity >= 10) itemIconId = 10481;
                    else if(this.quantity >= 5) itemIconId = 10480;
                    else if(this.quantity >= 4) itemIconId = 10479;
                    else if(this.quantity >= 3) itemIconId = 10478;
                    else if(this.quantity >= 2) itemIconId = 10477;
                    break; 

                    //Proboscis
                case 6319:
                    if(this.quantity >= 1000) itemIconId = 6321;
                    else if(this.quantity >= 100) itemIconId = 6320;
                    break; 

                    //Woad leaf
                case 1793:
                    if(this.quantity >= 5) itemIconId = 5279;
                    else if(this.quantity >= 4) itemIconId = 5278;
                    else if(this.quantity >= 3) itemIconId = 5277;
                    else if(this.quantity >= 2) itemIconId = 5276;
                    break;

                    //Ecto-token
                case 4278:
                    if(this.quantity >= 3) itemIconId = 4281;
                    else if(this.quantity >= 2) itemIconId = 4279;
                    break; 

                    //Platinum token
                case 13204:
                    if(this.quantity >= 5) itemIconId = 3991;
                    else if(this.quantity >= 4) itemIconId = 3989;
                    else if(this.quantity >= 3) itemIconId = 3987;
                    else if(this.quantity >= 2) itemIconId = 3985;
                    break;

                    //Warrior guild token
                case 8851:
                    if(this.quantity >= 5) itemIconId = 8855;
                    else if(this.quantity >= 4) itemIconId = 8854;
                    else if(this.quantity >= 3) itemIconId = 8853;
                    else if(this.quantity >= 2) itemIconId = 8852;
                    break;

                    //Barronite shards
                case 25676:
                    if(this.quantity >= 25) itemIconId = 25683;
                    else if(this.quantity >= 10) itemIconId = 25682;
                    else if(this.quantity >= 5) itemIconId = 25681;
                    else if(this.quantity >= 4) itemIconId = 25680;
                    else if(this.quantity >= 3) itemIconId = 25679;
                    else if(this.quantity >= 2) itemIconId = 25678;
                    break; 

                    //Stardust
                case 25527:
                    if(this.quantity >= 175) itemIconId = 25532;
                    else if(this.quantity >= 125) itemIconId = 25531;
                    else if(this.quantity >= 75) itemIconId = 25530;
                    else if(this.quantity >= 25) itemIconId = 25529;
                    break; 

                    //Spirit flakes
                case 25588:
                    if(this.quantity >= 9) itemIconId = 10669;
                    else if(this.quantity >= 8) itemIconId = 10666;
                    else if(this.quantity >= 7) itemIconId = 10602;
                    else if(this.quantity >= 6) itemIconId = 10601;
                    else if(this.quantity >= 5) itemIconId = 10166;
                    else if(this.quantity >= 4) itemIconId = 10165;
                    else if(this.quantity >= 3) itemIconId = 9816;
                    else if(this.quantity >= 2) itemIconId = 9815;
                    break; 

                    //Bone fragments
                case 25139:
                    if(this.quantity >= 5) itemIconId = 25144;
                    else if(this.quantity >= 4) itemIconId = 25143;
                    else if(this.quantity >= 3) itemIconId = 25142;
                    else if(this.quantity >= 2) itemIconId = 25141;
                    break;

                    //Crystal shard
                case 23962:
                    if(this.quantity >= 25) itemIconId = 23970;
                    else if(this.quantity >= 5) itemIconId = 23969;
                    else if(this.quantity >= 4) itemIconId = 23968;
                    else if(this.quantity >= 3) itemIconId = 23967;
                    else if(this.quantity >= 2) itemIconId = 23966;
                    break; 

                    //Larran's key
                case 23490:
                    if(this.quantity >= 5) itemIconId = 23494;
                    else if(this.quantity >= 4) itemIconId = 23493;
                    else if(this.quantity >= 3) itemIconId = 22329;
                    else if(this.quantity >= 2) itemIconId = 23492;
                    break; 

                    //Brimstone key
                case 23083:
                    if(this.quantity >= 25) itemIconId = 23090;
                    else if(this.quantity >= 10) itemIconId = 23089;
                    else if(this.quantity >= 5) itemIconId = 23088;
                    else if(this.quantity >= 4) itemIconId = 23087;
                    else if(this.quantity >= 3) itemIconId = 23086;
                    else if(this.quantity >= 2) itemIconId = 23085;
                    break;

                    //Molch pearl
                case 22820:
                    if(this.quantity >= 5) itemIconId = 22825;
                    else if(this.quantity >= 4) itemIconId = 22824;
                    else if(this.quantity >= 3) itemIconId = 22823;
                    else if(this.quantity >= 2) itemIconId = 22822;
                    break; 

                    //Mermaid's tear
                case 21656:
                    if(this.quantity >= 5) itemIconId = 21661;
                    else if(this.quantity >= 4) itemIconId = 21660;
                    else if(this.quantity >= 3) itemIconId = 21659;
                    else if(this.quantity >= 2) itemIconId = 21658;
                    break; 

                    //Numulite
                case 21555:
                    if(this.quantity >= 25) itemIconId = 21561;
                    else if(this.quantity >= 5) itemIconId = 21560;
                    else if(this.quantity >= 4) itemIconId = 21559;
                    else if(this.quantity >= 3) itemIconId = 21558;
                    else if(this.quantity >= 2) itemIconId = 21557;
                    break;

                    //Tokkul
                case 6529:
                    if(this.quantity >= 25) itemIconId = 6534;
                    else if(this.quantity >= 5) itemIconId = 6533;
                    else if(this.quantity >= 4) itemIconId = 6532;
                    else if(this.quantity >= 3) itemIconId = 6531;
                    else if(this.quantity >= 2) itemIconId = 6530;
                    break;

                    //trading stick
                case 6306:
                    if(this.quantity >= 10000) itemIconId = 6310;
                    else if(this.quantity >= 1000) itemIconId = 6309;
                    else if(this.quantity >= 100) itemIconId = 6308;
                    else if(this.quantity >= 10) itemIconId = 6307;
                    break;

                    //Glistening tear
                case 22207:
                    if(this.quantity >= 5) itemIconId = 19499;
                    else if(this.quantity >= 4) itemIconId = 6564;
                    else if(this.quantity >= 3) itemIconId = 1653;
                    else if(this.quantity >= 2) itemIconId = 1652;
                    break; 

                    //Lava scale shard
                case 11994:
                    if(this.quantity >= 5) itemIconId = 3256;
                    else if(this.quantity >= 4) itemIconId = 3254;
                    else if(this.quantity >= 3) itemIconId = 3252;
                    else if(this.quantity >= 2) itemIconId = 3250;
                    break; 

                    //Zulrah's scales
                case 12934:
                    if(this.quantity >= 5) itemIconId = 3999;
                    else if(this.quantity >= 4) itemIconId = 3997;
                    else if(this.quantity >= 3) itemIconId = 3995;
                    else if(this.quantity >= 2) itemIconId = 3993;
                    break; 

                    //Pieces of eight
                case 8951:
                    if(this.quantity >= 3) itemIconId = 8985;
                    else if(this.quantity >= 2) itemIconId = 8984;
                    break; 

                    //Guam seed
                case 5291:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Marrentill seed
                case 5292:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Tarromin seed
                case 5293:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Harralander seed
                case 5294:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Ranarr seed
                case 5295:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Toadflax seed
                case 5296:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Irit seed
                case 5297:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Avantoe seed
                case 5298:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Kwuarm seed
                case 5299:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Snapdragon seed
                case 5300:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Cadantine seed
                case 5301:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Lantadyme seed
                case 5302:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Dwarf weed seed
                case 5303:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Torstol seed
                case 5304:
                    if(this.quantity >= 5) itemIconId = 5227;
                    else if(this.quantity >= 4) itemIconId = 5226;
                    else if(this.quantity >= 3) itemIconId = 5225;
                    else if(this.quantity >= 2) itemIconId = 5224;
                    break; 

                    //Apple tree seed
                case 5283:
                    if(this.quantity >= 5) itemIconId = 5231;
                    else if(this.quantity >= 4) itemIconId = 5230;
                    else if(this.quantity >= 3) itemIconId = 5229;
                    else if(this.quantity >= 2) itemIconId = 5228;
                    break; 

                    //Asgarnian seed
                case 5308:
                    if(this.quantity >= 5) itemIconId = 5183;
                    else if(this.quantity >= 4) itemIconId = 5182;
                    else if(this.quantity >= 3) itemIconId = 5181;
                    else if(this.quantity >= 2) itemIconId = 5180;
                    break;

                    //Attas seed
                case 22881:
                    if(this.quantity >= 5) itemIconId = 22912;
                    else if(this.quantity >= 4) itemIconId = 22911;
                    else if(this.quantity >= 3) itemIconId = 22910;
                    else if(this.quantity >= 2) itemIconId = 22909;
                    break;

                    //Banana tree seed
                case 5284:
                    if(this.quantity >= 5) itemIconId = 5235;
                    else if(this.quantity >= 4) itemIconId = 5234;
                    else if(this.quantity >= 3) itemIconId = 5233;
                    else if(this.quantity >= 2) itemIconId = 5232;
                    break;

                    //Barley seed
                case 5305:
                    if(this.quantity >= 5) itemIconId = 5170;
                    else if(this.quantity >= 4) itemIconId = 5169;
                    else if(this.quantity >= 3) itemIconId = 5168;
                    else if(this.quantity >= 2) itemIconId = 5167;
                    break;

                    //Belladonna seed
                case 5281:
                    if(this.quantity >= 5) itemIconId = 5275;
                    else if(this.quantity >= 4) itemIconId = 5274;
                    else if(this.quantity >= 3) itemIconId = 5273;
                    else if(this.quantity >= 2) itemIconId = 5272;
                    break;

                    //Buchu seed
                case 20909:
                    if(this.quantity >= 5) itemIconId = 2420;
                    else if(this.quantity >= 4) itemIconId = 1589;
                    else if(this.quantity >= 3) itemIconId = 599;
                    else if(this.quantity >= 2) itemIconId = 2512;
                    break;

                    //Cabbage seed
                case 5324:
                    if(this.quantity >= 5) itemIconId = 5158;
                    else if(this.quantity >= 4) itemIconId = 5157;
                    else if(this.quantity >= 3) itemIconId = 5156;
                    else if(this.quantity >= 2) itemIconId = 5155;
                    break;

                    //Cactus seed
                case 5280:
                    if(this.quantity >= 5) itemIconId = 5267;
                    else if(this.quantity >= 4) itemIconId = 5266;
                    else if(this.quantity >= 3) itemIconId = 5265;
                    else if(this.quantity >= 2) itemIconId = 5264;
                    break;

                    //Cadavaberry seed
                case 5102:
                    if(this.quantity >= 5) itemIconId = 5211;
                    else if(this.quantity >= 4) itemIconId = 5210;
                    else if(this.quantity >= 3) itemIconId = 5209;
                    else if(this.quantity >= 2) itemIconId = 5208;
                    break;

                    //Calquat tree seed
                case 5290:
                    if(this.quantity >= 5) itemIconId = 5259;
                    else if(this.quantity >= 4) itemIconId = 5258;
                    else if(this.quantity >= 3) itemIconId = 5257;
                    else if(this.quantity >= 2) itemIconId = 5256;
                    break;

                    //Celastrus seed
                case 22869:
                    if(this.quantity >= 5) itemIconId = 22908;
                    else if(this.quantity >= 4) itemIconId = 22907;
                    else if(this.quantity >= 3) itemIconId = 22906;
                    else if(this.quantity >= 2) itemIconId = 22905;
                    break;

                    //Curry tree seed
                case 5286:
                    if(this.quantity >= 5) itemIconId = 5243;
                    else if(this.quantity >= 4) itemIconId = 5242;
                    else if(this.quantity >= 3) itemIconId = 5241;
                    else if(this.quantity >= 2) itemIconId = 5240;
                    break;

                    //Delphinium seed
                case 6457:
                    if(this.quantity >= 5) itemIconId = 6499;
                    else if(this.quantity >= 4) itemIconId = 6498;
                    else if(this.quantity >= 3) itemIconId = 6497;
                    else if(this.quantity >= 2) itemIconId = 6496;
                    break;

                    //Dragonfruit tree seed
                case 22877:
                    if(this.quantity >= 5) itemIconId = 22904;
                    else if(this.quantity >= 4) itemIconId = 22903;
                    else if(this.quantity >= 3) itemIconId = 22902;
                    else if(this.quantity >= 2) itemIconId = 22901;
                    break;

                    //Dwellberry seed
                case 5103:
                    if(this.quantity >= 5) itemIconId = 5215;
                    else if(this.quantity >= 4) itemIconId = 5214;
                    else if(this.quantity >= 3) itemIconId = 5213;
                    else if(this.quantity >= 2) itemIconId = 5212;
                    break;

                    //Golpar seed
                case 20906:
                    if(this.quantity >= 5) itemIconId = 10574;
                    else if(this.quantity >= 4) itemIconId = 10576;
                    else if(this.quantity >= 3) itemIconId = 10578;
                    else if(this.quantity >= 2) itemIconId = 10580;
                    break;

                    //Grape seed
                case 13657:
                    if(this.quantity >= 5) itemIconId = 3979;
                    else if(this.quantity >= 4) itemIconId = 3977;
                    else if(this.quantity >= 3) itemIconId = 3975;
                    else if(this.quantity >= 2) itemIconId = 3973;
                    break;

                    //Hammerstone seed
                case 5307:
                    if(this.quantity >= 5) itemIconId = 5179;
                    else if(this.quantity >= 4) itemIconId = 5178;
                    else if(this.quantity >= 3) itemIconId = 5177;
                    else if(this.quantity >= 2) itemIconId = 5176;
                    break;

                    //Hespori seed
                case 22875:
                    if(this.quantity >= 5) itemIconId = 22928;
                    else if(this.quantity >= 4) itemIconId = 22927;
                    else if(this.quantity >= 3) itemIconId = 22926;
                    else if(this.quantity >= 2) itemIconId = 22925;
                    break;

                    //Iasor seed
                case 22883:
                    if(this.quantity >= 5) itemIconId = 22916;
                    else if(this.quantity >= 4) itemIconId = 22915;
                    else if(this.quantity >= 3) itemIconId = 22914;
                    else if(this.quantity >= 2) itemIconId = 22913;
                    break;

                    //Jangerberry seed
                case 5104:
                    if(this.quantity >= 5) itemIconId = 5219;
                    else if(this.quantity >= 4) itemIconId = 5218;
                    else if(this.quantity >= 3) itemIconId = 5217;
                    else if(this.quantity >= 2) itemIconId = 5216;
                    break;

                    //Jute seed
                case 5306:
                    if(this.quantity >= 5) itemIconId = 5175;
                    else if(this.quantity >= 4) itemIconId = 5174;
                    else if(this.quantity >= 3) itemIconId = 5173;
                    else if(this.quantity >= 2) itemIconId = 5172;
                    break;

                    //Kelda seed
                case 6112:
                    if(this.quantity >= 5) itemIconId = 6117;
                    else if(this.quantity >= 4) itemIconId = 6116;
                    else if(this.quantity >= 3) itemIconId = 6115;
                    else if(this.quantity >= 2) itemIconId = 6114;
                    break;

                    //Krandorian seed
                case 5310:
                    if(this.quantity >= 5) itemIconId = 5191;
                    else if(this.quantity >= 4) itemIconId = 5190;
                    else if(this.quantity >= 3) itemIconId = 5189;
                    else if(this.quantity >= 2) itemIconId = 5188;
                    break;

                    //Kronos seed
                case 22885:
                    if(this.quantity >= 5) itemIconId = 22920;
                    else if(this.quantity >= 4) itemIconId = 22919;
                    else if(this.quantity >= 3) itemIconId = 22918;
                    else if(this.quantity >= 2) itemIconId = 22917;
                    break;

                    //Limpwurt seed
                case 5100:
                    if(this.quantity >= 5) itemIconId = 5271;
                    else if(this.quantity >= 4) itemIconId = 5270;
                    else if(this.quantity >= 3) itemIconId = 5269;
                    else if(this.quantity >= 2) itemIconId = 5268;
                    break;

                    //Magic seed
                case 5316:
                    if(this.quantity >= 5) itemIconId = 5126;
                    else if(this.quantity >= 4) itemIconId = 5125;
                    else if(this.quantity >= 3) itemIconId = 5124;
                    else if(this.quantity >= 2) itemIconId = 5123;
                    break;

                    //Mahogany seed
                case 21488:
                    if(this.quantity >= 5) itemIconId = 21499;
                    else if(this.quantity >= 4) itemIconId = 21498;
                    else if(this.quantity >= 3) itemIconId = 21497;
                    else if(this.quantity >= 2) itemIconId = 21496;
                    break;

                    //Maple seed
                case 5314:
                    if(this.quantity >= 5) itemIconId = 5122;
                    else if(this.quantity >= 4) itemIconId = 5121;
                    else if(this.quantity >= 3) itemIconId = 5120;
                    else if(this.quantity >= 2) itemIconId = 5119;
                    break;

                    //Marigold seed
                case 5096:
                    if(this.quantity >= 5) itemIconId = 5134;
                    else if(this.quantity >= 4) itemIconId = 5133;
                    else if(this.quantity >= 3) itemIconId = 5132;
                    else if(this.quantity >= 2) itemIconId = 5131;
                    break;

                    //Nasturtium seed
                case 5098:
                    if(this.quantity >= 5) itemIconId = 5199;
                    else if(this.quantity >= 4) itemIconId = 5198;
                    else if(this.quantity >= 3) itemIconId = 5197;
                    else if(this.quantity >= 2) itemIconId = 5196;
                    break;

                    //Noxifer seed
                case 20903:
                    if(this.quantity >= 5) itemIconId = 10573;
                    else if(this.quantity >= 4) itemIconId = 10575;
                    else if(this.quantity >= 3) itemIconId = 10577;
                    else if(this.quantity >= 2) itemIconId = 10579;
                    break;

                    //Onion seed
                case 5319:
                    if(this.quantity >= 5) itemIconId = 5162;
                    else if(this.quantity >= 4) itemIconId = 5161;
                    else if(this.quantity >= 3) itemIconId = 5160;
                    else if(this.quantity >= 2) itemIconId = 5159;
                    break;

                    //Orange tree seed
                case 5285:
                    if(this.quantity >= 5) itemIconId = 5239;
                    else if(this.quantity >= 4) itemIconId = 5238;
                    else if(this.quantity >= 3) itemIconId = 5237;
                    else if(this.quantity >= 2) itemIconId = 5236;
                    break;

                    //Orchid seed pink
                case 6458:
                    if(this.quantity >= 5) itemIconId = 6503;
                    else if(this.quantity >= 4) itemIconId = 6502;
                    else if(this.quantity >= 3) itemIconId = 6501;
                    else if(this.quantity >= 2) itemIconId = 6500;
                    break;

                    //Orchid seed yellow
                case 6459:
                    if(this.quantity >= 5) itemIconId = 6507;
                    else if(this.quantity >= 4) itemIconId = 6506;
                    else if(this.quantity >= 3) itemIconId = 6505;
                    else if(this.quantity >= 2) itemIconId = 6504;
                    break;

                    //Palm tree seed
                case 5289:
                    if(this.quantity >= 5) itemIconId = 5255;
                    else if(this.quantity >= 4) itemIconId = 5254;
                    else if(this.quantity >= 3) itemIconId = 5253;
                    else if(this.quantity >= 2) itemIconId = 5252;
                    break;

                    //Papaya tree seed
                case 5288:
                    if(this.quantity >= 5) itemIconId = 5251;
                    else if(this.quantity >= 4) itemIconId = 5250;
                    else if(this.quantity >= 3) itemIconId = 5249;
                    else if(this.quantity >= 2) itemIconId = 5248;
                    break;

                    //Pineapple seed
                case 5287:
                    if(this.quantity >= 5) itemIconId = 5247;
                    else if(this.quantity >= 4) itemIconId = 5246;
                    else if(this.quantity >= 3) itemIconId = 5245;
                    else if(this.quantity >= 2) itemIconId = 5244;
                    break;

                    //Pink rose seed
                case 6455:
                    if(this.quantity >= 5) itemIconId = 6491;
                    else if(this.quantity >= 4) itemIconId = 6490;
                    else if(this.quantity >= 3) itemIconId = 6489;
                    else if(this.quantity >= 2) itemIconId = 6488;
                    break;

                    //Poison ivy seed
                case 5106:
                    if(this.quantity >= 5) itemIconId = 5223;
                    else if(this.quantity >= 4) itemIconId = 5222;
                    else if(this.quantity >= 3) itemIconId = 5221;
                    else if(this.quantity >= 2) itemIconId = 5220;
                    break;

                    //Potato cactus seed
                case 22873:
                    if(this.quantity >= 5) itemIconId = 22900;
                    else if(this.quantity >= 4) itemIconId = 22899;
                    else if(this.quantity >= 3) itemIconId = 22898;
                    else if(this.quantity >= 2) itemIconId = 22897;
                    break;

                    //Potato seed
                case 5318:
                    if(this.quantity >= 5) itemIconId = 5166;
                    else if(this.quantity >= 4) itemIconId = 5165;
                    else if(this.quantity >= 3) itemIconId = 5164;
                    else if(this.quantity >= 2) itemIconId = 5163;
                    break;

                    //Red rose seed
                case 6454:
                    if(this.quantity >= 5) itemIconId = 6487;
                    else if(this.quantity >= 4) itemIconId = 6486;
                    else if(this.quantity >= 3) itemIconId = 6485;
                    else if(this.quantity >= 2) itemIconId = 6484;
                    break;

                    //Redberry seed
                case 5101:
                    if(this.quantity >= 5) itemIconId = 5207;
                    else if(this.quantity >= 4) itemIconId = 5206;
                    else if(this.quantity >= 3) itemIconId = 5205;
                    else if(this.quantity >= 2) itemIconId = 5204;
                    break;

                    //Redwood tree seed
                case 22871:
                    if(this.quantity >= 5) itemIconId = 22924;
                    else if(this.quantity >= 4) itemIconId = 22923;
                    else if(this.quantity >= 3) itemIconId = 22922;
                    else if(this.quantity >= 2) itemIconId = 22921;
                    break;

                    //Rosemary seed
                case 5097:
                    if(this.quantity >= 5) itemIconId = 5138;
                    else if(this.quantity >= 4) itemIconId = 5137;
                    else if(this.quantity >= 3) itemIconId = 5136;
                    else if(this.quantity >= 2) itemIconId = 5135;
                    break;

                    //Snape grass seed
                case 22879:
                    if(this.quantity >= 5) itemIconId = 22896;
                    else if(this.quantity >= 4) itemIconId = 22895;
                    else if(this.quantity >= 3) itemIconId = 22894;
                    else if(this.quantity >= 2) itemIconId = 22893;
                    break;

                    //Snowdrop seed
                case 6460:
                    if(this.quantity >= 5) itemIconId = 6511;
                    else if(this.quantity >= 4) itemIconId = 6510;
                    else if(this.quantity >= 3) itemIconId = 6509;
                    else if(this.quantity >= 2) itemIconId = 6508;
                    break;

                    //Spirit seed
                case 5317:
                    if(this.quantity >= 5) itemIconId = 5130;
                    else if(this.quantity >= 4) itemIconId = 5129;
                    else if(this.quantity >= 3) itemIconId = 5128;
                    else if(this.quantity >= 2) itemIconId = 5127;
                    break;

                    //Strawberry seed
                case 5323:
                    if(this.quantity >= 5) itemIconId = 5150;
                    else if(this.quantity >= 4) itemIconId = 5149;
                    else if(this.quantity >= 3) itemIconId = 5148;
                    else if(this.quantity >= 2) itemIconId = 5147;
                    break;

                    //Sweetcorn seed
                case 5320:
                    if(this.quantity >= 5) itemIconId = 5142;
                    else if(this.quantity >= 4) itemIconId = 5141;
                    else if(this.quantity >= 3) itemIconId = 5140;
                    else if(this.quantity >= 2) itemIconId = 5139;
                    break;

                    //Teak seed
                case 21486:
                    if(this.quantity >= 5) itemIconId = 21495;
                    else if(this.quantity >= 4) itemIconId = 21494;
                    else if(this.quantity >= 3) itemIconId = 21493;
                    else if(this.quantity >= 2) itemIconId = 21492;
                    break;

                    //Tomato seed
                case 5322:
                    if(this.quantity >= 5) itemIconId = 5154;
                    else if(this.quantity >= 4) itemIconId = 5153;
                    else if(this.quantity >= 3) itemIconId = 5152;
                    else if(this.quantity >= 2) itemIconId = 5151;
                    break;

                    //Vine seed
                case 6456:
                    if(this.quantity >= 5) itemIconId = 6495;
                    else if(this.quantity >= 4) itemIconId = 6494;
                    else if(this.quantity >= 3) itemIconId = 6493;
                    else if(this.quantity >= 2) itemIconId = 6492;
                    break;

                    //Watermelon seed
                case 5321:
                    if(this.quantity >= 5) itemIconId = 5146;
                    else if(this.quantity >= 4) itemIconId = 5145;
                    else if(this.quantity >= 3) itemIconId = 5144;
                    else if(this.quantity >= 2) itemIconId = 5143;
                    break;

                    //White lily seed
                case 22887:
                    if(this.quantity >= 5) itemIconId = 22892;
                    else if(this.quantity >= 4) itemIconId = 22891;
                    else if(this.quantity >= 3) itemIconId = 22890;
                    else if(this.quantity >= 2) itemIconId = 22889;
                    break;

                    //White rose seed
                case 6453:
                    if(this.quantity >= 5) itemIconId = 6483;
                    else if(this.quantity >= 4) itemIconId = 6482;
                    else if(this.quantity >= 3) itemIconId = 6481;
                    else if(this.quantity >= 2) itemIconId = 6480;
                    break;

                    //Whiteberry seed
                case 5105:
                    if(this.quantity >= 5) itemIconId = 5223;
                    else if(this.quantity >= 4) itemIconId = 5222;
                    else if(this.quantity >= 3) itemIconId = 5221;
                    else if(this.quantity >= 2) itemIconId = 5220;
                    break;

                    //Wildblood seed
                case 5311:
                    if(this.quantity >= 5) itemIconId = 5195;
                    else if(this.quantity >= 4) itemIconId = 5194;
                    else if(this.quantity >= 3) itemIconId = 5193;
                    else if(this.quantity >= 2) itemIconId = 5192;
                    break;

                    //Willow seed
                case 5313:
                    if(this.quantity >= 5) itemIconId = 5118;
                    else if(this.quantity >= 4) itemIconId = 5117;
                    else if(this.quantity >= 3) itemIconId = 5116;
                    else if(this.quantity >= 2) itemIconId = 5115;
                    break;

                    //Woad seed
                case 5099:
                    if(this.quantity >= 5) itemIconId = 5203;
                    else if(this.quantity >= 4) itemIconId = 5202;
                    else if(this.quantity >= 3) itemIconId = 5201;
                    else if(this.quantity >= 2) itemIconId = 5200;
                    break;

                    //Yanillian seed
                case 5309:
                    if(this.quantity >= 5) itemIconId = 5187;
                    else if(this.quantity >= 4) itemIconId = 5186;
                    else if(this.quantity >= 3) itemIconId = 5185;
                    else if(this.quantity >= 2) itemIconId = 5184;
                    break;

                    //Yew seed
                case 5315:
                    if(this.quantity >= 5) itemIconId = 5110;
                    else if(this.quantity >= 4) itemIconId = 5109;
                    else if(this.quantity >= 3) itemIconId = 5108;
                    else if(this.quantity >= 2) itemIconId = 5107;
                    break;

                    //Mushroom spore
                case 5282:
                    if(this.quantity >= 5) itemIconId = 5263;
                    else if(this.quantity >= 4) itemIconId = 5262;
                    else if(this.quantity >= 3) itemIconId = 5261;
                    else if(this.quantity >= 2) itemIconId = 5260;
                    break;

                    //Seaweed spore
                case 21490:
                    if(this.quantity >= 5) itemIconId = 21503;
                    else if(this.quantity >= 4) itemIconId = 21502;
                    else if(this.quantity >= 3) itemIconId = 21501;
                    else if(this.quantity >= 2) itemIconId = 21500;
                    break;

                    //Acorn
                case 5312:
                    if(this.quantity >= 5) itemIconId = 5114;
                    else if(this.quantity >= 4) itemIconId = 5113;
                    else if(this.quantity >= 3) itemIconId = 5112;
                    else if(this.quantity >= 2) itemIconId = 5111;
                    break;

                    //Crystal acorn
                case 23661:
                    if(this.quantity >= 5) itemIconId = 23666;
                    else if(this.quantity >= 4) itemIconId = 23665;
                    else if(this.quantity >= 3) itemIconId = 23664;
                    else if(this.quantity >= 2) itemIconId = 23663;
                    break;

                    //Hallowed mark
                case 24711:
                    if(this.quantity >= 5) itemIconId = 24716;
                    else if(this.quantity >= 4) itemIconId = 24715;
                    else if(this.quantity >= 3) itemIconId = 24714;
                    else if(this.quantity >= 2) itemIconId = 24713;
                    break; 
            }

            this.icon.graphic.texture = PIXI.Texture.from(`img/items/${itemIconId}.png`);
            this.icon.graphic.texture.rotate = 8;
                  
            // Truncation
            
            if(this.quantity > 9999999)
            {
                let _quantity = Math.trunc(this.quantity / 1000000);
                this.text.setText(`${_quantity}M`);
                this.text.setStyle(ITEM_ICON_TEXT_M);
            }
            else if(this.quantity > 99999)
            {
                let _quantity = Math.trunc(this.quantity / 1000);
                this.text.setText(`${_quantity}K`);
                this.text.setStyle(ITEM_ICON_TEXT_K);
            }
            else
            {
                this.text.setText(`${this.quantity}`);
                this.text.setStyle(ITEM_ICON_TEXT);
            }
            
            this.setVisibility(this.parent.isVisible());
        }
    }
}

export class InventoryInterface extends Interface
{
    constructor(name)
    {
        super(name);

        this.inventorySlots = new Array(INVENTORY_SIZE);
        for(var i = 0; i < INVENTORY_SIZE; i++)
        {
            this.inventorySlots[i] = new InterfaceItemSlot("InterfaceItemSlot", INVALID_ITEM, 0);
            this.inventorySlots[i].setParent(this);

            var x = i % INVENTORY_ROWS;
            var y = Math.floor(i / INVENTORY_ROWS);

            this.inventorySlots[i].setPosition(INVENTORY_OFFSET.x + (40 * x), INVENTORY_OFFSET.y - (36 * y));
        }
    }

    getSlot(slot)
    {
        return this.inventorySlots[slot];
    }

    loadSprites()
    {
        for(var i = 0; i < INVENTORY_SIZE; i++)
            this.inventorySlots[i].loadSprite();
    }

    update()
    {
        if(SELECTED_OBJECT == null)
            return;

        if(!(SELECTED_OBJECT instanceof Player))
            return;

        for(var i = 0; i < INVENTORY_SIZE; i++)
        {
            var itemInterfaceSlot = this.getSlot(i);
            itemInterfaceSlot.itemId = SELECTED_OBJECT.inventory[i].itemId;
            itemInterfaceSlot.quantity = SELECTED_OBJECT.inventory[i].quantity;
        }

        this.loadSprites();
    }
}
