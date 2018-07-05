import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
} from '@angular/material';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { ButtonComponent } from './button/button.component';
import { ImageCollectionComponent } from './image-collection/image-collection.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const EXTENTIONS = [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
];

const DECLARATIONS = [
    InputComponent,
    TextareaComponent,
    LoginBoxComponent,
    ButtonComponent,
    ImageCollectionComponent,
    ImageViewerComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ...EXTENTIONS,
    ],
    declarations: [
        ...DECLARATIONS,
    ],
    exports: [
        ...DECLARATIONS,
        ...EXTENTIONS,
    ],
})
export class ComponentsModule { }
