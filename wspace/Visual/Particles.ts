/**
 * Created by User on 15.04.2014.
 */
import * as PIXI from '../../pixi.js';
import {Particle} from "./Particle";

export class Particles {
    static screen:PIXI.Container = null;

    static items:Particle[] = [];

    static add(particle:Particle):void
    {
        Particles.items.push(particle);
    }

    static update(deltaTime:number):void
    {
        for (var i:number = Particles.items.length - 1; i >= 0; i--) {
            var particle:Particle = Particles.items[i];
            particle.update(deltaTime);
            if (particle.needDelete) {
                particle.done();
                Particles.items.splice(i, 1);              
            }
        }
    }



}