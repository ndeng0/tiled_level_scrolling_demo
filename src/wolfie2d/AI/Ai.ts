export abstract class AI {

    private behavior : String;

    public constructor(initstate : String) {
        this.behavior = initstate;
    }

    public getBehavior() : String {
        return this.behavior;
    }

    public setBehavior(behavior : String) : void {
        this.behavior = behavior;
    }

    public abstract move() : void;
}