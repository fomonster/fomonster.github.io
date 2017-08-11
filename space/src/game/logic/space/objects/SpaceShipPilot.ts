
import {SpaceShip} from "./SpaceShip";
import {GameObject} from "./GameObject";
import {Screen} from "../../../Screen";

export class SpaceShipPilot
{
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
