import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {UserData} from "./user/UserData";
import {Inventory} from "./game/Inventory";

export class GameData
{

    public static userData:UserData = new UserData();

    /**
     *  Иницаиализация справочников
     */
    public static init()
    {

        Inventory.init();
    }

    /**
     * Загрузка пользовательских данных
     */
    public static load()
    {
        GameData.userData.load();
        console.log("Game loaded");
    }

    /**
     *  Сохранение пользовательских данных
     */
    public static save()
    {
        GameData.userData.save();
        console.log("Game saved");
    }

    /**
     *  Расчет игровой логики в пользовательских данных
     */
    public static update(deltaTime:number)
    {
        GameData.userData.update(deltaTime);
    }
}