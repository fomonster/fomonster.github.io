import {GameObject} from "./GameObject";

export class Asteroid extends GameObject
{

    constructor()
    {
        super();
        this.setMesh('assets/asteroid.json');
    }

    public update(deltaTime:number)
    {
        super.update(deltaTime);

    }
}