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

export const emptyCreateControlDTO: CreateControlDTO = {
  fecha_control: new Date(),
  temperatura_aire: 0.0,
  humedad_relativa: 0.0,
  co2: 0,
  observaciones: "",
  id_sala: -1,
  id_personal: -1,
  id_turno: -1,
  temperaturas: [],
};
