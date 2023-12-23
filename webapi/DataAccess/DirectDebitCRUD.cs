using Newtonsoft.Json;
using webapi.Models;
using webapi.Models.BudgetObjects;
using webapi.Models.DirectDebitObjects;

namespace webapi.DataAccess
{
    public class DirectDebitCRUD
    {
        private readonly UserContext _userContext;

        public DirectDebitCRUD(UserContext userContext)
        {
            _userContext = userContext;
        }

        public async Task<DirectDebitResponse> CreateDebit(string p_budget_Id, string p_debit_name, decimal p_debit_amount, DateTime p_debit_date, int p_frequency, DateTime p_due_date)
        {
            try
            {
                //Try and find user using BudgetId
                Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == p_budget_Id).FirstOrDefault();

                if (budget != null)
                {
                    //Create Budget
                    Guid debitId = Guid.NewGuid();

                    DirectDebit directDebit = new DirectDebit()
                    {
                        DebitId = debitId.ToString(),
                        BudgetId = budget.BudgetId,
                        DebitName = p_debit_name,
                        DebitAmount = p_debit_amount,
                        DebitDate = p_debit_date,
                        Frequency = p_frequency,
                        DebitDueDate = p_due_date
                    };
                    //Add to database
                    _userContext.DirectDebits.Add(directDebit);
                    _userContext.SaveChanges();

                    return new DirectDebitResponse()
                    {
                        DebitId = directDebit.DebitId,
                        DebitName = directDebit.DebitName,
                        DebitDate = directDebit.DebitDate,
                        DebitAmount = directDebit.DebitAmount,
                        Frequency = directDebit.Frequency,
                        DebitDueDate= directDebit.DebitDueDate
                    };

                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> UserAccess(string p_session_Id, string p_budget_id)
        {
            try
            {
                //Get User
                User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

                //find direct debit
                DirectDebit directDebit = _userContext.DirectDebits.Where(debit => debit.BudgetId == p_budget_id).FirstOrDefault();

                if (user != null)
                {
                    //find budget debit belongs too, does the budget id match the user id?
                    Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == directDebit.BudgetId).FirstOrDefault();
                    
                    if(budget.Id == user.Id)
                    {
                        return true;

                    }
                    return false;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<DirectDebit>> GetAllDebits(string p_budget_Id, string p_session_Id)
        {
            //Does this user have access to it?
            User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

            if (user != null)
            {
                //get all direct debits assosiated with budget
                List<DirectDebit> directDebits = _userContext.DirectDebits.Where(directDebit => directDebit.BudgetId == p_budget_Id).ToList();

                foreach(DirectDebit directDebit in directDebits)
                {
                    if(DateTime.Now.CompareTo(directDebit.DebitDueDate) > 0)
                    {
                        directDebit.DebitDueDate = directDebit.DebitDueDate.AddDays(directDebit.Frequency);

                        //Change the direct debit date to reflect that it has now passed
                        _userContext.DirectDebits.Update(directDebit);
                    }
                }

                return directDebits;
            }

            return null;
        }

    }
}
