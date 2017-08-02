//import THREE = require('three.js');
import * as THREE from 'three.js';
import * as PIXI from 'pixi.js';
import {Widget} from "./Visual/Widget";
//import {LoaderWidget} from "./Logic/Widgets/LoaderWidget";
import {Particles} from "./Visual/Particles"

export class Game {

    public static baseWidth:number = 1024;
    public static baseHeight:number = 768;

    public static container: HTMLElement = null;

    // 3D
    public static camera:THREE.Camera = null;
    public static scene:THREE.Scene = null;
    public static renderer:THREE.WebGLRenderer = null;

    // 2D
    public static stage:PIXI.Stage = null;
    public static canvas:any = null;
    public static screen:PIXI.Container = null;

    public static mouseX:number = 0;
    public static mouseY:number = 0;

    //
    public static width = window.innerWidth;
    public static height = window.innerHeight;

    //
    public static screenTop = 0;
    public static screenLeft = 0;
    public static screenWidth = Game.baseWidth;
    public static screenHeight = Game.baseHeight;


    public static lastTime:number = 0;


    public static graphicsA:PIXI.Graphics = null;
    public static graphicsB:PIXI.Graphics = null;

    //-------------------------------------------------------------------------------------
    //
    //-------------------------------------------------------------------------------------

    public static init(container: HTMLElement)
    {
        Game.container = container;
        
        Game.init3DRender();

        Game.init2DRender();


        //-------------------------------------------------------------------------------------
        // 3D Scene
        //-------------------------------------------------------------------------------------

        var geometry = new THREE.BoxGeometry( 100, 100, 300 );
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh( geometry, material );
        cube.position.z = 0;
        cube.rotation.z = -45;
        Game.scene.add( cube );


        var mesh:THREE.Mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 100, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        );
        Game.scene.add( mesh );

        Game.lastTime = Date.now() * 0.0001;

        //-------------------------------------------------------------------------------------
        // 2D Scene
        //-------------------------------------------------------------------------------------

        var graphics = new PIXI.Graphics();
        graphics.beginFill( 0xe60630 );
        graphics.moveTo( 0,0  );
        graphics.lineTo( 100, 0);
        graphics.lineTo( 100, 100 );
        graphics.lineTo( 0, 100 );
        graphics.endFill();
        Game.screen.addChild( graphics );
        Game.graphicsA = graphics;

        graphics = new PIXI.Graphics();
        graphics.beginFill( 0x06e630 );
        graphics.moveTo( 0,0  );
        graphics.lineTo( 100, 0);
        graphics.lineTo( 100, 100 );
        graphics.lineTo( 0, 100 );
        graphics.endFill();
        Game.screen.addChild( graphics );
        Game.graphicsB = graphics;

        //-------------------------------------------------------------------------------------
        // Animation
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
        Game.canvas.plugins.interaction.on('mousemove', function(mouseData){
            var newPosition = mouseData.data.getLocalPosition(Game.screen);
            Widget.onMouseMove(newPosition.x, newPosition.y);

            if ( newPosition.x < 0 || newPosition.y < 0 || newPosition.x >=Game.width || newPosition.y >= Game.height ) {
                if ( Widget.over ) {
                    Widget.onMouseOut();
                }
            } else {
                if ( !Widget.over ) {
                    Widget.onMouseIn();
                }
            }

        });
        Game.canvas.plugins.interaction.on('mousedown', function(mouseData){
            var newPosition = mouseData.data.getLocalPosition(Game.screen);
            Widget.onMouseDown(newPosition.x, newPosition.y);
        });

        Game.canvas.plugins.interaction.on('mouseup', function(mouseData){
            var newPosition = mouseData.data.getLocalPosition(Game.screen);
            Widget.onMouseUp(newPosition.x, newPosition.y);
        });

        Game.resize();

    }

    public static done():void {
        Widget.done();
    }

    public static init3DRender()
    {

        Game.renderer = new THREE.WebGLRenderer({ antialias: true });
        Game.renderer.setClearColor(0x000000);
        Game.renderer.setPixelRatio(window.devicePixelRatio);
        Game.renderer.setSize(window.innerWidth, window.innerHeight);
        Game.container.appendChild(Game.renderer.domElement);

        Game.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);

        Game.scene = new THREE.Scene();

    }

    public static init2DRender()
    {
        Game.stage = new PIXI.Stage(0xffffff);

        Game.canvas = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {transparent:true});
        Game.canvas.view.style.position = "absolute";
        Game.canvas.view.style.top = "0px";
        Game.canvas.view.style.left = "0px";

        Game.container.appendChild(Game.canvas.view);

        Game.screen = new PIXI.Container();
        Game.stage.addChild(Game.screen);
    }

    public static update(deltaTime)
    {

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

        Particles.update(deltaTime);
        Widget.update(deltaTime);

        Game.render();
    }

    public static render()
    {
        if (!Game.scene || !Game.camera) return;
        Game.renderer.render(Game.scene, Game.camera);
        Game.canvas.render(Game.stage);
    }

    public static resize()
    {
        Game.width = window.innerWidth;
        Game.height = window.innerHeight;

        Game.camera.aspect = Game.width / Game.height;
        Game.camera.updateProjectionMatrix();

        Game.renderer.setSize( Game.width, Game.height );

        Game.canvas.resize(Game.width,Game.height);
        //Game.canvas.view.style.width = Game.width + 'px';
        //Game.canvas.view.style.height = Game.height + 'px';

        var koeff = 1;
        var koeffX = Game.width / Game.baseWidth;
        var koeffY = Game.height / Game.baseHeight;



        if (Game.screen != null ) {
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
            Game.screenTop = (Game.baseHeight * 0.5) - (Game.height * 0.5) / koeff;;
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


        if ( Game.graphicsA ) {
            Game.graphicsA.x = Game.screenLeft;
            Game.graphicsA.y = Game.screenTop;
        }
        if ( Game.graphicsB ) {
            Game.graphicsB.x = Game.screenWidth + Game.screenLeft - 100;
            Game.graphicsB.y = Game.screenHeight + Game.screenTop - 100;
        }
    }

}

