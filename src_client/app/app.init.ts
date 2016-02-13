import {bootstrap}    from 'angular2/platform/browser'
import {ROUTER_PROVIDERS,LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {enableProdMode, provide} from "angular2/core";
import {AppComponent} from './app.component'

// GULP: Enable/Disable Production Mode

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);