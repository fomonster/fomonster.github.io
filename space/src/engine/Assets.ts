import * as THREE from 'three';
import * as PIXI from 'pixi.js';

export class Assets
{
    public static objectMap:Map<string, any> = new Map<string, any>();
    public static textureMap:Map<string, PIXI.Texture> = new Map<string, PIXI.Texture>();

    private static _onLoad:Function;
    private static _onProgress:Function;

    /**
     *  3D Models
     */
    public static getGeometry(name:string, texturePath:string = ""):any
    {
        var jsonData:any = Assets.getObject(name);
        var loader:THREE.JSONLoader = new THREE.JSONLoader();
        var model:any = loader.parse(jsonData); //, texturePath
        return model;
    }


    /**
     *  JSON objects
     */
    public static getObject(name:string):any
    {
        return Assets.objectMap[name];
    }

    /**
     *  Any texture
     */
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

    /**
     *  Texture from specified atlas
     */
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

    /**
     *  Load any resources
     */
    public static load(list:Array<any>, onLoad:Function = null, onProgress:Function = null)
    {
        this._onLoad = onLoad;
        this._onProgress = onProgress;
        PIXI.loader.on('load', this.onLoadCallback.bind(Assets));
        if ( onProgress != null ) PIXI.loader.on('progress', this.onProgressCallback.bind(Assets));

        var loader:PIXI.loaders.Loader = null;
        for(var i:number=0;i<list.length;i++){
            if ( list[i].length == 2) {
                if ( loader == null ) loader = PIXI.loader.add(list[i][0], list[i][1]);
                else loader = loader.add(list[i][0], list[i][1]);
            } else {
                if ( loader == null ) loader = PIXI.loader.add(list[i]);
                else loader = loader.add(list[i]);
            }
        }
        if ( loader != null ) loader.load(this.onLoadComplete.bind(Assets));
        else onLoad();
    }


    private static onProgressCallback(loader, resource):void
    {
        if ( this._onProgress ) this._onProgress(loader, resource);
    }

    private static onLoadComplete():void
    {
        if ( this._onProgress != null ) PIXI.loader.off('progress', this.onProgressCallback.bind(Assets));
        PIXI.loader.off('load', this.onLoadCallback.bind(Assets));
        if ( this._onLoad ) this._onLoad();
    }

    private static onLoadCallback(loader, resource):void
    {
        console.log('loaded:',  resource.name);

        var n:string = resource.name;
        if ( n.indexOf("json") >= 0) {
            Assets.objectMap[n] = resource.data;
        } else if ( resource.spritesheet ) {
            var spritesheet:PIXI.Spritesheet = resource.spritesheet;
            for(let name in spritesheet.textures) {
                Assets.textureMap[name] = spritesheet.textures[name];
            }
        }
    }

}