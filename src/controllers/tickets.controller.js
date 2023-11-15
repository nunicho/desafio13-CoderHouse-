const mongoose = require("mongoose");
const TicketRepository = require("../dao/repository/tickets.repository.js");

const listarTickets = async (req, res) => {
  try {
    const ticket = await TicketRepository.listarTickets();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
};


const obtenerTicket= async (req, res, next) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "id inválido" });
    let ticketDB = await TicketRepository.obtenerTicket(id);
    if (!ticketDB)
      return res
        .status(404)
        .json({ error: `Ticket con id ${id} inexistente` });

    res.locals.ticketDB = ticketDB;
    next();
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
};

const generarCodigo = () => {
  // Generar un código único con Math.random y la fecha actual
  const fechaActual = new Date();
  const codigo = `${fechaActual.getFullYear()}${fechaActual.getMonth()}${fechaActual.getDate()}${fechaActual.getHours()}${fechaActual.getMinutes()}${fechaActual.getSeconds()}${Math.floor(
    Math.random() * 1000
  )}`;
  return codigo;
};

const crearTicket = async (req, res) => {
  try {
    const ticket = req.body;

    if (!ticket.purchase_datetime) {
    ticket.purchase_datetime = new Date();
    }

    if (!ticket.code) {      
    ticket.code = generarCodigo();
    }

    if (!ticket.amount || !ticket.purchaser) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const existe = await TicketRepository.existeTicket(ticket.code);
    if (existe) {
      return res.status(400).json({
        error: `El código ${ticket.code} ya está siendo usado por otro ticket.`,
      });
    }

    const ticketInsertado = await TicketRepository.crearTicket(ticket);
    res.status(201).json({ ticketInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
};

const borrarTicket = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const ticket = await TicketRepository.obtenerTicket(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ error: `Ticket con id ${id} inexistente` });
    }

    const resultado = await TicketRepository.borrarTicket(id);

    res
      .status(200)
      .json({ mensaje: "El ticket fue correctamente eliminado", resultado });
  } catch (error) {
    res.status(404).json({
      mensaje: "Error, el ticket solicitado no pudo ser eliminado",
    });
  }
};

module.exports = {
  listarTickets,
  crearTicket,
  obtenerTicket,
  borrarTicket,
};


// FALTA APLICAR REPOSITORY AL TICKET