module.exports = (sequelize,DataTypes) => {
    const ForgetPasswordRequests = sequelize.define("ForgetPasswordRequests",{
        uuid:{
            type:DataTypes.UUID,
        },
        isActive:{
            type: DataTypes.BOOLEAN,
        }
    });
    ForgetPasswordRequests.associate = (models) => {
        ForgetPasswordRequests.belongsTo(models.User, {
            onDelete: "cascade",
        });
    };
    return ForgetPasswordRequests;
}