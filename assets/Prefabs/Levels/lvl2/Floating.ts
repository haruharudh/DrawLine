import { EasingEnum } from "../../../Scripts/Common/Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Floating extends cc.Component {

    start () {
        this.CloudFloatingAnim();
    }

    

    private CloudFloatingAnim()
    {
        let floatingTween = cc.tween()
            .by(1.5, {scaleY: 0.1})
            .by(1.5, {scaleY: -0.1})

        cc.tween(this.node).then(floatingTween).repeatForever().start()
    }
}
