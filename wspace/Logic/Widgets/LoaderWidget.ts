/**
 * Created by fomonster on 24.04.2017.
 *
 * http://www.photoshopessentials.com/photo-effects/rotoscope/
 *
 */
import * as PIXI from '../../pixi.js';
import {Widget} from "../../Visual/Widget";
import {Game} from "../../Game";

export class LoaderWidget extends Widget
{
    public container:PIXI.Container = null;
    public graphics:PIXI.Graphics = null;
    public totalLoaded:number = 0;
    public totalToLoad:number = 0;

    public init():void
    {
        super.init();

        this.container = new PIXI.Container();
        //Game.screen.addChild(this.container);

        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);

        this.totalLoaded = 0;
        this.totalToLoad = 100;
        this.updateProgressBar();

        this.loadAssets();
    }

    public relase():void
    {
        super.release();

        this.container.removeChild(this.graphics);

        Game.screen.removeChild(this.container);

    }


    public update(deltaTime:number):void
    {
        super.update(deltaTime);
    }

    public updateProgressBar():void
    {
        var progressHeight:number = 10;
        var progressWidth:number = 150;

        this.graphics.clear();
        this.graphics.lineStyle(1, 0xffffff, 1);

        var sx:number = progressWidth;
        var sy:number = 0.5 * (Game.baseHeight - progressHeight);
        var ex:number = Game.baseWidth - progressWidth;
        var ey:number = sy + progressHeight;
        var px:number = (Game.baseWidth-progressWidth*2)*this.totalLoaded/ this.totalToLoad;

        this.graphics.beginFill(0x1f1f1f, 1);
        this.graphics.drawRect(sx,sy,Game.baseWidth-progressWidth*2,progressHeight);

        this.graphics.beginFill(0xcfcfcf, 1);
        this.graphics.drawRect(sx,sy,px,progressHeight);
    }


    public loadAssets():void
    {
        PIXI.loader.on('progress', this.onProgressCallback.bind(this));

        PIXI.loader
            .add('atlas', 'assets/atlas.json')
            .add('background', 'assets/background.png')
            .add('buildings', 'assets/buildings.png')
            .add('fog', 'assets/fog.png')
            .add('ground', 'assets/ground.png')
            .add('mountains', 'assets/mountains.png')
            .load(this.onLoadComplete.bind(this));
    }

    public onLoadComplete():void {
        this.close();
        Widget.showWidget("GameWidget");
    }

    public onProgressCallback(loader, resource):void
    {
        //console.log("-"+event.);
        this.totalLoaded = loader.progress;
        this.updateProgressBar();
        console.log('Progress:', loader.progress + '% ' + resource.name);
    }

}