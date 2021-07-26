import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorTailorModule } from '@ngneat/error-tailor';



import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegistroComunComponent } from './components/registro-comun/registro-comun.component';
import { RegistroEspecialComponent } from './components/registro-especial/registro-especial.component';
import { RegistroResponsableComponent } from './components/registro-responsable/registro-responsable.component';
import { config } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComunComponent,
    RegistroEspecialComponent,
    RegistroResponsableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // FormsModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
