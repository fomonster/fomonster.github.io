
export class Random
{
    public static iseed:number = 1;

    public static irandom(max:number):number
    {
        if (max <= 0) return 0;
        Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
        return Random.iseed % max;
    }

    public static irandomminmax(min:number, max:number):number
    {
        Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
        if (min < max) {
            return (Random.iseed % (max - min + 1)) + min;
        }
        else if (max < min) {
            return (Random.iseed % (min - max + 1)) + max;
        }
        else {
            return min;
        }
    }

    public static frandom():number
    {
        Random.iseed = ((Random.iseed >> 3) * Random.iseed * 16805 + 789221) % 2147483647;
        return (1.0*(Random.iseed % 10000000)) / 5000000.0 - 1.0;
    }

    public static irandomminmaxparam(min:number, max:number, param:number):number
    {
        if (param < 0) param = 0;
        if (param > 1000) param = 1000;
        Random.iseed = ((Random.iseed >> 3)*Random.iseed * 16805 + 789221) % 2147483647;
        var k:number = (0.05 + 1.9*param / 1000)*0.5;
        var y:number;
        var x:number;
        if (Random.iseed < 1073741823) {
            x = 1 - Random.iseed / 1073741823;
            y = k - k*(x*x);
        }
        else {
            x = Random.iseed / 1073741823 - 1;
            y = k + (1 - k)*(x*x);
        }
        return (max - min)*y + min + 0.5;
    }

}
