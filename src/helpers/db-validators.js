const UserModel = require("../models/user");

const IsNumeroValid = async (numero = "") => {
  var patron = /^9[0-9]{8}$/;
  if (!patron.test(numero)) throw new Error(`Numero not valid`);
};

const IsNumeroExists = async (numero = "") => {
  const existsUser = await UserModel.findOne({
    numero
  });
  if (existsUser) throw new Error(`User with numero '${numero}' exists in DB`);
};

module.exports = { IsNumeroValid, IsNumeroExists };
