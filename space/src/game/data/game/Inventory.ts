import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Assets} from "../../../engine/Assets";
import {Vector3} from "three";
import {Random} from "../../../engine/Random";

export class InventoryItemSlot
{
    public x:number = 0;
    public y:number = 0;
    public type:number = 0;
    public position:Vector3 = new Vector3();
    public scale:number = 1;
    public visible:boolean = true;
}

export class InventoryItemType
{
    public id:number;
    public name:string;

    public params:Array<any> = new Array<any>();
    public slots:Array<InventoryItemSlot> = new Array<InventoryItemSlot>();

    public type:number;
    public slotType:number;
    public maxCount:number;

    public caption:string;

    public image:PIXI.Texture;
    //public weaponShotType:ShotBase;

    public modelName:string;

    public setFrom(data:any)
    {
        this.id = data.id;
        this.name = data.name;


        this.type = data.type;
        this.slotType = data.slottype;
        this.caption = data.caption;
        this.maxCount = data.maxCount;
        if (this.maxCount < 1) this.maxCount = 1;
        //if (maxcount > 65535) maxcount = 65535;


        if (data.image ) {
            this.image = Assets.getTexture(data.image.name);
        }

        if (data.model) {
            this.modelName = data.model.name;
            //model = SS3DMeshModelList.Get();
        }

        this.slots.splice(0, this.slots.length);
        if (data.slots && data.slots.length > 0) {
            for (var i:number = 0; i < data.slots.length; i++) {
                var slotData:any = data.slots[i];
                var slot:InventoryItemSlot = new InventoryItemSlot();
                if ( slotData.x) slot.x = slotData.x;
                if ( slotData.y ) slot.y = slotData.y;
                if ( slotData.type) slot.type = slotData.type;

                if ( slotData.visible) slot.visible = slotData.visible;
                if ( slotData.scale ) slot.scale = slotData.scale;


                if ( slotData.posX ) slot.position.x = slotData.posX;
                if ( slotData.posY ) slot.position.y = slotData.posY;
                if ( slotData.posZ ) slot.position.z = slotData.posZ;

                this.slots.push(slot);
            }
        }

        // Weapons
        if (data.weapon ) {
            /* weaponName = xmltype->elements("weapon")[0]->attributeInt("name");
            if (weaponName == 1) {
                weaponShotType = new ShotA();
            }
            else if (weaponName == 2) {
                weaponShotType = new ShotA();
            }
            else if (weaponName == 3) {
                weaponShotType = new ShotA();
            }
            else if (weaponName == 4) {
                weaponShotType = new ShotA();
            }*/
        }

        // Парамеры
        this.params.splice(0, this.params.length);
        if (data.params && data.params.length > 0) {
            for (var i:number = 0; i < data.params.length; i++) {
                var dataParam:any = data.params[i];

                var param:any = {};
                param.name = dataParam.name;
                param.min = dataParam.min;
                param.max = dataParam.max;
                param.mode = dataParam.mode;
                param.id = dataParam.id;
                param.caption = dataParam.caption;
                this.params.push(param);
            }
        }
    }

}

export class InventoryItem
{
    public offset:number = 0;
    public owner:Inventory = null;
    public isChanged:boolean = false;
    public isSelected:boolean = false;

    public id:number = 0;
    public seed:number = 0;
    public itemsCount:number = 1;
    public condition:number = 0;
    public conditionMax:number = 100;

    public itemType:InventoryItemType = null;
    public slots:Array<Inventory> = new Array<Inventory>();

    public paramsInit:Map<string, number> = new Map<string, number>();
    public params:Map<string, number> = new Map<string, number>();

    constructor()
    {

    }

    public dispose()
    {

    }

    public init(_itemtype:InventoryItemType, _seed:number = 0, _condition:number = 100, _itemscount:number = 1)
    {
        this.itemType = _itemtype;
        this.id = _itemtype.id;
        this.seed = _seed;
        this.setCondition(_condition);
        this.setCount(_itemscount);

        this.initParams();
    }

