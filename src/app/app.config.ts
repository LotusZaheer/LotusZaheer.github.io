import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SupabaseTranslationLoader } from './services/supabase-i18n.loader';
import { SupabaseService } from './services/supabase.service';
import { provideMarkdown } from 'ngx-markdown';

// Factory replaced by direct class provider pattern or factory with deps
// Since SupabaseTranslationLoader is Injectable, we can likely use:
export function SupabaseLoaderFactory(supabase: SupabaseService) {
  return new SupabaseTranslationLoader(supabase);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideMarkdown(),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: SupabaseTranslationLoader
        }
      })
    )
  ]
};
