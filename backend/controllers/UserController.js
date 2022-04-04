const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome e obrigatorio" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O email e obrigatorio" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O telefone e obrigatorio" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha e obrigatoria" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha e obrigatoria" });
      return;
    }
    if (password !== confirmpassword) {
      res.status(422).json({
        message: "A senha e a confirmação de senha precisam ser iguais",
      });
      return;
    }
    // check if user exists already
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: "O email já esta em uso" });
      return;
    }
    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create a userExists
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (e) {
      res.status(500).json({ message: e });
    }
  }
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(422).json({ message: "O email e obrigatorio" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha e obrigatoria" });
      return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(422)
        .json({ message: "Não a usuário cadastrado com esse email" });
      return;
    }

    // check if password math with db password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(422).json({ message: "Senha invalida" });
      return;
    }
    await createUserToken(user, req, res);
  }

  static async checkuser(req, res) {
    let currentUser;
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
      const token = getToken(req);
      const decode = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decode.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }
  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({ user });
  }
  static async editUser(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);
    const { name, email, password, phone, confirmpassword } = req.body;
    let image = "";
    if (req.file) {
      user.image = req.file.filename;
    }

    if (!name) {
      res.status(422).json({ message: "O nome e obrigatorio" });
      return;
    }
    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O email e obrigatorio" });
      return;
    }
    const userExists = await User.findOne({ email: email });
    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro email" });
      return;
    }
    user.email = email;

    if (image) {
      const imageName = req.file.filename;
      user.image = imageName;
    }
    if (!phone) {
      res.status(422).json({ message: "O telefone e Obrigatorio" });
      return;
    }
    user.phone = phone;

    if (password != confirmpassword) {
      res.status(422).json({ message: "As senhas não conferem" });
      return;
    } else if (password === confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      //returns user updated data
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({
        message: "Usuário atualizado com sucesso",
        data: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }
};