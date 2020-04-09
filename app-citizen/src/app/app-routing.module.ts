import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main/main.component';

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
        path: 'welcome',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./welcome/welcome.module').then(m => m.WelcomeModule)
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
        component: MainComponent,
        children: [
            {
                path: 'home',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/home/home.module').then(m => m.HomeModule)
                    }
                ]
            },
            {
                path: 'autotest/:level/:question_id',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/autotest/autotest.module').then(m => m.AutotestModule)
                    }
                ]
            },
            {
                path: 'autotest',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/autotest/autotest.module').then(m => m.AutotestModule)
                    }
                ]
            },
            {
                path: 'request-leave-home',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/request-leave-home/request-leave-home.module').then(m => m.RequestLeaveHomeModule)
                    }
                ]
            },
            {
                path: 'leave-custom-reason-form',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/leave-custom-reason-form/leave-custom-reason-form.module').then(m => m.LeaveCustomReasonFormModule)
                    }
                ]
            },
            {
                path: 'leave-request-result',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/leave-requet-result/leave-request-result.module').then(m => m.LeaveRequestResultModule)
                    }
                ]
            },
            {
                path: 'my-info',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/patient-info/patient-info.module').then(m => m.PatientInfoModule)
                    }
                ]
            },
            {
                path: 'test-appointment/:appointment-type/confirm',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/test-appointment/confirm-test-appointment/confirm-test-appointment.module').then(m => m.ConfirmTestAppointmentModule)
                    }
                ]
            },
            {
                path: 'test-appointment/:appointment-type/request',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/test-appointment/request-test-appointment/request-test-appointment.module').then(m => m.RequestTestAppointmentModule)
                    }
                ]
            },
            {
                path: 'test-appointment/at-home/result',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/test-appointment/appointment-at-home/appointment-at-home.module').then(m => m.AppointmentAtHomeModule)
                    }
                ]
            },
            {
                path: 'test-appointment/at-health-center/result',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./main/test-appointment/appointment-health-center/appointment-health-center.module').then(m => m.AppointmentHealthCenterModule)
                    }
                ]
            }
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
