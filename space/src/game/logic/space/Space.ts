import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {GameObject} from "./objects/GameObject";
import {Screen} from "../../Screen";
import {SpaceShip} from "./objects/SpaceShip";
import {GameData} from "../../data/GameData";
import {Vector3} from "three";

export class Space
{
    //--------------------------------------------------------------------------
    // Игровые объекты
    //--------------------------------------------------------------------------

    public objects:Array<GameObject> = new Array<GameObject>();

    //--------------------------------------------------------------------------
    // Корабль игрока
    //--------------------------------------------------------------------------

    // Ид объекта корабл игрока
    public currentShipHash:number = 0;

    // Задержкка респауна корабля игрока
    public respawnDelay:number = 3;

    // Текущая точка респауна
    public respownPoint:Vector3 = new Vector3();

    // Задержка между расчетами кораблей
    public updateShipsRespawnDelay:number = 1;

    //--------------------------------------------------------------------------
    //
    //--------------------------------------------------------------------------

    /**
     *
     */
    constructor()
    {

    }

    /**
     *
     */
    public dispose()
    {
        this.clear();
    }

    /**
     *   Очистка космоса
     */
    public clear()
    {
        for(var i:number =this.objects.length-1; i >=0; i++) {
            var object: GameObject = this.objects[i];
            object.dispose();
        }
    }

    /**
     * Добавление объекта в космос
     */
    public addObject(object:GameObject)
    {
        this.objects.push(object);
    }

    /**
     *  Создает космос
     */
    public init()
    {

        this.addPlayerSpaceShip();



    }

    /**
     *  Создает космос
     */
    public done()
    {
        this.clear();


    }

    /**
     *
     */
    public update(deltaTime:number)
    {
        //Screen.scene.add()
        for(var i:number =this.objects.length-1; i >=0; i--) {
            var object:GameObject = this.objects[i];
            if ( object.needDelete ) {
                object.dispose();
                this.objects.splice(i,1);
            } else {
                object.update(deltaTime);
            }
        }
    }

    /**
     *
     */
    public addPlayerSpaceShip()
    {
        //
        var spaceship:SpaceShip = new SpaceShip();
        spaceship.position.set(this.respownPoint.x, this.respownPoint.y, this.respownPoint.z);
        spaceship.base = GameData.userData.base;
        spaceship.inventory = GameData.userData.inventory;
        spaceship.base.isChanged = true;
        spaceship.calculateInventory();
        this.addObject(spaceship);
        this.currentShipHash = spaceship.hash;

    }
}