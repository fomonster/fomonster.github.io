/**
 * Created by fomonster on 24.04.2017.
 *
 * http://www.photoshopessentials.com/photo-effects/rotoscope/
 *
 */
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Widget} from "../../engine/Widget";
import {Screen} from "../Screen";
import {Space} from "../logic/space/Space";
import {GameData} from "../data/GameData";

export class GameWidget extends Widget
{

    public graphicsA:PIXI.Graphics = null;
    public graphicsB:PIXI.Graphics = null;

    public space:Space = null;

    public preInit():void
    {
        super.preInit();
        this.space = new Space();
    }

    public init():void
    {
        GameData.load();


        super.init();
    }

    public postInit():void
    {
        this.space.init();
        //-------------------------------------------------------------------------------------
        // 3D Scene
        //-------------------------------------------------------------------------------------

        /*var cube = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 300 ), new THREE.MeshNormalMaterial() );
        cube.position.z = 0;
        cube.rotation.z = 0;
        Screen.scene.add( cube );

        var cubea = new THREE.Mesh( new THREE.BoxGeometry( 100, 300, 100 ), new THREE.MeshNormalMaterial() );
        cubea.position.z = 0;
        cubea.rotation.z = 0;
        Screen.scene.add( cubea );

        var mesh:THREE.Mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 100, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        );
        Screen.scene.add( mesh );
        */
        //-------------------------------------------------------------------------------------
        // 2D Scene
        //-------------------------------------------------------------------------------------

        /*var graphics = new PIXI.Graphics();
        graphics.beginFill( 0xe60630 );
        graphics.moveTo( 0,0  );
        graphics.lineTo( 100, 0);
        graphics.lineTo( 100, 100 );
        graphics.lineTo( 0, 100 );
        graphics.endFill();
        Screen.screen.addChild( graphics );
        this.graphicsA = graphics;

        graphics = new PIXI.Graphics();
        graphics.beginFill( 0x06e630 );
        graphics.moveTo( 0,0  );
        graphics.lineTo( 100, 0);
        graphics.lineTo( 100, 100 );
        graphics.lineTo( 0, 100 );
        graphics.endFill();
        Screen.screen.addChild( graphics );
        this.graphicsB = graphics;*/

        this.resize();
        super.postInit();
    }

    public preRelease():void
    {
        GameData.save();
        super.preRelease();
    }

    public release():void
    {
        this.space.done();
        super.release();
    }

    public postRelease():void
    {
        this.space.dispose();
        this.space = null;
        super.postRelease();
    }

    public update(deltaTime:number):void
    {
        super.update(deltaTime);
        if ( this.space ) {
            this.space.update(deltaTime);
        }
    }

    public resize():void
    {
        super.resize();
        if ( this.graphicsA ) {
            this.graphicsA.x = Screen.screenLeft;
            this.graphicsA.y = Screen.screenTop;
        }
        if ( this.graphicsB ) {
            this.graphicsB.x = Screen.screenWidth + Screen.screenLeft - 100;
            this.graphicsB.y = Screen.screenHeight + Screen.screenTop - 100;
        }
    }


}
