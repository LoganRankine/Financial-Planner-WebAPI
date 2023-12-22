using Newtonsoft.Json;
using webapi.Models;
using webapi.Models.BudgetObjects;
using webapi.Models.DirectDebitObjects;
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



        public async Task<Budget> CreateBudget(string p_session_Id, string p_budget_name, decimal p_budget_amount, DateTime p_start_date, DateTime p_end_date)
        {
            try
            {
                //Try and find user using SessionID
                User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

                if (user != null)
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

                    _userContext.Budgets.Add(budget);
                    _userContext.SaveChanges();

                    return budget;

                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public async Task<BudgetItem> CreateBudgetItem(string p_session_Id, string p_budget_id, string p_item_name, decimal p_item_amount, DateTime p_purchase_date)
        {
            try
            {
                //Try and find user using SessionID
                User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();

                //Ensure the user is able to use this budgetID
                if (user != null)
                {
                    //Create Budget
                    Guid itemId = Guid.NewGuid();

                    BudgetItem budgetItem = new BudgetItem{
                        BudgetId= p_budget_id,
                        ItemId = itemId.ToString(),
                        ItemAmount = p_item_amount,
                        PurchaseDate = p_purchase_date,
                        ItemName = p_item_name,
                    };

                    //Add to database
                    _userContext.BudgetItems.Add(budgetItem);
                    _userContext.SaveChanges();

                    return budgetItem;
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Budget>> GetAllBudgets(string p_session_Id)
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
                        return budgets;
                    }
                }
                return null;
            }
            catch
            {
                return null;
            }
        }
        public async Task<List<BudgetItem>> GetBudgetItems(string p_budget_id)
        {
            try
            {
                //find user using SessionID
                List<BudgetItem> p_budgetItems = _userContext.BudgetItems.Where(budgetItem => budgetItem.BudgetId == p_budget_id).ToList();

                if (p_budgetItems != null)
                {
                    //Get all budgets for user
                    if (p_budgetItems.Count > 0)
                    {
                        p_budgetItems = p_budgetItems.OrderByDescending(date => date.PurchaseDate).ToList();
                        return p_budgetItems;
                    }
                }
                return null;

            }
            catch
            {
                return null;
            }
        }

        public async Task<string> BudgetItemsWeek(string p_budget_id)
        {
            try
            {
                //find user using SessionID
                List<BudgetItem> p_budgetItems = _userContext.BudgetItems.Where(budgetItem => budgetItem.BudgetId == p_budget_id).ToList();

                if (p_budgetItems != null)
                {
                    //Get all budgets for user
                    if (p_budgetItems.Count > 0)
                    {
                        BudgetItemObjectResponse budgetItemObjectResponse = new();
                        foreach (BudgetItem budget_item in p_budgetItems)
                        {
                            budgetItemObjectResponse.BudgetItems.Add(new BudgetItemResponse()
                            {
                                ItemId = budget_item.ItemId,
                                ItemAmount = budget_item.ItemAmount,
                                ItemName = budget_item.ItemName,
                                PurchaseDate = budget_item.PurchaseDate,
                            });
                        }

                        budgetItemObjectResponse.BudgetItems = budgetItemObjectResponse.BudgetItems.OrderByDescending(date => date.PurchaseDate).ToList();
                        string response = JsonConvert.SerializeObject(budgetItemObjectResponse.BudgetItems);
                        return response;
                    }
                    return "No Budget Items";
                }
                return "No Budget Items";

            }
            catch
            {
                return "Error occured getting budget items";
            }
        }

        public async Task<bool> UserAccess(string p_session_Id, string p_budget_Id)
        {
            try
            {
                //Get User
                User user = _userContext.Users.Where(user => user.SessionId == p_session_Id).FirstOrDefault();
                List<Budget> budgets = _userContext.Budgets.Where(budget => budget.BudgetId == p_budget_Id).ToList();

                if (user != null)
                {
                    List<Budget> temp = budgets.Where(budget => budget.Id == user.Id).ToList();
                    if(temp.Count > 0)
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



        public async Task<bool> UpdateBudgetAmount(string p_budget_Id, decimal p_deduction_value, DirectDebitResponse p_direct_debit)
        {
            Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == p_budget_Id).FirstOrDefault();

            DirectDebit debit = _userContext.DirectDebits.Where(directDebit => directDebit.DebitId == p_direct_debit.DebitId).FirstOrDefault();
            
            if (budget != null)
            {
                if(debit != null)
                {
                    //Update budget value
                    decimal updatedAmount = budget.BudgetAmount - p_deduction_value;
                    budget.BudgetAmount = updatedAmount;

                    _userContext.Budgets.Update(budget);

                    //Update direct debit total amount
                    debit.DebitTotalAmount = p_deduction_value;
                    _userContext.DirectDebits.Update(debit);
                    _userContext.SaveChanges();
                    return true;
                }
                return false;
            }
            return false;
        }

        public async Task<bool> CalculateWeekly(string p_budget_id)
        {
            //Get budget
            Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId==p_budget_id).FirstOrDefault();

            double weeks = (budget.EndDate -  budget.StartDate).TotalDays/7;
            decimal totalAmount = budget.BudgetAmount;
            decimal weeklyAmount = totalAmount / (decimal)weeks;

            budget.WeeklyAmount = weeklyAmount;

            _userContext.Budgets.Update(budget);
            _userContext.SaveChanges();

            return true;
        }

    }
}
