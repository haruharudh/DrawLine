const {ccclass, property} = cc._decorator;

@ccclass
export default class Spinning extends cc.Component {
    
    start () {
        this.Spinning();
    }

    

    private Spinning()
    {
        let spinningTween = cc.tween()
            .by(2, {angle: -360})
        cc.tween(this.node).then(spinningTween).repeatForever().start()
    }
}
