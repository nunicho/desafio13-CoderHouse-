const express = require("express");
//const mongoose = require("mongoose");
const router = express.Router();
//const carritosModelo = require("../dao/DB/models/carritos.modelo.js");
//const Producto = require("../dao/DB/models/productos.modelo.js");
//const path = require("path");
//const prodModelo = require("../dao/DB/models/productos.modelo.js");
const carritosController = require("../controllers/carritos.controller.js")




router.get("/", carritosController.obtenerCarritos);

router.get("/:cid", carritosController.obtenerCarritoId);

router.post("/purchase", carritosController.crearCarrito);


module.exports = router;

