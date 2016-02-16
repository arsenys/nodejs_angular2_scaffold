import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    /* Defines name of pipe to be used in component's template */
    name: 'daysSince'
})
export class DaysSincePipe implements PipeTransform {
    /* The actual transformation method that processes the value on the left from the pipe */
    transform(value:Date):number {
        return Math.ceil(
            (new Date().getTime() - new Date('2016-01-01').getTime()) / 1000 / 60 / 60 / 24
        );
    }
}