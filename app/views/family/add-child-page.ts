import { NavigatedData, Page } from '@nativescript/core';
import { AddChildViewModel } from './add-child-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new AddChildViewModel();
}