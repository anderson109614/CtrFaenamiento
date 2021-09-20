export interface Usuario {
    IdUsuario: string,
    Cedula: string,
    Nombres: string,
    Apellidos: string,
    Imagen: string,
    FechaCreacion: {date:string},
    Estado: string,
    IdPerfil: string,
    NombrePerfil: string,
    token: string
    
}