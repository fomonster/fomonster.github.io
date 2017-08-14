import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {GameObject} from "./GameObject";
import {Inventory, InventoryItem} from "../../../data/game/Inventory";
import {SpaceShipWeapon} from "./SpaceShipWeapon";
import {SpaceShipReactive} from "./SpaceShipReactive";
import {Assets} from "../../../../engine/Assets";
import {Screen} from "../../../Screen";
import {SpaceShipPilot} from "./SpaceShipPilot";
import {Utils} from "../../../../engine/Utils";
import {Quaternion, Vector, Vector3} from "three";
import {Space} from "../Space";

export class SpaceShip extends GameObject
{


    public static RACE_HUMAN:number = 0;
    public static RACE_INSECT:number = 1;
    public static RACE_ALIEN:number = 2;

    public static MOVEPHASE_ATTACK_MOVETORANDOMPOINT:number = 0;
    public static MOVEPHASE_ATTACK_MOVETOTARGET:number = 0;
    public static MOVEPHASE_ATTACK_ROTATETOTARGET:number = 0;

    public currentHash:number = 0;
    // in game properties

    public mass:number = 0;

    public cargo:number = 0;

    public isOverload:boolean = false;

    public maxVelocity:number = 1;

    public angularAccelerationAdd:number = 0.01;

    public maxAngularVelocity:number = 0.02;

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

    // ai

    public pilot:SpaceShipPilot = null;

    public targetPoint:Vector3 = null; // точка назначения

    public targetObjectHash:number = -1; // хеш объекта назначения

    public movePhase:number = 0;


    // Временные регистры для расчетов
    public static dQ:Quaternion = new Quaternion();
    public static dQA:Quaternion = new Quaternion();
    public static dQB:Quaternion = new Quaternion();
    public static dV:Vector3 = new Vector3();
    public static dVA:Vector3 = new Vector3();

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

        this.angularAccelerationAdd = this.mobility / 60;
        this.maxAngularVelocity = this.mobility / 35;

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
        //
        Utils.rotateVector(this.rotation, Utils.AXIS_Y, this.forward);
        Utils.rotateVector(this.rotation, Utils.AXIS_Z, this.up);
        Utils.rotateVector(this.rotation, Utils.AXIS_X, this.right);
        Utils.rotateVector(this.rotation, Utils.AXIS_NEG_X, this.left);
        this.forward.normalize();
        this.up.normalize();
        this.right.normalize();
        this.left.normalize();
        //

        // Расчет инвентаря
        this.calculateInventory();

        //
        if ( this.pilot ) {
            this.pilot.update(deltaTime);
        }

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


