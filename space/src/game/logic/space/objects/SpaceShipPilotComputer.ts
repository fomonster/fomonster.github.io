
import {SpaceShip} from "./SpaceShip";
import {GameObject} from "./GameObject";
import {Screen} from "../../../Screen";
import {SpaceShipPilot} from "./SpaceShipPilot";
import {Space} from "../Space";
import {Random} from "../../../../engine/Random";
import {Vector3} from "three";

export class SpaceShipPilotComputer extends SpaceShipPilot
{
    public mode:number = SpaceShipPilot.MODE_STAND;

    public update(deltaTime:number)
    {



    }

    public onObjectCollided(obj:GameObject)
    {

    }

    public onShot(shot:any) //SS3DShotsShot
    {

    }

    public stepStand(deltaTime:number)
    {

        this.owner.velocity.x -= this.owner.velocity.x * this.owner.mobility * deltaTime * 0.05;
        this.owner.velocity.y -= this.owner.velocity.y * this.owner.mobility * deltaTime * 0.05;
        this.owner.velocity.z -= this.owner.velocity.z * this.owner.mobility * deltaTime * 0.05;

    }

    public stepAttack(deltaTime:number)
    {
        var obj:GameObject = this.owner.owner.get(this.owner.targetObjectHash);
        if ( obj != null ) {
            this.owner.stepAttackObject(obj, 15, deltaTime);
        } else {
            this.mode = SpaceShipPilot.MODE_STAND;
        }

    }

    public stepMoveToPoint(deltaTime:number)
    {
        this.owner.stepMoveToPoint(this.owner.targetPoint, deltaTime);
    }

    public stepMoveToObject(deltaTime:number)
    {
        var obj:GameObject = this.owner.owner.get(this.owner.targetObjectHash);
        if ( obj != null ) {
            this.owner.stepMoveToObject(obj,5, deltaTime);
        }
    }

    public setMoveToPoint(_x:number, _y:number, _z:number):void
    {
        this.owner.targetPoint = new Vector3(_x, _y, _z);
        this.mode = SpaceShipPilot.MODE_MOVETOPOINT;
    }

    public setAttackObject(object:GameObject):void
    {
        this.owner.targetObjectHash = object.hash;
        this.mode = SpaceShipPilot.MODE_ATTACK;
    }

}
