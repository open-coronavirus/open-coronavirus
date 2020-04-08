import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [<%= classify(name) %>Component],
  exports: [<%= classify(name) %>Component]
})
export class <%= classify(name) %>ComponentModule {}
