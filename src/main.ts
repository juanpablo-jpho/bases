import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, initializeFirestore, persistentLocalCache, provideFirestore } from '@angular/fire/firestore';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FileSaverModule } from 'ngx-filesaver';
import { ScreenTrackingService, getAnalytics, provideAnalytics, UserTrackingService } from '@angular/fire/analytics';
import { Capacitor } from '@capacitor/core';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    FileSaverModule,

    // firebase
    importProvidersFrom(provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig);
      if (Capacitor.isNativePlatform()) {
        initializeFirestore(app, {
          localCache: persistentLocalCache(),
        });
        initializeAuth(app, {
          persistence: indexedDBLocalPersistence
        });
      }
      return app;
    })),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAuth(() => getAuth())),   
    importProvidersFrom(provideFunctions(() => getFunctions())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideAnalytics(() => getAnalytics() )),
    ScreenTrackingService,
    UserTrackingService

  ],
  
});
