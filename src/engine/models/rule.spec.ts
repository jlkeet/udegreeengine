import { Course, Result } from '../index';
import { RuleOne, RuleTwo, RuleThree, RuleFour, RuleFive, RuleSix, RuleSeven } from '../index';
import { Rule } from './rule';

describe('Rule', () => {

    it('createRule, type 1, creates RuleOne', () => {
        let rule = Rule.createRule({ type: 1 });
        expect(rule instanceof RuleOne).toBe(true);
    });

    it('createRule, type 2, creates RuleTwo', () => {
        let rule = Rule.createRule({ type: 2 });
        expect(rule instanceof RuleTwo).toBe(true);
    });

    it('createRule, type 3, creates RuleThree', () => {
        let rule = Rule.createRule({ type: 3 });
        expect(rule instanceof RuleThree).toBe(true);
    });

    it('createRule, type 4, creates RuleFour', () => {
        let rule = Rule.createRule({ type: 4 });
        expect(rule instanceof RuleFour).toBe(true);
    });

    it('createRule, type 5, creates RuleFive', () => {
        let rule = Rule.createRule({ type: 5 });
        expect(rule instanceof RuleFive).toBe(true);
    });

    it('createRule, type 6, creates RuleSix', () => {
        let rule = Rule.createRule({ type: 6 });
        expect(rule instanceof RuleSix).toBe(true);
    });

    it('createRule, type 7, creates RuleSeven', () => {
        let rule = Rule.createRule({ type: 7 });
        expect(rule instanceof RuleSeven).toBe(true);
    });                        

});
