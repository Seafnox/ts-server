import { NgModule } from '@angular/core';
import { SideCategoriesComponent } from './side-categories.component';
import { MatButtonModule, MatSidenavModule } from '@angular/material';

@NgModule({
    imports: [
        MatSidenavModule,
        MatButtonModule,
    ],
    declarations: [SideCategoriesComponent],
    exports: [
        MatSidenavModule,
        MatButtonModule,
        SideCategoriesComponent,
    ],
})
export class SideCategoriesModule {}
