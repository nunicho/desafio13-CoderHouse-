const Carrito = require("./DB/models/carritos.modelo.js");
const Producto = require("./DB/models/productos.modelo.js");

const carritosMongoDao = {
  async obtenerCarritoPorId(id) {
    try {
      const carrito = await Carrito.findOne({ _id: id })
        .populate({
          path: "productos.producto",
          model: Producto,
        })
        .lean();
      return carrito;
    } catch (error) {
      throw new Error("Error al obtener el carrito desde la base de datos");
    }
  },  
};

module.exports = carritosMongoDao;

// FALTA APLICAR REPOSITORY AL CARRITO