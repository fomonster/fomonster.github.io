Разобрался как подключить модули pixi и three 

Нужно открыть консоль, перейти в папку проекта
Для pixi выполнить: npm install @types/pixi.js
Для three.js выполнить: npm install @types/three

для последний версий либ

npm install pixi
npm install three

Импорт в typescript выполнятся в шапке так:

import * as THREE from 'three';
import * as PIXI from 'pixi.js';

https://basarat.gitbooks.io/typescript/docs/project/tsconfig.html
https://codepen.io/RoryDuncan/pen/Jvfpw
https://www.html5rocks.com/en/tutorials/webaudio/positional_audio/