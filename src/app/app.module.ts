import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorTailorModule } from '@ngneat/error-tailor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComunComponent } from './components/registro-comun/registro-comun.component';
import { RegistroEspecialComponent } from './components/registro-especial/registro-especial.component';
import { RegistroResponsableComponent } from './components/registro-responsable/registro-responsable.component';
import { BarraNavegacionComponent } from './components/components/barra-navegacion/barra-navegacion.component';
import { MenuDesplegableComponent } from './components/components/menu-desplegable/menu-desplegable.component';
import { MapaReportesComponent } from './components/mapa-reportes/mapa-reportes.component';

import { AutenticacionGuard } from './services/guard/autenticacion.guard';
import { TokenInterceptorService } from './services/token-interceptor/token-interceptor.service';
import { TablaComunesComponent } from './components/tabla-usuarios/tabla-comunes/tabla-comunes.component';
import { TablaEspecialesComponent } from './components/tabla-usuarios/tabla-especiales/tabla-especiales.component';
import { TablaResponsablesComponent } from './components/tabla-usuarios/tabla-responsables/tabla-responsables.component';
import { BtnsTablasUsuariosComponent } from './components/components/btns-tablas-usuarios/btns-tablas-usuarios.component';
import { BusquedaUsuariosPipe } from './pipes/busqueda-usuarios/busqueda-usuarios.pipe';
import { BusquedaReportesPipe } from './pipes/busqueda-reportes/busqueda-reportes.pipe';
import { InformacionComponent } from './components/informacion/informacion/informacion.component';
import { ConoceMasComponent } from './components/informacion/conoce-mas/conoce-mas.component';
import { RutaAutomaticaComponent } from './components/ruta-automatica/ruta-automatica.component';
import { BtnsTablasReportesComponent } from './components/components/btns-tablas-reportes/btns-tablas-reportes.component';
import { TablaDesatendidosComponent } from './components/tabla-reportes/tabla-desatendidos/tabla-desatendidos.component';
import { TablaEnProcesoComponent } from './components/tabla-reportes/tabla-en-proceso/tabla-en-proceso.component';
import { TablaSolucionadosComponent } from './components/tabla-reportes/tabla-solucionados/tabla-solucionados.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistroComunComponent,
    RegistroEspecialComponent,
    RegistroResponsableComponent,
    InicioComponent,
    BarraNavegacionComponent,
    MenuDesplegableComponent,
    MapaReportesComponent,
    TablaComunesComponent,
    TablaEspecialesComponent,
    TablaResponsablesComponent,
    BtnsTablasUsuariosComponent,
    BusquedaUsuariosPipe,
    InformacionComponent,
    ConoceMasComponent,
    RutaAutomaticaComponent,
    BusquedaReportesPipe,
    BtnsTablasReportesComponent,
    TablaDesatendidosComponent,
    TablaEnProcesoComponent,
    TablaSolucionadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'Este campo es requerido',
          minlength: ({ requiredLength, actualLength }) => 
                      `Expect ${requiredLength} but got ${actualLength}`,
          // invalidAddress: error => `El correo electronico no es valido`,
          email: 'El email no es valido',
          validator: 'La contraseña no coincide'          
        }
      }
    })
  ],
  providers: [
    AutenticacionGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
