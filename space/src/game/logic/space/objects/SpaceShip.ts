import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {GameObject} from "./GameObject";
import {Inventory, InventoryItem} from "../../../data/game/Inventory";
import {SpaceShipWeapon} from "./SpaceShipWeapon";
import {SpaceShipReactive} from "./SpaceShipReactive";
import {Assets} from "../../../../engine/Assets";
import {Screen} from "../../../Screen";

export class SpaceShip extends GameObject
{

    public mesh:THREE.Mesh = null;

    public mass:number = 0;

    public cargo:number = 0;

    public isOverload:boolean = false;

    public maxVelocity:number = 1;

    public armor:number = 0;

    public shield:number = 0;

    public mobility:number = 0;

    public radarRadius:number = 0;

    public conditionReg:number = 0;

    public protectorReg:number = 0;

    public protectorDelay:number = 0;

    public protectorDelayMax:number = 0;

    public protectorMax:number = 0;

    public protector:number = 0;

    public weaponList:Array<SpaceShipWeapon> = new Array<SpaceShipWeapon>();

    public reactiveList:Array<SpaceShipReactive> = new Array<SpaceShipReactive>();

    public condition:number = 0;

    public conditionMax:number = 0;

    public regenerationDelay:number = 0;

    public regenerationDelayMax:number = 0;


    public setMesh(meshName:string)
    {
        if ( this.mesh != null ) {
            Screen.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
        var model:any = Assets.getGeometry("assets/model.json");
        this.mesh = new THREE.Mesh( model.geometry, model.materials[0] ); //new THREE.MeshBasicMaterial()
        Screen.scene.add( this.mesh );
    }

    public calculateInventory()
    {
        if ( !this.base.isChanged && !this.inventory.isChanged ) return;

        // Расчет на основе Base и Inventory
        if ( this.inventory.isChanged ) {
            this.inventory.calculate();
        }

        var isBaseChanged:boolean = this.base.isChanged;
        if ( isBaseChanged )
        {
            this.base.calculate();
        }

        // Масса корабля с инвентарем
        this.mass = this.base.getParam("mass") + this.inventory.getParam("mass");

        // Грузоподъемность
        this.cargo = this.base.getParam("cargo");

        // Скорость корабля
        this.maxVelocity = this.base.getParam("maxvelocity");
        if ( this.mass > this.cargo ) {
            this.maxVelocity = 1;
            this.isOverload = true;
        } else {
            this.isOverload = false;
        }
        if ( this.maxVelocity < 1 ) this.maxVelocity = 1;

        if ( !isBaseChanged ) {
            return;
        }

        // Броня
        this.armor = this.base.getParam("armor");

        // Щит
        this.shield = this.base.getParam("shield");

        // Подвижность
        this.mobility = this.base.getParam("mobility");

        // Радиус радара
        this.radarRadius = this.base.getParam("radarradius");

        // Регенерация здоровья
        this.conditionReg = this.base.getParam("conditionreg");

        // Регенерация защитного поля
        this.protectorReg = this.base.getParam("protectorreg");

        // Максмиальная величина защитного поля
        this.protectorMax = this.base.getParam("protectormax");

        // Максмиальная величина защитного поля
        this.protectorDelayMax = this.base.getParam("protectordelay");

        // Текущее значение защитного поля
        if ( this.protector < 0 ) this.protector = 0;
        if ( this.protector > this.protectorMax ) this.protector = this.protectorMax;

        // Массив с оружием
        this.weaponList.splice(0, this.weaponList.length);

        // Массив с реактивными струями
        this.reactiveList.splice(0, this.reactiveList.length);

        // Предмет с гипердрайвом
        var i:number;
        var wpn:SpaceShipWeapon;
        var rea:SpaceShipReactive;
        var baseItem:InventoryItem = this.base.getFirstItem();
        var slot:Inventory;
        var slotItem:InventoryItem;
        if ( baseItem != null ) {

            this.condition = baseItem.getCondition();
            this.conditionMax = baseItem.conditionMax;

            // Изображение корабля в пространстве
            this.setMesh(baseItem.itemType.modelName);

            // Проходим все слоты
            for (i = baseItem.slots.length - 1; i >= 0; i--) {
                slot = baseItem.slots[i];
                slotItem = slot.getFirstItem();

                // тип 1 - двигатель
                if ( slot.slotSlot.type == 1 ) {
                    // След от двигателя
                    rea = new SpaceShipReactive();


                    rea.position = slot.slotSlot.position;
                    rea.scale = slot.slotSlot.scale;

                    this.reactiveList.push(rea);
                }

                ///
                if ( slotItem != null ) {

                    if ( slotItem.itemType.type == 20 ) {
                        // Корабельное оружие

                        wpn = new SpaceShipWeapon();

                        //wpn.GunshotType = slotitem.itemtype.WeaponGunshotType;
                        wpn.radius = slotItem.getParam("damageradius");

                        wpn.damageMin = slotItem.getParam("damagemin");
                        wpn.damageMax = slotItem.getParam("damagemax");

                        wpn.velocity = slotItem.getParam("velocity");

                        wpn.randomShift = slotItem.getParam("randomshift") * 0.001;

                        wpn.splashDamageRadius = slotItem.getParam("damagesplashradius");;

                        wpn.delayMax = slotItem.getParam("delay")*0.01;
                        wpn.delay = wpn.delayMax;
                        wpn.position = slot.slotSlot.position;

                        wpn.weaponShotType = slotItem.itemType.weaponShotType;

                        this.weaponList.push(wpn);

                    }

                }

            }

        }

    }

    public update(deltaTime:number)
    {
        // Расчет инвентаря
        this.calculateInventory();

        //
        this.mesh.rotation.y += deltaTime * 10.0;
        this.mesh.rotation.x += deltaTime * 3.0;
        this.mesh.rotation.z += deltaTime * 5.0;

        // Регенерация протектора - щита
        this.protectorDelay += deltaTime;
        if ( this.protectorDelay >= this.protectorDelayMax ) {

            this.protector += this.protectorReg * deltaTime;

            if ( this.protector > this.protectorMax ) {
                this.protector = this.protectorMax;
            }

        }

        // Регенерация стойкости корпуса
        this.regenerationDelay += deltaTime;
        if ( this.regenerationDelay >= this.regenerationDelayMax ) {

            if ( this.condition < this.conditionMax ) {

                this.condition += this.conditionReg;
                if ( this.condition >= this.conditionMax ) {
                    this.condition = this.conditionMax;
                }

                var baseItem:InventoryItem = this.base.getFirstItem();
                if ( baseItem != null ) {
                    baseItem.setCondition(this.condition);
                }
            }

            //
            this.regenerationDelay -= this.regenerationDelayMax;
        }

    }


}