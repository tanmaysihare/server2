module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define("User",{
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        isPremium: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
    User.associate = (models)=>{
        User.hasMany(models.Expenses,{
            onDelete: "cascade",
        });
        User.hasMany(models.Orders,{
            onDelete: "cascade",
        });
        User.hasMany(models.ForgetPasswordRequests,{
            onDelete: "cascade",
        });
        User.hasMany(models.DownloadLinks,{
            onDelete: "cascade",
        });
    };
    return User;
}; 