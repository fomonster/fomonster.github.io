


import {Quaternion, Vector3} from "three";

export class Utils
{
    public static AXIS_X:Vector3 = new Vector3(1, 0, 0);
    public static AXIS_Y:Vector3 = new Vector3(0, 1, 0);
    public static AXIS_Z:Vector3 = new Vector3(0, 0, 1);
    public static AXIS_NEG_X:Vector3 = new Vector3(-1, 0, 0);
    public static AXIS_NEG_Y:Vector3 = new Vector3(0, -1, 0);
    public static AXIS_NEG_Z:Vector3 = new Vector3(0, 0, -1);

    public static setFromAxisAngle(q:Quaternion, vec:Vector3)
    {
        var r:number = Math.sqrt( vec.x * vec.x + vec.y * vec.y + vec.z * vec.z );
        if ( r == 0 ) r = 0.0000000001;
        var sina:number = Math.sin(r*0.5) / r;
        q.set(vec.x * sina, vec.y * sina, vec.z * sina,  Math.cos(r*0.5)); //setFromAxisAngle
    }

    public static shortestArc(q:Quaternion, from:Vector3, to:Vector3)
    {
        var v:Vector3 = new Vector3();
        v.crossVectors(from, to);
        q.x = v.x; q.y = v.y; q.z = v.z; q.w = from.dot(to);
        q.normalize();
        q.w += 1;
        if ( q.w<=0.00001 ) {
            if (from.z * from.z > from.x * from.x) {
                q.x= 0;
                q.y= from.z;
                q.z= -from.y;
            } else {
                q.x = from.y;
                q.y = -from.x;
                q.z = 0;
            }
        }
        q.normalize();
    }

    public static multiplyLeft(b:Quaternion, a:Quaternion)
    {
        var A:number = (b.w + b.x)*(a.w + a.x);
        var B:number = (b.z - b.y)*(a.y - a.z);
        var C:number = (b.x - b.w)*(a.y + a.z);
        var D:number = (b.y + b.z)*(a.x - a.w);
        var E:number = (b.x + b.z)*(a.x + a.y);
        var F:number = (b.x - b.z)*(a.x - a.y);
        var G:number = (b.w + b.y)*(a.w - a.z);
        var H:number = (b.w - b.y)*(a.w + a.z);
        b.x = A - (E + F + G + H) * 0.5;
        b.y = -C + (E - F + G - H) * 0.5;
        b.z = -D + (E - F - G + H) * 0.5;
        b.w = B + (-E - F + G + H) * 0.5;
    }

    public static multiplyRight(a:Quaternion, b:Quaternion)
    {
        var A:number = (b.w + b.x)*(a.w + a.x);
        var B:number = (b.z - b.y)*(a.y - a.z);
        var C:number = (b.x - b.w)*(a.y + a.z);
        var D:number = (b.y + b.z)*(a.x - a.w);
        var E:number = (b.x + b.z)*(a.x + a.y);
        var F:number = (b.x - b.z)*(a.x - a.y);
        var G:number = (b.w + b.y)*(a.w - a.z);
        var H:number = (b.w - b.y)*(a.w + a.z);
        a.x = A - (E + F + G + H) * 0.5;
        a.y = -C + (E - F + G - H) * 0.5;
        a.z = -D + (E - F - G + H) * 0.5;
        a.w = B + (-E - F + G + H) * 0.5;
    }

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