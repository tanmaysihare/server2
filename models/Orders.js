module.exports = (sequelize,DataTypes) => {
    const Orders = sequelize.define("Orders",{
      
        paymentId: {
           type: DataTypes.STRING,
        },
        orderId:{
            type: DataTypes.STRING,
        },
        status: {
           type: DataTypes.STRING,
        },
    });
    Orders.associate = (models)=>{
        Orders.belongsTo(models.User,{
            onDelete:"cascade",
        });
    };
    return Orders;
};