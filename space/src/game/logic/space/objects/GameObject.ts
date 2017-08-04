import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Vector3} from "three";

export class GameObject
{
    public position:Vector3 = new Vector3();

    public needDelete:boolean = false;

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

    }

    /**
     *
     */
    public update(deltaTime:number)
    {

    }
}