
const {ccclass, property} = cc._decorator;

@ccclass
export default class DrawLine extends cc.Component {

    // @property(cc.Node)
    // canvas: cc.Node = null;
    @property(cc.Node)
    drawLine: cc.Node = null;
    @property(cc.Graphics)
    line: cc.Graphics = null;

    disBtw2Points: number = 2;

    listPoint: cc.Vec2[] = [];

    lastPointPos: cc.Vec2 = cc.v2(0, 0);

    // protected start(): void {
    //     this.canvas.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    //     this.canvas.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
    // }
    // onLoad(){
    //     this.collidersParent = new cc.Node();
    //     this.node.addChild(this.collidersParent);
    // }
    
    // onTouchStart(e: cc.Event.EventTouch)
    // {
    //     this.listPoint = [];
    //     let currentPos = e.touch.getLocation();
    //     this.listPoint.push(currentPos);
    // }
    
    // onTouchMove(e: cc.Event.EventTouch)
    // {
    //     let currentPos = e.touch.getLocation();
    //     this.listPoint.push(currentPos);
    //     this.line.clear()
    //     this.line.moveTo(this.listPoint[0].x,this.listPoint[0].y);
    //     this.renderLine();
        
        
    // }
    
    
    // renderLine()
    // {
    //     let lastIndex = 0;
    //     for (let i = 0; i < this.listPoint.length; i++) {
    //         let lastPos = this.listPoint[lastIndex];
    //         let currentPos = this.listPoint[i];
    
    //         let distance = this.disVector(lastPos, currentPos);
    //         if (distance > this.disBtw2Points) {
    //             this.line.lineTo(currentPos.x, currentPos.y);
    //             lastIndex = i;
    
    //             // Create and attach colliders to each point in the list
    //             let colliderNode = new cc.Node();
    //             colliderNode.addComponent(cc.BoxCollider); // Assuming you want BoxColliders. You can use other types as well.
    //             this.collidersParent.addChild(colliderNode);
    //             colliderNode.setPosition(currentPos);
    //         }
    //     }
    //     this.line.stroke();
    // }
    
    
    // disVector(a: cc.Vec2, b:cc.Vec2)
    // {
    //     return a.sub(b).mag();
    // }
    UpdateGraphics() {
            this.lastPointPos = cc.v2(this.listPoint[this.listPoint.length - 1].x, this.listPoint[this.listPoint.length - 1].y);
        
            this.line.moveTo(this.listPoint[0].x, this.listPoint[0].y);
            this.line.lineTo(0.5 * (this.listPoint[0].x + this.listPoint[1].x), 0.5 * (this.listPoint[0].y + this.listPoint[1].y));
        
            for (let j = 1; j <= this.listPoint.length - 1; j++) {
            this.line.lineTo(this.listPoint[j].x, this.listPoint[j].y);
        }
        this.line.lineTo(this.lastPointPos.x, this.lastPointPos.y);
    }
    
    
        splice()
        {
            this.listPoint = [];
        }
    
        updateDrawPoints(point: cc.Vec2) {
            this.listPoint.push(point);
        }
        getListPoint()
        {
            return this.listPoint;
        }
        
        update(dt)
        {
            this.line.lineWidth = 25;
            this.line.clear();
            this.line.lineJoin = cc.Graphics.LineJoin.ROUND;
            this.line.lineCap = cc.Graphics.LineCap.BUTT;
            
            if(this.listPoint.length <= 1)
            {
                return;
            }
    
            this.UpdateGraphics()
            this.line.stroke();
        }
}

