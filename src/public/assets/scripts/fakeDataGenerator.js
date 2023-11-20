const {faker} =require("@faker-js/faker")
const productosModeloFaker = require("../../../dao/DB/models/productosFaker.modelo")




const generateFakeProducts = (quantity) => {
  const fakeProducts = [];

  for (let i = 0; i < quantity; i++) {
    const fakeProduct = {
      status: true,
      title: faker.commerce.productName(),
      description: faker.lorem.words(10),
      //price: faker.random.number({ min: 1, max: 1000, precision: 0.01 }),
      price: 1,
      thumbnail: faker.image.url(),
      code: 1,
      stock: 1
    };

    fakeProducts.push(fakeProduct);
  }

  return fakeProducts;
};

// Endpoint para generar y agregar productos falsos a la base de datos
const generateAndAddFakeProducts = async (req, res) => {
  try {
    // Genera 100 productos falsos
    const fakeProducts = generateFakeProducts(100);

    // Agrega los productos falsos a la base de datos
    await productosModeloFaker.create(fakeProducts);

    res
      .status(200)
      .json({ message: "Productos falsos generados y agregados con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { generateFakeProducts, generateAndAddFakeProducts };
