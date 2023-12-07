using Newtonsoft.Json;
using webapi.Models;
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

        public async Task<DirectDebitResponse> CreateDebit(string p_budget_Id, string p_debit_name, decimal p_debit_amount, DateTime p_debit_date, int p_frequency)
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
                    };

                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public async Task<string> GetAllDebits(string p_budget_Id, string p_session_Id)
        {
            //Does this user have access to it?
            User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

            if (user == null)
            {
                //get all direct debits assosiated with budget
                List<DirectDebit> directDebits = _userContext.DirectDebits.Where(directDebit => directDebit.BudgetId == p_budget_Id).ToList();

                List<DirectDebitResponse> directDebitResponse = new List<DirectDebitResponse>();
                foreach(DirectDebit directDebit in directDebits)
                {
                    directDebitResponse.Add(new DirectDebitResponse
                    {
                        DebitId = directDebit.DebitId,
                        DebitName = directDebit.DebitName,
                        DebitAmount = directDebit.DebitAmount,
                        DebitDate = directDebit.DebitDate,
                        Frequency=directDebit.Frequency
                    });
                }
            }

            return "No Budgets";
        }

    }
}
