import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleFive extends Rule {

    evaluate(courses: ICourse[]): Result {
        let course = this.course;
        let prereqs = this.preerqs;
        // for this rule type, courses must have ALL courses from prereqs in semesters earlier than course
        let plannedCourse = courses.find(c => { return c.code == course });

        //only proceed if this clourse planned
        if (plannedCourse !== undefined) {
            let plannedSemester = plannedCourse.semester;

            let missing = prereqs.filter(function (req_code) {
                return !courses.find((c) => {
                    return c.code == req_code && c.semester < plannedSemester
                });
            });
            if (missing.length > 0) {
                return new Result([`(5) must select all of [ ${prereqs} ] before semester ${plannedSemester}`]);
            }
        }
        return new Result([]);
    }
}
