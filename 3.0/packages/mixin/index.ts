/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * 一个mixin最佳实践的保存
 */
class Base {
    constructor(...args: any[]) {
        return this;
    }
}

function SpeakMixin<Cls extends typeof Base>(Ctor: Cls) {
    return class extends Ctor {
        speakText = 'speak'
        speak() {
            return this.speakText;
        }
    };
}
class Speak extends SpeakMixin(Base) {}

function RunMixin<Cls extends typeof Base>(Ctor: Cls) {
    return class extends Ctor {
        runText = 'runnnnn';
        run() {
            return 'run';
        }
    };
}
class Run extends RunMixin(Base) {}

function HumanMixin<Cls extends typeof Base>(Ctor: Cls) {
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
class Human extends HumanMixin(Base) {}

const trump = new Human('trump');
console.log(trump.run());
console.log(trump.speak());
console.log(trump.yeah());
console.log(trump.speakText);
console.log(trump.runText);


function withGeneric<T extends String, Cls extends typeof Base>(Ctor: Cls) {
    return class extends Ctor {
        text?: T = undefined
        one() {
            console.log(this.text);
        }
        two() {
            this.one();
        }
    };
}

function withGeneric2<T extends String, Cls extends typeof Base>(Ctor: Cls) {
    return class extends withGeneric<T, Cls>(Ctor) {
        text2?: T = undefined
        one() {
            super.one()
            console.log(this.text2);
        }
    };
}

const generic = new (withGeneric2<string, typeof Base>(Base));
generic.text = '123'
generic.text2 = '456'
generic.two();
