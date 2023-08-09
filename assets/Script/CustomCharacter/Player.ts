
import Common, { inGameState, spriteState } from "../Common";
import GameConfig from "../GameConfig";
import GameManager from "../GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.RigidBody)
    rb: cc.RigidBody = null;
    delayTime: number = 0;
    isStartMoving: boolean = false;
    initPos: cc.Vec3 = new cc.Vec3(0, 0);
    @property
    initVelocity: cc.Vec2 = new cc.Vec2(0, 0);
    @property(cc.SpriteFrame)
    charSprite:cc.SpriteFrame[] = [];
    @property(cc.Node)
    aniNode: cc.Node = null;

    startLevelAnim: cc.Node = null;

    @property
    isRemove: boolean = false;

    public static _ins: Player;
    public static get instance(): Player {
        return this._ins || new Player;
    }

    onLoad () {
        Common.instance.node.on(Common.instance.StartMovingEvent, this.startMoving, this);
        Common.instance.node.on(Common.instance.PassLevelEvent,this.onPass,this);
        Common.instance.node.on(Common.instance.FailLevelEvent,this.onFail,this);
        this.initPos = this.node.position;
    }
    
    onDisable() {
        Common.instance.node.off(Common.instance.StartMovingEvent, this.startMoving, this);
        Common.instance.node.off(Common.instance.PassLevelEvent,this.onPass,this);
        Common.instance.node.off(Common.instance.FailLevelEvent,this.onFail,this);
    }
    counter: number = 0;
    startMoving()
    {
        if(this.rb != null)
        {
            this.rb.type = cc.RigidBodyType.Dynamic;
            this.rb.linearVelocity = this.initVelocity;
            this.delayTime = GameManager.instance.lineMgr.timeChecking;
            this.counter = 0
            this.isStartMoving = true;
        }
        if(this.startLevelAnim != null)
        {
            this.startLevelAnim.active = false;
        }

    }
 

    update(dt: number){
        if(this.isStartMoving == undefined) return;
        this.counter += dt;
        if(this.counter >= 1)
        {
            this.counter--;
            this.counter --;
            if(this.delayTime == 0)
            {
                this.isStartMoving = true;
            }
        }
    }

    onCollisionEnter(other,self)
    {
        if (GameConfig.gameState != inGameState.CHECKING) return;

        if(other.node.group == "Target")
        {
            GameConfig.gameState = inGameState.COMPLETED
            //this.node.getComponent(cc.PolygonCollider).enabled = false;
            Common.instance.node.emit("PassLevelEvent");
            console.log("winGame in Target");
            return;
        }
        if(other.node.group == "Enemy")
        {
            GameConfig.gameState = inGameState.FAILED;
            console.log("failed");
            return;
        }
        if(other.node.name == "Line" && !GameManager.instance.lineMgr.isCanTouchDrawLine)
        {
            GameConfig.gameState = inGameState.FAILED;
            return;
        }
    }

    onFail()
    {
        if(this.charSprite[spriteState.Lose] !== undefined)
        {
            this.getComponent(cc.Sprite).spriteFrame = this.charSprite[spriteState.Lose];
        }
        if(this.isRemove)
        {
            this.node.removeFromParent(true);
        }
    }

    onPass()
    {
        if(this.charSprite[spriteState.Win] !== undefined)
        {
            this.getComponent(cc.Sprite).spriteFrame = this.charSprite[spriteState.Win];
        }
    }
    resetGravity()
    {
        this.rb.linearVelocity = this.initVelocity;
    }

    updateNewGravity(newGravity: cc.Vec2)
    {
        if(this.rb != null)
        {
            this.rb.type = cc.RigidBodyType.Dynamic;
            this.rb.linearVelocity = newGravity;
        }
    }

    updateNewLinear(newVelo)
    {
        if(this.rb != undefined)
        {
            this.rb.type = cc.RigidBodyType.Dynamic;
            this.rb.linearVelocity = new newVelo;
            this.isStartMoving = true;
        }
    }
}
