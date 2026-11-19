import { Component, OnDestroy } from '@angular/core';
import { ScrollService } from '../services/scroll.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { cvUrl } from '../../data/portfolio';
import { LotusComponent } from '../lotus/lotus.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule, LotusComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnDestroy {
  mobileMenuOpen = false;
  activeSection = 'about';
  private subscription: Subscription;
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