    public initParams()
    {
        this.paramsInit.clear();
        this.params.clear();

        for (var i:number = 0; i < this.itemType.params.length;i++) {
            var param:any = this.itemType.params[i];
            Inventory.iseed = (0xFFFF & this.seed) + param.id;
            var val:number = Inventory.irandomminmax(param.min, param.max);
            if (!this.paramsInit[param.name]) {
                this.paramsInit[param.name] = val;
            }
            else
            {
                this.paramsInit[param.name] += val;
            }
        }

        if ((this.paramsInit["condition"]) >= 0) this.conditionMax = this.paramsInit["condition"];
        if (this.getCondition() > this.conditionMax) this.setCondition(this.conditionMax);

        this.slots.splice(0, this.slots.length);
        for (var i:number = 0; i<this.itemType.slots.length; i++) {
            var slotType:InventoryItemSlot = this.itemType.slots[i];

            var slot:Inventory = new Inventory();
            slot.slotOwner = this;
            slot.slotX = slotType.x;
            slot.slotY = slotType.y;
            slot.slotVisible = slotType.visible;
            slot.slotType = slotType.type;
            slot.slotSlot = slotType;
            slot.isSlot = true;

            this.slots.push(slot);
        }

        this.isChanged = true;
    }


    public getCount()
    {
        return (this.itemsCount ^ (this.seed*this.seed | 1322597841));
    }

    public setCount(_count:number)
    {
        if (_count > this.itemType.maxCount) _count = this.itemType.maxCount;
        this.itemsCount = (_count ^ (this.seed * this.seed | 1322597841));
        this.onChanged();
    }

    public getCondition():number
    {
        return (this.condition ^ (this.seed*this.seed | 1322597845));
    }

    public setCondition(_condition:number)
    {
        this.condition = (_condition ^ (this.seed * this.seed | 1322597845));
    }

    public calculate():void
    {
        if (!this.isChanged) return;
        this.params.clear();

        for (var i:number = this.slots.length - 1; i >= 0; i--) {
            this.slots[i].calculate();
            Inventory.mergeParams(this.params, this.slots[i].params);
        }
        Inventory.mergeParams(this.params, this.paramsInit, this.getCount());

        this.isChanged = false;
    }

    public getParam(_name:string):number
    {
        return this.params[_name];
    }

    public onChanged()
    {
        this.isChanged = true;
        if (this.owner != null) {
            this.owner.onChanged();
        }
    }

}

export class Inventory
{
	public static iseed:number = 0;
	public static typesList:Array<InventoryItemType> = new Array<InventoryItemType>();
    public static typesIdMap:Map<number, InventoryItemType> = new Map<number, InventoryItemType>();
	public static typesMap:Map<string, InventoryItemType> = new Map<string, InventoryItemType>();

	public list:Array<InventoryItem> = new Array<InventoryItem>();
    public isSlot:boolean = false;
    public slotX:number = 0;
    public slotY:number = 0;
    public slotVisible:boolean = true;
    public slotType:number = 0;
    public slotSlot:InventoryItemSlot = null;
    public slotOwner:InventoryItem = null;
    public isChanged:boolean = true;
    public params:Map<string, number> = new Map<string, number>();

    /**
     *
     */

    constructor()
    {

    }


    public dispose()
    {
        this.clear();
    }


    public clear()
    {
        for (var i:number = 0; i < this.list.length; i++) {
            this.list[i].dispose();
        }
        this.list.splice(0, this.list.length);
        this.params.clear();
    }

    public add(type:InventoryItemType, count:number = 1, seed:number = 0, condition:number = 16777215)
    {
        var item:InventoryItem = null;
        if (type == null) return null;
        while (count > 0) {
            item = new InventoryItem();
            item.owner = this;
            item.init(type, seed, condition, count);
            item.offset = this.list.length;
            this.list.push(item);
            count -= item.getCount();
        }
        this.onChanged();
        return item;
    }

