// eslint-disable-next-line no-unused-vars
import TemperaturaCamaDTO from "./temperatura-cama-dto";

export default interface CreateControlDTO {
  fecha_control: Date;
  temperatura_aire: number;
  humedad_relativa: number;
  co2: number;
  observaciones: string;
  id_sala: number;
  id_personal: number;
  id_turno: number;
  temperaturas: Array<TemperaturaCamaDTO>;
}

export interface ControlDTO {
  fecha_control: Date;
  temperatura_aire: number;
  humedad_relativa: number;
  co2: number;
  observaciones: string;
  sala: number;
  personal: number;
  turno: number;
}
