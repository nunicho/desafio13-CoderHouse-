const Router = require("express").Router;
const router = Router();
const arrayProducts = require("../archivos/productos.json");
//const productosModelo = require("../dao/DB/models/productos.modelo.js");
//const carritosModelo = require("../dao/DB/models/carritos.modelo.js");
//const prodModelo = require("../dao/DB/models/productos.modelo.js");

const productosController = require("../controllers/productos.controller.js");
const carritosController = require("../controllers/carritos.controller.js");


//DTO para la vista CURRENT
const dtoUsuarios = require("../dto/dtoUsuarios.js")


const mongoose = require("mongoose");

const auth = (req, res, next) => {
  if (req.session.usuario) {
    next();
  } else {
    return res.redirect("/login");
  }
};

const auth2 = (req, res, next) => {
  if (req.session.usuario) {
    return res.redirect("/");
  } else {
    next();
  }
};


const authRol = (roles) => {
  return (req, res, next) => {
    const user = req.session.usuario;

    if (!user || !roles.includes(user.role)) {
      return res
        .status(403)
        .send("No tienes permisos para acceder a esta ruta");
    }

    next();
  };
};

router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario; // Pasar el usuario a res.locals
  next();
});

router.get("/", auth, (req, res) => {
  let verLogin = true;
  if (req.session.usuario) {
    verLogin = false;
  }

  res.status(200).render("home", {
    verLogin,
    titlePage: "Home Page de la ferretería El Tornillo",
    estilo: "styles.css",
  });
});

//---------------------------------------------------------------- RUTAS EN FILESYSTEM --------------- //

router.get("/fsproducts", auth, (req, res) => {
  let index = parseInt(req.query.index) || 0;
  const array = arrayProducts;
  const totalProducts = array.length;

  const lastIndex = array.length - 1;

  if (index < 0) {
    index = lastIndex;
  } else if (index >= totalProducts) {
    index = 0;
  }

  const product = array[index];

  res.header("Content-type", "text/html");
  res.status(200).render("FSproducts", {
    product: product,
    index: index,
    titlePage: "Página de productos",
    estilo: "productsStyles.css",
  });
});

router.get("/fsrealtimeproducts", auth, (req, res) => {
  let index = parseInt(req.query.index) || 0;
  const array = arrayProducts;
  const totalProducts = array.length;

  const lastIndex = array.length - 1;

  if (index < 0) {
    index = lastIndex;
  } else if (index >= totalProducts) {
    index = 0;
  }

  const product = array[index];

  res.header("Content-type", "text/html");
  res.status(200).render("realTimeProducts", {
    product: product,
    index: index,
    titlePage: "Página de productos en tiempo real",
    estilo: "realTimeProducts.css",
  });
});

//---------------------------------------------------------------- RUTAS PARA PRODUCTOS--------------- //

