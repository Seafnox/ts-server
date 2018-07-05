import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { WebStorageModule } from 'ngx-store';
import { RouterModule } from '@angular/router';
import { appRouting } from './app.routing';
import { MainPageModule } from './pages/main/main-page.module';
import { AdminPageModule } from './pages/admin/admin-page.module';
import { NotFoundPageModule } from './pages/not-found/not-found-page.module';

@NgModule({
    imports: [
        BrowserModule,
        WebStorageModule,
        ComponentsModule,
        RouterModule.forRoot(appRouting),
        MainPageModule,
        AdminPageModule,
        NotFoundPageModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
