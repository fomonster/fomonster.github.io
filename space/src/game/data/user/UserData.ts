import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Inventory, InventoryItem, InventoryItemType} from "../game/Inventory";
import {Random} from "../../../engine/Random";

export class UserData
{
    public currentSpaceSystem:number

    public base:Inventory = new Inventory();
    public inventory:Inventory = new Inventory();

    public load()
    {
        var data:any = localStorage.getItem("elite_game_save");
        if ( data == null ) {
            this.startInit();
        } else {
            this.loadFromObject(data);
        }
    }

    public save()
    {
        var data = this.saveToObject();
        localStorage.setItem("elite_game_save", data);
    }

    public loadFromObject(data:any)
    {

    }

    public saveToObject():any
    {
        var baseData:Array<number> = new Array<number>();
        this.base.saveTo(baseData);

        var inventoryData:Array<number> = new Array<number>();
        this.inventory.saveTo(inventoryData);


        var data:any = {
            inventory:inventoryData,
            base:baseData
        }

        return data;
    }

    public startInit()
    {
        Inventory.iseed = 33;

        this.inventory.clear();
        this.base.clear();

        var lev:number = 1;

        var it:InventoryItem = this.base.addRandom(Inventory.get("spaceship_1"), 1, lev - 1, lev + 1);
        it.calculate();

        // Случайное заполнение
        var baseItem:InventoryItem = this.base.getFirstItem();
        for (var i:number = 0; i < baseItem.slots.length; i++) {
            var list:Array<InventoryItemType> = new Array<InventoryItemType>();
            for (var j:number = 0; j < Inventory.typesList.length; j++) {
                if (Inventory.typesList[j].slotType == baseItem.slots[i].slotType) {
                    list.push(Inventory.typesList[j]);
                }
            }
            var id:number = Random.irandom(list.length);
            if (list.length > 0) {
                baseItem.slots[i].addRandom(list[id], 1, lev - 1, lev + 1);
            }
        }
        this.base.isChanged = true;
        this.base.calculate();


        this.inventory.add(Inventory.get("exp"), 1);
        this.inventory.add(Inventory.get("energy"), 50);
        this.inventory.add(Inventory.get("money"), 150);
        this.inventory.addRandom(Inventory.get("weapon_1"), 1);
        this.inventory.addRandom(Inventory.get("engine_1"), 1);

    }


    public update(deltaTime:number)
    {

    }
}