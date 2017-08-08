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
define("game/logic/space/objects/GameObject", ["require", "exports", "three", "game/data/game/Inventory"], function (require, exports, three_2, Inventory_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameObject = (function () {
        function GameObject() {
            this.position = new three_2.Vector3();
            this.needDelete = false;
            this.inventory = new Inventory_3.Inventory();
            this.base = new Inventory_3.Inventory();
            this.hash = GameObject.hashCounter;
            GameObject.hashCounter++;
        }
        GameObject.prototype.dispose = function () {
        };
        GameObject.prototype.update = function (deltaTime) {
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
define("game/logic/space/objects/SpaceShip", ["require", "exports", "three", "game/logic/space/objects/GameObject", "game/logic/space/objects/SpaceShipWeapon", "game/logic/space/objects/SpaceShipReactive", "engine/Assets", "game/Screen"], function (require, exports, THREE, GameObject_1, SpaceShipWeapon_1, SpaceShipReactive_1, Assets_3, Screen_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpaceShip = (function (_super) {
        __extends(SpaceShip, _super);
        function SpaceShip() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mesh = null;
            _this.mass = 0;
            _this.cargo = 0;
            _this.isOverload = false;
            _this.maxVelocity = 1;
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
            return _this;
        }
        SpaceShip.prototype.setMesh = function (meshName) {
            if (this.mesh != null) {
                Screen_2.Screen.scene.remove(this.mesh);
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
                this.mesh = null;
            }
            var model = Assets_3.Assets.getGeometry("assets/model.json");
            this.mesh = new THREE.Mesh(model.geometry, model.materials[0]);
            Screen_2.Screen.scene.add(this.mesh);
        };
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
            this.calculateInventory();
            this.mesh.rotation.y += deltaTime * 10.0;
            this.mesh.rotation.x += deltaTime * 3.0;
            this.mesh.rotation.z += deltaTime * 5.0;
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
        };
        return SpaceShip;
    }(GameObject_1.GameObject));
    exports.SpaceShip = SpaceShip;
});
define("game/logic/space/Space", ["require", "exports", "three", "game/Screen", "game/logic/space/objects/SpaceShip", "game/data/GameData", "three"], function (require, exports, THREE, Screen_3, SpaceShip_1, GameData_2, three_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Space = (function () {
        function Space() {
            this.light = null;
            this.particles = null;
            this.particlesGeometry = null;
            this.objects = new Array();
            this.currentShipHash = 0;
            this.respawnDelay = 3;
            this.respownPoint = new three_5.Vector3();
            this.updateShipsRespawnDelay = 1;
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
        Space.prototype.addObject = function (object) {
            this.objects.push(object);
        };
        Space.prototype.init = function () {
            this.light = new THREE.DirectionalLight(0xffffff);
            this.light.position.set(0, 0, 1);
            Screen_3.Screen.scene.add(this.light);
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
            Screen_3.Screen.scene.add(this.particles);
            this.addPlayerSpaceShip();
        };
        Space.prototype.done = function () {
            this.clear();
            Screen_3.Screen.scene.remove(this.particles);
            this.particlesGeometry.dispose();
            this.particles = null;
        };
        Space.prototype.update = function (deltaTime) {
            for (var i = this.objects.length - 1; i >= 0; i--) {
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
        Space.prototype.addPlayerSpaceShip = function () {
            var spaceship = new SpaceShip_1.SpaceShip();
            spaceship.position.set(this.respownPoint.x, this.respownPoint.y, this.respownPoint.z);
            spaceship.base = GameData_2.GameData.userData.base;
            spaceship.inventory = GameData_2.GameData.userData.inventory;
            spaceship.base.isChanged = true;
            spaceship.calculateInventory();
            this.addObject(spaceship);
            this.currentShipHash = spaceship.hash;
        };
        return Space;
    }());
    exports.Space = Space;
});
define("game/widgets/GameWidget", ["require", "exports", "engine/Widget", "game/Screen", "game/logic/space/Space", "game/data/GameData"], function (require, exports, Widget_2, Screen_4, Space_1, GameData_3) {
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
            this.space = new Space_1.Space();
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
                this.graphicsA.x = Screen_4.Screen.screenLeft;
                this.graphicsA.y = Screen_4.Screen.screenTop;
            }
            if (this.graphicsB) {
                this.graphicsB.x = Screen_4.Screen.screenWidth + Screen_4.Screen.screenLeft - 100;
                this.graphicsB.y = Screen_4.Screen.screenHeight + Screen_4.Screen.screenTop - 100;
            }
        };
        return GameWidget;
    }(Widget_2.Widget));
    exports.GameWidget = GameWidget;
});
define("Game", ["require", "exports", "three", "pixi.js", "engine/Widget", "engine/Particles", "game/Screen", "game/widgets/LoaderWidget", "game/widgets/GameWidget", "game/data/GameData"], function (require, exports, THREE, PIXI, Widget_3, Particles_1, Screen_5, LoaderWidget_1, GameWidget_1, GameData_4) {
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
            Screen_5.Screen.canvas.plugins.interaction.on('mousemove', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_5.Screen.screen);
                Widget_3.Widget.onMouseMove(newPosition.x, newPosition.y);
                if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= Screen_5.Screen.width || newPosition.y >= Screen_5.Screen.height) {
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
            Screen_5.Screen.canvas.plugins.interaction.on('mousedown', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_5.Screen.screen);
                Widget_3.Widget.onMouseDown(newPosition.x, newPosition.y);
            });
            Screen_5.Screen.canvas.plugins.interaction.on('mouseup', function (mouseData) {
                var newPosition = mouseData.data.getLocalPosition(Screen_5.Screen.screen);
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
            Screen_5.Screen.renderer = new THREE.WebGLRenderer({ antialias: true });
            Screen_5.Screen.renderer.setClearColor(0x000000);
            Screen_5.Screen.renderer.setPixelRatio(window.devicePixelRatio);
            Screen_5.Screen.renderer.setSize(window.innerWidth, window.innerHeight);
            Game.container.appendChild(Screen_5.Screen.renderer.domElement);
            Screen_5.Screen.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);
            Screen_5.Screen.scene = new THREE.Scene();
        };
        Game.init2DRender = function () {
            Screen_5.Screen.stage = new PIXI.Container();
            Screen_5.Screen.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
            Screen_5.Screen.canvas.view.style.position = "absolute";
            Screen_5.Screen.canvas.view.style.top = "0px";
            Screen_5.Screen.canvas.view.style.left = "0px";
            Game.container.appendChild(Screen_5.Screen.canvas.view);
            Screen_5.Screen.screen = new PIXI.Container();
            Screen_5.Screen.stage.addChild(Screen_5.Screen.screen);
        };
        Game.update = function (deltaTime) {
            Screen_5.Screen.camera.position.z = 18;
            Particles_1.Particles.update(deltaTime);
            Widget_3.Widget.updateWidgets(deltaTime);
            GameData_4.GameData.update(deltaTime);
            Game.render();
        };
        Game.render = function () {
            if (!Screen_5.Screen.scene || !Screen_5.Screen.camera)
                return;
            Screen_5.Screen.renderer.render(Screen_5.Screen.scene, Screen_5.Screen.camera);
            Screen_5.Screen.canvas.render(Screen_5.Screen.stage);
        };
        Game.resize = function () {
            Screen_5.Screen.resize();
            Widget_3.Widget.resizeWidget();
        };
        Game.container = null;
        Game.lastTime = 0;
        return Game;
    }());
    exports.Game = Game;
});
define("game/logic/space/objects/Asteriod", ["require", "exports", "game/logic/space/objects/GameObject"], function (require, exports, GameObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Asteriod = (function (_super) {
        __extends(Asteriod, _super);
        function Asteriod() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Asteriod;
    }(GameObject_2.GameObject));
    exports.Asteriod = Asteriod;
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