import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {GameObject} from "./objects/GameObject";
import {Screen} from "../../Screen";

export class Space
{
    public objects:Array<GameObject> = new Array<GameObject>();

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
     *  Создает космос
     */
    public init(seed:number)
    {

    }

    /**
     *
     */
    public update(deltaTime:number)
    {
        //Screen.scene.add()
        for(var i:number =this.objects.length-1; i >=0; i++) {
            var object:GameObject = this.objects[i];
            if ( object.needDelete ) {
                object.dispose();
                this.objects.splice(i,1);
            } else {
                object.update(deltaTime);
            }
        }
    }

}