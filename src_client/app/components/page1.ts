import {Component} from 'angular2/core';
import {Http} from "angular2/http";
import {DaysSincePipe} from '../pipes/pipeExample';
import {DirectiveExample} from '../directives/directiveExample';
import 'rxjs/Rx';

@Component({
    selector: 'page1',
    pipes: [DaysSincePipe],
    directives: [DirectiveExample],
    template: `
        <h2>Page 1</h2>
        <h3>Pipe example: {{ _dateForPipeExample |  daysSince }} days since the beginning of 2016 </h3>
        <h3>Async pipe example: {{ _promisedValue | async | uppercase }}</h3>
        <br/>
        <h3>Directive example: <span shadowDirective>Hover me...</span></h3>
    `
})
export class Page1 {
    private _dateForPipeExample:Date = new Date('2016-01-01');
    private _promisedValue:Promise<string>;

    constructor(private _http:Http) {
        this._promisedValue = new Promise((resolve, reject) => {
            this._http.get('/api/hello').map(res => res.json()).subscribe((data)=> {
                resolve(data.message);
            });
        });
    }
}