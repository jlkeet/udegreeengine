import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleOne extends Rule {

    evaluate(courses: ICourse[]): Result {
        let requiredCoures = this.courses;
        // for this rule type, courses must have ALL courses from required
        let missing = requiredCoures.filter(function (req_code) {
            return !courses.find((c) => { return c.code == req_code });
        });
        if (missing.length > 0) {
            return new Result([`(1) must select all of [ ${requiredCoures} ]`]);
        }
        return new Result([]);
    }
}