    public addById(id:number, count:number = 1, seed:number = 0, condition:number = 16777215):InventoryItem
    {
        var type:InventoryItemType = Inventory.getById(id);
        if (type == null) return null;
        return this.add(type, count, seed, condition);
    }

    public addCopy(it:InventoryItem):InventoryItem
    {
        // create item
        var item:InventoryItem = new InventoryItem();
        item.owner = this;
        item.init(it.itemType, it.seed, it.getCondition(), it.getCount());
        item.offset = this.list.length;
        this.list.push(item);
        // copy slots
        for (var i:number = 0; i < it.slots.length; i++) {
            var srcSlot:Inventory = it.slots[i];
            var dstSlot:Inventory = item.slots[i];
            for (var j:number = 0; j < srcSlot.list.length; j++) {
                dstSlot.addCopy(srcSlot.list[j]);
            }
        }
        this.onChanged();
        return item;
    }

    public addRandom(type:InventoryItemType, count:number = 1, levelMin:number = 1, levelMax:number = 16777215)
    {
        var item:InventoryItem = this.add(type, count, Inventory.irandom(10000) );
        return item;
    }

    public remove(offset:number, count:number):number
    {
        if (offset<0 || offset >= this.list.length) return 0;
        var it:InventoryItem = this.getItem(offset);
        var delcnt:number = 0;
        var cnt:number = it.getCount();
        if (cnt > count) {
            delcnt += count;
            it.setCount(cnt - count);
        }
        else
        {
            count -= cnt;
            delcnt += cnt;
            it.dispose();
            this.list.splice(offset,1);
        }
        this.format();
        this.onChanged();
        return delcnt;
    };

    public removeItem(_id:number, count:number, _seed:number)
    {
        var s:number = 0;
        var cnt:number = 0;
        var delcnt:number = 0;

        for (var i:number = this.list.length - 1; i >= 0; i--) {
            var it:InventoryItem = this.list[i];
            if (it.itemType.id == _id && it.seed == _seed) {
                cnt = it.getCount();
                if (cnt > count) {
                    delcnt += count;
                    it.setCount(cnt - count);
                    break;
                }
                else
                {
                    count -= cnt;
                    delcnt += cnt;
                    it.dispose();
                    this.list.splice(i, 1);
                }
            }
        }
        this.format();
        this.onChanged();
        return delcnt;
    }

    public getItemById(_id:number, _seed:number):InventoryItem
    {
        for (var i:number = this.list.length - 1; i >= 0; i--) {
            var it:InventoryItem = this.list[i];
            if (it.itemType.id == _id && it.seed == _seed) {
                return it;
            }
        }
        return null;
    }

    public getItemCount(_id:number, _seed:number):number
    {
        var s:number = 0;
        for (var i:number = this.list.length - 1; i >= 0; i--) {
            var it:InventoryItem = this.list[i];
            if (it.itemType.id == _id && it.seed == _seed) {
                s += it.getCount();
            }
        }
        return s;
    }

    public swap(offseta:number, offsetb:number)
    {
        if (offseta < 0 || offseta >= this.list.length || offsetb < 0 || offsetb >= this.list.length || offseta == offsetb) return;
        var item:InventoryItem = this.list[offseta];
        this.list[offseta] = this.list[offsetb];
        this.list[offsetb] = item;
        this.format();
        this.onChanged();
    }

    public move(toInventory:Inventory, offset:number, count:number)
    {
        if (offset<0 || offset >= this.list.length) return;
        var item:InventoryItem = this.list[offset];
        if (count > item.getCount()) count = item.getCount();
        if (count < item.getCount()) {
            var dstItem:InventoryItem = toInventory.addCopy(item);
            dstItem.setCount(count);
            item.setCount(item.getCount() - count);
        }
        else
        {
            item.owner = toInventory;
            item.offset = toInventory.list.length;
            toInventory.list.push(item);
            this.list.splice(offset, 1);
        }
        toInventory.format();
        toInventory.onChanged();
        this.format();
        this.onChanged();
    }

