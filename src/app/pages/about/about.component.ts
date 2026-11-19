import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { animateNameRewrite } from '../../shared/functions/utils';
import { cvUrl, socialNetworks } from '../../data/portfolio';

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
    socialNetworks = socialNetworks;
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
        const lang = this.translateService.currentLang || this.translateService.defaultLang || 'es';
        window.open(cvUrl[lang] ?? cvUrl['es'], '_blank');
    }
}