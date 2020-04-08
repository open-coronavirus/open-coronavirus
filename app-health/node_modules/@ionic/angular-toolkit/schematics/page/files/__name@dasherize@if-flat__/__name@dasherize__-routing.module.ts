import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { <%= classify(name) %>Page } from './<%= dasherize(name) %>.page';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(name) %>Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class <%= classify(name) %>PageRoutingModule {}
