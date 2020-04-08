import {SceneObject} from '../SceneObject'
import {AnimatedSpriteType} from './AnimatedSpriteType'
import { Vector3 } from '../../math/Vector3';
import { Viewport } from '../Viewport';

export class AnimatedSprite extends SceneObject {
    private spriteType : AnimatedSpriteType;
    private type : string;
    private state : string;
    private animationFrameIndex : number;
    private frameCounter : number;

    private movetime : number = 0;
    private randomInterval : number = Math.floor(Math.random() * 60);
    private direction : number;
    private initPosition : number;
    private newPosition : number;
    
    public constructor(initSpriteType : AnimatedSpriteType, initState : string, type : string) {
        super();
        this.spriteType = initSpriteType;
        this.type = type;
        
        // START RESET
        this.state = initState;
        this.animationFrameIndex = 0;
        this.frameCounter = 0;
    }

    public getAnimationFrameIndex() : number {
        return this.animationFrameIndex;
    }

    public getFrameCounter() : number {
        return this.frameCounter;
    }

    public getSpriteType() : AnimatedSpriteType {
        return this.spriteType;
    }

    public getType() : string {
        return this.type;
    }

    public getDirection() : number {
        return this.direction;
    }

    public getState() : string {
        return this.state;
    }
    
    public setState(initState : string) : void {
        this.state = initState;
        this.animationFrameIndex = 0;
        this.frameCounter = 0;
    }
    
    public update(delta : number) : void {
        this.frameCounter++;
        
        // HAVE WE GONE PAST THE LAST FRAME IN THE ANIMATION?
        var currentAnimation = this.spriteType.getAnimation(this.state);
        var currentFrame = currentAnimation[this.animationFrameIndex];
        if (this.frameCounter > (currentFrame.duration)) {
            this.animationFrameIndex++;
            if (this.animationFrameIndex >= currentAnimation.length) {
                this.animationFrameIndex = 0;
            }
            this.frameCounter = 0;
        }
    }

    public denkimushiAI() : void {
        let SPEED : number = 10;
        this.movetime++;

        if(this.movetime > this.randomInterval) {
            this.movetime = 0;
            this.randomInterval = Math.floor(Math.random() * 20);
            this.direction = Math.floor(Math.random() * 5);
        }

        // Stay Still
        if(this.direction == 0) {
            this.setState("IDLE");
        }
        // Move Up
        else if(this.direction == 1 && this.getPosition().getY() > 0) {
            this.setState("WALK");
            this.getPosition().set(this.getPosition().getX(), this.getPosition().getY() - SPEED, 0, 1);
        }
        // Move Right
        else if(this.direction == 2 && this.getPosition().getX() + this.getSpriteType().getSpriteWidth() < 3200) {
            this.setState("WALK");
            this.getPosition().set(this.getPosition().getX() + SPEED, this.getPosition().getY(), 0, 1);
        }
        // Move Down
        else if(this.direction == 3 && this.getPosition().getY() + this.getSpriteType().getSpriteHeight() < 3200) {
            this.setState("WALK");
            this.getPosition().set(this.getPosition().getX(), this.getPosition().getY() + SPEED, 0, 1);
        }
        // Move Left
        else if(this.direction == 4 && this.getPosition().getX() > 0) {
            this.setState("WALK");
            this.getPosition().set(this.getPosition().getX() - SPEED, this.getPosition().getY(), 0, 1);
        }
    }

    public ladybugAI() : void {
        let SPEED : number = 1;
        this.movetime++;

        if(this.direction == null) {
            this.direction = Math.random() <= 0.5 ? -1 : 1;
        }

        if(this.movetime > this.randomInterval + 100) {
            this.movetime = 0;
            this.direction = this.direction * -1;
        }

        // Stay Still
        if(this.direction == 0) {
            this.setState("IDLE");
        }
        // Move Right
        else if(this.direction == 1 && this.getPosition().getX() + this.getSpriteType().getSpriteWidth() < 3200) {
            this.setState("WALKING");
            this.getPosition().set(this.getPosition().getX() + SPEED, this.getPosition().getY(), 0, 1);
        }
        // Move Left
        else if(this.direction == -1 && this.getPosition().getX() > 0) {
            this.setState("WALKING");
            this.getPosition().set(this.getPosition().getX() - SPEED, this.getPosition().getY(), 0, 1);
        }

    }

    public antAI(viewport : Viewport) : void {
        let player = this;
        
        document.addEventListener("mousemove", function(event : MouseEvent) : void {
            let mouseX : number = event.clientX;
            let mouseY : number = event.clientY;
            
            if(player.getPosition().getX() - viewport.getX() < mouseX) {
                player.getPosition().set(player.getPosition().getX() + 1, player.getPosition().getY(), 0, 1);
            }else if(player.getPosition().getX() - viewport.getX() > mouseX) {
                player.getPosition().set(player.getPosition().getX() - 1, player.getPosition().getY(), 0, 1);
            }
            if(player.getPosition().getY() - viewport.getY() < mouseY) {
                player.getPosition().set(player.getPosition().getX(), player.getPosition().getY() + 1, 0, 1);
            }else if(player.getPosition().getY() - viewport.getY() > mouseY) {
                player.getPosition().set(player.getPosition().getX(), player.getPosition().getY() - 1, 0, 1);
            }
            
        });
    }

    public contains(pointX : number, pointY : number) : boolean {
        let spriteWidth = this.getSpriteType().getSpriteWidth();
        let spriteHeight = this.getSpriteType().getSpriteHeight();
        let spriteLeft = this.getPosition().getX();
        let spriteRight = this.getPosition().getX() + spriteWidth;
        let spriteTop = this.getPosition().getY();
        let spriteBottom = this.getPosition().getY() + spriteHeight;
        if (    (pointX < spriteLeft)
            ||  (spriteRight < pointX)
            ||  (pointY < spriteTop)
            ||  (spriteBottom < pointY)) {
                return false;
        }
        else {
            return true;
        }
    }
    
    /**RENAME THIS METHOD SO IT DENOTES PIXEL LOCATION IN TEXTURE */
    public getLeft() : number {
        return this.spriteType.getLeft(this.state, this.animationFrameIndex);
    }
    
    public getTop() : number {
        return this.spriteType.getTop(this.state, this.animationFrameIndex);
    }

    public toString() : string {
        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
                            +   "(state: " + this.getState() + ") "
                            +   "(animationFrameIndex: " + this.getAnimationFrameIndex() + ") "
                            +   "(frameCounter: " + this.getFrameCounter() + ") ";
        return summary;
    }
}