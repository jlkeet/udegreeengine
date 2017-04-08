import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleTwo extends Rule {

    evaluate(courses: ICourse[]): Result {
        let requiredCoures = this.courses;
        // for this rule type, courses must have at least one course from required
        let found = requiredCoures.filter(function (req_code) {
        return courses.find((c) => { return c.code == req_code });
        });
        if (found.length === 0) {
        return new Result([`(2) must select one from [${requiredCoures}]`]);
        }
        return new Result([]);
    }
}