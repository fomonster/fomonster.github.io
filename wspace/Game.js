"use strict";
exports.__esModule = true;
var THREE = require("three");
var PIXI = require("pixi.js");
var Widget_1 = require("./Visual/Widget");
var Particles_1 = require("./Visual/Particles");
var Screen_1 = require("./Screen");
var LoaderWidget_1 = require("./Logic/Widgets/LoaderWidget");
var GameWidget_1 = require("./Logic/Widgets/GameWidget");
var Game = (function () {
    function Game() {
    }
    //-------------------------------------------------------------------------------------
    //
    //-------------------------------------------------------------------------------------
    Game.init = function (container) {
        Game.container = container;
        Game.init3DRender();
        Game.init2DRender();
        Game.lastTime = Date.now() * 0.0001;
        Widget_1.Widget.initWidgets();
        //-------------------------------------------------------------------------------------
        // Render + Update
        //-------------------------------------------------------------------------------------
        var handler = function () {
            var time = Date.now() * 0.0001;
            var deltaTime = time - Game.lastTime;
            Game.lastTime = time;
            Game.update(deltaTime);
            Game.render();
            window.requestAnimationFrame(handler);
        };
        window.requestAnimationFrame(handler);
        //
        window.addEventListener('resize', function () { Game.resize(); }, false);
        //Game.app.stage.hitArea = new PIXI.Rectangle(0, 0,  Game.app.renderer.width/ Game.app.renderer.resolution,  Game.app.renderer.height/ Game.app.renderer.resolution);
        Screen_1.Screen.canvas.plugins.interaction.on('mousemove', function (mouseData) {
            var newPosition = mouseData.data.getLocalPosition(Screen_1.Screen.screen);
            Widget_1.Widget.onMouseMove(newPosition.x, newPosition.y);
            if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= Screen_1.Screen.width || newPosition.y >= Screen_1.Screen.height) {
                if (Widget_1.Widget.over) {
                    Widget_1.Widget.onMouseOut();
                }
            }
            else {
                if (!Widget_1.Widget.over) {
                    Widget_1.Widget.onMouseIn();
                }
            }
        });
        Screen_1.Screen.canvas.plugins.interaction.on('mousedown', function (mouseData) {
            var newPosition = mouseData.data.getLocalPosition(Screen_1.Screen.screen);
            Widget_1.Widget.onMouseDown(newPosition.x, newPosition.y);
        });
        Screen_1.Screen.canvas.plugins.interaction.on('mouseup', function (mouseData) {
            var newPosition = mouseData.data.getLocalPosition(Screen_1.Screen.screen);
            Widget_1.Widget.onMouseUp(newPosition.x, newPosition.y);
        });
        Game.resize();
        //-------------------------------------------------------------------------------------
        // Widgets
        //-------------------------------------------------------------------------------------
        Widget_1.Widget.addWidget("LoaderWidget", new LoaderWidget_1.LoaderWidget());
        Widget_1.Widget.addWidget("GameWidget", new GameWidget_1.GameWidget());
        //
        Widget_1.Widget.showWidget("LoaderWidget");
    };
    Game.done = function () {
        Widget_1.Widget.doneWidgets();
    };
    Game.init3DRender = function () {
        Screen_1.Screen.renderer = new THREE.WebGLRenderer({ antialias: true });
        Screen_1.Screen.renderer.setClearColor(0x000000);
        Screen_1.Screen.renderer.setPixelRatio(window.devicePixelRatio);
        Screen_1.Screen.renderer.setSize(window.innerWidth, window.innerHeight);
        Game.container.appendChild(Screen_1.Screen.renderer.domElement);
        Screen_1.Screen.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);
        Screen_1.Screen.scene = new THREE.Scene();
        //alert( "wow 1"+Game.scene );
    };
    Game.init2DRender = function () {
        Screen_1.Screen.stage = new PIXI.Container();
        Screen_1.Screen.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
        Screen_1.Screen.canvas.view.style.position = "absolute";
        Screen_1.Screen.canvas.view.style.top = "0px";
        Screen_1.Screen.canvas.view.style.left = "0px";
        Game.container.appendChild(Screen_1.Screen.canvas.view);
        Screen_1.Screen.screen = new PIXI.Container();
        Screen_1.Screen.stage.addChild(Screen_1.Screen.screen);
    };
    Game.update = function (deltaTime) {
        for (var i = 0; i < Screen_1.Screen.scene.children.length; i++) {
            var object = Screen_1.Screen.scene.children[i];
            object.rotation.y += deltaTime * 10.0;
            object.rotation.x += deltaTime * 3.0;
            object.rotation.z += deltaTime * 5.0;
        }
        Screen_1.Screen.camera.position.z = 1800;
        //Game.camera.position.x += (mouseX - camera.position.x) * 0.05;
        //Game.camera.position.y += (- mouseY - camera.position.y) * 0.05;
        Screen_1.Screen.camera.lookAt(Screen_1.Screen.scene.position);
        Particles_1.Particles.update(deltaTime);
        Widget_1.Widget.updateWidgets(deltaTime);
        Game.render();
    };
    Game.render = function () {
        if (!Screen_1.Screen.scene || !Screen_1.Screen.camera)
            return;
        Screen_1.Screen.renderer.render(Screen_1.Screen.scene, Screen_1.Screen.camera);
        Screen_1.Screen.canvas.render(Screen_1.Screen.stage);
    };
    Game.resize = function () {
        Screen_1.Screen.resize();
        Widget_1.Widget.resizeWidget();
    };
    Game.container = null;
    Game.lastTime = 0;
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map