module.exports = (sequelize, Datatype) => {
  const DownloadLinks = sequelize.define("DownloadLinks", {
    link: {
      type: Datatype.STRING,
      allowNull: false,
    },
  });
  DownloadLinks.associate = (models)=>{
    DownloadLinks.belongsTo(models.User,{
      onDelete: 'CASCADE',
    });
  };
  return DownloadLinks;
};