        // Предел скорости
        var linVel:number = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y + this.velocity.z * this.velocity.z);
        if ( linVel > this.maxVelocity )
        {
            this.velocity.x = this.maxVelocity * this.velocity.x / linVel;
            this.velocity.y = this.maxVelocity * this.velocity.y / linVel;
            this.velocity.z = this.maxVelocity * this.velocity.z / linVel;

            linVel = this.maxVelocity;
        }
        var angVel:number = Math.sqrt(this.angularVelocity.x * this.angularVelocity.x + this.angularVelocity.y * this.angularVelocity.y + this.angularVelocity.z * this.angularVelocity.z);
        if  ( angVel > this.maxAngularVelocity) {
            this.angularVelocity.x = this.maxAngularVelocity * this.angularVelocity.x / angVel;
            this.angularVelocity.y = this.maxAngularVelocity * this.angularVelocity.y / angVel;
            this.angularVelocity.z = this.maxAngularVelocity * this.angularVelocity.z / angVel;
        }


        // Применяем скорость
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;

        // Применяем угловую скорость
        Utils.setFromAxisAngle(SpaceShip.dQ,this.angularVelocity);
        Utils.multiplyRight(this.rotation, SpaceShip.dQ);

        // Коэффициенты уменьшений увеличений
        var koeffStop:Number = 5 * deltaTime;
        if ( koeffStop > 0.8 ) koeffStop = 0.8;

        var koeffAngle:Number = 0.3 * deltaTime;
        if ( koeffAngle > 1 ) koeffAngle = 1;

       super.update(deltaTime);

    }

    public stepRotateToPoint(point:Vector3, deltaTime:number, upAlign:boolean = false)
    {
        if ( point == null ) return;

        var step:number = this.angularAccelerationAdd * deltaTime;
        if ( step > 1 ) step = 1;
        if ( step < 0 ) step = 0;

        var stopStep:number = this.mobility * deltaTime;
        if ( stopStep > 0.8 ) stopStep = 0.8;
        if ( stopStep < 0 ) stopStep = 0;

        //
        SpaceShip.dV.set(point.x, point.y, point.z);
        SpaceShip.dV.sub(this.position);
        SpaceShip.dV.normalize();
        SpaceShip.dVA.crossVectors(this.forward, SpaceShip.dV);

        //
        var currentSpeed:number = this.angularVelocity.length();//Math.abs(this.angularVelocity.dot(SpaceShip.dVA));
        var deltaAngle:number = SpaceShip.dVA.length();
        if ( currentSpeed > deltaAngle * this.angularAccelerationAdd * 0.5  ) { //
            var accelKoeff:number = Math.abs(this.forward.dot(this.angularVelocity));// / currentSpeed;// * this.angularAccelerationAdd;
            if ( accelKoeff > 1 ) accelKoeff = 1;
            if ( accelKoeff < 0 ) accelKoeff = 0;

            var angularAccelerationX:number = (0 - this.angularVelocity.x) * stopStep * accelKoeff;/// * (1 - accelKoeff) + accelKoeff * SpaceShip.dVA.x * step;
            var angularAccelerationY:number = (0 - this.angularVelocity.y) * stopStep * accelKoeff;/// * (1 - accelKoeff) + accelKoeff * SpaceShip.dVA.y * step;
            var angularAccelerationZ:number = (0 - this.angularVelocity.z) * stopStep * accelKoeff;/// * (1 - accelKoeff) + accelKoeff * SpaceShip.dVA.z * step;

            this.angularVelocity.x += angularAccelerationX;
            this.angularVelocity.y += angularAccelerationY;
            this.angularVelocity.z += angularAccelerationZ;

        } else {
            var accelKoeff:number = 1;//Math.abs(deltaAngle) / (Math.PI / 6 );
            if ( accelKoeff > 1 ) accelKoeff = 1;
            if ( accelKoeff < 0 ) accelKoeff = 0;

            this.angularVelocity.x += SpaceShip.dVA.x * step * accelKoeff;
            this.angularVelocity.y += SpaceShip.dVA.y * step * accelKoeff;
            this.angularVelocity.z += SpaceShip.dVA.z * step * accelKoeff;

        }

        //var deltaAngle:number = Math.acos(this.forward.dot(SpaceShip.dV));
        //var moveAngle:number = this.angularVelocity.length();



        // Коэффеициент, определяющий силу поворота в сторону
        //var accelKoeff:number = Math.abs(deltaAngle) / (Math.PI / 6 );
        //if ( accelKoeff > 1 ) accelKoeff = 1;
        //if ( accelKoeff < 0 ) accelKoeff = 0;
        //if ( moveAngle > deltaAngle ) accelKoeff = 0;

        // Получаем ускорение поворота

        /*
        SpaceShip.dV.set(point.x, point.y, point.z);
        SpaceShip.dV.sub(this.position);
        SpaceShip.dV.normalize();
        SpaceShip.dVA.crossVectors( this.forward, SpaceShip.dV);
        SpaceShip.dVA.multiplyScalar(step);
        this.angularVelocity.add(SpaceShip.dVA);*/

        /*
        // rotation to point
        SpaceShip.dV.set(point.x, point.y, point.z);
        SpaceShip.dV.sub(this.position);
        SpaceShip.dV.normalize();
        Utils.shortestArc(SpaceShip.dQ, this.forward, SpaceShip.dV); //rot.setFromUnitVectors(this.forward, r);
        Utils.multiplyLeft(SpaceShip.dQ, this.rotation); //this.dQ.multiply(this.rotation);
        this.rotation.slerp(SpaceShip.dQ,  step);

        // up to angle plane
        if ( upAlign ) {
            SpaceShip.dVA.crossVectors(SpaceShip.dV, this.forward);
            if (SpaceShip.dVA.length() > 0.1) {

                Utils.shortestArc(SpaceShip.dQA, this.right, SpaceShip.dVA); //rot.setFromUnitVectors(this.forward, r);
                Utils.shortestArc(SpaceShip.dQB, this.left, SpaceShip.dVA); //rot.setFromUnitVectors(this.forward, r);

                if ( Math.acos(SpaceShip.dQA.w) < Math.acos(SpaceShip.dQB.w) ) {
                    Utils.multiplyLeft(SpaceShip.dQA, this.rotation); //this.dQ.multiply(this.rotation);
                    this.rotation.slerp(SpaceShip.dQA, step);
                } else {
                    Utils.multiplyLeft(SpaceShip.dQB, this.rotation); //this.dQ.multiply(this.rotation);
                    this.rotation.slerp(SpaceShip.dQB, step);
                }
            }
        }*/
    }

    public stepMoveToPoint(point:Vector3, deltaTime:number)
    {
        if ( point == null ) return;
        var r:Vector3 = point.sub(this.position);



    }

    public stepAttackObject(object:GameObject, distance:number, deltaTime:number)
    {

    }

    public stepMoveToObject(object:GameObject, distance:number, deltaTime:number)
    {

    }
}