import * as THREE from 'three';
import * as PIXI from 'pixi.js';

export class Assets
{
    public static objectMap:Map<string, any> = new Map<string, any>();
    public static textureMap:Map<string, PIXI.Texture> = new Map<string, PIXI.Texture>();
    /**
     *  JSON objects
     */
    public static getObject(name:string):any
    {
        return Assets.objectMap[name];
    }

    public static getTexture(name:string):PIXI.Texture
    {
        var texture:PIXI.Texture = null;
        if ( !name ) return null;
        if ( !PIXI.loader.resources[name] ) {
            texture = Assets.textureMap[name];
            if ( !texture ) {
                console.log("getTexture "+name+" error");
                return;
            }
            return texture;
        }
        texture = PIXI.loader.resources[name].texture;
        return texture;
    }

    public static getTextureFromAtlas(atlasName:string, name:string):PIXI.Texture
    {
        if ( !PIXI.loader.resources[atlasName] ) {
            console.log("getTextureFromAtlas " + atlasName + " error");
            return;
        }
        var texture:PIXI.Texture = PIXI.loader.resources[atlasName].textures[name];
        if ( !texture ) {
            console.log("getTextureFromAtlas " + atlasName+" " + name + "error");
            return;
        }
        return texture;
    }

}