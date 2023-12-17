using Newtonsoft.Json;
using webapi.Models;
using webapi.Services;

namespace webapi.DataCRUD
{
    public class BudgetDataCRUD
    {
        private readonly UserContext _userContext;

        public BudgetDataCRUD(UserContext userContext) 
        { 
            _userContext = userContext; 
        }

        public async Task<string> CreateBudget(string p_session_Id, string p_budget_name, decimal p_budget_amount, DateTime p_start_date, DateTime p_end_date)
        {
            try
            {
                //Try and find user using SessionID
                User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

                if(user != null)
                {
                    //Create Budget
                    Guid budgetId = Guid.NewGuid();

                    Budget budget = new Budget()
                    {
                        BudgetId = budgetId.ToString(),
                        Id = user.Id,
                        BudgetName = p_budget_name,
                        BudgetAmount = p_budget_amount,
                        StartDate = p_start_date,
                        EndDate = p_end_date
                    };

                    //Add to database
                    _userContext.Budgets.Add(budget);
                    _userContext.SaveChanges();

                    return JsonConvert.SerializeObject(new BudgetResponse() { 
                        BudgetId = budget.BudgetId,
                        BudgetName = budget.BudgetName,
                        BudgetAmount = (decimal)budget.BudgetAmount, 
                        StartDate = p_start_date, 
                        EndDate = p_end_date
                    });

                }
                return "SessionID incorrect or expired";
            }
            catch
            {
                return "Error occured during budget creation";
            }
        }

        public async Task<string> GetAllBudgets(string p_session_Id)
        {
            try
            {
                //find user using SessionID
                User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

                if (user != null)
                {
                    //Get all budgets for user
                    List<Budget> budgets = _userContext.Budgets.Where(budget => budget.Id == user.Id).ToList();
                    if (budgets.Count > 0)
                    {
                        List<BudgetResponse> budgetResponses = new();
                        foreach (Budget budget in budgets)
                        {
                            budgetResponses.Add(new BudgetResponse()
                            {
                                BudgetId = budget.BudgetId,
                                BudgetName = budget.BudgetName,
                                BudgetAmount = budget.BudgetAmount,
                                StartDate = budget.StartDate,
                                EndDate = budget.EndDate
                            });
                        }
                        return JsonConvert.SerializeObject(budgetResponses);
                    }
                    return "No Budgets";
                }
                return "SessionID incorrect or expired";
            }
            catch
            {
                return "Error occured getting all budgets";
            }
        }

        public async Task<Budget> GetBudget(string p_budgetId)
        {
            try
            {
                //find user using SessionID
                Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == p_budgetId).FirstOrDefault();

                if (budget != null)
                {
                    return budget;
                }
                return null;
            }
            catch
            {
                return null;
            }
        }


        public async Task<bool> UpdateBudgetAmount(string p_budget_Id, decimal p_deduction_value)
        {
            Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == p_budget_Id).FirstOrDefault();
            
            if (budget != null)
            {
                //Update value
                decimal updatedAmount = budget.BudgetAmount - p_deduction_value;
                budget.BudgetAmount = updatedAmount;

                _userContext.Budgets.Update(budget);
                _userContext.SaveChanges();

                return true;
            }
            return false;
        }

    }
}
