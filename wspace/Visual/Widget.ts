/**
 * Created by fomonster on 24.04.2017.
 */

export class Widget
{
    static STATE_INVISIBLE:number = 0;
    static STATE_SHOW:number = 1;
    static STATE_VISIBLE:number = 2;
    static STATE_HIDE:number = 3;
    static STATE_REMOVED:number = 4;

    static widgets:Array<Widget> = new Array<Widget>();
    static over:boolean = false;
    /**
     *
     */

    public name:string = "";
    public isDialog:boolean = false;
    public widgetState:number = 0;
    public needDispose:boolean = false;
    public needHide:boolean = false;
    public needShow:boolean = false;
    public needRemove:boolean = false;
    public needDelete:boolean = false;

    constructor() {

        this.isDialog = false;
        this.widgetState = Widget.STATE_INVISIBLE;
        this.needDispose = false;
        this.needHide = false;
        this.needShow = false;
        this.needRemove = false;
        this.needDelete = false;

    }

    public preInit():void
    {
        window.console.log("preInit " + this.name); 
    }

    public init():void
    {
        window.console.log("init " + this.name);
        this.switchState();
    }

    public postInit():void
    {
        window.console.log("postInit " + this.name);
        this.switchState();
    }

    public preRelease():void
    {
        window.console.log("preRelease " + this.name);
        this.switchState();
    }

    public release():void
    {
        window.console.log("release " + this.name);
        this.switchState();
    }

    public postRelease():void
    {
        window.console.log("postRelease " + this.name);
    }

    public update(deltaTime:number):void
    {
        if (this.needShow && this.widgetState == Widget.STATE_INVISIBLE) {

            var isCanShow:boolean = true;
            for (var i:number = 0; i < Widget.widgets.length; i++) {
                if (Widget.widgets[i].widgetState != Widget.STATE_INVISIBLE && !Widget.widgets[i].isDialog ) {
                    isCanShow = false;
                    break;
                }
            }
            //
            if (isCanShow || this.isDialog) {
                this.widgetState = Widget.STATE_SHOW;
                this.init();
            }

        }
        else if ((this.needHide || this.needRemove) && this.widgetState == Widget.STATE_VISIBLE) {
            this.widgetState = Widget.STATE_HIDE;
            this.preRelease();
        }
        else if (this.needRemove && this.widgetState == Widget.STATE_INVISIBLE) {

            this.widgetState = Widget.STATE_REMOVED;
            this.needDelete = true;

        }
    }

    public switchState():void {
        if (this.widgetState == Widget.STATE_SHOW) {
            this.widgetState = Widget.STATE_VISIBLE;
            this.postInit();
            this.needShow = false;
        }
        else if (this.widgetState == Widget.STATE_HIDE) {
            this.widgetState = Widget.STATE_INVISIBLE;
            this.release();
            this.needHide = false;
        }
    }

    public open():void
    {
        console.log("open " + this.name);
        if (this.widgetState == Widget.STATE_INVISIBLE) {
            this.widgetState = Widget.STATE_SHOW;
            this.preInit();
            this.needShow = true;
            this.needRemove = false;
        }
    }

    public close():void
    {
        window.console.log("close " + this.name);
        if (this.widgetState == Widget.STATE_VISIBLE) {
            this.widgetState = Widget.STATE_HIDE;
            this.preRelease();
            this.needShow = false;
            this.needRemove = true;
        }
    }

    public resize():void
    {
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
    static initWidgets():void {

    }

    /**
     *
     */
    static doneWidgets():void {

        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.widgetState == Widget.STATE_VISIBLE) widget.preRelease();
            if (widget.widgetState == Widget.STATE_HIDE) widget.release();
            widget.postRelease();
            widget = null;
        }
        Widget.widgets.splice(0, Widget.widgets.length);
    }

    /**
     *
     */
    static addWidget(name:string, widget:Widget):void {
        if (widget == null) return;
        widget.name = name;
        for (var i:number = 0; i < Widget.widgets.length; i++) {
            if (Widget.widgets[i].name == name) {
                return;
            }
        }
        Widget.widgets.push(widget);
        widget.preInit();
    }

    /**
     *
     */
    static getWidget(name:string):Widget {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.name == name) {
                return widget;
            }
        }
        return null;
    }

    /**
     *
     */
    static showWidget(name:string):void {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.name == name) {
                //widget.params = params;
                widget.needShow = true;
                widget.needHide = false;
            }
        }
    }

    /**
     *
     */
    static hideWidget(name:string):void {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.name == name) {
                widget.needShow = false;
                widget.needHide = true;
            }
        }
    }

    /**
     *
     */
    static removeWidget(name:string):void
    {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.name == name) {
                widget.needRemove = true;
                widget.needShow = false;
                widget.needHide = false;
            }
        }
    }

    /**
     *
     */
    static resizeWidget():void
    {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget: Widget = Widget.widgets[i];
            widget.resize();
        }
    }

    /**
     *
     */
    static updateWidgets(deltaTime:number):void {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.needDelete) {
                widget.postRelease();
                Widget.widgets.splice(i, 1);
            } else {
                widget.update(deltaTime);
            }
        }
    }

    /**
     *
     */
    static isDialogs():boolean {

        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            if (Widget.widgets[i].isDialog) return true;
        }
        return false;


    }

    /**
     *
     */
    static onMouseDown(x:number, y:number):void {
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            var widget:Widget = Widget.widgets[i];
            if (widget.hitTest(x, y)) {
                widget.onMouseDown(x, y);
                //widget.active = true;
                break;
            }
        }
    }

    static onMouseUp(x:number, y:number):void {
        var widget:Widget = null;
        for (var i:number = Widget.widgets.length - 1; i >= 0; i--) {
            widget = Widget.widgets[i];
            //if (window.active) {
            //   break;
            //}
        }
        //
        if (widget == null) return;
        widget.onMouseUp(x, y);
        //window.active = false;
    }

    static onMouseMove(x:number, y:number):void {
        /*var window:Widget = null;
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
        }*/
    }

    static onMouseOut():void {
        this.over = false;
        /*for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.onMouseOut();
        }*/
    }

    static onMouseIn():void {
        this.over = true;
        /*for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.onMouseIn();
        }*/
    }

    /**
     *
     */


}


