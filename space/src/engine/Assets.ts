import * as THREE from 'three';
import * as PIXI from 'pixi.js';

export class Assets
{
    /**
     *  JSON objects
     */
    public static getObject(name:string):any
    {

    }

    public static getTexture(name:string):PIXI.Texture
    {
        var texture:PIXI.Texture = PIXI.loader.resources[name].texture;

        return texture;
    }

    public static getTextureFromAtlas(atlasName:string, name:string):PIXI.Texture
    {
        return PIXI.loader.resources[atlasName].textures[name];
    }

}