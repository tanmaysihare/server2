const { sequelize, ForgetPasswordRequests, User } = require("../models");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const client = Sib.ApiClient.instance;
// Set the Sendinblue API key
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

// Create an instance of the EmailCampaignsApi
const tranEmailApi = new Sib.TransactionalEmailsApi();
exports.postForgetPassword = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const userEmail = req.body.email;
    const userId = await User.findOne({
      where: { email: userEmail },
      transaction,
    });
    var userUuid;
    if (userId) {
      const passwordRequest = await ForgetPasswordRequests.create(
        {
          uuid: uuidv4(),
          isActive: true,
          UserId: userId.id,
        },
        { transaction }
      );

      userUuid = passwordRequest.dataValues.uuid;
    } else {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const sender = {
      email: "expensetrackerteam@gmail.com",
    };
    const recipients = [
      {
        email: userEmail,
      },
    ];
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recipients,
        subject: "Password Reset Link",
        htmlContent: `<p>Click on the link below to reset your password</p><a href="http://localhost:3001/password/reset-password/${userUuid}">Reset Password</a>`,
      })
      .then(console.log)
      .catch(console.log);

    // Commit the transaction
    await transaction.commit();

    // Send a success response
    res.status(200).json({ message: "Email campaign created successfully" });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();

    // Send an error response

    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getResetPassword = async (req, res) => {
 
    const uuid = req.params.uuid;
    const passwordRequest = await ForgetPasswordRequests.findOne({
      where: { uuid: uuid, isActive: true },
    });
    if (!passwordRequest) {
      res.status(400).json({ message: "Invalid or expired link" });
    } else {
      res.redirect(`http://localhost:3000/reset-password/${uuid}`);
    }
   
 
};
exports.postNewPassword = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const uuid = req.headers["uuid"];
    console.log("uuid", uuid);
    const newPassword = req.body.password;
    console.log("newPassword", newPassword);
    const passwordRequest = await ForgetPasswordRequests.findOne({
      where: { uuid: uuid, isActive: true },
      transaction,
    });
    if (!passwordRequest) {
      res.status(400).json({ message: "Invalid or expired link" });
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { password: hashedPassword },
        { where: { id: passwordRequest.UserId }, transaction }
      );
      await ForgetPasswordRequests.update(
        { isActive: false },
        { where: { uuid: uuid }, transaction }
      );
      await transaction.commit();
      res.status(200).json({ message: "Password reset successfully" });
    }
  } catch (error) {
    console.error("Error in postNewPassword:", error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: "Internal server error", error });
  }
};
