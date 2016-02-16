import {bootstrap}    from 'angular2/platform/browser'
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {enableProdMode, provide} from "angular2/core";
import {AppComponent} from './app.component'

/* Do not remove the below comment line. Comment symbols will be removed by build
 * if the gulp.config specifies production mode
 */

// enableProdMode();

/* Bootstrapping root component of the app */
bootstrap(AppComponent,

    /* This array defines root injectors for app, following providers will be injected to all app components */
    [
        /* Provides a basic set of injectables to use the Http service */
        HTTP_PROVIDERS,

        /* Necessary if router is used in app */
        ROUTER_PROVIDERS,

        /* Specifies routing strategy as HashLocationStrategy (hash in URL usage) */
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]
);