    public getItem(offset:number):InventoryItem
    {
        if (offset<0 || offset >= this.list.length) return null;
        return this.list[offset];
    }

    public getFirstItem():InventoryItem
    {
        if (this.list.length <= 0) return null;
        return this.list[0];
    }

    public moveAll(toInventory:Inventory)
    {
        for (var i:number = this.list.length - 1; i >= 0; i--) {
            var item:InventoryItem = this.getItem(i);
            item.owner = toInventory;
            item.offset = toInventory.list.length;
            toInventory.list.push(item);
            item.onChanged();
            this.list.splice(i,1);
        }
        toInventory.format();
        toInventory.onChanged();
        this.onChanged();
    }

    public moveAllTo(toInventory:Inventory, offset:number)
    {
        for (var i:number = this.list.length - 1; i >= 0; i--) {
            var item:InventoryItem = this.getItem(i);
            item.owner = toInventory;
            item.offset = toInventory.list.length;
            toInventory.list.splice(offset, 0, item);
            item.onChanged();
            this.list.splice(i, 1);
        }
        toInventory.format();
        toInventory.onChanged();
        this.onChanged();
    }

    public onChanged()
    {
        this.isChanged = true;
        if (this.isSlot && this.slotOwner != null) {
            this.slotOwner.onChanged();
        }
    }

    public getParam(_name:string):number
    {
        return this.params[_name];
    }

    public calculate():void
    {
        if (!this.isChanged) return;

        this.params.clear();
        for (var i:number = this.list.length - 1; i >= 0; i--) {
            this.list[i].calculate();
            Inventory.mergeParams(this.params, this.list[i].params);
        }
        this.isChanged = false;
    }

    public isItems()
    {
        return (this.list.length > 0);
    }

    public format()
    {
        for (var i:number = 0; i < this.list.length; i++) {
            this.list[i].offset = i;
        }

        for (var i:number = 0; i < this.list.length; i++) {
            var dstItem:InventoryItem = this.getItem(i);
            if (dstItem.getCount() < dstItem.itemType.maxCount) {
                for (var j:number = this.list.length - 1; j > i; j--) {
                    var srcItem:InventoryItem = this.getItem(j);
                    if (this.isItemsEqual(dstItem, srcItem)) {
                        var cnt:number = dstItem.itemType.maxCount - dstItem.getCount();
                        if (cnt > srcItem.getCount()) cnt = srcItem.getCount();
                        dstItem.setCount(dstItem.getCount() + cnt);
                        dstItem.onChanged();
                        srcItem.setCount(srcItem.getCount() - cnt);
                        srcItem.onChanged();
                    }
                }
            }
        }

        for (i = this.list.length - 1; i >= 0; i--) {
            var item:InventoryItem = this.list[i];
            if (item.getCount() <= 0) {
                item.dispose();
                this.list.splice(i,1);
            }
        }
    }

    public isItemsEqual(itema:InventoryItem, itemb:InventoryItem):boolean
    {
        return (itema.id == itemb.id) && (itema.seed == itemb.seed) && (itema.condition == itemb.condition);
    }

    /**
     *
     */
    public saveTo(data:Array<number>)
    {
        data.push(this.list.length);
        for (var i:number = 0; i < this.list.length; i++) {
            var item:InventoryItem = this.list[i];

            data.push(item.id ^ 0xab97f413);
            data.push(item.seed ^ 0x13ab97f4);
            data.push(item.getCondition() ^ 0xabf41397);
            data.push(item.getCount() ^ 0xf4ab9713);

            for (var j:number = 0; j < item.slots.length; j++) {
                var slot:Inventory = item.slots[j];
                slot.saveTo(data);
            }

        }
    }

