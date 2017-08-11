
import {SpaceShip} from "./SpaceShip";
import {GameObject} from "./GameObject";
import {Screen} from "../../../Screen";
import {SpaceShipPilot} from "./SpaceShipPilot";
import {Space} from "../Space";
import {Random} from "../../../../engine/Random";

export class SpaceShipPilotPlayer extends SpaceShipPilot
{

    public update(deltaTime:number) {
        var acceleration: number = this.owner.maxVelocity  * this.owner.mobility * 0.2;


        //owner.IsFireA = SSControl.ButtonDown("firea") || SS3DGame.KeyPressed[32];
        //owner.IsFireB = SSControl.ButtonDown("fireb");// || SS3DGame.KeyPressed[32];

        var isForward: boolean = Screen.keyPressed(87); // W
        var isBackward: boolean = Screen.keyPressed(83); // S
        var isUp: boolean = Screen.keyPressed(89); // Y
        var isDown: boolean = Screen.keyPressed(72); // H
        var isLeft: boolean = Screen.keyPressed(66); // B
        var isRight: boolean = Screen.keyPressed(78); // N
        var isRotateLeft: boolean = Screen.keyPressed(65); // A
        var isRotateRight: boolean = Screen.keyPressed(68); // D
        var isRotateUp: boolean = Screen.keyPressed(80); // P
        var isRotateDown: boolean = Screen.keyPressed(76); // L
        var isRotateRollLeft: boolean = Screen.keyPressed(81); // Q
        var isRotateRollRight: boolean = Screen.keyPressed(69); // E

        var isTarget:boolean = Screen.keyPressed(84); // T

        // Линейное движение
        if (isUp) { //|| IsForwardMouse
            this.owner.velocity.x += this.owner.up.x * acceleration * deltaTime;
            this.owner.velocity.y += this.owner.up.y * acceleration * deltaTime;
            this.owner.velocity.z += this.owner.up.z * acceleration * deltaTime;
        } else if (isRight) { //|| IsForwardMouse
            this.owner.velocity.x += this.owner.right.x * acceleration * deltaTime;
            this.owner.velocity.y += this.owner.right.y * acceleration * deltaTime;
            this.owner.velocity.z += this.owner.right.z * acceleration * deltaTime;
        } else if (isForward) { //|| IsForwardMouse
            this.owner.velocity.x += this.owner.forward.x * acceleration * deltaTime;
            this.owner.velocity.y += this.owner.forward.y * acceleration * deltaTime;
            this.owner.velocity.z += this.owner.forward.z * acceleration * deltaTime;
        } else if (isBackward) {
            this.owner.velocity.x -= this.owner.velocity.x * this.owner.mobility * deltaTime * 0.3;
            this.owner.velocity.y -= this.owner.velocity.y * this.owner.mobility * deltaTime * 0.3;
            this.owner.velocity.z -= this.owner.velocity.z * this.owner.mobility * deltaTime * 0.3;
        }

        var step:number = deltaTime * this.owner.mobility * 0.01;

        // Вращение
        if ((isRotateRight && isRotateLeft) || (isRotateUp && isRotateDown) || (isRotateRollRight && isRotateRollLeft) || ((!isRotateLeft && !isRotateRight)&&(!isRotateUp && !isRotateDown)&&(!isRotateRollLeft && !isRotateRollRight)) ) {
            this.owner.angularVelocity.x -= this.owner.angularVelocity.x * this.owner.mobility * deltaTime * 0.5;
            this.owner.angularVelocity.y -= this.owner.angularVelocity.y * this.owner.mobility * deltaTime * 0.5;
            this.owner.angularVelocity.z -= this.owner.angularVelocity.z * this.owner.mobility * deltaTime * 0.5;
        } else {
            if ( isRotateLeft ) {
                this.owner.angularVelocity.x += this.owner.up.x * step;
                this.owner.angularVelocity.y += this.owner.up.y * step;
                this.owner.angularVelocity.z += this.owner.up.z * step;
            } else if ( isRotateRight ) {
                this.owner.angularVelocity.x -= this.owner.up.x * step;
                this.owner.angularVelocity.y -= this.owner.up.y * step;
                this.owner.angularVelocity.z -= this.owner.up.z * step;
            }
            if ( isRotateRollLeft ) {
                this.owner.angularVelocity.x -= this.owner.forward.x * step;
                this.owner.angularVelocity.y -= this.owner.forward.y * step;
                this.owner.angularVelocity.z -= this.owner.forward.z * step;
            } else if ( isRotateRollRight ) {
                this.owner.angularVelocity.x += this.owner.forward.x * step;
                this.owner.angularVelocity.y += this.owner.forward.y * step;
                this.owner.angularVelocity.z += this.owner.forward.z * step;
            }
            if ( isRotateUp ) {
                this.owner.angularVelocity.x += this.owner.right.x * step;
                this.owner.angularVelocity.y += this.owner.right.y * step;
                this.owner.angularVelocity.z += this.owner.right.z * step;
            } else if ( isRotateDown ) {
                this.owner.angularVelocity.x -= this.owner.right.x * step;
                this.owner.angularVelocity.y -= this.owner.right.y * step;
                this.owner.angularVelocity.z -= this.owner.right.z * step;
            }
        }

        if ( isTarget ) {

            this.owner.targetPoint = Space.self.objects[Random.irandom(Space.self.objects.length)].position;

        }

        if ( this.owner.targetPoint ) {
            this.owner.stepRotateToPoint(this.owner.targetPoint, deltaTime, true);
        }
    }

    public onObjectCollided(obj:GameObject)
    {

    }

    public onShot(shot:any) //SS3DShotsShot
    {

    }

}
