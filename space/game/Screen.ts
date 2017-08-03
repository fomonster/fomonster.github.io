import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Widget} from "../engine/Widget";

export class Screen
{

    public static baseWidth:number = 1024;
    public static baseHeight:number = 768;

    // 3D
    public static camera:THREE.PerspectiveCamera = null;
    public static scene:THREE.Scene = null;
    public static renderer:THREE.WebGLRenderer = null;

    // 2D
    public static stage:PIXI.Container = null;
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
    public static screenWidth = Screen.baseWidth;
    public static screenHeight = Screen.baseHeight;

    public static resize()
    {
        Screen.width = window.innerWidth;
        Screen.height = window.innerHeight;

        Screen.camera.aspect = Screen.width / Screen.height;
        Screen.camera.updateProjectionMatrix();

        Screen.renderer.setSize( Screen.width, Screen.height );

        Screen.canvas.resize(Screen.width,Screen.height);
        //Screen.canvas.view.style.width = Screen.width + 'px';
        //Screen.canvas.view.style.height = Screen.height + 'px';

        var koeff = 1;
        var koeffX = Screen.width / Screen.baseWidth;
        var koeffY = Screen.height / Screen.baseHeight;



        if (Screen.screen != null ) {
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
            Screen.screenTop = (Screen.baseHeight * 0.5) - (Screen.height * 0.5) / koeff;;
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




        Widget.resizeWidget();
    }
	
}