import { Component, Inject, OnInit } from '@angular/core';
import { ChildActivationStart, Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import swal from 'sweetalert';
import {UsuariosService} from '../../servicios/usuarios.service'
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuarioUso:any={};
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,private usrSer:UsuariosService, public router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarioUso();
  }
  cargarUsuarioUso(){
    var us=this.storage.get('Usuario');
    this.usuarioUso=us

  }
  //imagen
  base64textStringG = '';
  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e:any) {
    this.base64textStringG = 'data:image/jpg;base64,' + btoa(e.target.result);
    //console.log(this.base64textStringG);
    this.usuarioUso.Imagen=this.base64textStringG;
  }
  clkGuardar(){
    var TxtCedula=(<HTMLInputElement>document.getElementById('txtCedula')).value;
    var TxtNombre=(<HTMLInputElement>document.getElementById('txtNombres')).value;
    var TxtApellidos=(<HTMLInputElement>document.getElementById('txtApellidos')).value;
    var TxtContraseña=(<HTMLInputElement>document.getElementById('txtContraseña')).value;

    var usrAct={
      IdUsuario:this.usuarioUso.IdUsuario,
      Cedula:TxtCedula,
      Nombres:TxtNombre,
      Apellidos:TxtApellidos,
      Contrasena:TxtContraseña,
      IdPerfil:this.usuarioUso.IdPerfil,
      img:this.base64textStringG
    }

    if(this.validaruUsr(usrAct)){
      swal({
        title: "Seguro que deseas actualizar la informacion",
        
        icon: "warning",
        buttons: ['Cancelar','OK'],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.usrSer.actualizarUsuario(usrAct,this.usuarioUso.token).subscribe(
            async res => {
              if(res.estado){
                swal(res.mensaje, {
                  icon: "success",
                });
                this.actualizarUsuarioLocal(usrAct);
                this.router.navigateByUrl('/home');
                
              }else{
                swal(res.mensaje, {
                  icon: "warning",
                });
              }
      
            },
            err => {
              console.log(err);
              swal("Error al Actualisar Usuario", {
                icon: "warning",
              });

              
              
            }
          );



          
        }
      });
    }


  }
  actualizarUsuarioLocal(usr:any){
    this.usuarioUso.Cedula=usr.Cedula;
    this.usuarioUso.Nombres=usr.Nombres;
    this.usuarioUso.Apellidos=usr.Apellidos;
    if(usr.img.length!=0){
      this.usuarioUso.Imagen=usr.img;
    }
    this.storage.set('Usuario',this.usuarioUso);
  }
  validaruUsr(usr:any){
    console.log(usr);
    if(usr.Cedula.length != 10){
      this.mesajeError('Ingrese una cedula valida')
      return false;
    }
    if(usr.Nombres.length ==0){
      this.mesajeError('Ingrese un Nombre')
      return false;
    }
    if(usr.Apellidos.length==0){
      this.mesajeError('Ingrese un Apellido')
      return false;
    }
    return true;
  }
  mesajeError(texto:string){
    swal({
      title: "Error!",
      text: texto,
      icon: "warning",
      
    });
  }

}
