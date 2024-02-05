using Newtonsoft.Json;
using webapi.Models;
using webapi.Models.BudgetItemObjects;
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
                        AvailableAmount = p_budget_amount,
                        StartDate = p_start_date,
                        EndDate = p_end_date,
                        BudgetAmount = p_budget_amount
                    };

                    _userContext.Budgets.Add(budget);
                    _userContext.SaveChanges();

                    return budget;

                }
                return null;
            }
            catch{ throw; }
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
                    Budget budget = _userContext.Budgets.Where(temp_budget => temp_budget.BudgetId == p_budget_id).FirstOrDefault();

                    if (budget != null)
                    {
                        //Create BudgetItem
                        Guid itemId = Guid.NewGuid();

                        BudgetItem budgetItem = new BudgetItem
                        {
                            BudgetId = p_budget_id,
                            ItemId = itemId.ToString(),
                            ItemAmount = p_item_amount,
                            PurchaseDate = p_purchase_date,
                            ItemName = p_item_name,
                        };

                        //Deduct item amount form budget total
                        Budget updatedBudget = budget;
                        updatedBudget.AvailableAmount -= budgetItem.ItemAmount;

                        //Add to database
                        _userContext.BudgetItems.Add(budgetItem);
                        _userContext.Budgets.Update(updatedBudget);

                        _userContext.SaveChanges();

                        return budgetItem;
                    }
                }
                return null;
            }
            catch { throw; }
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

                    if(budgets != null)
                    {
                        if (budgets.Count > 0)
                        {
                            return budgets;
                        }
                    }
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<BudgetItem>> GetBudgetItems(string p_budget_id)
        {
            try
            {
                //find user using SessionID
                List<BudgetItem> p_budgetItems = _userContext.BudgetItems.Where(budgetItem => budgetItem.BudgetId == p_budget_id).ToList();

                if (p_budgetItems.Count != 0)
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
                throw;
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
                throw;
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

        public Budget GetBudget(string p_budgetId)
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
                throw;
            }
        }

        public async Task<bool> UpdateBudgetAmount(string p_budget_Id, decimal p_deduction_value, DirectDebit p_direct_debit)
        {
            Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == p_budget_Id).FirstOrDefault();

            DirectDebit debit = _userContext.DirectDebits.Where(directDebit => directDebit.DebitId == p_direct_debit.DebitId).FirstOrDefault();
            
            if (budget != null)
            {
                if(debit != null)
                {
                    //Update budget value
                    decimal updatedAmount = budget.AvailableAmount - p_deduction_value;
                    budget.AvailableAmount = updatedAmount;

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
            decimal totalAmount = budget.AvailableAmount;
            decimal weeklyAmount = totalAmount / (decimal)weeks;

            budget.WeeklyAmount = weeklyAmount;

            _userContext.Budgets.Update(budget);
            _userContext.SaveChanges();

            return true;
        }

        public async Task<bool> DeleteBudget(string p_budget_id)
        {
            try
            {
                Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == p_budget_id).FirstOrDefault();

                if (budget != null)
                {
                    //Remove budget, remove everything assosiated to budget
                    List<DirectDebit> directDebits = _userContext.DirectDebits.Where(debit => debit.BudgetId == p_budget_id).ToList();
                    List<BudgetItem> budgetItems = _userContext.BudgetItems.Where(budgetItem => budgetItem.BudgetId == p_budget_id).ToList();

                    //Remove direct debits
                    directDebits.ForEach(directDebit =>
                    {
                        _userContext.Remove(directDebit);
                    });

                    //Remove budget items
                    budgetItems.ForEach(budgetItem =>
                    {
                        _userContext.Remove(budgetItem);
                    });

                    //Remove budget
                    _userContext.Budgets.Remove(budget);

                    _userContext.SaveChanges();
                    Console.WriteLine($"Budget {p_budget_id} deleted");
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public bool DeleteBudgetItem(string p_budgetItem_id)
        {
            try
            {
                BudgetItem budgetItem = _userContext.BudgetItems.Where(budget => budget.ItemId == p_budgetItem_id).FirstOrDefault();

                if (budgetItem != null)
                {
                    //Find the budget
                    Budget budget = _userContext.Budgets.Where(budget => budget.BudgetId == budgetItem.BudgetId).FirstOrDefault();

                    if (budget != null)
                    {
                        //Add the budgetItem value back to budget
                        Budget updateBudget = budget;
                        updateBudget.AvailableAmount = budget.AvailableAmount + budgetItem.ItemAmount;

                        //Update budget amount and remove bugdetItem
                        _userContext.BudgetItems.Remove(budgetItem);
                        _userContext.Budgets.Update(updateBudget);

                        _userContext.SaveChanges();

                        Console.WriteLine($"BudgetItem {p_budgetItem_id} deleted");

                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> EditBudgetItem(BudgetItem p_editbudgetItem)
        {
            try
            {
                if (p_editbudgetItem != null)
                {
                    BudgetItem updatedBudgetItem = new()
                    {
                        BudgetId = p_editbudgetItem.BudgetId,
                        ItemAmount = (decimal)p_editbudgetItem.ItemAmount,
                        ItemId = p_editbudgetItem.ItemId,
                        ItemName = p_editbudgetItem.ItemName,
                        PurchaseDate = (DateTime)p_editbudgetItem.PurchaseDate
                    };

                    _userContext.ChangeTracker.Clear();
                    _userContext.BudgetItems.Update(updatedBudgetItem);
                    _userContext.SaveChanges();

                    return true;
                }

                return false;
            }
            catch { throw; }
        }

        public BudgetItem GetBudgetItem(string p_budgetItem_Id)
        {
            try
            {
                //find user using SessionID
                BudgetItem p_budgetItem = _userContext.BudgetItems.Where(budgetItem => budgetItem.ItemId == p_budgetItem_Id).FirstOrDefault();

                if (p_budgetItem != null)
                {
                    return p_budgetItem;
                }
                return null;

            }
            catch
            {
                throw;
            }
        }

        public bool EditBudgetAmount(string p_budget_Id, decimal p_new_amount_value)
        {
            try
            {

                Budget budget = _userContext.Budgets.Where(temp_budget => temp_budget.BudgetId == p_budget_Id).FirstOrDefault();

                if (budget != null)
                {
                    budget.AvailableAmount = p_new_amount_value;
                    //Add to database
                    _userContext.Budgets.Update(budget);

                    _userContext.SaveChanges();

                    return true;
                }

                return false;
            }
            catch { throw; }
        }

        public bool UpdateBudget(Budget p_budget)
        {
            try
            {
                if (p_budget != null)
                {
                    _userContext.ChangeTracker.Clear();
                    _userContext.Budgets.Update(p_budget);
                    _userContext.SaveChanges();
                    return true;
                }
                return false;
            }
            catch
            {
                throw;
            }
        }

        public List<DirectDebit> UpdateDirectDebits(List<DirectDebit> p_directDebits)
        {
            try
            {
                if (p_directDebits != null && p_directDebits.Count != 0)
                {
                    foreach (DirectDebit debit in p_directDebits)
                    {
                        _userContext.Update(debit);
                    }

                    _userContext.SaveChanges();
                    return p_directDebits;
                }

                return null;
            }
            catch
            {
                throw;
            }
        }

        public List<DirectDebit> GetDirectDebits(string p_budget_id)
        {
            try
            {
                //Get direct debits
                List<DirectDebit> directDebits = _userContext.DirectDebits.Where(debit => debit.BudgetId == p_budget_id).ToList();

                if (directDebits.Count != 0)
                {
                    return directDebits;
                }

                return null;
            }
            catch
            {
                throw;
            }
        }

    }
}
