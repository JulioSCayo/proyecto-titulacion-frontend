import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./components/inicio/inicio.component";
import { RegistroComunComponent } from "./components/registro-comun/registro-comun.component";
import { RegistroEspecialComponent } from "./components/registro-especial/registro-especial.component";
import { RegistroResponsableComponent } from "./components/registro-responsable/registro-responsable.component";

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'registro', component: RegistroComunComponent},
  {path: 'registro-especial', component: RegistroEspecialComponent},
  {path: 'registro-responsable', component: RegistroResponsableComponent},
  {path: '**', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }