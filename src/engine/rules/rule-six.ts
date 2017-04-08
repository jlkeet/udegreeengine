import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleSix extends Rule {

    evaluate(courses: ICourse[]): Result {
        let restrictions = this.restrictions;
        // for this rule type, courses must NOT have ANY of courses from restrictions

        let found = restrictions.filter(function (req_code) {
            return courses.find((c) => {
                return c.code == req_code
            });
        });
        if (found.length > 0) {
            return new Result([`(6) must NOT select ANY of [ ${restrictions} ]`]);
        }
        return new Result([]);
    }
}