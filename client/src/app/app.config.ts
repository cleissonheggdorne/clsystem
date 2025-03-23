import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { 
  AvatarModule, 
  BadgeModule, 
  BreadcrumbModule, 
  ButtonGroupModule, 
  ButtonModule, 
  CardModule, 
  DropdownModule, 
  FooterModule, 
  FormModule, 
  GridModule, 
  HeaderModule, 
  ListGroupModule, 
  NavModule, 
  ProgressModule, 
  SharedModule, 
  SidebarModule, 
  TabsModule, 
  UtilitiesModule,
} from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(
      AvatarModule,
      BadgeModule,
      BreadcrumbModule,
      ButtonGroupModule,
      ButtonModule,
      CardModule,
      DropdownModule,
      FooterModule,
      FormModule,
      GridModule,
      HeaderModule,
      ListGroupModule,
      NavModule,
      ProgressModule,
      SharedModule,
      SidebarModule,
      TabsModule,
      UtilitiesModule
    ),
    IconSetService
  ]
};
