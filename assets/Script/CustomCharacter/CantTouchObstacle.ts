import Common, { inGameState } from "../Common";
import GameConfig from "../GameConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class CantTouchObstacle extends cc.Component {


    onLoad() {
        Common.instance.node.on(Common.instance.StartMovingEvent, this.startMoving, this);
    }

    startMoving() {
        this.scheduleOnce(function () {
            this.node.removeFromParent(true);
        }, 0.1);
    }

    onCollisionEnter(other, self) {
        if (other.node.name == "Line") {
            GameConfig.gameState = inGameState.FAILED;
            console.log("failed");
            return;
        }
    }
}
