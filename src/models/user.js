const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  numero: {
    type: Number,
    required: [true, "El numero es obligatorio"],
    unique: true,
  },
  img: {
    type: String,
    required: [false],
    default: null
     
  },
  online:{
    type: Boolean,
    required: false,
    default: false
  },
  fecha_activo :{
    type: Date,
    default: null
  }
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, ...detailsUser } = this.toObject();
  detailsUser.uid = _id;
  return detailsUser;
};

module.exports = model("User", UserSchema);
