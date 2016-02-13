/// <reference path="../../typings/main.d.ts" />

import {Component} from 'angular2/core';

import {
    RouteConfig,
    RouterOutlet,
    RouterLink,
    Route,
    AsyncRoute
} from 'angular2/router';

import {Page1} from './components/page1';

@Component({
    selector: 'app',
    template: `
        <h1>Demo</h1>
        <nav>
            <a [routerLink]="['Page1']">Page1</a>
            <a [routerLink]="['Page2']">Page2</a>
        </nav>
        <hr/>
        <router-outlet></router-outlet>
    `,
    directives: [
        RouterOutlet,
        RouterLink,
        Page1
    ]
})
@RouteConfig([
    new Route({path: '/page1', name: 'Page1', component: Page1, useAsDefault: true}),
    new AsyncRoute({
        path: '/page2',
        name: 'Page2',
        loader: () => System.import('app/components/page2').then(m=> m.Page2)
    })
])
export class AppComponent {
}
