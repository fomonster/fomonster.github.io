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
define("game/Screen", ["require", "exports"], function (require, exports) {
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
define("game/widgets/LoaderWidget", ["require", "exports", "pixi.js", "engine/Widget", "game/Screen"], function (require, exports, PIXI, Widget_1, Screen_1) {
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
                .add("assets/inventory.json")
                .add('atlas', 'assets/atlas.json')
                .load(this.onLoadComplete.bind(this));
        };
        LoaderWidget.prototype.onLoadComplete = function () {
            this.close();
            Widget_1.Widget.showWidget("GameWidget");
        };
        LoaderWidget.prototype.onProgressCallback = function (loader, resource) {
            this.totalLoaded = loader.progress;
            this.updateProgressBar();
            console.log('Progress:', loader.progress + '% ' + resource.name);
        };
        return LoaderWidget;
    }(Widget_1.Widget));
    exports.LoaderWidget = LoaderWidget;
});
define("game/widgets/GameWidget", ["require", "exports", "three", "pixi.js", "engine/Widget", "game/Screen"], function (require, exports, THREE, PIXI, Widget_2, Screen_2) {
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
            cube.rotation.z = 0;
            Screen_2.Screen.scene.add(cube);
            var cubea = new THREE.Mesh(new THREE.BoxGeometry(100, 300, 100), new THREE.MeshNormalMaterial());
            cubea.position.z = 0;
            cubea.rotation.z = 0;
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
    }(Widget_2.Widget));
    exports.GameWidget = GameWidget;
});
define("game/data/GameData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameData = (function () {
        function GameData() {
        }
        GameData.load = function () {
        };
        GameData.save = function () {
        };
        GameData.update = function (deltaTime) {
        };
        return GameData;
    }());
    exports.GameData = GameData;
});
define("Game", ["require", "exports", "three", "pixi.js", "engine/Widget", "engine/Particles", "game/Screen", "game/widgets/LoaderWidget", "game/widgets/GameWidget", "game/data/GameData"], function (require, exports, THREE, PIXI, Widget_3, Particles_1, Screen_3, LoaderWidget_1, GameWidget_1, GameData_1) {
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
            Widget_3.Widget.initWidgets();
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
                Widget_3.Widget.onMouseMove(newPosition.x, newPosition.y);
                if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= Screen_3.Screen.width || newPosition.y >= Screen_3.Screen.height) {
                    if (Widget_3.Widget.over) {
                        Widget_3.Widget.onMouseOut();
                    }
                }
                else {
                    if (!Widget_3.Widget.over) {
                        Widget_3.Widget.onMouseIn();
                    }
                }
            });
            Screen_3.Screen.canvas.plugins.interaction.on('mousedown', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_3.Screen.screen);
                Widget_3.Widget.onMouseDown(newPosition.x, newPosition.y);
            });
            Screen_3.Screen.canvas.plugins.interaction.on('mouseup', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_3.Screen.screen);
                Widget_3.Widget.onMouseUp(newPosition.x, newPosition.y);
            });
            Game.resize();
            Widget_3.Widget.addWidget("LoaderWidget", new LoaderWidget_1.LoaderWidget());
            Widget_3.Widget.addWidget("GameWidget", new GameWidget_1.GameWidget());
            Widget_3.Widget.showWidget("LoaderWidget");
        };
        Game.done = function () {
            Widget_3.Widget.doneWidgets();
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
            Widget_3.Widget.updateWidgets(deltaTime);
            GameData_1.GameData.update(deltaTime);
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
            Widget_3.Widget.resizeWidget();
        };
        Game.container = null;
        Game.lastTime = 0;
        return Game;
    }());
    exports.Game = Game;
});
define("game/logic/space/objects/GameObject", ["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameObject = (function () {
        function GameObject() {
            this.position = new three_1.Vector3();
            this.needDelete = false;
        }
        GameObject.prototype.dispose = function () {
        };
        GameObject.prototype.update = function (deltaTime) {
        };
        return GameObject;
    }());
    exports.GameObject = GameObject;
});
define("game/logic/space/Space", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Space = (function () {
        function Space() {
            this.objects = new Array();
        }
        Space.prototype.dispose = function () {
            this.clear();
        };
        Space.prototype.clear = function () {
            for (var i = this.objects.length - 1; i >= 0; i++) {
                var object = this.objects[i];
                object.dispose();
            }
        };
        Space.prototype.init = function (seed) {
        };
        Space.prototype.update = function (deltaTime) {
            for (var i = this.objects.length - 1; i >= 0; i++) {
                var object = this.objects[i];
                if (object.needDelete) {
                    object.dispose();
                    this.objects.splice(i, 1);
                }
                else {
                    object.update(deltaTime);
                }
            }
        };
        return Space;
    }());
    exports.Space = Space;
});
define("engine/Assets", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Assets = (function () {
        function Assets() {
        }
        Assets.getObject = function (name) {
        };
        Assets.getTexture = function (name) {
            var texture = PIXI.loader.resources[name].texture;
            return texture;
        };
        Assets.getTextureFromAtlas = function (atlasName, name) {
            return PIXI.loader.resources[atlasName].textures[name];
        };
        return Assets;
    }());
    exports.Assets = Assets;
});
define("game/logic/space/objects/SpaceShip", ["require", "exports", "game/logic/space/objects/GameObject"], function (require, exports, GameObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShip = (function (_super) {
        __extends(SpaceShip, _super);
        function SpaceShip() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SpaceShip;
    }(GameObject_1.GameObject));
    exports.SpaceShip = SpaceShip;
});
define("game/logic/space/objects/SpaceStation", ["require", "exports", "game/logic/space/objects/GameObject"], function (require, exports, GameObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceStation = (function (_super) {
        __extends(SpaceStation, _super);
        function SpaceStation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SpaceStation;
    }(GameObject_2.GameObject));
    exports.SpaceStation = SpaceStation;
});
define("game/logic/space/objects/Asteriod", ["require", "exports", "game/logic/space/objects/GameObject"], function (require, exports, GameObject_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Asteriod = (function (_super) {
        __extends(Asteriod, _super);
        function Asteriod() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Asteriod;
    }(GameObject_3.GameObject));
    exports.Asteriod = Asteriod;
});
define("game/data/game/Inventory", ["require", "exports", "engine/Assets", "three"], function (require, exports, Assets_1, three_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InventoryItemSlot = (function () {
        function InventoryItemSlot() {
            this.x = 0;
            this.y = 0;
            this.type = 0;
            this.position = new three_2.Vector3();
            this.scale = 1;
            this.visible = true;
        }
        return InventoryItemSlot;
    }());
    exports.InventoryItemSlot = InventoryItemSlot;
    var InventoryItemType = (function () {
        function InventoryItemType() {
            this.params = new Array();
            this.slots = new Array();
        }
        InventoryItemType.prototype.setFrom = function (data) {
            this.id = data.id;
            this.name = data.name;
            this.type = data.type;
            this.slotType = data.slottype;
            this.caption = data.caption;
            this.maxCount = data.maxCount;
            if (this.maxCount < 1)
                this.maxCount = 1;
            if (data.image) {
                this.image = Assets_1.Assets.getTexture(data.image.name);
            }
            if (data.model) {
                this.modelName = data.model[0].name;
            }
            this.slots.splice(0, this.slots.length);
            if (data.slots && data.slots.length > 0) {
                for (var i = 0; i < data.slots.length; i++) {
                    var slotData = data.slots[i];
                    var slot = new InventoryItemSlot();
                    if (slotData.x)
                        slot.x = slotData.x;
                    if (slotData.y)
                        slot.y = slotData.y;
                    if (slotData.type)
                        slot.type = slotData.type;
                    if (slotData.visible)
                        slot.visible = slotData.visible;
                    if (slotData.scale)
                        slot.scale = slotData.scale;
                    if (slotData.posX)
                        slot.position.x = slotData.posX;
                    if (slotData.posY)
                        slot.position.y = slotData.posY;
                    if (slotData.posZ)
                        slot.position.z = slotData.posZ;
                    this.slots.push(slot);
                }
            }
            if (data.weapon) {
            }
            this.params.splice(0, this.params.length);
            if (data.params && data.params.length > 0) {
                for (var i = 0; i < data.params.length; i++) {
                    var dataParam = data.params[i];
                    var param = {};
                    param.name = dataParam.name;
                    param.min = dataParam.min;
                    param.max = dataParam.max;
                    param.mode = dataParam.mode;
                    param.id = dataParam.id;
                    param.caption = dataParam.caption;
                    this.params.push(param);
                }
            }
        };
        return InventoryItemType;
    }());
    exports.InventoryItemType = InventoryItemType;
    var InventoryItem = (function () {
        function InventoryItem() {
            this.offset = 0;
            this.owner = null;
            this.isChanged = false;
            this.isSelected = false;
            this.id = 0;
            this.seed = 0;
            this.itemsCount = 1;
            this.condition = 0;
            this.conditionMax = 100;
            this.itemType = null;
            this.slots = new Array();
            this.paramsInit = new Map();
            this.paramsSlot = new Map();
            this.params = new Map();
        }
        InventoryItem.prototype.dispose = function () {
        };
        InventoryItem.prototype.init = function (_itemtype, _seed, _condition, _itemscount) {
            if (_seed === void 0) { _seed = 0; }
            if (_condition === void 0) { _condition = 100; }
            if (_itemscount === void 0) { _itemscount = 1; }
            this.itemType = _itemtype;
            this.id = _itemtype.id;
            this.seed = _seed;
            this.setCondition(_condition);
            this.setCount(_itemscount);
            this.initParams();
        };
        InventoryItem.prototype.initParams = function () {
            this.paramsInit.clear();
            this.params.clear();
            this.paramsSlot.clear();
            for (var i = 0; i < this.itemType.params.length; i++) {
                var param = this.itemType.params[i];
                Inventory.iseed = (0xFFFF & this.seed) + param.id;
                var val = Inventory.irandomminmax(param.min, param.max);
                if (!this.paramsInit[param.name]) {
                    this.paramsInit[param.name] = val;
                }
                else {
                    this.paramsInit[param.name] += val;
                }
            }
            if ((this.paramsInit["condition"]) >= 0)
                this.conditionMax = this.paramsInit["condition"];
            if (this.getCondition() > this.conditionMax)
                this.setCondition(this.conditionMax);
            this.slots.splice(0, this.slots.length);
            for (var i = 0; i < this.itemType.slots.length; i++) {
                var slotType = this.itemType.slots[i];
                var slot = new Inventory();
                slot.slotOwner = this;
                slot.slotX = slotType.x;
                slot.slotY = slotType.y;
                slot.slotVisible = slotType.visible;
                slot.slotType = slotType.type;
                slot.slotSlot = slotType;
                slot.isSlot = true;
                this.slots.push(slot);
            }
            this.isChanged = true;
        };
        InventoryItem.prototype.getCount = function () {
            return (this.itemsCount ^ (this.seed * this.seed | 1322597841));
        };
        InventoryItem.prototype.setCount = function (_count) {
            if (_count > this.itemType.maxCount)
                _count = this.itemType.maxCount;
            this.itemsCount = (_count ^ (this.seed * this.seed | 1322597841));
            this.onChanged();
        };
        InventoryItem.prototype.getCondition = function () {
            return (this.condition ^ (this.seed * this.seed | 1322597845));
        };
        InventoryItem.prototype.setCondition = function (_condition) {
            this.condition = (_condition ^ (this.seed * this.seed | 1322597845));
        };
        InventoryItem.prototype.calculate = function () {
            if (!this.isChanged)
                return;
            for (var i = this.slots.length - 1; i >= 0; i--) {
                this.slots[i].calculate();
            }
            var itcount = this.getCount();
            this.params.clear();
            for (var i = this.slots.length - 1; i >= 0; i--) {
                Inventory.mergeParams(this.params, this.slots[i].params);
            }
            Inventory.mergeParams(this.params, this.paramsInit, this.getCount());
            this.isChanged = false;
        };
        InventoryItem.prototype.getParam = function (_name) {
            return this.params[_name];
        };
        InventoryItem.prototype.onChanged = function () {
            this.isChanged = true;
            if (this.owner != null) {
                this.owner.onChanged();
            }
        };
        return InventoryItem;
    }());
    exports.InventoryItem = InventoryItem;
    var Inventory = (function () {
        function Inventory() {
            this.list = new Array();
            this.isSlot = false;
            this.slotX = 0;
            this.slotY = 0;
            this.slotVisible = true;
            this.slotType = 0;
            this.slotSlot = null;
            this.slotOwner = null;
            this.isChanged = true;
            this.params = new Map();
        }
        Inventory.prototype.dispose = function () {
            this.clear();
        };
        Inventory.prototype.clear = function () {
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].dispose();
            }
            this.list.splice(0, this.list.length);
            this.params.clear();
        };
        Inventory.prototype.add = function (type, count, seed, condition) {
            var item = null;
            if (type == null)
                return null;
            while (count > 0) {
                item = new InventoryItem();
                item.owner = this;
                item.init(type, seed, condition, count);
                item.offset = this.list.length;
                this.list.push(item);
                count -= item.getCount();
            }
            this.onChanged();
            return item;
        };
        Inventory.prototype.addById = function (id, count, seed, condition) {
            var type = Inventory.getById(id);
            if (type == null)
                return null;
            return this.add(type, count, seed, condition);
        };
        Inventory.prototype.addCopy = function (it) {
            var item = new InventoryItem();
            item.owner = this;
            item.init(it.itemType, it.seed, it.getCondition(), it.getCount());
            item.offset = this.list.length;
            this.list.push(item);
            for (var i = 0; i < it.slots.length; i++) {
                var srcSlot = it.slots[i];
                var dstSlot = item.slots[i];
                for (var j = 0; j < srcSlot.list.length; j++) {
                    dstSlot.addCopy(srcSlot.list[j]);
                }
            }
            this.onChanged();
            return item;
        };
        Inventory.prototype.remove = function (offset, count) {
            if (offset < 0 || offset >= this.list.length)
                return 0;
            var it = this.getItem(offset);
            var delcnt = 0;
            var cnt = it.getCount();
            if (cnt > count) {
                delcnt += count;
                it.setCount(cnt - count);
            }
            else {
                count -= cnt;
                delcnt += cnt;
                it.dispose();
                this.list.splice(offset, 1);
            }
            this.format();
            this.onChanged();
            return delcnt;
        };
        ;
        Inventory.prototype.removeItem = function (_id, count, _seed) {
            var s = 0;
            var cnt = 0;
            var delcnt = 0;
            for (var i = this.list.length - 1; i >= 0; i--) {
                var it = this.list[i];
                if (it.itemType.id == _id && it.seed == _seed) {
                    cnt = it.getCount();
                    if (cnt > count) {
                        delcnt += count;
                        it.setCount(cnt - count);
                        break;
                    }
                    else {
                        count -= cnt;
                        delcnt += cnt;
                        it.dispose();
                        this.list.splice(i, 1);
                    }
                }
            }
            this.format();
            this.onChanged();
            return delcnt;
        };
        Inventory.prototype.getItemById = function (_id, _seed) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                var it = this.list[i];
                if (it.itemType.id == _id && it.seed == _seed) {
                    return it;
                }
            }
            return null;
        };
        Inventory.prototype.getItemCount = function (_id, _seed) {
            var s = 0;
            for (var i = this.list.length - 1; i >= 0; i--) {
                var it = this.list[i];
                if (it.itemType.id == _id && it.seed == _seed) {
                    s += it.getCount();
                }
            }
            return s;
        };
        Inventory.prototype.swap = function (offseta, offsetb) {
            if (offseta < 0 || offseta >= this.list.length || offsetb < 0 || offsetb >= this.list.length || offseta == offsetb)
                return;
            var item = this.list[offseta];
            this.list[offseta] = this.list[offsetb];
            this.list[offsetb] = item;
            this.format();
            this.onChanged();
        };
        Inventory.prototype.move = function (toInventory, offset, count) {
            if (offset < 0 || offset >= this.list.length)
                return;
            var item = this.list[offset];
            if (count > item.getCount())
                count = item.getCount();
            if (count < item.getCount()) {
                var dstItem = toInventory.addCopy(item);
                dstItem.setCount(count);
                item.setCount(item.getCount() - count);
            }
            else {
                item.owner = toInventory;
                item.offset = toInventory.list.length;
                toInventory.list.push(item);
                this.list.splice(offset, 1);
            }
            toInventory.format();
            toInventory.onChanged();
            this.format();
            this.onChanged();
        };
        Inventory.prototype.getItem = function (offset) {
            if (offset < 0 || offset >= this.list.length)
                return null;
            return this.list[offset];
        };
        Inventory.prototype.getFirstItem = function () {
            if (this.list.length <= 0)
                return null;
            return this.list[0];
        };
        Inventory.prototype.moveAll = function (toInventory) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                var item = this.getItem(i);
                item.owner = toInventory;
                item.offset = toInventory.list.length;
                toInventory.list.push(item);
                item.onChanged();
                this.list.splice(i, 1);
            }
            toInventory.format();
            toInventory.onChanged();
            this.onChanged();
        };
        Inventory.prototype.moveAllTo = function (toInventory, offset) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                var item = this.getItem(i);
                item.owner = toInventory;
                item.offset = toInventory.list.length;
                toInventory.list.splice(offset, 0, item);
                item.onChanged();
                this.list.splice(i, 1);
            }
            toInventory.format();
            toInventory.onChanged();
            this.onChanged();
        };
        Inventory.prototype.onChanged = function () {
            this.isChanged = true;
            if (this.isSlot && this.slotOwner != null) {
                this.slotOwner.onChanged();
            }
        };
        Inventory.prototype.getParam = function (_name) {
            return this.params[_name];
        };
        Inventory.prototype.calculate = function () {
            if (!this.isChanged)
                return;
            this.params.clear();
            for (var i = this.list.length - 1; i >= 0; i--) {
                this.list[i].calculate();
                Inventory.mergeParams(this.params, this.list[i].params);
            }
            this.isChanged = false;
        };
        Inventory.prototype.isItems = function () {
            return (this.list.length > 0);
        };
        Inventory.prototype.format = function () {
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].offset = i;
            }
            for (var i = 0; i < this.list.length; i++) {
                var dstItem = this.getItem(i);
                if (dstItem.getCount() < dstItem.itemType.maxCount) {
                    for (var j = this.list.length - 1; j > i; j--) {
                        var srcItem = this.getItem(j);
                        if (this.isItemsEqual(dstItem, srcItem)) {
                            var cnt = dstItem.itemType.maxCount - dstItem.getCount();
                            if (cnt > srcItem.getCount())
                                cnt = srcItem.getCount();
                            dstItem.setCount(dstItem.getCount() + cnt);
                            dstItem.onChanged();
                            srcItem.setCount(srcItem.getCount() - cnt);
                            srcItem.onChanged();
                        }
                    }
                }
            }
            for (i = this.list.length - 1; i >= 0; i--) {
                var item = this.list[i];
                if (item.getCount() <= 0) {
                    item.dispose();
                    this.list.splice(i, 1);
                }
            }
        };
        Inventory.prototype.isItemsEqual = function (itema, itemb) {
            return (itema.id == itemb.id) && (itema.seed == itemb.seed) && (itema.condition == itemb.condition);
        };
        Inventory.prototype.saveTo = function (data) {
        };
        Inventory.prototype.loadFrom = function (data) {
        };
        Inventory.irandomminmax = function (min, max) {
            Inventory.iseed = ((Inventory.iseed >> 3) * Inventory.iseed * 16805 + 789221) % 2147483647;
            if (min < max) {
                return (Inventory.iseed % 65536) * (max - min + 1) / 65536 + min;
            }
            else if (max < min) {
                return (Inventory.iseed % 65536) * (min - max + 1) / 65536 + max;
            }
            else {
                return min;
            }
        };
        Inventory.init = function () {
            for (var i = 0; i < Inventory.typesList.length; i++) {
            }
            Inventory.typesList.splice(0, Inventory.typesList.length);
            Inventory.typesMap.clear();
            Inventory.typesIdMap.clear();
            var data = Assets_1.Assets.getObject("inventoryitems.json");
            Inventory.typesAdd(data);
        };
        Inventory.done = function () {
            for (var i = 0; i < Inventory.typesList.length; i++) {
            }
            Inventory.typesList.splice(0, Inventory.typesList.length);
            Inventory.typesMap.clear();
            Inventory.typesIdMap.clear();
        };
        Inventory.typesAdd = function (data) {
            for (var i = 0; i < data.items.length; i++) {
                var itemData = data.items[i];
                if (itemData.file) {
                    var dataNew = Assets_1.Assets.getObject(itemData.file);
                    Inventory.typesAdd(dataNew);
                }
                else if (itemData.name) {
                    var name = itemData.name;
                    var inventoryItemType = new InventoryItemType();
                    inventoryItemType.setFrom(itemData);
                    Inventory.typesMap[name] = inventoryItemType;
                    Inventory.typesIdMap[inventoryItemType.id] = inventoryItemType;
                    Inventory.typesList.push(inventoryItemType);
                }
            }
        };
        Inventory.get = function (name) {
            var res = Inventory.typesMap[name];
            if (res == null) {
                console.log("Inventory ItemType not found " + name);
                return null;
            }
            return res;
        };
        Inventory.getById = function (id) {
            var res = Inventory.typesIdMap[id];
            if (res == null) {
                console.log("Inventory ItemID not found " + id);
                return null;
            }
            return res;
        };
        Inventory.mergeParams = function (to, from, mul) {
            if (mul === void 0) { mul = 1; }
            for (var itemName in from) {
                if (to[itemName]) {
                    to[itemName] += from[itemName] * mul;
                }
                else {
                    to[itemName] = from[itemName] * mul;
                }
            }
        };
        Inventory.iseed = 0;
        Inventory.typesList = new Array();
        Inventory.typesIdMap = new Map();
        Inventory.typesMap = new Map();
        return Inventory;
    }());
    exports.Inventory = Inventory;
});
//# sourceMappingURL=main.js.map