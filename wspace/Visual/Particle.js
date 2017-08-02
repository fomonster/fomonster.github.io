"use strict";
exports.__esModule = true;
/**
 * Created by User on 15.04.2014.
 */
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
//# sourceMappingURL=Particle.js.map