const {ccclass, property} = cc._decorator;

@ccclass
export default class BatScript extends cc.Component {

    onCollisionEnter(other, self) {
        if (other.node.group === "character") {
            this.node.children[0].active = true;
            return;
        }
    }

    onCollisionExit(other, self) {
        if (other.node.group === "character") {
            this.node.children[0].active = false;
            return;
        }
    }
}
