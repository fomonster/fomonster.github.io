"use strict";
exports.__esModule = true;
var Widget_1 = require("./Visual/Widget");
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
        //Screen.canvas.view.style.width = Screen.width + 'px';
        //Screen.canvas.view.style.height = Screen.height + 'px';
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
        //
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
    // 3D
    Screen.camera = null;
    Screen.scene = null;
    Screen.renderer = null;
    // 2D
    Screen.stage = null;
    Screen.canvas = null;
    Screen.screen = null;
    Screen.mouseX = 0;
    Screen.mouseY = 0;
    //
    Screen.width = window.innerWidth;
    Screen.height = window.innerHeight;
    //
    Screen.screenTop = 0;
    Screen.screenLeft = 0;
    Screen.screenWidth = Screen.baseWidth;
    Screen.screenHeight = Screen.baseHeight;
    return Screen;
}());
exports.Screen = Screen;
//# sourceMappingURL=Screen.js.map