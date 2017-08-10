


import {Quaternion, Vector3} from "three";

export class Utils
{
    public static AXIS_X:Vector3 = new Vector3(1, 0, 0);
    public static AXIS_Y:Vector3 = new Vector3(0, 1, 0);
    public static AXIS_Z:Vector3 = new Vector3(0, 0, 1);

    public static rotateVector(q:Quaternion, v:Vector3, to:Vector3 = null):Vector3
    {
        var vt0x:number;
        var vt0y:number;
        var vt0z:number;
        var vt2x:number;
        var vt2y:number;
        var vt2z:number;
        vt0x = 2*(q.y * v.z - v.y * q.z);
        vt0y = 2*(v.x * q.z - q.x * v.z);
        vt0z = 2*(q.x * v.y - v.x * q.y);
        vt2x = vt0x * q.w + v.x;
        vt2y = vt0y * q.w + v.y;
        vt2z = vt0z * q.w + v.z;
        var vt:Vector3 = to;
        if ( to == null )  vt = new Vector3();
        vt.x = q.y * vt0z - vt0y * q.z + vt2x;
        vt.y = vt0x * q.z - q.x * vt0z + vt2y;
        vt.z = q.x * vt0y - vt0x * q.y + vt2z;
        return vt;
    }

}