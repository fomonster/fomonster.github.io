/**
 * Created by fomonster on 24.04.2017.
 *
 * http://www.photoshopessentials.com/photo-effects/rotoscope/
 *
 */
import * as THREE from '../../three.js';
import * as PIXI from '../../pixi.js';
import {Widget} from "../../Visual/Widget";
import {Game} from "../../Game";

export class GameWidget extends Widget
{

    public preInit():void
    {
        super.preInit();

    }

    public init():void
    {
        super.init();

    }

    public postInit():void
    {
        super.postInit();

        alert( "wow 2"+Game.scene );
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

    }

    public preRelease():void
    {
        super.preRelease();

    }

    public release():void
    {
        super.release();

    }

    public postRelease():void
    {
        super.postRelease();

    }

    public update(deltaTime:number):void
    {
        super.update(deltaTime);
    }

}
