import {Directive, HostListener} from 'angular2/core';
@Directive({
    selector: '[shadowDirective]'
})
export class DirectiveExample {

    @HostListener('mouseenter', ['$event.target'])
    onMouseEnter(el:HTMLElement) {
        el.style.boxShadow = '5px 5px 15px 0px rgba(0,0,0,0.5)';
    }

    @HostListener('mouseleave', ['$event.target'])
    onMouseLeave(el:HTMLElement) {
        el.style.boxShadow = '';
    }
}