import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    template: ''
})
export abstract class BaseSubscriber implements OnDestroy {
    protected destroy$: Subject<boolean> = new Subject<boolean>();

    constructor() { }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}