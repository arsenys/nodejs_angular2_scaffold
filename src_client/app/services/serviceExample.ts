import {Http} from 'angular2/http';
import {Injectable} from 'angular2/core';
import 'rxjs/Rx';

/* @Injectable marks a class as available to Injector for creation. Without it this service class
 * would be not injectable into components
 */
@Injectable()
export class GithubService {

    /* Http service is injected because it's defined in bootstraps list of global providers */
    constructor(private _http:Http) {
    }

    getPublicRepos() {
        return this._http
            .get('https://api.github.com/repositories')
            .map(res => res.json());
    }
}