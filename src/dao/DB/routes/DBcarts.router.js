const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const carritosModelo = require("../models/carritos.modelo.js");
const Producto = require("../models/productos.modelo.js");
const path = require("path");
const prodModelo = require("../models/productos.modelo.js");



// ------------------ TICKET ----------------- // 

const ticketsModelo = require("../models/ticket.modelo.js");


router.get("/", async (req, res) => {
  try {
    const carritos = await carritosModelo.find();
    res.status(200).json({ data: carritos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        mensaje: 'Requiere un argumento "cid" de tipo ObjectId válido',
      });
    }

    const carrito = await carritosModelo.findOne({ _id: cid }).populate({
      path: "productos.producto",
      model: prodModelo,
    });

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        mensaje: `El carrito con ID ${cid} no existe`,
      });
    }

    const productosEnCarrito = carrito.productos.map((productoEnCarrito) => ({
      producto: {
        ...productoEnCarrito.producto._doc,
      },
      quantity: productoEnCarrito.cantidad,
    }));

    res.status(200).json({
      data: { carrito: { _id: carrito._id, productos: productosEnCarrito } },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/purchase", async (req, res) => {
  try {
    const carritoToAdd = req.body;

    const hasMissingFields = carritoToAdd.products.some(
      (product) => !product.id || !product.quantity
    );

    if (hasMissingFields || carritoToAdd.products.length === 0) {
      return res.status(400).json({
        error: 'Los productos deben tener campos "id" y "quantity" completos',
      });
    }

    const productIds = carritoToAdd.products.map((product) => product.id);

    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "id inválido" });
      }
    }

    const insufficientStockProducts = [];

    // Verificar stock antes de agregar al carrito
    for (const product of carritoToAdd.products) {
      const { id, quantity } = product;

      const productInDB = await Producto.findById(id);

      if (!productInDB) {
        return res
          .status(404)
          .json({ error: `Producto con id ${id} no encontrado` });
      }

      if (productInDB.stock < quantity) {
        insufficientStockProducts.push({
          id,
          quantity,
          availableStock: productInDB.stock,
        });
      }
    }

    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        error: "No hay suficiente stock para algunos productos en el carrito.",
        insufficientStockProducts,
      });
    }

    const groupedProducts = {};
    let totalAmount = 0;

    for (const product of carritoToAdd.products) {
      const { id, quantity } = product;

      const productInDB = await Producto.findById(id);

      if (!productInDB) {
        return res
          .status(404)
          .json({ error: `Producto con id ${id} no encontrado` });
      }

      totalAmount += productInDB.price * quantity;

      if (!groupedProducts[id]) {
        groupedProducts[id] = parseInt(quantity, 10);
      } else {
        groupedProducts[id] += parseInt(quantity, 10);
      }
    }

    const carrito = new carritosModelo({
      productos: Object.keys(groupedProducts).map((id) => ({
        producto: id,
        cantidad: groupedProducts[id],
      })),
      amount: totalAmount, 
    });

    let carritoInsertado = await carrito.save();

    

    const ticket = new ticketsModelo({
      code: generateTicketCode(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.session.usuario.email
    });

    
    const ticketInsertado = await ticket.save();

   
    for (const product of carritoToAdd.products) {
      const productInDB = await Producto.findById(product.id);
      productInDB.stock -= product.quantity;
      await productInDB.save();
    }

    res.status(201).json({ carritoInsertado, ticketInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
});

function generateTicketCode() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime(); // Obtener el timestamp actual
  const randomPart = Math.random().toString(36).substring(2, 8); // Generar una cadena aleatoria

  // Concatenar el timestamp y la cadena aleatoria para formar el código del ticket
  const ticketCode = `${timestamp}${randomPart}`;

  return ticketCode;
}

function calculateTotalAmount(products) {
  let totalAmount = 0;

  for (const product of products) {
    totalAmount += product.quantity * product.price;
  }

  // Puedes redondear el monto total a dos decimales si es necesario
  totalAmount = parseFloat(totalAmount.toFixed(2));

  return totalAmount;
}

module.exports = router;

