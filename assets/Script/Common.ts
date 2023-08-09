
const {ccclass, property} = cc._decorator;

export enum inGameState {
    NONE,
    PLAYING,
    CHECKING,
    COMPLETED,
    FAILED
}

export enum spriteState{
    Begin,
    Win,
    Lose,
}
export enum EasingEnum {
    quadIn = "quadIn",
    quadOut = "quadOut",
    quadInOut = "quadInOut",
    cubicIn = "cubicIn",
    cubicOut = "cubicOut",
    cubicInOut = "cubicInOut",
    quartIn = "quartIn",
    quartOut = "quartOut",
    quartInOut = "quartInOut",
    quintIn = "quintIn",
    quintOut = "quintOut",
    quintInOut = "quintInOut",
    sineIn = "sineIn",
    sineOut = "sineOut",
    sineInOut = "sineInOut",
    expoIn = "expoIn",
    expoOut = "expoOut",
    expoInOut = "expoInOut",
    circIn = "circIn",
    circOut = "circOut",
    circInOut = "circInOut",
    elasticIn = "elasticIn",
    elasticOut = "elasticOut",
    elasticInOut = "elasticInOut",
    backIn = "backIn",
    backOut = "backOut",
    backInOut = "backInOut",
    bounceIn = "bounceIn",
    bounceOut = "bounceOut",
    bounceInOut = "bounceInOut",
    smooth = "smooth",
    fade = "fade",

}
@ccclass
export default class Common extends cc.Component{

    public static _ins: Common;


    public static get instance(): Common {
        return this._ins || new Common;
    }

    onLoad(){
        Common._ins = this;
    }

    ChangeLanguageEvent: string = "ChangeLanguageEvent";
    StartMovingEvent: string = "StartMovingEvent";
    FailLevelEvent: string = "FailLevelEvent";
    PassLevelEvent: string = "PassLevelEvent";
    ClaimWeapon: string = "ClaimWeapon";

    // update (dt) {}
}
