import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleThree extends Rule {

    evaluate(courses: ICourse[]): Result {
        let requiredCoures = this.courses;
        let creditsRequired = this.credits;
        // for this rule type, courses must have ALL courses from required
        let creditsPlanned = 0;
        let found = courses.forEach(function (course) {
        if(requiredCoures.find( r => { return r == course.code }))
        {
            creditsPlanned += course.credits;
        }
        });
        
        if (creditsPlanned <  creditsRequired) {
        return new Result([`(3) must select ${creditsRequired} credits from` + requiredCoures.toString()]);
        }
        return new Result([]);
    }
}