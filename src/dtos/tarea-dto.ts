export default interface TareaDTO {
  id: number;
  fecha_generada: Date;
  descripcion: string;
  realizada: boolean;
  fecha_planificada: Date;
  id_sala: number;
  id_personal: number;
}
