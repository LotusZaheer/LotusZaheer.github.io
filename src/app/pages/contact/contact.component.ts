import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { contactMethods } from '../../data/contact-methods.data';
import { countries, Country } from '../../data/countries.data';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
    @ViewChild('searchBox') searchBox?: ElementRef;

    contactMethods = contactMethods;
    allCountries = countries;
    filteredCountries = countries;
    selectedCountry: Country = countries[0];
    isDropdownOpen = false;
    searchQuery = '';
    contactForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private http: HttpClient
    ) {
        this.contactForm = this.fb.group({
            nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
            empresa: [''],
            email: ['', [Validators.required, Validators.email]],
            prefijoPais: [this.selectedCountry.code, Validators.required],
            telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            mensaje: ['', [Validators.required, Validators.maxLength(500)]],
            aceptoPolitica: [false, Validators.requiredTrue]
        });
    }

    ngOnInit() {
        this.translate.setDefaultLang('es');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang?.match(/es|en/) ? browserLang : 'es');
        this.detectCountry();
    }

    detectCountry() {
        this.http.get<any>('https://ipapi.co/json/').subscribe({
            next: (data) => {
                const detected = this.allCountries.find(c =>
                    c.flag.toLowerCase() === data.country_code?.toLowerCase()
                );
                if (detected) {
                    this.selectCountry(detected);
                }
            },
            error: () => console.log('Could not detect country automatically')
        });
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        if (this.isDropdownOpen) {
            this.searchQuery = '';
            this.filteredCountries = this.allCountries;
            setTimeout(() => this.searchBox?.nativeElement.focus(), 100);
        }
    }

    filterCountries() {
        const query = this.searchQuery.toLowerCase().trim();
        if (!query) {
            this.filteredCountries = this.allCountries;
            return;
        }

        this.filteredCountries = this.allCountries.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.code.includes(query)
        );
    }

    selectCountry(country: Country) {
        this.selectedCountry = country;
        this.contactForm.patchValue({ prefijoPais: country.code });
        this.isDropdownOpen = false;
    }

    onSubmit() {
        if (this.contactForm.valid) {
            console.log('Form data:', this.contactForm.value);
        }
    }
}