    /**
     *
     */
    public loadFrom(data:Array<number>, offset:number)
    {
        this.clear();
        if ( data.length <= 0 && offset < data.length ) return;
        var itemsCount:number = data[offset++];

        for (var i:number = 0; i < itemsCount; i++) {
            if ( offset + 4 >= data.length ) return;
            var id:number = data[offset++];
            id = (id ^ 0xab97f413) & 0x0000ffff;
            var seed:number = data[offset++];
            seed = (seed ^ 0x13ab97f4) & 0x0000ffff;
            var condition:number = data[offset++];
            condition = (condition ^ 0xabf41397) & 0x0000ffff;
            var count:number = data[offset++];
            count = count ^ 0xf4ab9713;
            var it:InventoryItem = this.addById(id, count, seed, condition);
            if (it != null) {
                for (var j:number = 0; j < it.slots.length; j++) {
                    var slot:Inventory = it.slots[j];
                    slot.loadFrom(data, offset);
                }
            }
        }

    }

    /**
     *
     */

    public static irandom(max:number):number
    {
        if (max <= 0) return 0;
        Inventory.iseed = ((Inventory.iseed >> 3) * Inventory.iseed * 16805 + 789221) % 2147483647;
        return Inventory.iseed % max;
    }

    public static irandomminmax(min:number, max:number):number
    {
        Inventory.iseed = ((Inventory.iseed >> 3) * Inventory.iseed * 16805 + 789221) % 2147483647;
        if (min < max) {
            return (Inventory.iseed % 65536) * (max - min + 1) / 65536 + min;
        }
        else if (max < min) {
            return (Inventory.iseed % 65536) * (min - max + 1) / 65536 + max;
        }
        else {
            return min;
        }
    }


    public static init()
    {
        for (var i:number = 0; i < Inventory.typesList.length; i++) {
            ///Inventory.typesList[i].dispose();
        }
        Inventory.typesList.splice(0, Inventory.typesList.length);
        Inventory.typesMap.clear();
        Inventory.typesIdMap.clear();

        var data:any = Assets.getObject("assets/inventory.json");
        Inventory.typesAdd(data);
    }

    public static done()
    {
        for (var i:number = 0; i < Inventory.typesList.length; i++) {
            //Inventory.typesList[i].dispose();
        }
        Inventory.typesList.splice(0, Inventory.typesList.length);
        Inventory.typesMap.clear();
        Inventory.typesIdMap.clear();
    }

    public static typesAdd(data:any)
    {
        for (var i:number = 0; i < data.items.length; i++) {
            var itemData:any = data.items[i];
            if (itemData.file) {
                var dataNew:any = Assets.getObject(itemData.file);
                Inventory.typesAdd(dataNew);
            }
            else if (itemData.name) {
                var name:string = itemData.name;
                var inventoryItemType:InventoryItemType = new InventoryItemType();
                inventoryItemType.setFrom(itemData);
                Inventory.typesMap[name] = inventoryItemType;
                Inventory.typesIdMap[inventoryItemType.id] = inventoryItemType;
                Inventory.typesList.push(inventoryItemType);
            }
        }
    }

    public static get(name:string):InventoryItemType
    {
        var res:InventoryItemType  = Inventory.typesMap[name];
        if (res == null) {
            console.log("Inventory ItemType not found " + name);
            return null;
        }
        return res;
    }

    public static getById(id:number):InventoryItemType
    {
        var res:InventoryItemType = Inventory.typesIdMap[id];
        if (res == null) {
            console.log("Inventory ItemID not found " + id);
            return null;
        }
        return res;
    }

    public static mergeParams(to:Map<string, number>, from:Map<string, number>, mul:number = 1)
    {
        for (let itemName in from) {
            if( to[itemName] ) {
                to[itemName] += from[itemName] * mul;
            }
            else {
                to[itemName] = from[itemName] * mul;
            }
        }
    }
}