import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {GameObject} from "./objects/GameObject";
import {Screen} from "../../Screen";
import {SpaceShip} from "./objects/SpaceShip";
import {GameData} from "../../data/GameData";
import {Vector3} from "three";
import {Assets} from "../../../engine/Assets";

export class Space
{
    //--------------------------------------------------------------------------
    // Игровые объекты
    //--------------------------------------------------------------------------

    //
    public light:THREE.Light = null;

    //
    public particles:THREE.Points = null;
    public particlesGeometry:THREE.Geometry = null;

    //
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
        // Stars


        // ----------------

        this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 0, 0, 1 );
        Screen.scene.add( this.light );

        // -----------------

        this.particlesGeometry = new THREE.Geometry();

        for ( var i = 0; i < 10000; i ++ ) {

            var vertex = new THREE.Vector3();
            vertex.x = THREE.Math.randFloatSpread( 2000 );
            vertex.y = THREE.Math.randFloatSpread( 2000 );
            vertex.z = THREE.Math.randFloatSpread( 2000 );

            var r = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
            if ( r != 0 ) {
                vertex.x = 20000 * vertex.x / r;
                vertex.y = 20000 * vertex.y / r;
                vertex.z = 20000 * vertex.z / r;
            }

            this.particlesGeometry.vertices.push( vertex );

        }

        this.particles = new THREE.Points( this.particlesGeometry, new THREE.PointsMaterial( { color: 0x888888, size: 2, sizeAttenuation:false } ) );
        Screen.scene.add( this.particles );


        // -----------------

        this.addPlayerSpaceShip();



    }

    /**
     *  Создает космос
     */
    public done()
    {
        this.clear();

        // Stars
        Screen.scene.remove( this.particles );
        this.particlesGeometry.dispose();
        this.particles = null;

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