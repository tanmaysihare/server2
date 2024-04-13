const {Expenses,sequelize} = require('../models');

exports.postExpense = async (req,res)=>{
    let transaction;
    try{
        transaction = await sequelize.transaction();

        const userId = req.user.id;
    
        const expenseData = req.body;
        expenseData.UserId = userId;
        const newData = await Expenses.create(expenseData,{transaction});
        await transaction.commit();
        res.status(200).json({message:'Expense Created',newData});
    }catch(error){
        if(transaction) await transaction.rollback();
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.getExpense = async(req,res)=>{
    let transaction;
    try{
        transaction = await sequelize.transaction();
        const userId = req.user.id;
        const expenses = await Expenses.findAll({where:{UserId:userId},order:[['createdAt','DESC']],transaction});
        await transaction.commit();
        res.json(expenses);
    }catch(error){
        if(transaction) await transaction.rollback();
        res.status(500).json({error: 'Internal server error'});
    }
}; 

exports.deleteExpense = async(req,res)=>{
    let transaction;
    try{
        transaction = await sequelize.transaction();
        const userId = req.user.id;
        const dltExpense = req.params.id;
        const expenseToDelete = await Expenses.findOne({where:{id:dltExpense, UserId:userId},transaction});
        if(!expenseToDelete) return res.status(400).json({error:"Expense not Found to Delete"});
        await expenseToDelete.destroy({transaction});
        await transaction.commit();
        res.status(200).json({message:'Expense Deleted'});
    }catch(error){
        if(transaction) await transaction.rollback();
        res.status(500).json({error: 'Internal server error'});
    }
};