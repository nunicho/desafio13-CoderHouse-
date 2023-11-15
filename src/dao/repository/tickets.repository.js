const TicketsMongoDao = require("../ticketsMongoDao.js");

class TicketsRepository {


  async listarTickets() {
    try {
      return await TicketsMongoDao.listarTickets(); // Corregido aquí
    } catch (error) {
      throw new Error("Error al listar tickets en el repositorio");
    }
  }

  async obtenerTicket(id) {
    try {
      return await TicketsMongoDao.obtenerTicket(id);
    } catch (error) {
      throw new Error("Error al obtener el ticket en el repositorio");
    }
  }

  async crearTicket(ticket) {
    try {
      const existe = await TicketsMongoDao.existeTicket(ticket.code);
      if (existe) {
        throw new Error(
          `El código ${ticket.code} ya está siendo usado por otro ticket.`
        );
      }

      return await TicketsMongoDao.crearTicket(ticket);
    } catch (error) {
      throw new Error("Error al crear producto en el repositorio");
    }
  }

  async borrarTicket(id) {
    try {
      const producto = await TicketsMongoDao.obtenerTicket(id);
      if (!producto) {
        throw new Error(`Producto con id ${id} inexistente`);
      }

      return await TicketsMongoDao.borrarTicket(id);
    } catch (error) {
      throw new Error("Error al borrar producto en el repositorio");
    }
  }

  async existeTicket(code) {
    return await TicketsMongoDao.existeTicket(code);
  }
}

module.exports = new TicketsRepository();

// FALTA APLICAR REPOSITORY AL TICKET