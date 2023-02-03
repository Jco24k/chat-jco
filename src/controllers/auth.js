const { response } = require("express");

const UserModel = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const ingresarChat = async (req, res = response) => {
  const { nombre, numero } = req.body;

  try {
    let user = await UserModel.findOne({ numero });
    if (!user) {
      user = new UserModel({
        nombre,
        numero,
        fecha_activo: new Date(),
      });
    } else {
      user.nombre = nombre;
      user.fecha_activo = new Date();
    }

    await user.save();
    const token = await generateJWT(user._id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { user } = req;

  // Generar el JWT
  const token = await generateJWT(user._id);

  res.json({
    user,
    token,
  });
};

const guardarUsuario = async ({ nombre, numero }) => {
  let user = await findOne(numero);
  if (!user) {
    user = new UserModel({ nombre, numero });
    await user.save();
  }
  return user;
};

const findOne = async (numero) => {
  return await UserModel.findOne({
    numero,
  });
};
module.exports = {
  ingresarChat,
  renovarToken,
  guardarUsuario,
};
