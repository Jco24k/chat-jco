const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");

const validarJWT = async (req = request, res = response, next) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  const [type, token] = auth.split(" ");
  if (!type || type !== "Bearer")
    res.status(401).json({ msg: "Expected authentication type Bearer Token" });
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    // leer el usuario que corresponde al uid
    const user = await UserModel.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe DB",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
