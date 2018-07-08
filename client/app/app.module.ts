import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { WebStorageModule } from 'ngx-store';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';
import { MainPageModule } from './pages/main/main-page.module';
import { AdminPageModule } from './pages/admin/admin-page.module';
import { NotFoundPageModule } from './pages/not-found/not-found-page.module';
import { BackendService } from './services/backend/backend.service';

@NgModule({
    imports: [
        BrowserModule,
        WebStorageModule,
        ComponentsModule,
        RouterModule.forRoot(appRoutes, {enableTracing: true}),
        MainPageModule,
        AdminPageModule,
        NotFoundPageModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        {provide: BackendService, useClass: BackendService},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
