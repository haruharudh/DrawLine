import Common, { inGameState } from "./Common";
import DrawLine from "./DrawLine";
import GameConfig from "./GameConfig";
import GameManager from "./GameManager";


const {ccclass,property} = cc._decorator;

@ccclass
export default class LineCollider extends cc.Component {
   
    // @property(cc.Node)
    // private includeNode: cc.Node = null;

    @property(cc.Node)
    private handDrawNode: cc.Node = null;

    // @property(cc.Node)
    // private uiNode: cc.Node = null;

    @property(cc.Prefab)
    private pointGraphicPrefab: cc.Prefab = null;

    @property
    public hintText: string = "";

    @property
    public timeChecking: number = 5;

    @property(cc.Node)
    protected characterNode: cc.Node = null;

    @property
    public isCanTouchDrawLine: boolean = true;

    //Character meet target to win
    @property
    public isMeetTargetLevel: boolean = false;
    @property
    public isToggleNewAnim: boolean = false;
   
    toggleNode: cc.Node = null;

    protected pointGraphic: DrawLine = null;
    // canShowTutorial: boolean = true;

    private pointNode: cc.Node = null;

    protected _posList: cc.Vec2[] = [];

    private _drawNode: cc.Node = null;
    @property
    public isToggleOnWall: boolean = true;

    private hasDrawnLine: boolean = false;



    onLoad() {
        this.handDrawNode.on('touchstart', this.StartTouch, this);
        this.handDrawNode.on('touchmove', this.TouchMove, this);
        this.handDrawNode.on('touchend', this.EndTouch, this);
        this.handDrawNode.on('touchcancel', this.EndTouch, this);
        Common._ins.node.on(Common._ins.PassLevelEvent,this.onPassLevel,this);
        Common._ins.node.on(Common._ins.FailLevelEvent,this.onFailedLevel,this);
        this.pointNode = cc.instantiate(GameManager.instance.brushPrefab);
        this.pointNode.setPosition(0, 0, 0);
    }
    
    StartTouch(event: cc.Event.EventTouch) {
        if (GameConfig.gameState != inGameState.PLAYING) return;
        let pos = event.touch.getLocation();
        let n_pos = this.handDrawNode.convertToNodeSpaceAR(pos);
        this.pointNode.parent = this.handDrawNode;
        this.pointNode.active = true;
        this.pointNode.setPosition(n_pos);
        this.createPointGraphics(n_pos);
    }

    private _tempPos = null;

    TouchMove(event: cc.Event.EventTouch) {
        if (GameConfig.gameState != inGameState.PLAYING) return;
        if (!this._drawNode) return;

        let pos = event.touch.getLocation();
        let n_pos = this.handDrawNode.convertToNodeSpaceAR(pos);
        this.pointNode.active = true;
        this.pointNode.setPosition(n_pos);

        if (!this._tempPos) {
            this._tempPos = n_pos;
        } else {
            let distance = cc.Vec2.distance(this._tempPos, n_pos);
            if (distance >= 8) {
                distance = this._jugement(n_pos);
                if (distance >= 8) {
                    this.pointGraphic.updateDrawPoints(n_pos);
                    this._tempPos = n_pos;
                }
            }
    }
    }

    EndTouch() {
        if (GameConfig.gameState != inGameState.PLAYING) return;
        this.startMoving(); 

    }
    
    private _jugement(pos: cc.Vec2) {
        let distance = 100;
        for (let i = 0; i < this._posList.length; i++) {
            let dis = cc.Vec2.distance(pos, this._posList[i]);
            distance = dis < distance ? dis : distance;

        }
        return distance;
    }

    startMoving() {
        //Add physical
        let self = this;
        this._posList = this.pointGraphic.getListPoint();
        this._addPhysices(function () {
            self.DoCheckingComplete();
        });
    }

