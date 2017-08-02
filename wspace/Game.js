"use strict";
exports.__esModule = true;
var THREE = require("three.js");
var PIXI = require("pixi.js");
var Widget_1 = require("./Visual/Widget");
var Particles_1 = require("./Visual/Particles");
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
        Game.canvas.plugins.interaction.on('mousemove', function (mouseData) {
            var newPosition = mouseData.data.getLocalPosition(Game.screen);
            Widget_1.Widget.onMouseMove(newPosition.x, newPosition.y);
            if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= Game.width || newPosition.y >= Game.height) {
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
        Game.canvas.plugins.interaction.on('mousedown', function (mouseData) {
            var newPosition = mouseData.data.getLocalPosition(Game.screen);
            Widget_1.Widget.onMouseDown(newPosition.x, newPosition.y);
        });
        Game.canvas.plugins.interaction.on('mouseup', function (mouseData) {
            var newPosition = mouseData.data.getLocalPosition(Game.screen);
            Widget_1.Widget.onMouseUp(newPosition.x, newPosition.y);
        });
        Game.resize();
    };
    Game.done = function () {
        Widget_1.Widget.doneWidgets();
    };
    Game.init3DRender = function () {
        Game.renderer = new THREE.WebGLRenderer({ antialias: true });
        Game.renderer.setClearColor(0x000000);
        Game.renderer.setPixelRatio(window.devicePixelRatio);
        Game.renderer.setSize(window.innerWidth, window.innerHeight);
        Game.container.appendChild(Game.renderer.domElement);
        Game.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);
        Game.scene = new THREE.Scene();
        alert("wow 1" + Game.scene);
    };
    Game.init2DRender = function () {
        Game.stage = new PIXI.Stage(0xffffff);
        Game.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
        Game.canvas.view.style.position = "absolute";
        Game.canvas.view.style.top = "0px";
        Game.canvas.view.style.left = "0px";
        Game.container.appendChild(Game.canvas.view);
        Game.screen = new PIXI.Container();
        Game.stage.addChild(Game.screen);
    };
    Game.update = function (deltaTime) {
        for (var i = 0; i < Game.scene.children.length; i++) {
            var object = Game.scene.children[i];
            object.rotation.y += deltaTime * 10.0;
            object.rotation.x += deltaTime * 3.0;
            object.rotation.z += deltaTime * 5.0;
        }
        Game.camera.position.z = 1800;
        //Game.camera.position.x += (mouseX - camera.position.x) * 0.05;
        //Game.camera.position.y += (- mouseY - camera.position.y) * 0.05;
        Game.camera.lookAt(Game.scene.position);
        Particles_1.Particles.update(deltaTime);
        Widget_1.Widget.updateWidgets(deltaTime);
        Game.render();
    };
    Game.render = function () {
        if (!Game.scene || !Game.camera)
            return;
        Game.renderer.render(Game.scene, Game.camera);
        Game.canvas.render(Game.stage);
    };
    Game.resize = function () {
        Game.width = window.innerWidth;
        Game.height = window.innerHeight;
        Game.camera.aspect = Game.width / Game.height;
        Game.camera.updateProjectionMatrix();
        Game.renderer.setSize(Game.width, Game.height);
        Game.canvas.resize(Game.width, Game.height);
        //Game.canvas.view.style.width = Game.width + 'px';
        //Game.canvas.view.style.height = Game.height + 'px';
        var koeff = 1;
        var koeffX = Game.width / Game.baseWidth;
        var koeffY = Game.height / Game.baseHeight;
        if (Game.screen != null) {
            if (koeffX < koeffY) {
                Game.screen.x = 0;
                Game.screen.y = 0.5 * (Game.height - Game.baseHeight * koeffX);
                Game.screen.scale.x = koeffX;
                Game.screen.scale.y = koeffX;
            }
            else {
                Game.screen.x = 0.5 * (Game.width - Game.baseWidth * koeffY);
                Game.screen.y = 0;
                Game.screen.scale.x = koeffY;
                Game.screen.scale.y = koeffY;
            }
        }
        //
        if (koeffY > koeffX) {
            koeff = koeffX;
            Game.screenTop = (Game.baseHeight * 0.5) - (Game.height * 0.5) / koeff;
            ;
            Game.screenLeft = 0;
            Game.screenWidth = Game.baseWidth;
            Game.screenHeight = Game.height / koeff;
        }
        else {
            koeff = koeffY;
            Game.screenLeft = (Game.baseWidth * 0.5) - (Game.width * 0.5) / koeff;
            Game.screenWidth = Game.width / koeff;
            Game.screenTop = 0;
            Game.screenHeight = Game.baseHeight;
        }
        if (Game.graphicsA) {
            Game.graphicsA.x = Game.screenLeft;
            Game.graphicsA.y = Game.screenTop;
        }
        if (Game.graphicsB) {
            Game.graphicsB.x = Game.screenWidth + Game.screenLeft - 100;
            Game.graphicsB.y = Game.screenHeight + Game.screenTop - 100;
        }
        Widget_1.Widget.resizeWidget();
    };
    return Game;
}());
Game.baseWidth = 1024;
Game.baseHeight = 768;
Game.container = null;
// 3D
Game.camera = null;
Game.scene = null;
Game.renderer = null;
// 2D
Game.stage = null;
Game.canvas = null;
Game.screen = null;
Game.mouseX = 0;
Game.mouseY = 0;
//
Game.width = window.innerWidth;
Game.height = window.innerHeight;
//
Game.screenTop = 0;
Game.screenLeft = 0;
Game.screenWidth = Game.baseWidth;
Game.screenHeight = Game.baseHeight;
Game.lastTime = 0;
Game.graphicsA = null;
Game.graphicsB = null;
exports.Game = Game;
//# sourceMappingURL=Game.js.map