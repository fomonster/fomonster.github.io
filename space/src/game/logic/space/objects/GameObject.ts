import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Quaternion, Vector3} from "three";
import {Inventory} from "../../../data/game/Inventory";

export class GameObject
{
    public static hashCounter:number = 1;

    public hash:number;

    public forward:Vector3 = new Vector3(0, 0, 1);
    public up:Vector3 = new Vector3(0, 1, 0);
    public right:Vector3 = new Vector3(1, 0, 0);

    public position:Vector3 = new Vector3();
    public rotation:Quaternion = new Quaternion();

    public velocity:Vector3 = new Vector3();
    public angularVelocity:Vector3 = new Vector3();

    public boundingSphereRadius:number = 0;

    public needDelete:boolean = false;

    public inventory:Inventory  = new Inventory();
    public base:Inventory  = new Inventory();

    /**
     *
     */
    constructor()
    {
        this.hash = GameObject.hashCounter;
        GameObject.hashCounter++;
    }

    /**
     *
     */
    public dispose()
    {

    }

    /**
     *
     */
    public update(deltaTime:number)
    {

    }

    public calculateInventory()
    {

    }
}