    DoCheckingComplete()
    {
        GameConfig.gameState = inGameState.CHECKING;
        GameManager.instance.startCounting(this.timeChecking);
        Common.instance.node.emit("StartMovingEvent");
    }
    public _addPhysices(callback: any) {
        this._drawNode.removeAllChildren(true);
        this.addBoxPhysic(this._drawNode);
        callback();
    }
    addBoxPhysic(g: cc.Node) {
        try {
            g.addComponent(cc.RigidBody);
            g.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
            for (let i = 0; i < this._posList.length - 1; i++) {
                let point1 = this._posList[i];
                let point2 = this._posList[i + 1];
                this.addRectangleBetweenPointsToBody(g, point1, point2);
            }
        } catch (error) {
            this._drawNode.destroy();
            return;
        }
    }


    addRectangleBetweenPointsToBody(b2Body: cc.Node, start: cc.Vec2, end: cc.Vec2) {
        let distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        let sx = start.x;
        let sy = start.y;
        let ex = end.x;
        let ey = end.y;
        let dist_x = sx - ex;
        let dist_y = sy - ey;
        let angle = Math.atan2(dist_y, dist_x);

        let px = (sx + ex) / 2;
        let py = (sy + ey) / 2;
        let width = Math.abs(distance);
        let height = 20;


        let center = new cc.Vec2(px, py);

        let bc: cc.PhysicsPolygonCollider = b2Body.addComponent(cc.PhysicsPolygonCollider);
        bc.density = 1;
        bc.friction = 0.1;
        bc.restitution = 0.5;
        bc.points = this.getListPointFrom(center, angle, height, width);
        bc.apply();
    }


    getListPointFrom(center: cc.Vec2, angle: number, height: number, width: number): cc.Vec2[] {
        let Top_Right = new cc.Vec2();
        let Top_Left = new cc.Vec2();
        let Bot_Left = new cc.Vec2();
        let Bot_Right = new cc.Vec2();

        let halfW = width / 2;
        let halfH = height / 2;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        Top_Right.x = center.x + (halfW * cos) - (halfH * sin);
        Top_Right.y = center.y + (halfW * sin) + (halfH * cos);
        Top_Left.x = center.x - (halfW * cos) - (halfH * sin);
        Top_Left.y = center.y - (halfW * sin) + (halfH * cos);
        Bot_Left.x = center.x - (halfW * cos) + (halfH * sin);
        Bot_Left.y = center.y - (halfW * sin) - (halfH * cos);
        Bot_Right.x = center.x + (halfW * cos) + (halfH * sin);
        Bot_Right.y = center.y + (halfW * sin) - (halfH * cos);

        return [Top_Right, Top_Left, Bot_Left, Bot_Right];
    }

    createPointGraphics(pos: cc.Vec2) {
        let listRope = this.handDrawNode.children;
        for (let i = 0; i < listRope.length - 1; i++) {
            listRope[i].removeFromParent(true);
        }
        this._drawNode = cc.instantiate(this.pointGraphicPrefab);
        this.pointGraphic = this._drawNode.getComponent(DrawLine);
        this._drawNode.parent = this.handDrawNode;
        this._drawNode.setSiblingIndex(0);
        this.pointGraphic.splice();
        this.pointGraphic.updateDrawPoints(pos);
    }

    ClearGraphics() {
        for (let pointGraphic of this.handDrawNode.children) {
            if (pointGraphic.name === "Line") {
                pointGraphic.removeFromParent(true);
            }
        }
    }    
    onFailedLevel() {
        this.playFailEffect();
        this.schedule(function () {
            this.ClearGraphics();
            GameManager.instance.restartLevel();
        }, 0.5);
    }

    playFailEffect()
    {
        let failAni= cc.instantiate(GameManager._ins.aniFailPrefab);
        failAni.parent = this.node;
    }

    playPassEffect()
    {
        let passAni = cc.instantiate(GameManager._ins.aniWinPrefab);
        passAni.parent = this.node;
    }
    onPassLevel()
    {
        this.playPassEffect()
        if(this.isToggleNewAnim == false)
        {}else{
            this.toggleNode.active == false;
        }
        GameManager.instance.onCompleteLevel();
        
    }
}

