const database = require("./database");
const _ = require("lodash");


let dollarUSLocale = Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
});


exports.liabilityData = function (userID) {

    let sql = `SELECT * FROM ((((liability_amounts a 
            INNER JOIN liability_interests b ON a.user_id = b.user_id) 
            INNER JOIN liability_interest_rates c ON a.user_id = c.user_id) 
            INNER JOIN liability_durations d ON a.user_id = d.user_id)
            INNER JOIN liability_dates e ON a.user_id = e.user_id) 
            WHERE a.user_id  = ?`;

    return new Promise((resolve, reject) => {

        database.query(sql, userID, function (err, result, fields) {

            if (err) {
                reject(err);
            }

            let income_expense = [
                {
                    monthlyIncome: result[0].monthly_income,
                    monthlyExpense: result[0].monthly_expenses,
                    annualIncome: result[0].monthly_income * 12,
                    annualExpense: result[0].monthly_expenses * 12
                }
            ]

            let arranged_result = [
                {
                    type: "Car Loan",
                    amount: result[0].car_loan_amount,
                    interest: result[0].car_loan_interest,
                    rate: result[0].car_loan_rate,
                    duration: result[0].car_loan_duration,
                    date: result[0].car_loan_date
                },

                {
                    type: "Property Loan",
                    amount: result[0].property_loan_amount,
                    interest: result[0].property_loan_interest,
                    rate: result[0].property_loan_rate,
                    duration: result[0].property_loan_duration,
                    date: result[0].property_loan_date
                },

                {
                    type: "Educational Loan",
                    amount: result[0].educational_loan_amount,
                    interest: result[0].educational_loan_interest,
                    rate: result[0].educational_loan_rate,
                    duration: result[0].educational_loan_duration,
                    date: result[0].educational_loan_date
                },

                {
                    type: "Home Loan",
                    amount: result[0].home_loan_amount,
                    interest: result[0].home_loan_interest,
                    rate: result[0].home_loan_rate,
                    duration: result[0].home_loan_duration,
                    date: result[0].home_loan_date
                },

                {
                    type: "Bills Payable",
                    amount: result[0].bills_payable_amount,
                    interest: result[0].bills_payable_interest,
                    rate: result[0].bills_payable_rate,
                    duration: result[0].bills_payable_duration,
                    date: result[0].bills_payable_date
                },

                {
                    type: "Mortgage Payable",
                    amount: result[0].mortgage_payable_amount,
                    interest: result[0].mortgage_payable_interest,
                    rate: result[0].mortgage_payable_rate,
                    duration: result[0].mortgage_payable_duration,
                    date: result[0].mortgage_payable_date
                },

                {
                    type: "Capital Leases",
                    amount: result[0].capital_leases_amount,
                    interest: result[0].capital_leases_interest,
                    rate: result[0].capital_leases_rate,
                    duration: result[0].capital_leases_duration,
                    date: result[0].capital_leases_date
                },

                {
                    type: "Bank Account Overdrafts",
                    amount: result[0].bank_account_overdrafts_amount,
                    interest: result[0].bank_account_overdrafts_interest,
                    rate: result[0].bank_account_overdrafts_rate,
                    duration: result[0].bank_account_overdrafts_duration,
                    date: result[0].bank_account_overdrafts_date
                },

            ]

            /* add dolar and currency format to income and expenses */
            for (var i = 0; i < income_expense.length; i++) {
                income_expense[i].monthlyIncome = dollarUSLocale.format(income_expense[i].monthlyIncome);
                income_expense[i].monthlyExpense = dollarUSLocale.format(income_expense[i].monthlyExpense);
                income_expense[i].annualIncome = dollarUSLocale.format(income_expense[i].annualIncome);
                income_expense[i].annualExpense = dollarUSLocale.format(income_expense[i].annualExpense);
            }

            let total_amount = 0;
            let total_interest = 0;

            for (var i = 0; i < arranged_result.length; i++) {

                /* calculate total amount and interest */
                total_amount += arranged_result[i].amount;
                total_interest += arranged_result[i].interest;

                /* add dolar and currency format to amounts and interests */
                arranged_result[i].amount = dollarUSLocale.format(arranged_result[i].amount);
                arranged_result[i].interest = dollarUSLocale.format(arranged_result[i].interest);

                // arranged_result[i].date = moment(date).utc().format('DD/MM/YYYY');

                /* add percentage format to rates and year to duration */
                arranged_result[i].rate = parseFloat(arranged_result[i].rate).toFixed(2) + "%";
                arranged_result[i].duration = arranged_result[i].duration + " yrs";

            }

            /* add dolar and currency format to total amount and interest */
            total_amount = dollarUSLocale.format(total_amount);
            total_interest = dollarUSLocale.format(total_interest);

            let sendData = [income_expense[0], arranged_result, total_amount, total_interest];
            resolve(sendData);

        });
    });
};


