
import * as THREE from 'three';
import * as PIXI from 'pixi.js'; 
import {Widget} from "./engine/Widget";
import {Particles} from "./engine/Particles"
import {Screen} from "./game/Screen"
import {LoaderWidget} from "./game/widgets/LoaderWidget";
import {GameWidget} from "./game/widgets/GameWidget";
import {GameData} from "./game/data/GameData";

export class Game
{

    public static container: HTMLElement = null;
    public static lastTime:number = 0;

    //-------------------------------------------------------------------------------------
    //
    //-------------------------------------------------------------------------------------

    public static init(container: HTMLElement)
    {
        Game.container = container;

        Game.init3DRender();

        Game.init2DRender();

        Game.lastTime = Date.now() * 0.0001;

        Widget.initWidgets();

        //-------------------------------------------------------------------------------------
        // Render + Update
        //-------------------------------------------------------------------------------------

        const handler = () => {

            var time = Date.now() * 0.0001;
            var deltaTime = time - Game.lastTime;
            Game.lastTime = time;

            Game.update(deltaTime);

            Game.render();

            window.requestAnimationFrame(handler);
        };
        window.requestAnimationFrame(handler);

        //
        window.addEventListener( 'resize',  () => { Game.resize(); }, false );

        //Game.app.stage.hitArea = new PIXI.Rectangle(0, 0,  Game.app.renderer.width/ Game.app.renderer.resolution,  Game.app.renderer.height/ Game.app.renderer.resolution);
        Screen.canvas.plugins.interaction.on('mousemove', function(mouseData){
            var newPosition = mouseData.data.getLocalPosition(Screen.screen);
            Widget.onMouseMove(newPosition.x, newPosition.y);

            if ( newPosition.x < 0 || newPosition.y < 0 || newPosition.x >=Screen.width || newPosition.y >= Screen.height ) {
                if ( Widget.over ) {
                    Widget.onMouseOut();
                }
            } else {
                if ( !Widget.over ) {
                    Widget.onMouseIn();
                }
            }

        });
        Screen.canvas.plugins.interaction.on('mousedown', function(mouseData){
            var newPosition = mouseData.data.getLocalPosition(Screen.screen);
            Widget.onMouseDown(newPosition.x, newPosition.y);
        });

        Screen.canvas.plugins.interaction.on('mouseup', function(mouseData){
            var newPosition = mouseData.data.getLocalPosition(Screen.screen);
            Widget.onMouseUp(newPosition.x, newPosition.y);
        });

        Game.resize();

        //-------------------------------------------------------------------------------------
        // Widgets
        //-------------------------------------------------------------------------------------

        Widget.addWidget("LoaderWidget", new LoaderWidget());
        Widget.addWidget("GameWidget", new GameWidget());

        //
        Widget.showWidget("LoaderWidget");

    }

    public static done():void {
        Widget.doneWidgets();
    }

    public static init3DRender()
    {

        Screen.renderer = new THREE.WebGLRenderer({ antialias: true });
        Screen.renderer.setClearColor(0x000000);
        Screen.renderer.setPixelRatio(window.devicePixelRatio);
        Screen.renderer.setSize(window.innerWidth, window.innerHeight);
        Game.container.appendChild(Screen.renderer.domElement);

        Screen.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);

        Screen.scene = new THREE.Scene();
    }

    public static init2DRender()
    {
        Screen.stage = new PIXI.Container();

        Screen.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {transparent:true});
        Screen.canvas.view.style.position = "absolute";
        Screen.canvas.view.style.top = "0px";
        Screen.canvas.view.style.left = "0px";

        Game.container.appendChild(Screen.canvas.view);

        Screen.screen = new PIXI.Container();
        Screen.stage.addChild(Screen.screen);

    }

    public static update(deltaTime)
    {

        //for (var i = 0; i < Screen.scene.children.length; i++) {
        //    var object = Screen.scene.children[i];
        //    object.rotation.y += deltaTime * 10.0;
        //   object.rotation.x += deltaTime * 3.0;
        //    object.rotation.z += deltaTime * 5.0;
        //}

        Screen.camera.position.z = 18;
        //ame.camera.position.x += (mouseX - camera.position.x) * 0.05;
        //Game.camera.position.y += (- mouseY - camera.position.y) * 0.05;

        //Screen.camera.lookAt(Screen.scene.position);

        Particles.update(deltaTime);
        Widget.updateWidgets(deltaTime);
        GameData.update(deltaTime);

        Game.render();
    }

    public static render()
    {
        if (!Screen.scene || !Screen.camera) return;
        Screen.renderer.render(Screen.scene, Screen.camera);
        Screen.canvas.render(Screen.stage);
    }

    public static resize()
    {
        Screen.resize();
        Widget.resizeWidget();
    }

}
