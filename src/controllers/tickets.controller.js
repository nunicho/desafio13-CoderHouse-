const ticketsModelo = require("../dao/DB/models/ticket.modelo.js");

function generateTicketCode() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomPart = Math.random().toString(36).substring(2, 8);
  const ticketCode = `${timestamp}${randomPart}`;
  return ticketCode;
}

async function createTicket(amount, purchaserEmail) {
  const ticket = new ticketsModelo({
    code: generateTicketCode(),
    purchase_datetime: new Date(),
    amount,
    purchaser: purchaserEmail,
  });

  const ticketInsertado = await ticket.save();
  return ticketInsertado;
}

module.exports = {
  generateTicketCode,
  createTicket,
};
