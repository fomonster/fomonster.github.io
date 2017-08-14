
import {SpaceShip} from "./SpaceShip";
import {GameObject} from "./GameObject";
import {Screen} from "../../../Screen";

export class SpaceShipPilot
{
    public static MODE_STAND:number = 0;
    public static MODE_MOVETOPOINT:number = 1;
    public static MODE_MOVETOOBJECT:number = 2;
    public static MODE_ATTACK:number = 3;
    public static MODE_FALLBACK:number = 4;

    public owner:SpaceShip = null;

    public targetHash:number;

    public constructor(_owner:SpaceShip)
    {
        this.owner = _owner;

    }

    public update(deltaTime:number)
    {

    }

    public onObjectCollided(obj:GameObject)
    {

    }

    public onShot(shot:any) //SS3DShotsShot
    {

    }

}
