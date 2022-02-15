const { Router } = require("express");
const routes = new Router();
const User = require("../models/user");
require("dotenv-safe").config();
const jwt = require("jsonwebtoken");

routes.post(`/users/login`, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email, password: req.body.password },
    });

    if (!user)  {
      res.status(404).send({
        user: null,
        token: null,
        message: "Usuário ou senha inválidos",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET,
      {
        expiresIn: 3600,
      }
    );
  

    res.send({
      user: user,
      token: token,
      message: "Usuário autenticado com sucesso",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = routes;
