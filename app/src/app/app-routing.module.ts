import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AppContainerComponent} from './app-container/app-container.component';

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
        path: 'register',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./register/register.module').then(m => m.RegisterModule)
            }
        ]
    },
    {
        path: 'no-access',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./no-access/no-access.module').then(m => m.NoAccessModule)
            }
        ]
    },
    {
        path: 'app',
        component: AppContainerComponent,
        children: [
            {
                path: 'home',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/home/home.module').then(m => m.HomeModule)
                    }
                ]
            },
            {
                path: 'autotest/:question_id',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/autotest/autotest.module').then(m => m.AutotestModule)
                    }
                ]
            },
            {
                path: 'autotest',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/autotest/autotest.module').then(m => m.AutotestModule)
                    }
                ]
            },
            {
                path: 'request-leave-home',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/request-leave-home/request-leave-home.module').then(m => m.RequestLeaveHomeModule)
                    }
                ]
            },
            {
                path: 'leave-custom-reason-form',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/leave-custom-reason-form/leave-custom-reason-form.module').then(m => m.LeaveCustomReasonFormModule)
                    }
                ]
            },
            {
                path: 'leave-request-result',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/leave-requet-result/leave-request-result.module').then(m => m.LeaveRequestResultModule)
                    }
                ]
            },
            {
                path: 'my-info',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/patient-info/patient-info.module').then(m => m.PatientInfoModule)
                    }
                ]
            },
            {
                path: 'request-test',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./app-container/request-test/request-test.module').then(m => m.RequestTestModule)
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
