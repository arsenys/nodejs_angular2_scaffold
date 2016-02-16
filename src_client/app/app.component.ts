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
    /* Selector defines which HTML tag will correspond with this component */
    selector: 'app',
    template: `
        <h1>Demo</h1>
        <nav>
            <!-- RouterLink directive generates link to a specific component in the router -->
            <a [routerLink]="['Page1']">Page1</a>
            <a [routerLink]="['Page2']">Page2</a>
        </nav>
        <hr/>
        <!-- Router outlet is where the routing components will be rendered -->
        <router-outlet></router-outlet>
    `,
    /* Directives array contains types of components or directives that are used in this component's template */
    directives: [
        RouterOutlet,
        RouterLink
    ]
})
/*
 * Routing definition. Contains default preloaded route 'Page1' and lazy (on demand) loaded component 'Page2' with
 * all of its dependencies.
 */
@RouteConfig([
    new Route({
        path: '/page1',
        name: 'Page1',
        component: Page1,
        useAsDefault: true
    }),
    new AsyncRoute({
        path: '/page2',
        name: 'Page2',
        loader: () => System.import('app/components/page2').then(m=> m['Page2'])
    })
])
export class AppComponent {
}

