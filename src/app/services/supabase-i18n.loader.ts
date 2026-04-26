import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class SupabaseTranslationLoader implements TranslateLoader {
    constructor(private i18n: I18nService) { }

    getTranslation(lang: string): Observable<any> {
        return this.i18n.getTranslations(lang).pipe(
            map(flat => this.unflatten(flat))
        );
    }

    private unflatten(data: { [key: string]: string }): any {
        const result: any = {};
        for (const i in data) {
            const keys = i.split('.');
            keys.reduce((acc, cur, j) => {
                return acc[cur] || (acc[cur] = (keys[j + 1] === undefined ? data[i] : {}));
            }, result);
        }
        return result;
    }
}
