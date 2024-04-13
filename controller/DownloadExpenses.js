const { Expenses, User, sequelize, DownloadLinks } = require('../models');
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadToS3(data, fileName) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: 'public-read',
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

exports.downloadExpenses = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const user = await User.findOne({ where: { id: req.user.id }, transaction });
    if (!user.isPremium) {
      return res.status(401).json({ message: "Unauthorized. Premium membership required." });
    }
    const date = new Date();
    const createdTime = date.toLocaleTimeString();
    const createdDate = date.toDateString();
  //  console.log(createdDate, createdTime);
    const expenses = await Expenses.findAll({ where: { UserId: req.user.id }, transaction });
    const stringifyExpense = JSON.stringify(expenses);
    const file = `Expenses-${createdDate}-${createdTime}.txt`;
    const fileUrl = await uploadToS3(stringifyExpense, file);
    await DownloadLinks.create({ link: fileUrl , UserId: req.user.id}, { transaction });
    await transaction.commit();
    res.status(200).json({ fileUrl: fileUrl, success: true });
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.error("Error in downloadExpenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.previousDownloads = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const downloads = await DownloadLinks.findAll({ where: { UserId: req.user.id },order: [['createdAt', 'DESC']], transaction });
    await transaction.commit();
    res.status(200).json({ downloads });
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.error("Error in previousDownloads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}