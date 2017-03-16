import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [ 
  //empty - defined in engine
];

@NgModule({
  imports: [
    // Only for all app level use forRoot
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}