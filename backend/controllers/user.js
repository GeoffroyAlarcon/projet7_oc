const jwt = require("jsonwebtoken");
const conn = require('../mysqlConfig')
const bcrypt = require('bcrypt')
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const user = req.body;
  const userModel = new User();
  console.log(user)
  console.log("nom : " + user._email);
  bcrypt.hash(req.body._motDePasse, 10)
    .then(hash => {

      user._motDePasse = hash

      console.log("Connected!");

      conn.query(userModel.saveUser(), [user._nom, user._prenom, user._email, user._departement, user._motDePasse, user._pseudo], function (err, result) {

        if (err) {
          return res.status(401).json({ message: 'email ou pseudo déjà pris veuillez !' });
        }
        else {
          return res.status(200).json({
            message: "utilisateur enregistré avec succès ! "


          });
        }
      });
    });

}

exports.login = (req, res, next) => {
  const user = new User()
  conn.query(user.findUser(), req.body.email, (err, rows, result) => {
    if (err) throw err;

    else {
      if (rows.length == 0) {
        return res.status(400).json({ error: 'utilisateur non trouvé' });
      }
      rows.forEach((row) => {

        bcrypt.compare(req.body.motDePasse, `${row.motDePasse}`)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            else {
              const authUser = new User(row.id, row.prenom, row.nom, row.email, row.motDePasse, row.pseudo, row.departement);

              const token = jwt.sign(
                { userId: row.id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' });
              return res.status(200).json({
                userId: authUser.id,
                token: token,
                authUser
              })

            }
          })
      })
    }
  })
};
exports.loginForAdmin = (req, res, next) => {
  const user = new User()
  conn.query(user.loginForAdmin(), [req.body.email, req.body.motDePasse], (err, rows, result) => {
    if (err) throw err;
    if (rows.length == 0) {
      return res.status(400).json({ error: 'utilisateur non trouvé' });
    }
    rows.forEach((row) => {

      const authUser = new User(row.id, null, null, row.email, row.motDePasse, null, null, row.administrateur);

      const token = jwt.sign(
        { userId: row.id },
        'RANDOM_TOKEN_SECRET',
        { expiresIn: '24h' });
      return res.status(200).json({
        userId: authUser.id,
        token: token,
        authUser
      })


    })


  });
}





exports.deleteUser = (req, res, next) => {
  const user = new User()
  conn.query(user.deleteUser()
    , [req.query._email, req.query._motDePasse],
    function (error, result, fields) {
      if (error) throw error
      if (result.affectedRows == 0) {
        return res.status(401).json({ error: ' suppression non authorisé' });
      }
      else {
        return res
          .status(200)
          .json({ message: 'Votre compte a bien été supprimé !' })
      }
    }
  )
}
