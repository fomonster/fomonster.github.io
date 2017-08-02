/**
 * Created by fomonster on 24.04.2017.
 */


import * as PIXI from './pixi.js';

export class Widget
{
    public screen:PIXI.Container = null;

    public needDelete:boolean = false;
    public name:string = "";
    public active:boolean = true;

    constructor() {

        this.needDelete = false;

    }

    public preInit():void {
        window.console.log("preInit " + this.name); 
    }

    public init():void {
        window.console.log("init " + this.name);
    }

    public postInit():void {
        window.console.log("postInit " + this.name);
    }

    public preDone():void {
        window.console.log("preDone " + this.name);
    }

    public done():void {
        window.console.log("release " + this.name);

    }

    public postDone():void {
        window.console.log("postRelease " + this.name);
    }

    public update(deltaTime:number):void {


    }

    public show():void {
        window.console.log("show " + this.name);
    }

    public hide():void {
        if (this.needDelete) return;

        window.console.log("hide " + this.name);
        this.needDelete = true;
        this.preDone();
    }

    public doShow():void {
        window.console.log("doShow " + this.name);
        this.postInit();
    }

    public doHide():void {
        window.console.log("doHide " + this.name);
        this.preDone();
    }

    public hitTest(x:number, y:number):boolean {

        return false;
    }

    public onMouseDown(x:number, y:number):void {

    }

    public onMouseUp(x:number, y:number):void {

    }

    public onMouseMove(x:number, y:number):void {

    }

    public onMouseOut():void {

    }

    public onMouseIn():void {

    }


    /**
     *
     */

    static list:Array<Widget> = new Array<Widget>();

    static container:PIXI.Container = null;

    static oldTime:number = 0;

    static over:boolean = false;

    /**
     *
     */
    static init(_container:PIXI.Container):void {
        Widget.container = _container;

        Widget.list.splice(0, Widget.list.length);


    }

    static done():void {

        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.preDone();
            //if ( Widget.container.contains(window) ) {
            //    Widget.container.removeChild(window);
            //}
            window.done();
            window = null;
        }
        Widget.list.splice(0, Widget.list.length);
    }

    /**
     *
     */
    static update(deltaTime:number):void {


        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            if (window.needDelete) {
                //if ( Widget.container.contains(window) ) {
                //    Widget.container.removeChild(window);
                //}
                window.done();
                Widget.list.splice(i, 1);
            } else {
                window.update(deltaTime);
            }
        }
    }

    /**
     *
     * @param name
     * @param newWindow
     */
    static add(name:string, newWindow:Widget):void {
        newWindow.screen = Widget.container;
        newWindow.name = name;
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            if (window.name == name) {
                window.preDone();
                window.doHide();
                window = null;
            }
        }
        Widget.list.push(newWindow);
        newWindow.init();
        newWindow.doShow();
        //Widget.container.addChild(newWindow);
    }

    static get(name:string):Widget {
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];

            if (window.name == name) {
                return window;
            }
        }
        return null;
    }

    static onMouseDown(x:number, y:number):void {
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            if (window.hitTest(x, y)) {
                window.onMouseDown(x, y);
                window.active = true;
                break;
            }
        }
    }

    static onMouseUp(x:number, y:number):void {
        var window:Widget = null;
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            window = Widget.list[i];
            if (window.active) {
                break;
            }
        }
        //
        if (window == null) return;
        window.onMouseUp(x, y);
        window.active = false;
    }

    static onMouseMove(x:number, y:number):void {
        var window:Widget = null;
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            window = Widget.list[i];
            if (window.active) {
                break;
            }
        }
        //
        if (window == null) {
            for (var i:number = Widget.list.length - 1; i >= 0; i--) {
                window = Widget.list[i];
                if (window.hitTest(x, y)) {
                    window.onMouseMove(x, y);
                    break;
                }
            }
        } else {
            window.onMouseMove(x, y);
            window.active = false;
        }
    }

    static onMouseOut():void {
        this.over = false;
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.onMouseOut();
        }
    }

    static onMouseIn():void {
        this.over = true;
        for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.onMouseIn();
        }
    }

}


