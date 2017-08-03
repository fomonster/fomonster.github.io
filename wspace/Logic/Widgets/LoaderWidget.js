"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * Created by fomonster on 24.04.2017.
 *
 * http://www.photoshopessentials.com/photo-effects/rotoscope/
 *
 */
var PIXI = require("pixi.js");
var Widget_1 = require("../../Visual/Widget");
var Screen_1 = require("../../Screen");
var LoaderWidget = (function (_super) {
    __extends(LoaderWidget, _super);
    function LoaderWidget() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        _this.graphics = null;
        _this.totalLoaded = 0;
        _this.totalToLoad = 0;
        return _this;
    }
    LoaderWidget.prototype.init = function () {
        _super.prototype.init.call(this);
        this.container = new PIXI.Container();
        Screen_1.Screen.screen.addChild(this.container);
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);
        this.totalLoaded = 0;
        this.totalToLoad = 100;
        this.updateProgressBar();
        this.loadAssets();
    };
    LoaderWidget.prototype.release = function () {
        _super.prototype.release.call(this);
        this.container.removeChild(this.graphics);
        Screen_1.Screen.screen.removeChild(this.container);
    };
    LoaderWidget.prototype.update = function (deltaTime) {
        _super.prototype.update.call(this, deltaTime);
    };
    LoaderWidget.prototype.updateProgressBar = function () {
        var progressHeight = 10;
        var progressWidth = 150;
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xffffff, 1);
        var sx = progressWidth;
        var sy = 0.5 * (Screen_1.Screen.baseHeight - progressHeight);
        var ex = Screen_1.Screen.baseWidth - progressWidth;
        var ey = sy + progressHeight;
        var px = (Screen_1.Screen.baseWidth - progressWidth * 2) * this.totalLoaded / this.totalToLoad;
        this.graphics.beginFill(0x1f1f1f, 1);
        this.graphics.drawRect(sx, sy, Screen_1.Screen.baseWidth - progressWidth * 2, progressHeight);
        this.graphics.beginFill(0xcfcfcf, 1);
        this.graphics.drawRect(sx, sy, px, progressHeight);
    };
    LoaderWidget.prototype.loadAssets = function () {
        PIXI.loader.on('progress', this.onProgressCallback.bind(this));
        PIXI.loader
            .add('atlas', 'assets/atlas.json')
            .add('background', 'assets/background.png')
            .add('buildings', 'assets/buildings.png')
            .add('fog', 'assets/fog.png')
            .add('ground', 'assets/ground.png')
            .add('mountains', 'assets/mountains.png')
            .load(this.onLoadComplete.bind(this));
    };
    LoaderWidget.prototype.onLoadComplete = function () {
        this.close();
        Widget_1.Widget.showWidget("GameWidget");
    };
    LoaderWidget.prototype.onProgressCallback = function (loader, resource) {
        //console.log("-"+event.);
        this.totalLoaded = loader.progress;
        this.updateProgressBar();
        console.log('Progress:', loader.progress + '% ' + resource.name);
    };
    return LoaderWidget;
}(Widget_1.Widget));
exports.LoaderWidget = LoaderWidget;
//# sourceMappingURL=LoaderWidget.js.map