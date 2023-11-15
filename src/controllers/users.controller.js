//const UserService = require("../services/users.service.js");
const mongoose = require("mongoose");
const UsersRepository = require("../dao/repository/users.repository")

const createUser = async (userData) => {
  try {
    const user = await UsersRepository.createUser(userData);
    return user;
  } catch (error) {
    throw error;
  }
}

const getUserByEmail = async (email) => {
  try {
    const user = await UsersRepository.getUserByEmail(email);
    return user;
  } catch (error) {
    throw error;
  }
}


const getUsers = async (req, res) => {
  try {
    const users = await UsersRepository.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    const updatedUser = await UsersRepository.updateUser(userId, userData);
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await UsersRepository.deleteUser(userId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};




module.exports = {
  createUser,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
 };


/*
//const UserService = require("../services/users.service.js");

const UsersService = require("../services/users.service.js")

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await UsersService.createUser(userData);
    return user; // No enviamos una respuesta JSON directamente aquí
  } catch (error) {
    throw error; // Reenviamos el error
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email= req.body.email; 
    console.log(email)// Opción para obtener el correo electrónico del cuerpo de la solicitud
    const user = await UsersService.getUserByEmail(email);
    return user; // No enviamos una respuesta JSON directamente aquí
  } catch (error) {
    throw error; // Reenviamos el error
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await UsersService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    const updatedUser = await UsersService.updateUser(userId, userData);
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await UserService.deleteUser(userId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};


module.exports = {
createUser,
getUserByEmail,
getUsers,
updateUser,
deleteUser
};
*/