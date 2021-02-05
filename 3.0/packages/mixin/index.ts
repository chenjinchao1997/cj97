/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class Base {
    constructor(...args: any[]) {
        return this;
    }
}

export function SpeakMixin<Cls extends typeof Base>(Ctor: Cls) {
    return class extends Ctor {
        speakText = 'speak'
        speak() {
            return this.speakText;
        }
    };
}
export class Speak extends SpeakMixin(Base) {}

export function RunMixin<Cls extends typeof Base>(Ctor: Cls) {
    return class extends Ctor {
        runText = 'runnnnn';
        run() {
            return 'run';
        }
    };
}
export class Run extends RunMixin(Base) {}

export function HumanMixin<Cls extends typeof Base>(Ctor: Cls) {
    return class extends RunMixin(SpeakMixin(Ctor)) {
        name: string;
        constructor(name = '') {
            super();
            this.name = name;
        }
        yeah() {
            return this.speakText + 'China!';
        }
        run() {
            return 'human can\'t run';
        }
    };
}
export class Human extends HumanMixin(Base) {}

const trump = new Human('trump');
console.log(trump.run());
console.log(trump.speak());
console.log(trump.yeah());
console.log(trump.speakText);
console.log(trump.runText);
