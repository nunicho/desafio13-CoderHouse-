
// FALTA APLICAR REPOSITORY AL CARRITO
const mongoose = require("mongoose");
const carritosRepository = require("../dao/repository/carritos.repository.js");
const carritosModelo = require("../dao/DB/models/carritos.modelo.js")
const productosModelo = require("../dao/DB/models/productos.modelo.js")


const obtenerCarritos = async (req, res) => {
  try {
    const carritos = await carritosModelo.find();
    res.status(200).json({ data: carritos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


const obtenerCarritoId = async (req, res, next) => {
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
      model: productosModelo,
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

    // Almacena los datos en res.locals para que estén disponibles en la siguiente middleware
    res.locals.carritoDB = {
      _id: carrito._id,
      productos: productosEnCarrito,
    };

    next(); // Llama a la siguiente middleware (en este caso, vistar.router.js)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = {
  obtenerCarritos,
  obtenerCarritoId,
};

