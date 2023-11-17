const ticketRepository = require("../dao/repository/tickets.repository.js");

function generateTicketCode() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomPart = Math.random().toString(36).substring(2, 8);
  const ticketCode = `${timestamp}${randomPart}`;
  return ticketCode;
}

async function createTicket(amount, purchaserEmail) {
  const ticketCode = generateTicketCode();
  const purchaseDatetime = new Date();

  const ticket = await ticketRepository.createTicket({
    code: ticketCode,
    purchaseDatetime,
    amount,
    purchaser: purchaserEmail,
  });

  return ticket;
}

module.exports = {
  generateTicketCode,
  createTicket,
};