exports.getMonthlyIn_Ex = function (userID) {

    let sql = `SELECT a.monthly_income, a.monthly_expenses
                FROM liability_amounts a
                WHERE a.user_id = ?`

    return new Promise((resolve, reject) => {
        database.query(sql, userID, function (err, result) {
            if (err) {
                reject(err);
            }
            console.log(result);
            let sendData = result[0];
            resolve(sendData);
        });
    });
}


exports.editLiabilities = function (type, userID) {

    let liability_type = _.snakeCase(_.lowerCase(type));
    let amount = liability_type + "_amount";
    let interest = liability_type + "_interest";
    let rate = liability_type + "_rate";
    let duration = liability_type + "_duration";
    let date = liability_type + "_date";

    let sql = `SELECT a.${amount}, b.${interest}, c.${rate}, d.${duration}, e.${date}
               FROM ((((liability_amounts a 
                INNER JOIN liability_interests b ON a.user_id = b.user_id) 
                INNER JOIN liability_interest_rates c ON a.user_id = c.user_id) 
                INNER JOIN liability_durations d ON a.user_id = d.user_id) 
                INNER JOIN liability_dates e ON a.user_id = e.user_id)
                WHERE a.user_id = ?`;

    return new Promise((resolve, reject) => {
        database.query(sql, userID, function (err, result) {
            if (err) {
                reject(err);
            }
            // result[0].date = moment(result[0].date).utc().format('DD/MM/YYYY');
            console.log(result);
            let sendData = [result[0], amount, rate, duration, date];
            resolve(sendData);
        });
    });
};


exports.calInterest = function (type, r, t, p, date, userID) {

    if(p === ""){p = 0;}
    if(r === ""){r = 0;}
    if(t === ""){t = 0;}

    let liability_type = _.snakeCase(_.lowerCase(type));
    let amount = liability_type + "_amount";
    let interest = liability_type + "_interest";
    let rate = liability_type + "_rate";
    let duration = liability_type + "_duration";
    let borrowingDate = liability_type + "_date";

    let int = ((p * r * t) / 100);

    let sql = `UPDATE liability_amounts a, liability_interests b, liability_interest_rates c, liability_durations d, liability_dates e 
               SET a.${amount} = ?, b.${interest} = ?, c.${rate} = ?, d.${duration} = ?, e.${borrowingDate} = "${date}"
               WHERE a.user_id = b.user_id AND c.user_id = b.user_id AND d.user_id = c.user_id AND e.user_id = d.user_id AND a.user_id = ?`;

    return new Promise((resolve, reject) => {
        database.query(sql, [p, int, r, t, userID], function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


exports.updateIn_Ex = function(name, updateValue, userID) {

    if(updateValue === ""){updateValue = 0;}
    
    name = _.snakeCase(_.lowerCase(name));
    let sql = `UPDATE liability_amounts a SET a.${name} = ? WHERE a.user_id = ?`

    return new Promise((resolve, reject) => {
        database.query(sql, [updateValue, userID], function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


module.exports;