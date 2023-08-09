import Common, { inGameState } from "./Common";
import GameConfig from "./GameConfig";
import LineManager from "./LineManager";
import SoundManager from "./UI/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    
    @property(cc.Label)
    lbgameOver: cc.Label = null;
    
    @property(cc.Label)
    lbgameWon: cc.Label = null;
    
    // @property(cc.Node)
    // obstacle: cc.Node = null;


    // @property(cc.Prefab)
    // linePrefabs: cc.Prefab = null;

    // @property(cc.Node)
    // canvas: cc.Node = null;
    
    // @property(cc.Prefab)
    // prefabToSpawn: cc.Prefab = null;
    
    @property(cc.Label)
    timeStart:cc.Label = null;
    
    // deltaTime: number = 1;
    // timeSinceLastSpawn: number = 0;
    // lastSpawnPosition: cc.Vec2 = null;
    // gameTime : number = 0;
    // currentTime: number = 10;
    // uiManager: UIManager = null;
    
    // isGameOver: boolean = false;
    // canSpawn: boolean = true;
    
    @property(cc.Prefab)
    public brushPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    public brush: cc.Sprite = null;

    public reachLevel : number = 1; 
    
    private maxLevel: number = 300;
    countValue = 0;
    private timeCheck : number;
    lineMgr : LineManager = null;
    
    // levelNode:cc.Node = null;
    
    @property(cc.Node)
    private toggleWallNode: cc.Node = null;
    @property(cc.Node)
    private levelContainer: cc.Node = null;
    @property(cc.Prefab)
    leftParticlePrefabs: cc.Prefab = null;
    @property(cc.Prefab)
    rightParticlePrefabs: cc.Prefab = null;
    @property(cc.Node)
    leftFireworkContainer: cc.Node = null;
    @property(cc.Node)
    rightFireworkContainer: cc.Node = null;
    @property(cc.Node)
    nextLevelButton: cc.Node = null
    @property(cc.Node)
    completeDlg: cc.Node = null;
    
    @property(cc.Prefab)
    aniFailPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    aniWinPrefab: cc.Prefab = null;
    
    @property(cc.Label)
    levelText: cc.Label = null;
    @property(cc.Label)
    hintText: cc.Label = null;
    
    leftParticle: cc.Node ;
    rightParticle: cc.Node;
    
    
    public static _ins: GameManager;
    
    public static get instance(): GameManager {
        return this._ins || new GameManager;
    }
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        GameManager._ins = this;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        
        this.nextLevelButton.on('click', this.NextLevel, this);
    }
    
    start () {
        GameManager._ins.loadLevel(this.reachLevel);
    }

    update(dt: number) {
        {
            if(GameConfig.gameState == inGameState.CHECKING)
            {
                this.countValue += dt;
                if(this.countValue > 1)
                {
                    this.countValue = 0;
                    this.timeCheck -= 1;
                    this.updateTimeDisplay()
                }
            }
            else if(GameConfig.gameState == inGameState.FAILED)
            {
                GameConfig.gameState = inGameState.NONE;
                Common.instance.node.emit("FailLevelEvent");
            }
        }
    }
    
    updateTimeDisplay()
    {
        this.timeStart.string = this.timeCheck + "";
        if(this.timeCheck == 0)
        {
            if(!this.lineMgr.isMeetTargetLevel)
            {
                this.timeStart.node.active = false;
                GameConfig.gameState = inGameState.COMPLETED;
                Common._ins.node.emit("PassLevelEvent");
            }else
            {
                GameConfig.gameState = inGameState.FAILED;
            }
        }
    }
    
    startCounting(timeCheck: number)
    {
        this.timeCheck = timeCheck;
        this.timeStart.node.active = true;
        this.updateTimeDisplay();
    }
    private NextLevel() {
        GameConfig.sessionNumber += 1;
        this.loadLevel(this.reachLevel + 1);
        this.completeDlg.active = false;
    }
    onCompleteAni()
    {
        SoundManager.instance.PlayDoneLevel();
        this.scheduleOnce(function() 
        {
            this.leftParticle = cc.instantiate(this.leftParticlePrefabs);
            this.rightParticle = cc.instantiate(this.rightParticlePrefabs)
            this.rightParticle.parent = this.rightFireworkContainer;
            this.leftParticle.parent = this.leftFireworkContainer;
            this.leftParticle.position = cc.Vec2.ZERO;
            this.rightParticle.position = cc.Vec2.ZERO;
        },0.2);

        this.scheduleOnce(function()
        {
            if(this.leftParticle !== null || this.rightParticle !== null)
            {
                this.leftParticle.destroy();
                this.rightParticle.destroy();
            }
        },2.2)
    }

    onCompleteLevel()
    {
        this.onCompleteAni()
        this.scheduleOnce(function()
        {
            // if(this.reachLevel < this.maxLevel)
            // {
                this.timeStart.node.active = false;
                this.completeDlg.active = true;
            // }
        },3)
    }

    loadLevel(levelNum: number)
    {
        let self = this;
        if (levelNum >= 300) return;
        let LevelIndex = levelNum > 200 ? GameConfig.LevelOrder[levelNum - 200] : levelNum;
        cc.resources.load(`LevelPrefab/Level${LevelIndex}`, function(err , prefab: cc.Prefab)
        {
            if(err)
            {
                self.loadLevel(LevelIndex + 1);
            }
            else{
                GameManager.instance.onCheckingLevel(prefab,LevelIndex);
            }
        })
    }
    onCheckingLevel(prefab: cc.Prefab, levelId: number)
    {
        this.reachLevel = levelId;
        this.levelText.string = "LEVEL" +`${levelId}`;
        let levelNode = cc.instantiate(prefab);
        levelNode.name = `LEVEL${levelId}`;
        if(this.lineMgr != null)
        {
            cc.resources.release(`LevelPrefab/Level${this.reachLevel-1}`);
            this.lineMgr.node.destroy();
        }
        this.lineMgr = levelNode.getComponent(LineManager);
        this.toggleWallNode.active = this.lineMgr.isToggleOnWall;
        this.levelContainer.addChild(levelNode);
        levelNode.setPosition(0,0,0);
        this.hintText.string = this.lineMgr.hintText;
        GameConfig.gameState = inGameState.PLAYING;
    }

    restartLevel() {
        let self = this;
        this.timeStart.node.active = false;
        GameManager.instance.loadLevel(self.reachLevel);
    }

}
