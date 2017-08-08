

import {Vector3} from "three";

export class SpaceShipWeapon
{
    public radius:number = 0;
    public damageMin:number = 0;
    public damageMax:number = 0;
    public velocity:number = 0;
    public randomShift:number = 0;
    public splashDamageRadius:number = 0;
    public delayMax:number = 0;
    public delay:number = 0;
    public position:Vector3 = new Vector3();
    public weaponShotType:number = 0;


}