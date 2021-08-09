import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./components/inicio/inicio.component";
import { RegistroComunComponent } from "./components/registro-comun/registro-comun.component";
import { RegistroEspecialComponent } from "./components/registro-especial/registro-especial.component";
import { RegistroResponsableComponent } from "./components/registro-responsable/registro-responsable.component";
import { ListaUsuariosComponent } from "./components/lista-usuarios/lista-usuarios.component";
import { MapaReportesComponent } from "./components/mapa-reportes/mapa-reportes/mapa-reportes.component";
import { TablaComunesComponent } from "./components/tabla-comunes/tabla-comunes.component";
import { TablaEspecialesComponent } from "./components/tabla-especiales/tabla-especiales.component";
import { TablaResponsablesComponent } from "./components/tabla-responsables/tabla-responsables.component";


import { AutenticacionGuard } from './services/guard/autenticacion.guard';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'registro', component: RegistroComunComponent},
  {path: 'registro-especial', component: RegistroEspecialComponent},
  {path: 'registro-responsable', component: RegistroResponsableComponent},
  // {path: 'usuarios', component: ListaUsuariosComponent},
  {path: 'usuarios', component: TablaComunesComponent},
  {path: 'usuarios-comunes', component: TablaComunesComponent},
  {path: 'usuarios-especiales', component: TablaEspecialesComponent},
  {path: 'usuarios-responsables', component: TablaResponsablesComponent},
  {path: 'mapa-reportes', component: MapaReportesComponent, canActivate: [AutenticacionGuard]},
  {path: '**', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }