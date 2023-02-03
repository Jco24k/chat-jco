const { Router } = require("express");
const { check } = require("express-validator");
const { ingresarChat, renovarToken } = require("../controllers/auth");
const { validFields } = require("../middlewares/valid-fields");
const { IsNumeroValid, IsNumeroExists } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/login",
  [
    check("nombre", "nombre is required").notEmpty(),
    check("numero", "numero is required").notEmpty(),
    check("numero").custom(IsNumeroValid),
    // check("numero").custom(IsNumeroExists),
    validFields,
  ],
  ingresarChat
);

router.get('/', validarJWT, renovarToken );

module.exports = router;
