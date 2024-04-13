module.exports = (sequelize,Datatype)=>{
    const Expenses = sequelize.define("Expenses",{
        money:{
            type:Datatype.STRING,
            allowNull:false,
        },
        description:{
            type:Datatype.STRING,
            allowNull: false,
        },
        category:{
            type:Datatype.STRING,
            allowNull:false,
        },
    });
    Expenses.associate = (models)=>{
        Expenses.belongsTo(models.User,{
            onDelete:"cascade",
        });
    };
    return Expenses;
}