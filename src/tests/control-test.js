"use stricts";
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const url = require("./variables").url;
const token = require("./variables").token;

describe("Post control: ", () => {
  it("Se debe poder crear un control", (done) => {
    chai
      .request(url)
      .post("/api/control")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        fecha_control: new Date(),
        temperatura_aire: 22,
        humedad_relativa: 40,
        co2: 55,
        observaciones: "Todo bajo control.",
        id_sala: 1,
        id_personal: 2,
        id_turno: 1,
        temperaturas: [
          {
            nro_cama: 1,
            t1: 20,
            t2: 20,
            t3: 20,
            t4: 20,
            t5: 20,
            t6: 19,
          },
          {
            nro_cama: 2,
            t1: 21,
            t2: 21,
            t3: 21,
            t4: 21,
            t5: 21,
            t6: 20,
          },
          {
            nro_cama: 3,
            t1: 22,
            t2: 22,
            t3: 22,
            t4: 22,
            t5: 22,
            t6: 21,
          },
          {
            nro_cama: 4,
            t1: 21,
            t2: 21,
            t3: 21,
            t4: 21,
            t5: 21,
            t6: 20,
          },
          {
            nro_cama: 5,
            t1: 20,
            t2: 20,
            t3: 20,
            t4: 20,
            t5: 20,
            t6: 19,
          },
          {
            nro_cama: 6,
            t1: 19,
            t2: 19,
            t3: 19,
            t4: 19,
            t5: 19,
            t6: 18,
          },
        ],
      })
      .end(function (err, res) {
        console.log(res.text);
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Get controles list : ", () => {
  it("Se debe obtener la lista de controles cargados en la BD.", (done) => {
    chai
      .request(url)
      .get("/api/control/list")
      .set({ Authorization: `Bearer ${token}` })
      .end(function (err, res) {
        console.log(Array.from(JSON.parse(res.text)));
        expect(res).to.have.status(200);
        expect(Array.from(JSON.parse(res.text))).to.be.an("array");
        done();
      });
  });
});
