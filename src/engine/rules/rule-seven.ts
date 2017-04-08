import { ICourse, Result } from '../index';
import { Rule } from '../models/rule';

export class RuleSeven extends Rule {

    evaluate(courses: ICourse[]): Result {
        let corequisites= this.corequisites;
        let course = this.course;
        let plannedCourse = courses.find(c => { return c.code == course });
        //only proceed if this clourse planned
        if (plannedCourse !== undefined) {
        let plannedSemester = plannedCourse.semester;

        let coReqsPlannedInSameSemester = corequisites.filter(function (req_code) {
            return courses.find((c) => {
            return c.code == req_code && c.semester === plannedSemester
            });
        });

        if (coReqsPlannedInSameSemester.length === 0) {
            return new Result([`(7) must select AT least on of [ ${corequisites} ] in semsester ${plannedSemester}`]);
        }
        }
        return new Result([]);
    }
}