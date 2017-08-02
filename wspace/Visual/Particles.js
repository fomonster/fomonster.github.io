"use strict";
exports.__esModule = true;
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
    return Particles;
}());
Particles.screen = null;
Particles.items = [];
exports.Particles = Particles;
//# sourceMappingURL=Particles.js.map