/**
 * Created by fomonster on 24.04.2017.
 */
"use strict";
exports.__esModule = true;
var Widget = (function () {
    function Widget() {
        this.screen = null;
        this.needDelete = false;
        this.name = "";
        this.active = true;
        this.needDelete = false;
    }
    Widget.prototype.preInit = function () {
        window.console.log("preInit " + this.name);
    };
    Widget.prototype.init = function () {
        window.console.log("init " + this.name);
    };
    Widget.prototype.postInit = function () {
        window.console.log("postInit " + this.name);
    };
    Widget.prototype.preDone = function () {
        window.console.log("preDone " + this.name);
    };
    Widget.prototype.done = function () {
        window.console.log("release " + this.name);
    };
    Widget.prototype.postDone = function () {
        window.console.log("postRelease " + this.name);
    };
    Widget.prototype.update = function (deltaTime) {
    };
    Widget.prototype.show = function () {
        window.console.log("show " + this.name);
    };
    Widget.prototype.hide = function () {
        if (this.needDelete)
            return;
        window.console.log("hide " + this.name);
        this.needDelete = true;
        this.preDone();
    };
    Widget.prototype.doShow = function () {
        window.console.log("doShow " + this.name);
        this.postInit();
    };
    Widget.prototype.doHide = function () {
        window.console.log("doHide " + this.name);
        this.preDone();
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
    Widget.init = function (_container) {
        Widget.container = _container;
        Widget.list.splice(0, Widget.list.length);
    };
    Widget.done = function () {
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
            window.preDone();
            //if ( Widget.container.contains(window) ) {
            //    Widget.container.removeChild(window);
            //}
            window.done();
            window = null;
        }
        Widget.list.splice(0, Widget.list.length);
    };
    /**
     *
     */
    Widget.update = function (deltaTime) {
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
            if (window.needDelete) {
                //if ( Widget.container.contains(window) ) {
                //    Widget.container.removeChild(window);
                //}
                window.done();
                Widget.list.splice(i, 1);
            }
            else {
                window.update(deltaTime);
            }
        }
    };
    /**
     *
     * @param name
     * @param newWindow
     */
    Widget.add = function (name, newWindow) {
        newWindow.screen = Widget.container;
        newWindow.name = name;
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
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
    };
    Widget.get = function (name) {
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
            if (window.name == name) {
                return window;
            }
        }
        return null;
    };
    Widget.onMouseDown = function (x, y) {
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
            if (window.hitTest(x, y)) {
                window.onMouseDown(x, y);
                window.active = true;
                break;
            }
        }
    };
    Widget.onMouseUp = function (x, y) {
        var window = null;
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            window = Widget.list[i];
            if (window.active) {
                break;
            }
        }
        //
        if (window == null)
            return;
        window.onMouseUp(x, y);
        window.active = false;
    };
    Widget.onMouseMove = function (x, y) {
        var window = null;
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            window = Widget.list[i];
            if (window.active) {
                break;
            }
        }
        //
        if (window == null) {
            for (var i = Widget.list.length - 1; i >= 0; i--) {
                window = Widget.list[i];
                if (window.hitTest(x, y)) {
                    window.onMouseMove(x, y);
                    break;
                }
            }
        }
        else {
            window.onMouseMove(x, y);
            window.active = false;
        }
    };
    Widget.onMouseOut = function () {
        this.over = false;
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
            window.onMouseOut();
        }
    };
    Widget.onMouseIn = function () {
        this.over = true;
        for (var i = Widget.list.length - 1; i >= 0; i--) {
            var window = Widget.list[i];
            window.onMouseIn();
        }
    };
    return Widget;
}());
/**
 *
 */
Widget.list = new Array();
Widget.container = null;
Widget.oldTime = 0;
Widget.over = false;
exports.Widget = Widget;
//# sourceMappingURL=Widget.js.map