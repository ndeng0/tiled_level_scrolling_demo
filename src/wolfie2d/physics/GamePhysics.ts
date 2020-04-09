import {SceneGraph} from '../scene/SceneGraph'
import { AnimatedSprite } from '../scene/sprite/AnimatedSprite';
import { SceneObject } from '../scene/SceneObject';

export class GamePhysics {

    private player : AnimatedSprite;

    constructor() {

        this.player = null;

    }

    update(sceneGraph : SceneGraph) : void {
        // UPDATE ALL OBJECT POSITIONS ACCORDING TO THEIR VELOCITIES
        // BUT MAKE SURE TO PERFORM COLLISION DETECTION AS WELL
        // NOTE, FOR THIS YOU SHOULD MAKE SURE EACH SCENE OBJECT
        // HAS A BOUNDING VOLUME LIKE EITHER AN AABB OR A CIRCLE

        for (let sprite of sceneGraph.getAnimatedSpites()) {
            if(sprite.getType() == "ANT") {
                this.player = sprite;
            }
        }

        let left : number= this.player.getPosition().getX();
        let right : number = this.player.getPosition().getX() + this.player.getSpriteType().getSpriteWidth();
        let top : number = this.player.getPosition().getY();
        let bottom : number = this.player.getPosition().getY() + this.player.getSpriteType().getSpriteHeight();

        let arr = sceneGraph.getAnimatedSpites();

        for (let index=0; index < sceneGraph.getNumSprites() - 1; index++) {
            if (arr[index].getType() == "DENKIMUSHI2") {
                if (arr[index].contains(left, top) || 
                    arr[index].contains(right, top) ||
                    arr[index].contains(left, bottom) ||
                    arr[index].contains(right, bottom)) {
                        sceneGraph.removeAnimatedSprite(index);
                    }
            }
        }
    }
}