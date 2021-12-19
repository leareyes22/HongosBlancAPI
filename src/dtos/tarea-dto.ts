export default interface TareaDTO {
  id: number;
  fecha_generada: Date;
  descripcion: string;
  realizada: boolean;
  fecha_planificada: Date;
  sala: string;
  personal_creador: string;
}
