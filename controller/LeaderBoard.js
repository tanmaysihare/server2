const {User} = require("../models");
const {Expenses} = require("../models");
const {sequelize} = require("../models");
exports.getLeaderBoard = async (req, res) => {
    // try {
    //     // Find all users with premium memberships
    //     const users = await User.findAll({ where: { isPremium: true } });

    //     // Fetch all expenses for premium users
    //     let allExpenses = [];
    //     for (const user of users) {
    //         const userExpenses = await Expenses.findAll({ where: { UserId: user.id } });
    //         allExpenses.push(...userExpenses);
    //     }

    //     // Aggregate expenses by user ID and calculate total expenses
    //     const userAggExpense = {};
    //     for (const expense of allExpenses) {
    //         if (userAggExpense[expense.UserId]) {
    //             userAggExpense[expense.UserId] += parseInt(expense.money);
    //         } else {
    //             userAggExpense[expense.UserId] = parseInt(expense.money);
    //         }
    //     }

    //     // Convert userAggExpense object to an array of objects for sorting
    //     const sortedExpenses = Object.entries(userAggExpense).map(([UserId, money]) => ({ UserId, money }));
    //     sortedExpenses.sort((a, b) => b.money - a.money);

    //     // Find user data for leaderboard
    //     const leaderboardUsers = await User.findAll({ where: { id: sortedExpenses.map(expense => expense.UserId) } });
    //     var endPointLeaderBoard = [];
    //     for (const user of leaderboardUsers) {
    //         endPointLeaderBoard.push({ name: user.name, money: userAggExpense[user.id] });
    //     }
    //     res.json({ userData: endPointLeaderBoard });
    // } catch (error) {
    //     console.error("Error in getLeaderBoard:", error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
    let transaction;
    try {
        transaction = await sequelize.transaction();
        // Find all expenses including associated user information
        const userExpenses = await Expenses.findAll({
            include: [
                {
                     model: User,
                    required: true,
                where:{isPremium:true}
            }
        ],
            transaction,
        });

        // Aggregate expenses by user ID and calculate total expenses
        const userAggExpense = {};
        userExpenses.forEach((expense) => {
            
            const userName = expense.User.name;
            const expenseAmount = parseFloat(expense.money);
            if (!userAggExpense[userName]) {
                userAggExpense[userName] = 0;
            }
            userAggExpense[userName] += expenseAmount;
        });

        // Convert the aggregated expenses to an array of objects
        const aggregatedExpenses = Object.entries(userAggExpense).map(([userName, totalExpense]) => ({
             userName,
            totalExpense,
        }));
        const sortedExpenses = aggregatedExpenses.sort((a, b) => b.totalExpense - a.totalExpense);
       await transaction.commit();
        res.json(sortedExpenses);
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.error("Error in getUserExpenses:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.getLeaderBoard2 = async(req,res)=>{
    // try{
    //     const users = await User.findAll();
    //     const expenses = await Expenses.findAll();
    //     const userAggExpense = {}
    //     expenses.forEach((expense)=>{
    //         if(userAggExpense[expense.UserId]){
    //             userAggExpense[expense.UserId] += parseInt(expense.money)
    //         }else{
    //             userAggExpense[expense.UserId] = parseInt(expense.money)
    //         }
    //     })
    //     var userLeaderBoard = [];
    //     users.forEach((user)=>{
    //         userLeaderBoard.push({name:user.name, money:userAggExpense[user.id]})
    //     })
    //     const userLeaderBoard2  = userLeaderBoard.sort((a, b) => b.money - a.money);
    //     res.json({userData:userLeaderBoard2});
    // }catch(error){
    //     res.status(500).json({error: 'Internal server error'});
    // }

    let transaction;
    try {
        transaction = await sequelize.transaction();
        // Find all expenses including associated user information
        const userExpenses = await Expenses.findAll({
            include: [{ model: User }],
            transaction,
        });

        // Aggregate expenses by user ID and calculate total expenses
        const userAggExpense = {};
        userExpenses.forEach((expense) => {
            
            const userName = expense.User.name;
            const expenseAmount = parseFloat(expense.money);
            if (!userAggExpense[userName]) {
                userAggExpense[userName] = 0;
            }
            userAggExpense[userName] += expenseAmount;
        });

        // Convert the aggregated expenses to an array of objects
        const aggregatedExpenses = Object.entries(userAggExpense).map(([userName, totalExpense]) => ({
             userName,
            totalExpense,
        }));
        const sortedExpenses = aggregatedExpenses.sort((a, b) => b.totalExpense - a.totalExpense);
        await transaction.commit();
        res.json(sortedExpenses);
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.error("Error in getUserExpenses:", error);
        res.status(500).json({ error: 'Internal server error' });
    }


}