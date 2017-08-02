/**
 * Created by fomonster on 24.04.2017.
 */
"use strict";
exports.__esModule = true;
var Widget = (function () {
    function Widget() {
        /**
         *
         */
        this.name = "";
        this.isDialog = false;
        this.widgetState = 0;
        this.needDispose = false;
        this.needHide = false;
        this.needShow = false;
        this.needRemove = false;
        this.needDelete = false;
        this.isDialog = false;
        this.widgetState = Widget.STATE_INVISIBLE;
        this.needDispose = false;
        this.needHide = false;
        this.needShow = false;
        this.needRemove = false;
        this.needDelete = false;
    }
    Widget.prototype.preInit = function () {
        window.console.log("preInit " + this.name);
    };
    Widget.prototype.init = function () {
        window.console.log("init " + this.name);
        this.switchState();
    };
    Widget.prototype.postInit = function () {
        window.console.log("postInit " + this.name);
        this.switchState();
    };
    Widget.prototype.preRelease = function () {
        window.console.log("preRelease " + this.name);
        this.switchState();
    };
    Widget.prototype.release = function () {
        window.console.log("release " + this.name);
        this.switchState();
    };
    Widget.prototype.postRelease = function () {
        window.console.log("postRelease " + this.name);
    };
    Widget.prototype.update = function (deltaTime) {
        if (this.needShow && this.widgetState == Widget.STATE_INVISIBLE) {
            var isCanShow = true;
            for (var i = 0; i < Widget.widgets.length; i++) {
                if (Widget.widgets[i].widgetState != Widget.STATE_INVISIBLE && !Widget.widgets[i].isDialog) {
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
    };
    Widget.prototype.switchState = function () {
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
    };
    Widget.prototype.open = function () {
        console.log("open " + this.name);
        if (this.widgetState == Widget.STATE_INVISIBLE) {
            this.widgetState = Widget.STATE_SHOW;
            this.preInit();
            this.needShow = true;
            this.needRemove = false;
        }
    };
    Widget.prototype.close = function () {
        window.console.log("close " + this.name);
        if (this.widgetState == Widget.STATE_VISIBLE) {
            this.widgetState = Widget.STATE_HIDE;
            this.preRelease();
            this.needShow = false;
            this.needRemove = true;
        }
    };
    Widget.prototype.resize = function () {
    };
    Widget.prototype.hitTest = function (x, y) {
        return false;
    };
    Widget.prototype.onMouseDown = function (x, y) {
    };
    Widget.prototype.onMouseUp = function (x, y) {
    };
    Widget.prototype.onMouseMove = function (x, y) {
    };
    Widget.prototype.onMouseOut = function () {
    };
    Widget.prototype.onMouseIn = function () {
    };
    /**
     *
     */
    Widget.initWidgets = function () {
    };
    /**
     *
     */
    Widget.doneWidgets = function () {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.widgetState == Widget.STATE_VISIBLE)
                widget.preRelease();
            if (widget.widgetState == Widget.STATE_HIDE)
                widget.release();
            widget.postRelease();
            widget = null;
        }
        Widget.widgets.splice(0, Widget.widgets.length);
    };
    /**
     *
     */
    Widget.addWidget = function (name, widget) {
        if (widget == null)
            return;
        widget.name = name;
        for (var i = 0; i < Widget.widgets.length; i++) {
            if (Widget.widgets[i].name == name) {
                return;
            }
        }
        Widget.widgets.push(widget);
        widget.preInit();
    };
    /**
     *
     */
    Widget.getWidget = function (name) {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.name == name) {
                return widget;
            }
        }
        return null;
    };
    /**
     *
     */
    Widget.showWidget = function (name) {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.name == name) {
                //widget.params = params;
                widget.needShow = true;
                widget.needHide = false;
            }
        }
    };
    /**
     *
     */
    Widget.hideWidget = function (name) {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.name == name) {
                widget.needShow = false;
                widget.needHide = true;
            }
        }
    };
    /**
     *
     */
    Widget.removeWidget = function (name) {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.name == name) {
                widget.needRemove = true;
                widget.needShow = false;
                widget.needHide = false;
            }
        }
    };
    /**
     *
     */
    Widget.resizeWidget = function () {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            widget.resize();
        }
    };
    /**
     *
     */
    Widget.updateWidgets = function (deltaTime) {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.needDelete) {
                widget.postRelease();
                Widget.widgets.splice(i, 1);
            }
            else {
                widget.update(deltaTime);
            }
        }
    };
    /**
     *
     */
    Widget.isDialogs = function () {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            if (Widget.widgets[i].isDialog)
                return true;
        }
        return false;
    };
    /**
     *
     */
    Widget.onMouseDown = function (x, y) {
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            var widget = Widget.widgets[i];
            if (widget.hitTest(x, y)) {
                widget.onMouseDown(x, y);
                //widget.active = true;
                break;
            }
        }
    };
    Widget.onMouseUp = function (x, y) {
        var widget = null;
        for (var i = Widget.widgets.length - 1; i >= 0; i--) {
            widget = Widget.widgets[i];
            //if (window.active) {
            //   break;
            //}
        }
        //
        if (widget == null)
            return;
        widget.onMouseUp(x, y);
        //window.active = false;
    };
    Widget.onMouseMove = function (x, y) {
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
    };
    Widget.onMouseOut = function () {
        this.over = false;
        /*for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.onMouseOut();
        }*/
    };
    Widget.onMouseIn = function () {
        this.over = true;
        /*for (var i:number = Widget.list.length - 1; i >= 0; i--) {
            var window:Widget = Widget.list[i];
            window.onMouseIn();
        }*/
    };
    return Widget;
}());
Widget.STATE_INVISIBLE = 0;
Widget.STATE_SHOW = 1;
Widget.STATE_VISIBLE = 2;
Widget.STATE_HIDE = 3;
Widget.STATE_REMOVED = 4;
Widget.widgets = new Array();
Widget.over = false;
exports.Widget = Widget;
//# sourceMappingURL=Widget.js.map