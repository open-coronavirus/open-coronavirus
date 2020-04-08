import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AppContainerComponent} from './app-container/app-container.component';
import { DiagnosticSendResultModule } from './app-container/diagnostic-send-result/diagnostic-send-result.module';

const routes: Routes = [
    {
      path: 'splash',
      children: [
        {
          path: '',
          loadChildren: () =>
              import('./splash/splash.module').then(m => m.SplashModule)
        }
      ]
    },
    {
        path: 'login',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./login/login.module').then(m => m.LoginModule)
            }
        ]
    },
    {
        path: 'app',
        component: AppContainerComponent,
        children: [
            {
                path: 'diagnostic-send',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/diagnostic-send/diagnostic-send.module').then(m => m.DiagnosticSendModule)
                    }
                ]
            },
            {
                path: 'diagnostic-send-result',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/diagnostic-send-result/diagnostic-send-result.module').then(m => m.DiagnosticSendResultModule)
                    }
                ]
            },
            {
                path: 'my-info',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/user-info/user-info.module').then(m => m.UserInfoModule)
                    }
                ]
            },
        ]
    },
    {
      path: '',
      redirectTo: '/splash',
      pathMatch: 'full'
    }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
