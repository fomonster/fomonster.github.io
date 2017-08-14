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
        Screen.keyPressed = function (keyCode) {
            return (Screen.keys[keyCode] && Screen.keys[keyCode]);
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
        Screen.keys = {};
        return Screen;
    }());
    exports.Screen = Screen;
});
define("engine/Assets", ["require", "exports", "three", "pixi.js"], function (require, exports, THREE, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Assets = (function () {
        function Assets() {
        }
        Assets.getGeometry = function (name, texturePath) {
            if (texturePath === void 0) { texturePath = ""; }
            var jsonData = Assets.getObject(name);
            var loader = new THREE.JSONLoader();
            var model = loader.parse(jsonData);
            return model;
        };
        Assets.getObject = function (name) {
            return Assets.objectMap[name];
        };
        Assets.getTexture = function (name) {
            var texture = null;
            if (!name)
                return null;
            if (!PIXI.loader.resources[name]) {
                texture = Assets.textureMap[name];
                if (!texture) {
                    console.log("getTexture " + name + " error");
                    return;
                }
                return texture;
            }
            texture = PIXI.loader.resources[name].texture;
            return texture;
        };
        Assets.getTextureFromAtlas = function (atlasName, name) {
            if (!PIXI.loader.resources[atlasName]) {
                console.log("getTextureFromAtlas " + atlasName + " error");
                return;
            }
            var texture = PIXI.loader.resources[atlasName].textures[name];
            if (!texture) {
                console.log("getTextureFromAtlas " + atlasName + " " + name + "error");
                return;
            }
            return texture;
        };
        Assets.load = function (list, onLoad, onProgress) {
            if (onLoad === void 0) { onLoad = null; }
            if (onProgress === void 0) { onProgress = null; }
            this._onLoad = onLoad;
            this._onProgress = onProgress;
            PIXI.loader.on('load', this.onLoadCallback.bind(Assets));
            if (onProgress != null)
                PIXI.loader.on('progress', this.onProgressCallback.bind(Assets));
            var loader = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].length == 2) {
                    if (loader == null)
                        loader = PIXI.loader.add(list[i][0], list[i][1]);
                    else
                        loader = loader.add(list[i][0], list[i][1]);
                }
                else {
                    if (loader == null)
                        loader = PIXI.loader.add(list[i]);
                    else
                        loader = loader.add(list[i]);
                }
            }
            if (loader != null)
                loader.load(this.onLoadComplete.bind(Assets));
            else
                onLoad();
        };
        Assets.onProgressCallback = function (loader, resource) {
            if (this._onProgress)
                this._onProgress(loader, resource);
        };
        Assets.onLoadComplete = function () {
            if (this._onProgress != null)
                PIXI.loader.off('progress', this.onProgressCallback.bind(Assets));
            PIXI.loader.off('load', this.onLoadCallback.bind(Assets));
            if (this._onLoad)
                this._onLoad();
        };
        Assets.onLoadCallback = function (loader, resource) {
            console.log('loaded:', resource.name);
            var n = resource.name;
            if (n.indexOf("json") >= 0) {
                Assets.objectMap[n] = resource.data;
            }
            else if (resource.spritesheet) {
                var spritesheet = resource.spritesheet;
                for (var name_1 in spritesheet.textures) {
                    Assets.textureMap[name_1] = spritesheet.textures[name_1];
                }
            }
        };
        Assets.objectMap = new Map();
        Assets.textureMap = new Map();
        return Assets;
    }());
    exports.Assets = Assets;
});
define("engine/Random", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Random = (function () {
        function Random() {
        }
        Random.irandom = function (max) {
            if (max <= 0)
                return 0;
            Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
            return Random.iseed % max;
        };
        Random.irandomminmax = function (min, max) {
            Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
            if (min < max) {
                return (Random.iseed % (max - min + 1)) + min;
            }
            else if (max < min) {
                return (Random.iseed % (min - max + 1)) + max;
            }
            else {
                return min;
            }
        };
        Random.frandom = function () {
            Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
            return (1.0 * (Random.iseed % 10000000)) / 5000000.0 - 1.0;
        };
        Random.irandomminmaxparam = function (min, max, param) {
            if (param < 0)
                param = 0;
            if (param > 1000)
                param = 1000;
            Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
            var k = (0.05 + 1.9 * param / 1000) * 0.5;
            var y;
            var x;
            if (Random.iseed < 1073741823) {
                x = 1 - Random.iseed / 1073741823;
                y = k - k * (x * x);
            }
            else {
                x = Random.iseed / 1073741823 - 1;
                y = k + (1 - k) * (x * x);
            }
            return (max - min) * y + min + 0.5;
        };
        Random.iseed = 1;
        return Random;
    }());
    exports.Random = Random;
});
define("game/data/game/Inventory", ["require", "exports", "engine/Assets", "three"], function (require, exports, Assets_1, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InventoryItemSlot = (function () {
        function InventoryItemSlot() {
            this.x = 0;
            this.y = 0;
            this.type = 0;
            this.position = new three_1.Vector3();
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
                this.modelName = data.model.name;
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
                this.weaponShotType = data.weapon.name;
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
            this.paramsInit = new Map();
            this.params = new Map();
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
            this.params = new Map();
            for (var i = this.slots.length - 1; i >= 0; i--) {
                this.slots[i].calculate();
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
            this.params = new Map();
        };
        Inventory.prototype.add = function (type, count, seed, condition) {
            if (count === void 0) { count = 1; }
            if (seed === void 0) { seed = 0; }
            if (condition === void 0) { condition = 16777215; }
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
            if (count === void 0) { count = 1; }
            if (seed === void 0) { seed = 0; }
            if (condition === void 0) { condition = 16777215; }
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
        Inventory.prototype.addRandom = function (type, count, levelMin, levelMax) {
            if (count === void 0) { count = 1; }
            if (levelMin === void 0) { levelMin = 1; }
            if (levelMax === void 0) { levelMax = 16777215; }
            var item = this.add(type, count, Inventory.irandom(10000));
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
            this.params = new Map();
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
            data.push(this.list.length);
            for (var i = 0; i < this.list.length; i++) {
                var item = this.list[i];
                data.push(item.id ^ 0xab97f413);
                data.push(item.seed ^ 0x13ab97f4);
                data.push(item.getCondition() ^ 0xabf41397);
                data.push(item.getCount() ^ 0xf4ab9713);
                for (var j = 0; j < item.slots.length; j++) {
                    var slot = item.slots[j];
                    slot.saveTo(data);
                }
            }
        };
        Inventory.prototype.loadFrom = function (data, offset) {
            this.clear();
            if (data.length <= 0 && offset < data.length)
                return;
            var itemsCount = data[offset++];
            for (var i = 0; i < itemsCount; i++) {
                if (offset + 4 >= data.length)
                    return;
                var id = data[offset++];
                id = (id ^ 0xab97f413) & 0x0000ffff;
                var seed = data[offset++];
                seed = (seed ^ 0x13ab97f4) & 0x0000ffff;
                var condition = data[offset++];
                condition = (condition ^ 0xabf41397) & 0x0000ffff;
                var count = data[offset++];
                count = count ^ 0xf4ab9713;
                var it = this.addById(id, count, seed, condition);
                if (it != null) {
                    for (var j = 0; j < it.slots.length; j++) {
                        var slot = it.slots[j];
                        slot.loadFrom(data, offset);
                    }
                }
            }
        };
        Inventory.irandom = function (max) {
            if (max <= 0)
                return 0;
            Inventory.iseed = ((Inventory.iseed >> 3) * Inventory.iseed * 16805 + 789221) % 2147483647;
            return Inventory.iseed % max;
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
            Inventory.typesMap = new Map();
            Inventory.typesIdMap = new Map();
            var data = Assets_1.Assets.getObject("assets/inventory.json");
            Inventory.typesAdd(data);
        };
        Inventory.done = function () {
            for (var i = 0; i < Inventory.typesList.length; i++) {
            }
            Inventory.typesList.splice(0, Inventory.typesList.length);
            Inventory.typesMap = new Map();
            Inventory.typesIdMap = new Map();
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
define("game/data/user/UserData", ["require", "exports", "game/data/game/Inventory", "engine/Random"], function (require, exports, Inventory_1, Random_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserData = (function () {
        function UserData() {
            this.base = new Inventory_1.Inventory();
            this.inventory = new Inventory_1.Inventory();
        }
        UserData.prototype.load = function () {
            var data = localStorage.getItem("elite_game_save");
            if (data == null) {
                this.startInit();
            }
            else {
                this.loadFromObject(data);
            }
        };
        UserData.prototype.save = function () {
            var data = this.saveToObject();
            localStorage.setItem("elite_game_save", data);
        };
        UserData.prototype.loadFromObject = function (data) {
        };
        UserData.prototype.saveToObject = function () {
            var baseData = new Array();
            this.base.saveTo(baseData);
            var inventoryData = new Array();
            this.inventory.saveTo(inventoryData);
            var data = {
                inventory: inventoryData,
                base: baseData
            };
            return data;
        };
        UserData.prototype.startInit = function () {
            Inventory_1.Inventory.iseed = 33;
            this.inventory.clear();
            this.base.clear();
            var lev = 1;
            var it = this.base.addRandom(Inventory_1.Inventory.get("spaceship_1"), 1, lev - 1, lev + 1);
            it.calculate();
            var baseItem = this.base.getFirstItem();
            for (var i = 0; i < baseItem.slots.length; i++) {
                var list = new Array();
                for (var j = 0; j < Inventory_1.Inventory.typesList.length; j++) {
                    if (Inventory_1.Inventory.typesList[j].slotType == baseItem.slots[i].slotType) {
                        list.push(Inventory_1.Inventory.typesList[j]);
                    }
                }
                var id = Random_1.Random.irandom(list.length);
                if (list.length > 0) {
                    baseItem.slots[i].addRandom(list[id], 1, lev - 1, lev + 1);
                }
            }
            this.base.isChanged = true;
            this.base.calculate();
            this.inventory.add(Inventory_1.Inventory.get("exp"), 1);
            this.inventory.add(Inventory_1.Inventory.get("energy"), 50);
            this.inventory.add(Inventory_1.Inventory.get("money"), 150);
            this.inventory.addRandom(Inventory_1.Inventory.get("weapon_1"), 1);
            this.inventory.addRandom(Inventory_1.Inventory.get("engine_1"), 1);
        };
        UserData.prototype.update = function (deltaTime) {
        };
        return UserData;
    }());
    exports.UserData = UserData;
});
define("game/data/GameData", ["require", "exports", "game/data/user/UserData", "game/data/game/Inventory"], function (require, exports, UserData_1, Inventory_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameData = (function () {
        function GameData() {
        }
        GameData.init = function () {
            Inventory_2.Inventory.init();
        };
        GameData.load = function () {
            GameData.userData.load();
            console.log("Game loaded");
        };
        GameData.save = function () {
            GameData.userData.save();
            console.log("Game saved");
        };
        GameData.update = function (deltaTime) {
            GameData.userData.update(deltaTime);
        };
        GameData.userData = new UserData_1.UserData();
        return GameData;
    }());
    exports.GameData = GameData;
});
define("game/widgets/LoaderWidget", ["require", "exports", "pixi.js", "engine/Widget", "game/Screen", "engine/Assets", "game/data/GameData"], function (require, exports, PIXI, Widget_1, Screen_1, Assets_2, GameData_1) {
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
            this.container = new PIXI.Container();
            Screen_1.Screen.screen.addChild(this.container);
            this.graphics = new PIXI.Graphics();
            this.container.addChild(this.graphics);
            this.totalLoaded = 0;
            this.totalToLoad = 100;
            this.updateProgressBar();
            this.loadAssets();
            _super.prototype.init.call(this);
        };
        LoaderWidget.prototype.release = function () {
            this.container.removeChild(this.graphics);
            Screen_1.Screen.screen.removeChild(this.container);
            _super.prototype.release.call(this);
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
            var list = [
                'assets/model.json',
                'assets/asteroid.json',
                'assets/inventory.json',
                ['atlas', 'assets/atlas.json']
            ];
            Assets_2.Assets.load(list, this.onLoadComplete.bind(this), this.onProgressCallback.bind(this));
        };
        LoaderWidget.prototype.onLoadComplete = function () {
            GameData_1.GameData.init();
            GameData_1.GameData.load();
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
define("game/logic/space/objects/GameObject", ["require", "exports", "three", "three", "game/data/game/Inventory", "engine/Assets", "game/Screen"], function (require, exports, THREE, three_2, Inventory_3, Assets_3, Screen_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameObject = (function () {
        function GameObject() {
            this.owner = null;
            this.forward = new three_2.Vector3(0, 0, 1);
            this.up = new three_2.Vector3(0, 1, 0);
            this.right = new three_2.Vector3(1, 0, 0);
            this.left = new three_2.Vector3(-1, 0, 0);
            this.position = new three_2.Vector3();
            this.rotation = new three_2.Quaternion();
            this.velocity = new three_2.Vector3();
            this.angularVelocity = new three_2.Vector3();
            this.boundingSphereRadius = 0;
            this.needDelete = false;
            this.inventory = new Inventory_3.Inventory();
            this.base = new Inventory_3.Inventory();
            this.mesh = null;
            this.hash = GameObject.hashCounter;
            GameObject.hashCounter++;
        }
        GameObject.prototype.dispose = function () {
        };
        GameObject.prototype.setMesh = function (meshName) {
            if (this.mesh != null) {
                Screen_2.Screen.scene.remove(this.mesh);
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
                this.mesh = null;
            }
            var model = Assets_3.Assets.getGeometry(meshName);
            this.mesh = new THREE.Mesh(model.geometry, model.materials);
            Screen_2.Screen.scene.add(this.mesh);
        };
        GameObject.prototype.update = function (deltaTime) {
            if (this.mesh != null) {
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                this.mesh.setRotationFromQuaternion(this.rotation);
            }
        };
        GameObject.prototype.calculateInventory = function () {
        };
        GameObject.hashCounter = 1;
        return GameObject;
    }());
    exports.GameObject = GameObject;
});
define("game/logic/space/objects/SpaceShipWeapon", ["require", "exports", "three"], function (require, exports, three_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShipWeapon = (function () {
        function SpaceShipWeapon() {
            this.radius = 0;
            this.damageMin = 0;
            this.damageMax = 0;
            this.velocity = 0;
            this.randomShift = 0;
            this.splashDamageRadius = 0;
            this.delayMax = 0;
            this.delay = 0;
            this.position = new three_3.Vector3();
            this.weaponShotType = 0;
        }
        return SpaceShipWeapon;
    }());
    exports.SpaceShipWeapon = SpaceShipWeapon;
});
define("game/logic/space/objects/SpaceShipReactive", ["require", "exports", "three"], function (require, exports, three_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShipReactive = (function () {
        function SpaceShipReactive() {
            this.position = new three_4.Vector3();
            this.scale = 1;
        }
        return SpaceShipReactive;
    }());
    exports.SpaceShipReactive = SpaceShipReactive;
});
define("game/logic/space/objects/SpaceShipPilot", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShipPilot = (function () {
        function SpaceShipPilot(_owner) {
            this.owner = null;
            this.owner = _owner;
        }
        SpaceShipPilot.prototype.update = function (deltaTime) {
        };
        SpaceShipPilot.prototype.onObjectCollided = function (obj) {
        };
        SpaceShipPilot.prototype.onShot = function (shot) {
        };
        SpaceShipPilot.MODE_STAND = 0;
        SpaceShipPilot.MODE_MOVETOPOINT = 1;
        SpaceShipPilot.MODE_MOVETOOBJECT = 2;
        SpaceShipPilot.MODE_ATTACK = 3;
        SpaceShipPilot.MODE_FALLBACK = 4;
        return SpaceShipPilot;
    }());
    exports.SpaceShipPilot = SpaceShipPilot;
});
define("engine/Utils", ["require", "exports", "three"], function (require, exports, three_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils = (function () {
        function Utils() {
        }
        Utils.setFromAxisAngle = function (q, vec) {
            var r = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
            if (r == 0)
                r = 0.0000000001;
            var sina = Math.sin(r * 0.5) / r;
            q.set(vec.x * sina, vec.y * sina, vec.z * sina, Math.cos(r * 0.5));
        };
        Utils.shortestArc = function (q, from, to) {
            var v = new three_5.Vector3();
            v.crossVectors(from, to);
            q.x = v.x;
            q.y = v.y;
            q.z = v.z;
            q.w = from.dot(to);
            q.normalize();
            q.w += 1;
            if (q.w <= 0.00001) {
                if (from.z * from.z > from.x * from.x) {
                    q.x = 0;
                    q.y = from.z;
                    q.z = -from.y;
                }
                else {
                    q.x = from.y;
                    q.y = -from.x;
                    q.z = 0;
                }
            }
            q.normalize();
        };
        Utils.multiplyLeft = function (b, a) {
            var A = (b.w + b.x) * (a.w + a.x);
            var B = (b.z - b.y) * (a.y - a.z);
            var C = (b.x - b.w) * (a.y + a.z);
            var D = (b.y + b.z) * (a.x - a.w);
            var E = (b.x + b.z) * (a.x + a.y);
            var F = (b.x - b.z) * (a.x - a.y);
            var G = (b.w + b.y) * (a.w - a.z);
            var H = (b.w - b.y) * (a.w + a.z);
            b.x = A - (E + F + G + H) * 0.5;
            b.y = -C + (E - F + G - H) * 0.5;
            b.z = -D + (E - F - G + H) * 0.5;
            b.w = B + (-E - F + G + H) * 0.5;
        };
        Utils.multiplyRight = function (a, b) {
            var A = (b.w + b.x) * (a.w + a.x);
            var B = (b.z - b.y) * (a.y - a.z);
            var C = (b.x - b.w) * (a.y + a.z);
            var D = (b.y + b.z) * (a.x - a.w);
            var E = (b.x + b.z) * (a.x + a.y);
            var F = (b.x - b.z) * (a.x - a.y);
            var G = (b.w + b.y) * (a.w - a.z);
            var H = (b.w - b.y) * (a.w + a.z);
            a.x = A - (E + F + G + H) * 0.5;
            a.y = -C + (E - F + G - H) * 0.5;
            a.z = -D + (E - F - G + H) * 0.5;
            a.w = B + (-E - F + G + H) * 0.5;
        };
        Utils.rotateVector = function (q, v, to) {
            if (to === void 0) { to = null; }
            var vt0x;
            var vt0y;
            var vt0z;
            var vt2x;
            var vt2y;
            var vt2z;
            vt0x = 2 * (q.y * v.z - v.y * q.z);
            vt0y = 2 * (v.x * q.z - q.x * v.z);
            vt0z = 2 * (q.x * v.y - v.x * q.y);
            vt2x = vt0x * q.w + v.x;
            vt2y = vt0y * q.w + v.y;
            vt2z = vt0z * q.w + v.z;
            var vt = to;
            if (to == null)
                vt = new three_5.Vector3();
            vt.x = q.y * vt0z - vt0y * q.z + vt2x;
            vt.y = vt0x * q.z - q.x * vt0z + vt2y;
            vt.z = q.x * vt0y - vt0x * q.y + vt2z;
            return vt;
        };
        Utils.AXIS_X = new three_5.Vector3(1, 0, 0);
        Utils.AXIS_Y = new three_5.Vector3(0, 1, 0);
        Utils.AXIS_Z = new three_5.Vector3(0, 0, 1);
        Utils.AXIS_NEG_X = new three_5.Vector3(-1, 0, 0);
        Utils.AXIS_NEG_Y = new three_5.Vector3(0, -1, 0);
        Utils.AXIS_NEG_Z = new three_5.Vector3(0, 0, -1);
        return Utils;
    }());
    exports.Utils = Utils;
});
define("game/logic/space/objects/SpaceShip", ["require", "exports", "game/logic/space/objects/GameObject", "game/logic/space/objects/SpaceShipWeapon", "game/logic/space/objects/SpaceShipReactive", "engine/Utils", "three"], function (require, exports, GameObject_1, SpaceShipWeapon_1, SpaceShipReactive_1, Utils_1, three_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShip = (function (_super) {
        __extends(SpaceShip, _super);
        function SpaceShip() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.currentHash = 0;
            _this.mass = 0;
            _this.cargo = 0;
            _this.isOverload = false;
            _this.maxVelocity = 1;
            _this.angularAccelerationAdd = 0.01;
            _this.maxAngularVelocity = 0.02;
            _this.armor = 0;
            _this.shield = 0;
            _this.mobility = 0;
            _this.radarRadius = 0;
            _this.conditionReg = 0;
            _this.protectorReg = 0;
            _this.protectorDelay = 0;
            _this.protectorDelayMax = 0;
            _this.protectorMax = 0;
            _this.protector = 0;
            _this.weaponList = new Array();
            _this.reactiveList = new Array();
            _this.condition = 0;
            _this.conditionMax = 0;
            _this.regenerationDelay = 0;
            _this.regenerationDelayMax = 0;
            _this.pilot = null;
            _this.targetPoint = null;
            _this.targetObjectHash = -1;
            _this.movePhase = 0;
            _this.isFireA = false;
            _this.isFireB = false;
            return _this;
        }
        SpaceShip.prototype.calculateInventory = function () {
            if (!this.base.isChanged && !this.inventory.isChanged)
                return;
            if (this.inventory.isChanged) {
                this.inventory.calculate();
            }
            var isBaseChanged = this.base.isChanged;
            if (isBaseChanged) {
                this.base.calculate();
            }
            this.mass = this.base.getParam("mass") + this.inventory.getParam("mass");
            this.cargo = this.base.getParam("cargo");
            this.maxVelocity = this.base.getParam("maxvelocity");
            if (this.mass > this.cargo) {
                this.maxVelocity = 1;
                this.isOverload = true;
            }
            else {
                this.isOverload = false;
            }
            if (this.maxVelocity < 1)
                this.maxVelocity = 1;
            if (!isBaseChanged) {
                return;
            }
            this.armor = this.base.getParam("armor");
            this.shield = this.base.getParam("shield");
            this.mobility = this.base.getParam("mobility");
            this.angularAccelerationAdd = this.mobility / 60;
            this.maxAngularVelocity = this.mobility / 35;
            this.radarRadius = this.base.getParam("radarradius");
            this.conditionReg = this.base.getParam("conditionreg");
            this.protectorReg = this.base.getParam("protectorreg");
            this.protectorMax = this.base.getParam("protectormax");
            this.protectorDelayMax = this.base.getParam("protectordelay");
            if (this.protector < 0)
                this.protector = 0;
            if (this.protector > this.protectorMax)
                this.protector = this.protectorMax;
            this.weaponList.splice(0, this.weaponList.length);
            this.reactiveList.splice(0, this.reactiveList.length);
            var i;
            var wpn;
            var rea;
            var baseItem = this.base.getFirstItem();
            var slot;
            var slotItem;
            if (baseItem != null) {
                this.condition = baseItem.getCondition();
                this.conditionMax = baseItem.conditionMax;
                this.setMesh(baseItem.itemType.modelName);
                for (i = baseItem.slots.length - 1; i >= 0; i--) {
                    slot = baseItem.slots[i];
                    slotItem = slot.getFirstItem();
                    if (slot.slotSlot.type == 1) {
                        rea = new SpaceShipReactive_1.SpaceShipReactive();
                        rea.position = slot.slotSlot.position;
                        rea.scale = slot.slotSlot.scale;
                        this.reactiveList.push(rea);
                    }
                    if (slotItem != null) {
                        if (slotItem.itemType.type == 20) {
                            wpn = new SpaceShipWeapon_1.SpaceShipWeapon();
                            wpn.radius = slotItem.getParam("damageradius");
                            wpn.damageMin = slotItem.getParam("damagemin");
                            wpn.damageMax = slotItem.getParam("damagemax");
                            wpn.velocity = slotItem.getParam("velocity");
                            wpn.randomShift = slotItem.getParam("randomshift") * 0.001;
                            wpn.splashDamageRadius = slotItem.getParam("damagesplashradius");
                            ;
                            wpn.delayMax = slotItem.getParam("delay") * 0.01;
                            wpn.delay = wpn.delayMax;
                            wpn.position = slot.slotSlot.position;
                            wpn.weaponShotType = slotItem.itemType.weaponShotType;
                            this.weaponList.push(wpn);
                        }
                    }
                }
            }
        };
        SpaceShip.prototype.update = function (deltaTime) {
            Utils_1.Utils.rotateVector(this.rotation, Utils_1.Utils.AXIS_Y, this.forward);
            Utils_1.Utils.rotateVector(this.rotation, Utils_1.Utils.AXIS_Z, this.up);
            Utils_1.Utils.rotateVector(this.rotation, Utils_1.Utils.AXIS_X, this.right);
            Utils_1.Utils.rotateVector(this.rotation, Utils_1.Utils.AXIS_NEG_X, this.left);
            this.forward.normalize();
            this.up.normalize();
            this.right.normalize();
            this.left.normalize();
            this.calculateInventory();
            if (this.pilot) {
                this.pilot.update(deltaTime);
            }
            this.protectorDelay += deltaTime;
            if (this.protectorDelay >= this.protectorDelayMax) {
                this.protector += this.protectorReg * deltaTime;
                if (this.protector > this.protectorMax) {
                    this.protector = this.protectorMax;
                }
            }
            this.regenerationDelay += deltaTime;
            if (this.regenerationDelay >= this.regenerationDelayMax) {
                if (this.condition < this.conditionMax) {
                    this.condition += this.conditionReg;
                    if (this.condition >= this.conditionMax) {
                        this.condition = this.conditionMax;
                    }
                    var baseItem = this.base.getFirstItem();
                    if (baseItem != null) {
                        baseItem.setCondition(this.condition);
                    }
                }
                this.regenerationDelay -= this.regenerationDelayMax;
            }
            var linVel = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y + this.velocity.z * this.velocity.z);
            if (linVel > this.maxVelocity) {
                this.velocity.x = this.maxVelocity * this.velocity.x / linVel;
                this.velocity.y = this.maxVelocity * this.velocity.y / linVel;
                this.velocity.z = this.maxVelocity * this.velocity.z / linVel;
                linVel = this.maxVelocity;
            }
            var angVel = Math.sqrt(this.angularVelocity.x * this.angularVelocity.x + this.angularVelocity.y * this.angularVelocity.y + this.angularVelocity.z * this.angularVelocity.z);
            if (angVel > this.maxAngularVelocity) {
                this.angularVelocity.x = this.maxAngularVelocity * this.angularVelocity.x / angVel;
                this.angularVelocity.y = this.maxAngularVelocity * this.angularVelocity.y / angVel;
                this.angularVelocity.z = this.maxAngularVelocity * this.angularVelocity.z / angVel;
            }
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;
            this.position.z += this.velocity.z * deltaTime;
            Utils_1.Utils.setFromAxisAngle(SpaceShip.dQ, this.angularVelocity);
            Utils_1.Utils.multiplyRight(this.rotation, SpaceShip.dQ);
            var koeffStop = 5 * deltaTime;
            if (koeffStop > 0.8)
                koeffStop = 0.8;
            var koeffAngle = 0.3 * deltaTime;
            if (koeffAngle > 1)
                koeffAngle = 1;
            _super.prototype.update.call(this, deltaTime);
        };
        SpaceShip.prototype.stepRotateToPoint = function (point, deltaTime, upAlign) {
            if (upAlign === void 0) { upAlign = false; }
            if (point == null)
                return;
            var step = this.angularAccelerationAdd * deltaTime;
            if (step > 1)
                step = 1;
            if (step < 0)
                step = 0;
            var stopStep = this.mobility * deltaTime;
            if (stopStep > 0.8)
                stopStep = 0.8;
            if (stopStep < 0)
                stopStep = 0;
            SpaceShip.dV.set(point.x, point.y, point.z);
            SpaceShip.dV.sub(this.position);
            SpaceShip.dV.normalize();
            SpaceShip.dVA.crossVectors(this.forward, SpaceShip.dV);
            var currentSpeed = this.angularVelocity.length();
            var deltaAngle = SpaceShip.dVA.length();
            if (currentSpeed > deltaAngle * this.angularAccelerationAdd * 0.5) {
                var accelKoeff = 1 - Math.abs(this.forward.dot(this.angularVelocity)) * 100;
                if (accelKoeff > 1)
                    accelKoeff = 1;
                if (accelKoeff < 0)
                    accelKoeff = 0;
                console.log(accelKoeff);
                this.angularVelocity.x += -this.angularVelocity.x * stopStep * accelKoeff;
                this.angularVelocity.y += -this.angularVelocity.y * stopStep * accelKoeff;
                this.angularVelocity.z += -this.angularVelocity.z * stopStep * accelKoeff;
            }
            else {
                var accelKoeff = 1;
                if (accelKoeff > 1)
                    accelKoeff = 1;
                if (accelKoeff < 0)
                    accelKoeff = 0;
                this.angularVelocity.x += SpaceShip.dVA.x * step * accelKoeff;
                this.angularVelocity.y += SpaceShip.dVA.y * step * accelKoeff;
                this.angularVelocity.z += SpaceShip.dVA.z * step * accelKoeff;
            }
            return deltaAngle;
        };
        SpaceShip.prototype.stepMoveToPoint = function (point, deltaTime) {
            var deltaAngle = this.stepRotateToPoint(point, deltaTime);
            var r = Math.sqrt((point.x - this.position.x) * (point.x - this.position.x) + (point.y - this.position.y) * (point.y - this.position.y) + (point.z - this.position.z) * (point.z - this.position.z));
            if (r < 0.1)
                return r;
            var acceleration = this.maxVelocity * deltaTime * this.mobility * 0.2;
            var accelKoeff = Math.abs(deltaAngle) / (Math.PI / 2);
            if (accelKoeff > 1)
                accelKoeff = 1;
            if (accelKoeff < 0)
                accelKoeff = 0;
            accelKoeff = ((1 - accelKoeff) * 70 * r / this.maxVelocity);
            if (accelKoeff < 0)
                accelKoeff = 0;
            if (accelKoeff > 1)
                accelKoeff = 1;
            this.velocity.x += accelKoeff * this.forward.x * acceleration - (1 - accelKoeff) * this.velocity.x * acceleration * 0.07;
            this.velocity.y += accelKoeff * this.forward.y * acceleration - (1 - accelKoeff) * this.velocity.y * acceleration * 0.07;
            this.velocity.z += accelKoeff * this.forward.z * acceleration - (1 - accelKoeff) * this.velocity.z * acceleration * 0.07;
            return r;
        };
        SpaceShip.prototype.stepAttackObject = function (object, distance, deltaTime) {
        };
        SpaceShip.prototype.stepMoveToObject = function (object, distance, deltaTime) {
            if (object == null)
                return;
            var point = object.position;
            this.isFireA = false;
            var deltaAngle = this.stepRotateToPoint(point, deltaTime);
            var r = Math.sqrt((point.x - this.position.x) * (point.x - this.position.x) + (point.y - this.position.y) * (point.y - this.position.y) + (point.z - this.position.z) * (point.z - this.position.z));
            if (r < 0.1)
                return r;
            var acceleration = this.maxVelocity * deltaTime * this.mobility * 0.2;
            var accelKoeff = Math.abs(deltaAngle) / (Math.PI / 2);
            if (accelKoeff > 1)
                accelKoeff = 1;
            if (accelKoeff < 0)
                accelKoeff = 0;
            var distKoeff = r - distance;
            if (distKoeff < 0)
                distKoeff = 0;
            accelKoeff = ((1 - accelKoeff) * distKoeff / (this.maxVelocity / 0.33));
            if (accelKoeff < 0)
                accelKoeff = 0;
            if (accelKoeff > 1)
                accelKoeff = 1;
            this.velocity.x += accelKoeff * this.forward.x * acceleration - (1 - accelKoeff) * this.velocity.x * acceleration * 0.07;
            this.velocity.y += accelKoeff * this.forward.y * acceleration - (1 - accelKoeff) * this.velocity.y * acceleration * 0.07;
            this.velocity.z += accelKoeff * this.forward.z * acceleration - (1 - accelKoeff) * this.velocity.z * acceleration * 0.07;
        };
        SpaceShip.RACE_HUMAN = 0;
        SpaceShip.RACE_INSECT = 1;
        SpaceShip.RACE_ALIEN = 2;
        SpaceShip.MOVEPHASE_ATTACK_MOVETORANDOMPOINT = 0;
        SpaceShip.MOVEPHASE_ATTACK_MOVETOTARGET = 0;
        SpaceShip.MOVEPHASE_ATTACK_ROTATETOTARGET = 0;
        SpaceShip.dQ = new three_6.Quaternion();
        SpaceShip.dQA = new three_6.Quaternion();
        SpaceShip.dQB = new three_6.Quaternion();
        SpaceShip.dV = new three_6.Vector3();
        SpaceShip.dVA = new three_6.Vector3();
        return SpaceShip;
    }(GameObject_1.GameObject));
    exports.SpaceShip = SpaceShip;
});
define("game/logic/space/objects/SpaceShipPilotPlayer", ["require", "exports", "game/Screen", "game/logic/space/objects/SpaceShipPilot", "game/logic/space/Space", "engine/Random"], function (require, exports, Screen_3, SpaceShipPilot_1, Space_1, Random_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShipPilotPlayer = (function (_super) {
        __extends(SpaceShipPilotPlayer, _super);
        function SpaceShipPilotPlayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpaceShipPilotPlayer.prototype.update = function (deltaTime) {
            var acceleration = this.owner.maxVelocity * this.owner.mobility * 0.2;
            var isForward = Screen_3.Screen.keyPressed(87);
            var isBackward = Screen_3.Screen.keyPressed(83);
            var isUp = Screen_3.Screen.keyPressed(89);
            var isDown = Screen_3.Screen.keyPressed(72);
            var isLeft = Screen_3.Screen.keyPressed(66);
            var isRight = Screen_3.Screen.keyPressed(78);
            var isRotateLeft = Screen_3.Screen.keyPressed(65);
            var isRotateRight = Screen_3.Screen.keyPressed(68);
            var isRotateUp = Screen_3.Screen.keyPressed(80);
            var isRotateDown = Screen_3.Screen.keyPressed(76);
            var isRotateRollLeft = Screen_3.Screen.keyPressed(81);
            var isRotateRollRight = Screen_3.Screen.keyPressed(69);
            var isTarget = Screen_3.Screen.keyPressed(84);
            if (isUp) {
                this.owner.velocity.x += this.owner.up.x * acceleration * deltaTime;
                this.owner.velocity.y += this.owner.up.y * acceleration * deltaTime;
                this.owner.velocity.z += this.owner.up.z * acceleration * deltaTime;
            }
            else if (isRight) {
                this.owner.velocity.x += this.owner.right.x * acceleration * deltaTime;
                this.owner.velocity.y += this.owner.right.y * acceleration * deltaTime;
                this.owner.velocity.z += this.owner.right.z * acceleration * deltaTime;
            }
            else if (isForward) {
                this.owner.velocity.x += this.owner.forward.x * acceleration * deltaTime;
                this.owner.velocity.y += this.owner.forward.y * acceleration * deltaTime;
                this.owner.velocity.z += this.owner.forward.z * acceleration * deltaTime;
            }
            else if (isBackward) {
                this.owner.velocity.x -= this.owner.velocity.x * this.owner.mobility * deltaTime * 0.3;
                this.owner.velocity.y -= this.owner.velocity.y * this.owner.mobility * deltaTime * 0.3;
                this.owner.velocity.z -= this.owner.velocity.z * this.owner.mobility * deltaTime * 0.3;
            }
            var step = deltaTime * this.owner.mobility * 0.01;
            if ((isRotateRight && isRotateLeft) || (isRotateUp && isRotateDown) || (isRotateRollRight && isRotateRollLeft) || ((!isRotateLeft && !isRotateRight) && (!isRotateUp && !isRotateDown) && (!isRotateRollLeft && !isRotateRollRight))) {
                this.owner.angularVelocity.x -= this.owner.angularVelocity.x * this.owner.mobility * deltaTime * 0.5;
                this.owner.angularVelocity.y -= this.owner.angularVelocity.y * this.owner.mobility * deltaTime * 0.5;
                this.owner.angularVelocity.z -= this.owner.angularVelocity.z * this.owner.mobility * deltaTime * 0.5;
            }
            else {
                if (isRotateLeft) {
                    this.owner.angularVelocity.x += this.owner.up.x * step;
                    this.owner.angularVelocity.y += this.owner.up.y * step;
                    this.owner.angularVelocity.z += this.owner.up.z * step;
                }
                else if (isRotateRight) {
                    this.owner.angularVelocity.x -= this.owner.up.x * step;
                    this.owner.angularVelocity.y -= this.owner.up.y * step;
                    this.owner.angularVelocity.z -= this.owner.up.z * step;
                }
                if (isRotateRollLeft) {
                    this.owner.angularVelocity.x -= this.owner.forward.x * step;
                    this.owner.angularVelocity.y -= this.owner.forward.y * step;
                    this.owner.angularVelocity.z -= this.owner.forward.z * step;
                }
                else if (isRotateRollRight) {
                    this.owner.angularVelocity.x += this.owner.forward.x * step;
                    this.owner.angularVelocity.y += this.owner.forward.y * step;
                    this.owner.angularVelocity.z += this.owner.forward.z * step;
                }
                if (isRotateUp) {
                    this.owner.angularVelocity.x += this.owner.right.x * step;
                    this.owner.angularVelocity.y += this.owner.right.y * step;
                    this.owner.angularVelocity.z += this.owner.right.z * step;
                }
                else if (isRotateDown) {
                    this.owner.angularVelocity.x -= this.owner.right.x * step;
                    this.owner.angularVelocity.y -= this.owner.right.y * step;
                    this.owner.angularVelocity.z -= this.owner.right.z * step;
                }
            }
            if (isTarget) {
                var i = Random_2.Random.irandom(Space_1.Space.self.objects.length);
                this.owner.targetObjectHash = Space_1.Space.self.objects[i].hash;
                this.owner.targetPoint = Space_1.Space.self.objects[i].position;
            }
            if (this.owner.targetPoint) {
                var r = this.owner.stepMoveToObject(this.owner.owner.objectsHash[this.owner.targetObjectHash], 1, deltaTime);
                if (r < 2) {
                    var i = Random_2.Random.irandom(Space_1.Space.self.objects.length);
                    this.owner.targetObjectHash = Space_1.Space.self.objects[i].hash;
                    this.owner.targetPoint = Space_1.Space.self.objects[i].position;
                }
            }
        };
        SpaceShipPilotPlayer.prototype.onObjectCollided = function (obj) {
        };
        SpaceShipPilotPlayer.prototype.onShot = function (shot) {
        };
        return SpaceShipPilotPlayer;
    }(SpaceShipPilot_1.SpaceShipPilot));
    exports.SpaceShipPilotPlayer = SpaceShipPilotPlayer;
});
define("game/logic/space/objects/Asteroid", ["require", "exports", "game/logic/space/objects/GameObject"], function (require, exports, GameObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Asteroid = (function (_super) {
        __extends(Asteroid, _super);
        function Asteroid() {
            var _this = _super.call(this) || this;
            _this.setMesh('assets/asteroid.json');
            return _this;
        }
        Asteroid.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
        };
        return Asteroid;
    }(GameObject_2.GameObject));
    exports.Asteroid = Asteroid;
});
define("game/logic/space/Space", ["require", "exports", "three", "game/Screen", "game/logic/space/objects/SpaceShip", "game/data/GameData", "three", "game/logic/space/objects/SpaceShipPilotPlayer", "game/logic/space/objects/Asteroid", "engine/Random"], function (require, exports, THREE, Screen_4, SpaceShip_1, GameData_2, three_7, SpaceShipPilotPlayer_1, Asteroid_1, Random_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Space = (function () {
        function Space() {
            this.light = null;
            this.particles = null;
            this.particlesGeometry = null;
            this.objects = new Array();
            this.objectsHash = new Map();
            this.currentShipHash = 0;
            this.respawnDelay = 3;
            this.respownPoint = new three_7.Vector3();
            this.updateShipsRespawnDelay = 1;
            Space.self = this;
        }
        Space.prototype.dispose = function () {
            this.clear();
        };
        Space.prototype.clear = function () {
            for (var i = this.objects.length - 1; i >= 0; i++) {
                var object = this.objects[i];
                this.objectsHash[object.hash] = null;
                object.dispose();
            }
            this.objects.splice(0, this.objects.length);
        };
        Space.prototype.add = function (object) {
            if (object == null)
                return;
            object.owner = this;
            this.objectsHash[object.hash] = object;
            this.objects.push(object);
        };
        Space.prototype.get = function (hash) {
            return this.objectsHash[hash];
        };
        Space.prototype.init = function () {
            this.light = new THREE.DirectionalLight(0xffffff);
            this.light.position.set(0, 0, 1);
            Screen_4.Screen.scene.add(this.light);
            this.particlesGeometry = new THREE.Geometry();
            for (var i = 0; i < 10000; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = THREE.Math.randFloatSpread(2000);
                vertex.y = THREE.Math.randFloatSpread(2000);
                vertex.z = THREE.Math.randFloatSpread(2000);
                var r = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
                if (r != 0) {
                    vertex.x = 20000 * vertex.x / r;
                    vertex.y = 20000 * vertex.y / r;
                    vertex.z = 20000 * vertex.z / r;
                }
                this.particlesGeometry.vertices.push(vertex);
            }
            this.particles = new THREE.Points(this.particlesGeometry, new THREE.PointsMaterial({ color: 0x888888, size: 2, sizeAttenuation: false }));
            Screen_4.Screen.scene.add(this.particles);
            this.addPlayerSpaceShip();
            this.addAsteroids();
        };
        Space.prototype.done = function () {
            this.clear();
            Screen_4.Screen.scene.remove(this.particles);
            this.particlesGeometry.dispose();
            this.particles = null;
        };
        Space.prototype.update = function (deltaTime) {
            for (var i = this.objects.length - 1; i >= 0; i--) {
                var object = this.objects[i];
                if (object.needDelete) {
                    this.objectsHash[object.hash] = null;
                    object.dispose();
                    this.objects.splice(i, 1);
                }
                else {
                    object.update(deltaTime);
                }
            }
            this.assignCamera(this.objectsHash[this.currentShipHash]);
        };
        Space.prototype.assignCamera = function (object) {
            if (object == null)
                return;
            object.mesh.add(Screen_4.Screen.camera);
        };
        Space.prototype.addPlayerSpaceShip = function () {
            var spaceship = new SpaceShip_1.SpaceShip();
            spaceship.pilot = new SpaceShipPilotPlayer_1.SpaceShipPilotPlayer(spaceship);
            spaceship.position.set(this.respownPoint.x, this.respownPoint.y, this.respownPoint.z);
            spaceship.base = GameData_2.GameData.userData.base;
            spaceship.inventory = GameData_2.GameData.userData.inventory;
            spaceship.base.isChanged = true;
            spaceship.calculateInventory();
            this.add(spaceship);
            this.currentShipHash = spaceship.hash;
        };
        Space.prototype.addAsteroids = function () {
            var count = 1000;
            for (var i = 0; i < count; i++) {
                var asteroid = new Asteroid_1.Asteroid();
                asteroid.position.set(Random_3.Random.irandomminmax(-500, 500), Random_3.Random.irandomminmax(-500, 500), Random_3.Random.irandomminmax(-500, 500));
                this.add(asteroid);
            }
        };
        Space.self = null;
        return Space;
    }());
    exports.Space = Space;
});
define("game/widgets/GameWidget", ["require", "exports", "engine/Widget", "game/Screen", "game/logic/space/Space", "game/data/GameData"], function (require, exports, Widget_2, Screen_5, Space_2, GameData_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameWidget = (function (_super) {
        __extends(GameWidget, _super);
        function GameWidget() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.graphicsA = null;
            _this.graphicsB = null;
            _this.space = null;
            return _this;
        }
        GameWidget.prototype.preInit = function () {
            _super.prototype.preInit.call(this);
            this.space = new Space_2.Space();
        };
        GameWidget.prototype.init = function () {
            GameData_3.GameData.load();
            _super.prototype.init.call(this);
        };
        GameWidget.prototype.postInit = function () {
            this.space.init();
            this.resize();
            _super.prototype.postInit.call(this);
        };
        GameWidget.prototype.preRelease = function () {
            GameData_3.GameData.save();
            _super.prototype.preRelease.call(this);
        };
        GameWidget.prototype.release = function () {
            this.space.done();
            _super.prototype.release.call(this);
        };
        GameWidget.prototype.postRelease = function () {
            this.space.dispose();
            this.space = null;
            _super.prototype.postRelease.call(this);
        };
        GameWidget.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            if (this.space) {
                this.space.update(deltaTime);
            }
        };
        GameWidget.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.graphicsA) {
                this.graphicsA.x = Screen_5.Screen.screenLeft;
                this.graphicsA.y = Screen_5.Screen.screenTop;
            }
            if (this.graphicsB) {
                this.graphicsB.x = Screen_5.Screen.screenWidth + Screen_5.Screen.screenLeft - 100;
                this.graphicsB.y = Screen_5.Screen.screenHeight + Screen_5.Screen.screenTop - 100;
            }
        };
        return GameWidget;
    }(Widget_2.Widget));
    exports.GameWidget = GameWidget;
});
define("Game", ["require", "exports", "three", "pixi.js", "engine/Widget", "engine/Particles", "game/Screen", "game/widgets/LoaderWidget", "game/widgets/GameWidget", "game/data/GameData", "three"], function (require, exports, THREE, PIXI, Widget_3, Particles_1, Screen_6, LoaderWidget_1, GameWidget_1, GameData_4, three_8) {
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
            window.addEventListener("keydown", function (event) {
                Screen_6.Screen.keys[event.keyCode] = true;
                event.preventDefault();
            }, false);
            window.addEventListener("keyup", function (event) {
                Screen_6.Screen.keys[event.keyCode] = false;
                event.preventDefault();
            }, false);
            window.addEventListener('resize', function () { Game.resize(); }, false);
            Screen_6.Screen.canvas.plugins.interaction.on('mousemove', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_6.Screen.screen);
                Widget_3.Widget.onMouseMove(newPosition.x, newPosition.y);
                if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= Screen_6.Screen.width || newPosition.y >= Screen_6.Screen.height) {
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
            Screen_6.Screen.canvas.plugins.interaction.on('mousedown', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_6.Screen.screen);
                Widget_3.Widget.onMouseDown(newPosition.x, newPosition.y);
            });
            Screen_6.Screen.canvas.plugins.interaction.on('mouseup', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_6.Screen.screen);
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
            Screen_6.Screen.renderer = new THREE.WebGLRenderer({ antialias: true });
            Screen_6.Screen.renderer.setClearColor(0x000000);
            Screen_6.Screen.renderer.setPixelRatio(window.devicePixelRatio);
            Screen_6.Screen.renderer.setSize(window.innerWidth, window.innerHeight);
            Game.container.appendChild(Screen_6.Screen.renderer.domElement);
            Screen_6.Screen.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 3, 30000);
            Screen_6.Screen.camera.up.set(0, 0, 1);
            Screen_6.Screen.camera.position.set(0, 0, 0);
            Screen_6.Screen.camera.lookAt(new three_8.Vector3(0, 1, 0));
            Screen_6.Screen.scene = new THREE.Scene();
        };
        Game.init2DRender = function () {
            Screen_6.Screen.stage = new PIXI.Container();
            Screen_6.Screen.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
            Screen_6.Screen.canvas.view.style.position = "absolute";
            Screen_6.Screen.canvas.view.style.top = "0px";
            Screen_6.Screen.canvas.view.style.left = "0px";
            Game.container.appendChild(Screen_6.Screen.canvas.view);
            Screen_6.Screen.screen = new PIXI.Container();
            Screen_6.Screen.stage.addChild(Screen_6.Screen.screen);
        };
        Game.update = function (deltaTime) {
            Particles_1.Particles.update(deltaTime);
            Widget_3.Widget.updateWidgets(deltaTime);
            GameData_4.GameData.update(deltaTime);
            Game.render();
        };
        Game.render = function () {
            if (!Screen_6.Screen.scene || !Screen_6.Screen.camera)
                return;
            Screen_6.Screen.renderer.render(Screen_6.Screen.scene, Screen_6.Screen.camera);
            Screen_6.Screen.canvas.render(Screen_6.Screen.stage);
        };
        Game.resize = function () {
            Screen_6.Screen.resize();
            Widget_3.Widget.resizeWidget();
        };
        Game.container = null;
        Game.lastTime = 0;
        return Game;
    }());
    exports.Game = Game;
});
define("game/logic/space/objects/SpaceShipPilotComputer", ["require", "exports", "game/logic/space/objects/SpaceShipPilot", "three"], function (require, exports, SpaceShipPilot_2, three_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShipPilotComputer = (function (_super) {
        __extends(SpaceShipPilotComputer, _super);
        function SpaceShipPilotComputer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mode = SpaceShipPilot_2.SpaceShipPilot.MODE_STAND;
            return _this;
        }
        SpaceShipPilotComputer.prototype.update = function (deltaTime) {
        };
        SpaceShipPilotComputer.prototype.onObjectCollided = function (obj) {
        };
        SpaceShipPilotComputer.prototype.onShot = function (shot) {
        };
        SpaceShipPilotComputer.prototype.stepStand = function (deltaTime) {
            this.owner.velocity.x -= this.owner.velocity.x * this.owner.mobility * deltaTime * 0.05;
            this.owner.velocity.y -= this.owner.velocity.y * this.owner.mobility * deltaTime * 0.05;
            this.owner.velocity.z -= this.owner.velocity.z * this.owner.mobility * deltaTime * 0.05;
        };
        SpaceShipPilotComputer.prototype.stepAttack = function (deltaTime) {
            var obj = this.owner.owner.get(this.owner.targetObjectHash);
            if (obj != null) {
                this.owner.stepAttackObject(obj, 15, deltaTime);
            }
            else {
                this.mode = SpaceShipPilot_2.SpaceShipPilot.MODE_STAND;
            }
        };
        SpaceShipPilotComputer.prototype.stepMoveToPoint = function (deltaTime) {
            this.owner.stepMoveToPoint(this.owner.targetPoint, deltaTime);
        };
        SpaceShipPilotComputer.prototype.stepMoveToObject = function (deltaTime) {
            var obj = this.owner.owner.get(this.owner.targetObjectHash);
            if (obj != null) {
                this.owner.stepMoveToObject(obj, 5, deltaTime);
            }
        };
        SpaceShipPilotComputer.prototype.setMoveToPoint = function (_x, _y, _z) {
            this.owner.targetPoint = new three_9.Vector3(_x, _y, _z);
            this.mode = SpaceShipPilot_2.SpaceShipPilot.MODE_MOVETOPOINT;
        };
        SpaceShipPilotComputer.prototype.setAttackObject = function (object) {
            this.owner.targetObjectHash = object.hash;
            this.mode = SpaceShipPilot_2.SpaceShipPilot.MODE_ATTACK;
        };
        return SpaceShipPilotComputer;
    }(SpaceShipPilot_2.SpaceShipPilot));
    exports.SpaceShipPilotComputer = SpaceShipPilotComputer;
});
define("game/logic/space/objects/SpaceStation", ["require", "exports", "game/logic/space/objects/GameObject"], function (require, exports, GameObject_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceStation = (function (_super) {
        __extends(SpaceStation, _super);
        function SpaceStation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SpaceStation;
    }(GameObject_3.GameObject));
    exports.SpaceStation = SpaceStation;
});
//# sourceMappingURL=main.js.map