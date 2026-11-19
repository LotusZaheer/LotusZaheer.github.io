import { Component, OnInit, OnDestroy } from '@angular/core';
import { animateNameRewrite } from './../functions/utils';
import { ScrollService } from '../services/scroll.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { cvUrl } from '../../data/portfolio';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  activeSection = 'about';
  private subscription: Subscription;
  displayName = 'Andrés Uribe';
  currentLang: string;

  constructor(private scrollService: ScrollService, private translate: TranslateService) {
    this.subscription = this.scrollService.activeSection$.subscribe(
      section => this.activeSection = section
    );
    this.currentLang = translate.currentLang || 'es';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.activeSection = sectionId;
    }
  }

  downloadCV() {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    window.open(cvUrl[lang] ?? cvUrl['es'], '_blank');
  }

  nameA = 'Andrés Uribe';
  nameB = '@LotusZaheer';
  private currentName = '';
  private targetName = '';
  private blinkChar = '■';

  ngOnInit() {
    this.currentName = this.nameA;
    this.targetName = this.nameB;
    this.runAnimation();
  }

  /////////////////////////////////////////////////////

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

  switchLanguage() {
    const newLang = this.currentLang === 'es' ? 'en' : 'es';
    this.currentLang = newLang;
    this.translate.use(newLang);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
