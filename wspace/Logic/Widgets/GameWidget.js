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
var THREE = require("three.js");
var PIXI = require("pixi.js");
var Widget_1 = require("../../Visual/Widget");
var Screen_1 = require("../../Screen");
var GameWidget = (function (_super) {
    __extends(GameWidget, _super);
    function GameWidget() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphicsA = null;
        _this.graphicsB = null;
        return _this;
    }
    GameWidget.prototype.preInit = function () {
        _super.prototype.preInit.call(this);
    };
    GameWidget.prototype.init = function () {
        _super.prototype.init.call(this);
    };
    GameWidget.prototype.postInit = function () {
        _super.prototype.postInit.call(this);
        //-------------------------------------------------------------------------------------
        // 3D Scene
        //-------------------------------------------------------------------------------------
        var geometry = new THREE.BoxGeometry(100, 100, 300);
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(geometry, material);
        cube.position.z = 0;
        cube.rotation.z = -45;
        Screen_1.Screen.scene.add(cube);
        var mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 16, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
        Screen_1.Screen.scene.add(mesh);
        //-------------------------------------------------------------------------------------
        // 2D Scene
        //-------------------------------------------------------------------------------------
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xe60630);
        graphics.moveTo(0, 0);
        graphics.lineTo(100, 0);
        graphics.lineTo(100, 100);
        graphics.lineTo(0, 100);
        graphics.endFill();
        Screen_1.Screen.screen.addChild(graphics);
        this.graphicsA = graphics;
        graphics = new PIXI.Graphics();
        graphics.beginFill(0x06e630);
        graphics.moveTo(0, 0);
        graphics.lineTo(100, 0);
        graphics.lineTo(100, 100);
        graphics.lineTo(0, 100);
        graphics.endFill();
        Screen_1.Screen.screen.addChild(graphics);
        this.graphicsB = graphics;
        this.resize();
    };
    GameWidget.prototype.preRelease = function () {
        _super.prototype.preRelease.call(this);
    };
    GameWidget.prototype.release = function () {
        _super.prototype.release.call(this);
    };
    GameWidget.prototype.postRelease = function () {
        _super.prototype.postRelease.call(this);
    };
    GameWidget.prototype.update = function (deltaTime) {
        _super.prototype.update.call(this, deltaTime);
    };
    GameWidget.prototype.resize = function () {
        if (this.graphicsA) {
            this.graphicsA.x = Screen_1.Screen.screenLeft;
            this.graphicsA.y = Screen_1.Screen.screenTop;
        }
        if (this.graphicsB) {
            this.graphicsB.x = Screen_1.Screen.screenWidth + Screen_1.Screen.screenLeft - 100;
            this.graphicsB.y = Screen_1.Screen.screenHeight + Screen_1.Screen.screenTop - 100;
        }
    };
    return GameWidget;
}(Widget_1.Widget));
exports.GameWidget = GameWidget;
//# sourceMappingURL=GameWidget.js.map