/// <reference path="../../../typings/main.d.ts" />

import {Component} from 'angular2/core';
import {GithubService} from '../services/serviceExample';

@Component({
    selector: 'page2',
    styles: [
        '.selected { font-weight: bold; }',
        'ul li { float: left; cursor: pointer; }'
    ],
    providers: [GithubService],
    template: `
        <h2>Page 2</h2>
        <h3 *ngIf="_data.length == 0">Loading latest public GitHub repositories</h3>
        <h3 *ngIf="_data.length > 0">Latest {{_data.length}} public GitHub repositories</h3>
        <div *ngFor="#item of _pagedData">
            <b>{{item.name}}</b> by {{item.owner.login}} (<a href="{{item.html_url}}" target="_blank">Link</a>)
        </div>
        <ul>
            <li *ngFor="#page of _pagingData, #index = index" [ngClass]="{ selected: _page == index }" (click)="_applyPaging(index)"> [ {{index}} ] </li>
        </ul>
    `
})
export class Page2 {

    private _data:Array<Object> = [];
    private _pagedData:Array<Object> = [];
    private _page:number = 0;
    private _perPage:number = 10;
    private _pagingData:Array<any> = [];


    private _applyPaging(pageNum:number) {
        this._page = pageNum;
        this._pagedData = this._data.slice(this._page * this._perPage, (this._page + 1) * this._perPage);
    }

    constructor(private _githubService:GithubService) {
        this._githubService.getPublicRepos().subscribe(
            data => {
                this._data = data;
                this._pagingData = Array(Math.ceil(this._data.length / this._perPage));
                this._applyPaging(0);
            },
            error => {
                console.log(error);
            }
        );
    }
}