import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { WebStorageModule } from 'ngx-store';

@NgModule({
    imports: [
        BrowserModule,
        WebStorageModule,
        ComponentsModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
