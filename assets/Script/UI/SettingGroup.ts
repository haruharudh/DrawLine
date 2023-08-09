import SoundManager from "./SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingGroup extends cc.Component {

    @property(cc.Node)
    btnSetting: cc.Node = null;

    @property(cc.Node)
    btnBGM: cc.Node = null;

    @property(cc.Node)
    btnSoundEffect: cc.Node = null;

    @property(cc.Node)
    btnShake: cc.Node = null;

    @property(cc.SpriteFrame)
    btnBGM_OnOff: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    btnSoundEffect_OnOff: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    btnShake_OnOff: cc.SpriteFrame[] = [];

    @property(cc.Node)
    private btnLayout: cc.Node = null;
    private showTween: cc.Tween = new cc.Tween();
    private isShow: boolean = false;
    private isBGM: boolean = true;
    private isSoundEffect: boolean = true;
    private isShake: boolean = true;


    // LIFE-CYCLE CALLBACKS:
    start () {
        this.btnSetting.on('click', this.showListBtn,this);
        this.btnBGM.on('click',this.onBtnBGM,this);
        this.btnSoundEffect.on('click',this.onBtnSound,this);
        this.btnShake.on('click', this.onBtnShake, this);
    }

    showListBtn()
    {
        this.isShow = !this.isShow;
        if (this.isShow)
        {
            this.showTween.stop();
            this.showTween =
                cc.tween(this.btnLayout)
                    .to(0.25, {position: cc.Vec2.ZERO}, {easing: 'linear'})
                    .start()
        }
        else
        {
            this.showTween.stop();
            this.showTween =
                cc.tween(this.btnLayout)
                    .to(0.25, {position: cc.v2(0, 500)}, {easing: 'linear'})
                    .start()
        }

    }
    onBtnBGM()
    {
        this.isBGM = !this.isBGM;
        this.btnBGM.getComponent(cc.Sprite).spriteFrame = this.btnBGM_OnOff[!this.isBGM ? 1: 0];
        SoundManager.instance.SetOnOffBackgroundMusic(this.isBGM);
    }
    onBtnSound()
    {
        this.isSoundEffect = !this.isSoundEffect;
        this.btnSoundEffect.getComponent(cc.Sprite).spriteFrame = this.btnSoundEffect_OnOff[!this.isSoundEffect ? 1:0];
        SoundManager.instance.SetOnOffSoundEffect(this.isSoundEffect);
    }

    onBtnShake()
    {
        this.isShake = !this.isShake;
        this.btnShake.getComponent(cc.Sprite).spriteFrame = this.btnShake_OnOff[!this.isShake ? 1:0];
    }





    // update (dt) {}
}
