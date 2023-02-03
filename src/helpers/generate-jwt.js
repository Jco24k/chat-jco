const { UserModel } = require('../models')
const jwt = require("jsonwebtoken");


const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("failed to generate token");
        } else resolve(token);
      }
    );
  });
};

const ComprobarJWT = async( bearer = '') => {

  const [type, token] = bearer.split(" ");
  if (!type || type !== "Bearer")
    return null

  try {
      
      if(  token.length < 10 ) {
          return null;
      }

      const { uid } = jwt.verify( token, process.env.SECRET_KEY );
      const user = await UserModel.findById( uid );
      if ( !user ) return null;
      return user;

  } catch (error) {
      return null;
  }

}

module.exports = {
  generateJWT,
  ComprobarJWT
};