router.get("/DBproducts", auth, authRol(["user"]), async (req, res) => {
  try {
    const productos = await productosController.listarProductos(req, res);

    res.header("Content-type", "text/html");
    res.status(200).render("DBproducts", {
      productos: productos.docs,
      hasProducts: productos.docs.length > 0,
      // activeProduct: true,
      status: productos.docs.status,
      pageTitle: "Productos en DATABASE",
      estilo: "productsStyles.css",
      totalPages: productos.totalPages,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      filtro: req.query.filtro || "",
      codeFilter: req.query.codeFilter || "",
      sort: req.query.sort || "",
      limit: req.query.limit || 10,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.get(
  "/DBproducts-Admin",
  auth,
  authRol(["administrador"]),
  async (req, res) => {
    try {
      const productos = await productosController.listarProductos(req, res);

      res.header("Content-type", "text/html");
      res.status(200).render("DBproducts-Admin", {
        productos: productos.docs,
        hasProducts: productos.docs.length > 0,
        // activeProduct: true,
        status: productos.docs.status,
        pageTitle: "Productos en DATABASE",
        estilo: "productsStyles.css",
        totalPages: productos.totalPages,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        filtro: req.query.filtro || "",
        codeFilter: req.query.codeFilter || "",
        sort: req.query.sort || "",
        limit: req.query.limit || 10,
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);


router.get(
  "/DBproducts/:id",
  auth,
  productosController.obtenerProducto,
  (req, res) => {
    const productoDB = res.locals.productoDB;
    if (!productoDB) {
      return res.status(404).send("Producto no encontrado");
    }
    res.header("Content-type", "text/html");
    res.status(200).render("DBproductsDetails", {
      productoDB,
      estilo: "productDetails.css",
    });
  }
);

router.post("/DBProducts", auth, productosController.crearProducto);

// PARA AGREGAR EN OTRO MOMENTO
//router.put("/DBproducts/:id", auth, productosController.editarProducto);

router.delete("/DBproducts/:id", auth, productosController.borrarProducto, (req, res)=>{
   res.header("Content-type", "text/html");
    res.status(200).render("DBproductsDetails", {
      productoDB,
      estilo: "productDetails.css",
    });

});


//---------------------------------------------------------------- RUTAS PARA CARRITOS--------------- //


router.get(
  "/carts/:cid",
  auth,
  carritosController.obtenerCarrito,
  (req, res) => {
    const carritoDB = res.locals.carritoDB;

    if (!carritoDB) {
      return res.status(404).json("Carrito no encontrado");
    }   
    res.header("Content-type", "text/html");
    res.status(200).render("DBcartDetails", {
      carritoDB,
      estilo: "DBcartDetails.css",
    });
  }
);



//---------------------------------------------------------------- RUTAS PARA EL CHAT --------------- //

router.get("/chat", auth, authRol(["user"]), (req, res) => {
  res.setHeader("Content-type", "text/html");
  res.status(200).render("chat", {
    estilo: "chat.css",
    usuario: req.session.usuario,
  });
});

//---------------------------------------------------------------- RUTAS PARA EL USERS ---------------//

router.get("/registro", auth2, (req, res) => {
  let error = false;
  let errorDetalle = "";
  if (req.query.error) {
    error = true;
    errorDetalle = req.query.error;
  }

  res.status(200).render("registro", {
    verLogin: true,
    error,
    errorDetalle,
    estilo: "login.css",
  });
});

router.get("/login", auth2, (req, res) => {
  let error = false;
  let errorDetalle = "";
  if (req.query.error) {
    error = true;
    errorDetalle = req.query.error;
  }

  let usuarioCreado = false;
  let usuarioCreadoDetalle = "";
  if (req.query.usuarioCreado) {
    usuarioCreado = true;
    usuarioCreadoDetalle = req.query.usuarioCreado;
  }

  res.status(200).render("login", {
    verLogin: true,
    usuarioCreado,
    usuarioCreadoDetalle,
    error,
    errorDetalle,
    estilo: "login.css",
  });
});

router.get("/perfil", auth, (req, res) => {
  res.status(200).render("perfil", {
    verLogin: false,
    estilo: "login.css",
  });
});

router.get("/loginAdmin", (req, res) => {
  let error = false;
  let errorDetalle = "";
  if (req.query.error) {
    error = true;
    errorDetalle = req.query.error;
  }

  res.status(200).render("loginAdmin", {
    error,
    errorDetalle,
    estilo: "login.css",
  });
});

//---------------------------------------------------------------- RUTA CURRENT ---------------//

router.get("/current", (req, res) => {
  const user = req.session.usuario;

  if (!user) {
    return res.status(401).render("current", {
      estilo: "login.css",
    });
  }

  const usuarioDTO = new dtoUsuarios(user.email, user.role);

  res.status(200).render("current", {
    estilo: "login.css",
    usuario: usuarioDTO,
  });
});

module.exports = router;
