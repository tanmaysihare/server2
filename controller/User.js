const { createTokens } = require("../middleware/tokken");
const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");


exports.postSignup = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const userData = req.body;
    const existingUser = await User.findOne({
      where: { email: userData.email },
      transaction,
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    }, { transaction });
    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postLogin2 = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, transaction });

    if (!user) {
    return  res.status(400).json({ error: "User does not exist" });
    }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "incorrect password" });
      }
    
      const accessToken = createTokens(user);
      await transaction.commit();
      res
        .status(200)
        .json({ success: true, message: "User logged in successfully", authenticate:accessToken, isPremium: user.isPremium });
    
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
