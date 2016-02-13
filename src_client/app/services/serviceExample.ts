import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Injectable} from 'angular2/core';
import 'rxjs/Rx';

@Injectable()
export class GithubService {
    constructor(private _http:Http) {
    }

    getPublicRepos() {
        return this._http
            .get('https://api.github.com/repositories')
            .map(res => res.json());
    }

    private handleError(error:Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}