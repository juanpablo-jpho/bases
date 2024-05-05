import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Platform } from '@ionic/angular/standalone';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analytics: Analytics = inject(Analytics);
  authenticationService: AuthenticationService = inject(AuthenticationService);
  userService: UserService = inject(UserService);

  constructor(private platform: Platform) {
    this.init();
  }

  private init() {
    setTimeout( async () => {
      this.registerEvent('session_start')
    }, 3000);
  }

  async registerEvent(event: EventListAnalytics, parametros: any = {}) {
    const roles = await this.userService.getRol()
    parametros.rol = roles?.admin ? 'admin' : 'ciente';
    parametros.platform = this.getPlatform();
    logEvent(this.analytics, event, parametros);
  }

  private getPlatform() {
      if (this.platform.is('capacitor')) {
        if (this.platform.is('android') ) {
          return 'app-android';
        }
        if (this.platform.is('ios') ) {
          return 'app-ios';
        }
      }
      if (this.platform.is('desktop')) {
        return 'desktop';
      }
      if (this.platform.is('mobileweb')) {
        if (this.platform.is('android') ) {
          return 'web-android';
        }
        if (this.platform.is('ios') ) {
          return 'web-ios';
        }
      }
      return 'otra';
  }

}

type EventListAnalytics = 'add_item' | 'session_start'
