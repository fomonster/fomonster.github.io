import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Vector3} from "three";
import {Inventory} from "../../../data/game/Inventory";

export class GameObject
{
    public static hashCounter:number = 1;

    public hash:number;
    public position:Vector3 = new Vector3();

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