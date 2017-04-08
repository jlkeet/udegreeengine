import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleFour extends Rule {

    evaluate(courses: ICourse[]): Result {
        let groups = this.groups;
        let creditsRequired = this.credits;

        // for this rule type, must choose at least X credits from 2 of the 3 groups
        let groupOneCredits = courses.filter(function (course) {
            return groups[0].find(g => { return course.code == g });
        }).reduce((a, b) => a + b.credits, 0);

        let groupTwoCredits = courses.filter(function (course) {
            return groups[1].find(g => { return course.code == g });
        }).reduce((a, b) => a + b.credits, 0);

        let groupThreeCredits = courses.filter(function (course) {
            return groups[2].find(g => { return course.code == g });
        }).reduce((a, b) => a + b.credits, 0);

        let totalCreditsRequired = 2 * creditsRequired;
        if (
            groupOneCredits + groupTwoCredits === totalCreditsRequired ||
            groupTwoCredits + groupThreeCredits === totalCreditsRequired ||
            groupOneCredits + groupThreeCredits === totalCreditsRequired
        ) {
            return new Result([]);

        }
        return new Result([`(4) must select ${creditsRequired} credits from two of the following groups` + groups.toString()]);
    }
}