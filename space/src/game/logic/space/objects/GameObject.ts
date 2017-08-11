import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Quaternion, Vector3} from "three";
import {Inventory} from "../../../data/game/Inventory";
import {Assets} from "../../../../engine/Assets";
import {Screen} from "../../../Screen";

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

    // graphics
    public mesh:THREE.Mesh = null;

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
    public setMesh(meshName:string)
    {
        if ( this.mesh != null ) {
            Screen.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
        var model:any = Assets.getGeometry(meshName);
        this.mesh = new THREE.Mesh( model.geometry, model.materials );
        Screen.scene.add( this.mesh );
    }

    /**
     *
     */
    public update(deltaTime:number)
    {
        if ( this.mesh != null ) {
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.mesh.setRotationFromQuaternion(this.rotation);
        }
    }

    /**
     *
     */
    public calculateInventory()
    {

    }
}