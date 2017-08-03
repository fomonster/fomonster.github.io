/**
 * Created by User on 15.04.2014.
 */
export class Particle
{
    public needDelete:boolean = false;

    public lifeTime:number = 0;
    public lifeTimeMax:number = 1;

    construcor (_x:number,_y:number):void
    {

    }

    public done():void
    {

    }

    public update(deltaTime:number):void
    {
        this.lifeTime += deltaTime;
        if ( this.lifeTime > this.lifeTimeMax ) {
            this.needDelete = true;
            this.lifeTime = this.lifeTimeMax;
        }
    }

}