import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { ICourse } from '../models/course';
import { ISubject, Subject } from '../models/subject';
import { Rule, Result, IRule } from '../models/rule';
import { Degree } from '../models/degree';
import { IFaculty, Faculty } from '../models/faculty';

@Injectable()
export class InitService {

    private readonly COURSES = '/courses';
    private readonly SUBJECTS = '/subjects';
    private readonly FACULTIES = '/faculties';
    private readonly DEGREES = '/degrees';
    private readonly RULES = '/rules';

    constructor(private af: AngularFire) {
        //this.populateDegrees();
        //this.populateRules();
    }

    populateDegrees() {
        let degrees = this.af.database.list(this.DEGREES);
        degrees.remove().then(() => {

            degrees.push({ name: 'Bachelor of Architectural Studies', code: 'B1' });
            degrees.push({ name: 'Bachelor of Arts', code: 'B1' });

        });
    }
    populateRules() {
        let rules = this.af.database.list(this.RULES);
        rules.remove().then(() => {

            rules.push({ degree: 'B1', ruleid: 'B11', type: 1, courses: ['ARCHDES 100',  'ARCHDES 101']  });
            rules.push({ degree: 'B1', ruleid: 'B12', type: 1, courses: ['ARCHDES 200', 'ARCHDRC 202', 'ARCHTECH 207', 'ARCHHTC 235', 'ARCHDES 201', 'ARCHTECH 208', 'ARCHHTC 236']  });
            rules.push({ degree: 'B1', ruleid: 'B13', type: 1, courses: ['ARCHDES 300', 'ARCHHTC 340', 'ARCHTECH 307', 'ARCHDES 301', 'ARCHHTC 339', 'ARCHTECH 312', 'ARCHPRM 304']  });
            rules.push({ degree: 'B1', ruleid: 'B14', type: 2, courses: ['ARCHDRC 300','ARCHDRC 301','ARCHDRC 302','ARCHDRC 303','ARCHDRC 304','ARCHDRC 370','ARCHDRC 371','ARCHDRC 372','ARCHDRC 373']  });
            rules.push({ degree: 'B1', ruleid: 'B15', type: 3, courses: ['ARCHDES 200',  'ARCHTECH 207', 'ARCHTECH 208'], credits: 30  });
            rules.push({ degree: 'B1', ruleid: 'B16', type: 4, groups: [['ARCHDES 200',  'ARCHTECH 207'], ['ARCHTECH 208', 'ARCHDRC 302'], ['ARCHHTC 235', 'ARCHDES 201']], credits: 15  });

        });
    }    
}


