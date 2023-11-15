const mongoose = require("mongoose");
const TicketsModelo = require("./DB/models/ticket.modelo.js");

class TicketsMongoDao {
  
  async listarTickets() {
    try {
      const tickets = await TicketsModelo.find();
      return tickets;
    } catch (error) {
      throw new Error("Error al obtener tickets desde la base de datos");
    }
  }
  async obtenerTicket(id) {
    return await TicketsModelo.findById(id).lean();
  }

  async crearTicket(producto) {
    return await TicketsModelo.create(producto);
  }

  async existeTicket(code) {
    return await TicketsModelo.findOne({ code: code });
  }

  async borrarTicket(id) {
    return await TicketsModelo.deleteOne({ _id: id });
  }
}

module.exports = new TicketsMongoDao();

// FALTA APLICAR REPOSITORY AL TICKET