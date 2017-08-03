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
define("engine/Widget", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Widget = (function () {
        function Widget() {
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
        Widget.initWidgets = function () {
        };
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
        Widget.getWidget = function (name) {
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                var widget = Widget.widgets[i];
                if (widget.name == name) {
                    return widget;
                }
            }
            return null;
        };
        Widget.showWidget = function (name) {
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                var widget = Widget.widgets[i];
                if (widget.name == name) {
                    widget.needShow = true;
                    widget.needHide = false;
                }
            }
        };
        Widget.hideWidget = function (name) {
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                var widget = Widget.widgets[i];
                if (widget.name == name) {
                    widget.needShow = false;
                    widget.needHide = true;
                }
            }
        };
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
        Widget.resizeWidget = function () {
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                var widget = Widget.widgets[i];
                widget.resize();
            }
        };
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
        Widget.isDialogs = function () {
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                if (Widget.widgets[i].isDialog)
                    return true;
            }
            return false;
        };
        Widget.onMouseDown = function (x, y) {
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                var widget = Widget.widgets[i];
                if (widget.hitTest(x, y)) {
                    widget.onMouseDown(x, y);
                    break;
                }
            }
        };
        Widget.onMouseUp = function (x, y) {
            var widget = null;
            for (var i = Widget.widgets.length - 1; i >= 0; i--) {
                widget = Widget.widgets[i];
            }
            if (widget == null)
                return;
            widget.onMouseUp(x, y);
        };
        Widget.onMouseMove = function (x, y) {
        };
        Widget.onMouseOut = function () {
            this.over = false;
        };
        Widget.onMouseIn = function () {
            this.over = true;
        };
        Widget.STATE_INVISIBLE = 0;
        Widget.STATE_SHOW = 1;
        Widget.STATE_VISIBLE = 2;
        Widget.STATE_HIDE = 3;
        Widget.STATE_REMOVED = 4;
        Widget.widgets = new Array();
        Widget.over = false;
        return Widget;
    }());
    exports.Widget = Widget;
});
define("engine/Particle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Particle = (function () {
        function Particle() {
            this.needDelete = false;
            this.lifeTime = 0;
            this.lifeTimeMax = 1;
        }
        Particle.prototype.construcor = function (_x, _y) {
        };
        Particle.prototype.done = function () {
        };
        Particle.prototype.update = function (deltaTime) {
            this.lifeTime += deltaTime;
            if (this.lifeTime > this.lifeTimeMax) {
                this.needDelete = true;
                this.lifeTime = this.lifeTimeMax;
            }
        };
        return Particle;
    }());
    exports.Particle = Particle;
});
define("engine/Particles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Particles = (function () {
        function Particles() {
        }
        Particles.add = function (particle) {
            Particles.items.push(particle);
        };
        Particles.update = function (deltaTime) {
            for (var i = Particles.items.length - 1; i >= 0; i--) {
                var particle = Particles.items[i];
                particle.update(deltaTime);
                if (particle.needDelete) {
                    particle.done();
                    Particles.items.splice(i, 1);
                }
            }
        };
        Particles.screen = null;
        Particles.items = [];
        return Particles;
    }());
    exports.Particles = Particles;
});
define("game/Screen", ["require", "exports", "engine/Widget"], function (require, exports, Widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Screen = (function () {
        function Screen() {
        }
        Screen.resize = function () {
            Screen.width = window.innerWidth;
            Screen.height = window.innerHeight;
            Screen.camera.aspect = Screen.width / Screen.height;
            Screen.camera.updateProjectionMatrix();
            Screen.renderer.setSize(Screen.width, Screen.height);
            Screen.canvas.resize(Screen.width, Screen.height);
            var koeff = 1;
            var koeffX = Screen.width / Screen.baseWidth;
            var koeffY = Screen.height / Screen.baseHeight;
            if (Screen.screen != null) {
                if (koeffX < koeffY) {
                    Screen.screen.x = 0;
                    Screen.screen.y = 0.5 * (Screen.height - Screen.baseHeight * koeffX);
                    Screen.screen.scale.x = koeffX;
                    Screen.screen.scale.y = koeffX;
                }
                else {
                    Screen.screen.x = 0.5 * (Screen.width - Screen.baseWidth * koeffY);
                    Screen.screen.y = 0;
                    Screen.screen.scale.x = koeffY;
                    Screen.screen.scale.y = koeffY;
                }
            }
            if (koeffY > koeffX) {
                koeff = koeffX;
                Screen.screenTop = (Screen.baseHeight * 0.5) - (Screen.height * 0.5) / koeff;
                ;
                Screen.screenLeft = 0;
                Screen.screenWidth = Screen.baseWidth;
                Screen.screenHeight = Screen.height / koeff;
            }
            else {
                koeff = koeffY;
                Screen.screenLeft = (Screen.baseWidth * 0.5) - (Screen.width * 0.5) / koeff;
                Screen.screenWidth = Screen.width / koeff;
                Screen.screenTop = 0;
                Screen.screenHeight = Screen.baseHeight;
            }
            Widget_1.Widget.resizeWidget();
        };
        Screen.baseWidth = 1024;
        Screen.baseHeight = 768;
        Screen.camera = null;
        Screen.scene = null;
        Screen.renderer = null;
        Screen.stage = null;
        Screen.canvas = null;
        Screen.screen = null;
        Screen.mouseX = 0;
        Screen.mouseY = 0;
        Screen.width = window.innerWidth;
        Screen.height = window.innerHeight;
        Screen.screenTop = 0;
        Screen.screenLeft = 0;
        Screen.screenWidth = Screen.baseWidth;
        Screen.screenHeight = Screen.baseHeight;
        return Screen;
    }());
    exports.Screen = Screen;
});
define("game/widgets/LoaderWidget", ["require", "exports", "pixi.js", "engine/Widget", "game/Screen"], function (require, exports, PIXI, Widget_2, Screen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                .load(this.onLoadComplete.bind(this));
        };
        LoaderWidget.prototype.onLoadComplete = function () {
            this.close();
            Widget_2.Widget.showWidget("GameWidget");
        };
        LoaderWidget.prototype.onProgressCallback = function (loader, resource) {
            this.totalLoaded = loader.progress;
            this.updateProgressBar();
            console.log('Progress:', loader.progress + '% ' + resource.name);
        };
        return LoaderWidget;
    }(Widget_2.Widget));
    exports.LoaderWidget = LoaderWidget;
});
define("game/widgets/GameWidget", ["require", "exports", "three", "pixi.js", "engine/Widget", "game/Screen"], function (require, exports, THREE, PIXI, Widget_3, Screen_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            var cube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 300), new THREE.MeshNormalMaterial());
            cube.position.z = 0;
            cube.rotation.z = -45;
            Screen_2.Screen.scene.add(cube);
            var cubea = new THREE.Mesh(new THREE.BoxGeometry(100, 300, 100), new THREE.MeshNormalMaterial());
            cubea.position.z = 0;
            cubea.rotation.z = -45;
            Screen_2.Screen.scene.add(cubea);
            var mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 16, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
            Screen_2.Screen.scene.add(mesh);
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xe60630);
            graphics.moveTo(0, 0);
            graphics.lineTo(100, 0);
            graphics.lineTo(100, 100);
            graphics.lineTo(0, 100);
            graphics.endFill();
            Screen_2.Screen.screen.addChild(graphics);
            this.graphicsA = graphics;
            graphics = new PIXI.Graphics();
            graphics.beginFill(0x06e630);
            graphics.moveTo(0, 0);
            graphics.lineTo(100, 0);
            graphics.lineTo(100, 100);
            graphics.lineTo(0, 100);
            graphics.endFill();
            Screen_2.Screen.screen.addChild(graphics);
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
                this.graphicsA.x = Screen_2.Screen.screenLeft;
                this.graphicsA.y = Screen_2.Screen.screenTop;
            }
            if (this.graphicsB) {
                this.graphicsB.x = Screen_2.Screen.screenWidth + Screen_2.Screen.screenLeft - 100;
                this.graphicsB.y = Screen_2.Screen.screenHeight + Screen_2.Screen.screenTop - 100;
            }
        };
        return GameWidget;
    }(Widget_3.Widget));
    exports.GameWidget = GameWidget;
});
define("Game", ["require", "exports", "three", "pixi.js", "engine/Widget", "engine/Particles", "game/Screen", "game/widgets/LoaderWidget", "game/widgets/GameWidget"], function (require, exports, THREE, PIXI, Widget_4, Particles_1, Screen_3, LoaderWidget_1, GameWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game() {
        }
        Game.init = function (container) {
            Game.container = container;
            Game.init3DRender();
            Game.init2DRender();
            Game.lastTime = Date.now() * 0.0001;
            Widget_4.Widget.initWidgets();
            var handler = function () {
                var time = Date.now() * 0.0001;
                var deltaTime = time - Game.lastTime;
                Game.lastTime = time;
                Game.update(deltaTime);
                Game.render();
                window.requestAnimationFrame(handler);
            };
            window.requestAnimationFrame(handler);
            window.addEventListener('resize', function () { Game.resize(); }, false);
            Screen_3.Screen.canvas.plugins.interaction.on('mousemove', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_3.Screen.screen);
                Widget_4.Widget.onMouseMove(newPosition.x, newPosition.y);
                if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= Screen_3.Screen.width || newPosition.y >= Screen_3.Screen.height) {
                    if (Widget_4.Widget.over) {
                        Widget_4.Widget.onMouseOut();
                    }
                }
                else {
                    if (!Widget_4.Widget.over) {
                        Widget_4.Widget.onMouseIn();
                    }
                }
            });
            Screen_3.Screen.canvas.plugins.interaction.on('mousedown', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_3.Screen.screen);
                Widget_4.Widget.onMouseDown(newPosition.x, newPosition.y);
            });
            Screen_3.Screen.canvas.plugins.interaction.on('mouseup', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_3.Screen.screen);
                Widget_4.Widget.onMouseUp(newPosition.x, newPosition.y);
            });
            Game.resize();
            Widget_4.Widget.addWidget("LoaderWidget", new LoaderWidget_1.LoaderWidget());
            Widget_4.Widget.addWidget("GameWidget", new GameWidget_1.GameWidget());
            Widget_4.Widget.showWidget("LoaderWidget");
        };
        Game.done = function () {
            Widget_4.Widget.doneWidgets();
        };
        Game.init3DRender = function () {
            Screen_3.Screen.renderer = new THREE.WebGLRenderer({ antialias: true });
            Screen_3.Screen.renderer.setClearColor(0x000000);
            Screen_3.Screen.renderer.setPixelRatio(window.devicePixelRatio);
            Screen_3.Screen.renderer.setSize(window.innerWidth, window.innerHeight);
            Game.container.appendChild(Screen_3.Screen.renderer.domElement);
            Screen_3.Screen.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);
            Screen_3.Screen.scene = new THREE.Scene();
        };
        Game.init2DRender = function () {
            Screen_3.Screen.stage = new PIXI.Container();
            Screen_3.Screen.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
            Screen_3.Screen.canvas.view.style.position = "absolute";
            Screen_3.Screen.canvas.view.style.top = "0px";
            Screen_3.Screen.canvas.view.style.left = "0px";
            Game.container.appendChild(Screen_3.Screen.canvas.view);
            Screen_3.Screen.screen = new PIXI.Container();
            Screen_3.Screen.stage.addChild(Screen_3.Screen.screen);
        };
        Game.update = function (deltaTime) {
            for (var i = 0; i < Screen_3.Screen.scene.children.length; i++) {
                var object = Screen_3.Screen.scene.children[i];
                object.rotation.y += deltaTime * 10.0;
                object.rotation.x += deltaTime * 3.0;
                object.rotation.z += deltaTime * 5.0;
            }
            Screen_3.Screen.camera.position.z = 1800;
            Screen_3.Screen.camera.lookAt(Screen_3.Screen.scene.position);
            Particles_1.Particles.update(deltaTime);
            Widget_4.Widget.updateWidgets(deltaTime);
            Game.render();
        };
        Game.render = function () {
            if (!Screen_3.Screen.scene || !Screen_3.Screen.camera)
                return;
            Screen_3.Screen.renderer.render(Screen_3.Screen.scene, Screen_3.Screen.camera);
            Screen_3.Screen.canvas.render(Screen_3.Screen.stage);
        };
        Game.resize = function () {
            Screen_3.Screen.resize();
            Widget_4.Widget.resizeWidget();
        };
        Game.container = null;
        Game.lastTime = 0;
        return Game;
    }());
    exports.Game = Game;
});
//# sourceMappingURL=main.js.map