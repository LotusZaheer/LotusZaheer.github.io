import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { animateNameRewrite } from '../../shared/functions/utils';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
    nameA = '@LotusZaheer';
    nameB = 'Andrés Uribe';
    displayName = ''; //intercambiar por home.name
    private currentName = '';
    private targetName = '';
    private blinkChar = '■';

    constructor(private translateService: TranslateService) { }

    ngOnInit() {
        this.currentName = this.nameA;
        this.targetName = this.nameB;
        this.displayName = this.currentName;
        this.runAnimation();
    }

    runAnimation() {
        animateNameRewrite(
            this.currentName,
            this.targetName,
            this.blinkChar,
            text => this.displayName = text,
            () => {
                this.currentName = this.targetName;
                this.targetName = this.currentName === this.nameA ? this.nameB : this.nameA;
                setTimeout(() => this.runAnimation(), 5000);
            }
        );
    }

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    downloadCV() {
        const currentLanguage = this.translateService.currentLang || this.translateService.defaultLang || 'es';
        const fileName = currentLanguage === 'en' ? 'ENG_HV_Andres_Uribe_Garcia.pdf' : 'ESP_HV_Andres_Uribe_Garcia.pdf';
        const pdfPath = `assets/pdf/${fileName}`;

        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
} 