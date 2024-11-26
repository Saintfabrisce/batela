import { NavigatedData, Page } from '@nativescript/core';
import { SignupViewModel } from './signup-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new SignupViewModel();
}