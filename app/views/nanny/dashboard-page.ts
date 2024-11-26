import { NavigatedData, Page } from '@nativescript/core';
import { NannyDashboardViewModel } from './dashboard-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new NannyDashboardViewModel();
}