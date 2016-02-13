import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'daysSince'})
export class DaysSincePipe implements PipeTransform {
    transform(value: Date) : any {
        return Math.ceil(((new Date().getTime() - new Date('2016-01-01').getTime()) / 1000 / 60 / 60 / 24));
    }
}