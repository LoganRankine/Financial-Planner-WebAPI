using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using webapi.DataCRUD;
using webapi.Models;
using webapi.Models.BudgetItemObjects;
using webapi.Models.BudgetObjects;
using webapi.Models.DirectDebitObjects;

namespace webapi.Services
{
    public class BudgetService
    {
        private readonly BudgetDataCRUD _budgetDataCRUD;

        public BudgetService(BudgetDataCRUD budgetDataCRUD) { _budgetDataCRUD = budgetDataCRUD; }

        public async Task<string> CreateBudget(string p_session_Id, string p_budget_name, decimal p_budget_amount, DateTime p_start_date, DateTime p_end_date)
        {
            try
            {
                //Check that request information
                Budget budget = await _budgetDataCRUD.CreateBudget(p_session_Id, p_budget_name, p_budget_amount, p_start_date, p_end_date);

                if (budget != null)
                {
                    return JsonConvert.SerializeObject(new BudgetResponse()
                    {
                        BudgetId = budget.BudgetId,
                        BudgetName = budget.BudgetName,
                        BudgetAmount = (decimal)budget.BudgetAmount,
                        StartDate = p_start_date,
                        EndDate = p_end_date
                    });
                }
                return "Budget";

            }
            catch { throw; }
        }

        public async Task<bool> UserAccess(string p_session_Id, string p_budget_Id)
        {
            bool response = await _budgetDataCRUD.UserAccess(p_session_Id, p_budget_Id);

            return response;
        }

        public async Task<string> CreateBudgetItem(string p_session_Id, string p_budget_id, string p_item_name, decimal p_item_amount, DateTime p_purchase_date)
        {
            try
            {
                BudgetItem budgetItem = await _budgetDataCRUD.CreateBudgetItem(p_session_Id, p_budget_id, p_item_name, p_item_amount, p_purchase_date);

                if (budgetItem != null)
                {
                    string response = JsonConvert.SerializeObject(new BudgetItemResponse
                    {
                        ItemAmount = budgetItem.ItemAmount,
                        PurchaseDate = budgetItem.PurchaseDate,
                        ItemId = budgetItem.ItemId,
                        ItemName = budgetItem.ItemName
                    });
                    return response;
                }
                return JsonConvert.SerializeObject("Failed to create BudgetItem");
            }
            catch { throw; }
        }

        public async Task<string> EditBudgetItem(EditBudgetItem editBudgetItem)
        {
            try
            {
                BudgetItem temp_budgetItem;

                switch (editBudgetItem)
                {
                    case null:
                        break;

                    case EditBudgetItem item when item.PurchaseDate != null && item.ItemName != null && item.ItemAmount != null:

                        //Update budget total amount with new value
                        if (UpdateBudgetAmountItem(editBudgetItem.ItemId, (decimal)editBudgetItem.ItemAmount))
                        {
                            //Get budget Item before update
                            temp_budgetItem = _budgetDataCRUD.GetBudgetItem(editBudgetItem.ItemId);

                            if (temp_budgetItem != null)
                            {
                                //Update BudgetItem with new values
                                temp_budgetItem.PurchaseDate = (DateTime)editBudgetItem.PurchaseDate;
                                temp_budgetItem.ItemName = editBudgetItem.ItemName;
                                temp_budgetItem.ItemAmount = (decimal)editBudgetItem.ItemAmount;



                                bool updateSuccessfull = await _budgetDataCRUD.EditBudgetItem(temp_budgetItem);

                                if (!updateSuccessfull)
                                {
                                    return $"Unsuccessful";
                                }
                                return $"Success: Item:{temp_budgetItem.ItemId} was updated. Changes: Purchase name: {temp_budgetItem.ItemName}, Purchase date: {temp_budgetItem.PurchaseDate} and Amount: {temp_budgetItem.ItemAmount}";
                            }

                        }
                        break;

                    case EditBudgetItem item when item.PurchaseDate != null && item.ItemName != null:
                        //Get budget Item before update
                        temp_budgetItem = _budgetDataCRUD.GetBudgetItem(editBudgetItem.ItemId);

                        if (temp_budgetItem != null)
                        {
                            temp_budgetItem.PurchaseDate = (DateTime)editBudgetItem.PurchaseDate;
                            temp_budgetItem.ItemName = editBudgetItem.ItemName;
                            bool updateSuccessfull = await _budgetDataCRUD.EditBudgetItem(temp_budgetItem);

                            if (!updateSuccessfull)
                            {
                                return $"Unsuccessful";
                            }
                            return $"Success: Item:{temp_budgetItem.ItemId}, {temp_budgetItem.ItemName}, {temp_budgetItem.PurchaseDate} was changed.";
                        }

                        break;

                    case EditBudgetItem item when item.ItemAmount != null:

                        //Update budget total amount with new value
                        if (UpdateBudgetAmountItem(editBudgetItem.ItemId, (decimal)editBudgetItem.ItemAmount))
                        {
                            //Get budget Item before update
                            temp_budgetItem = _budgetDataCRUD.GetBudgetItem(editBudgetItem.ItemId);

                            if (temp_budgetItem != null)
                            {
                                //update item with new amount
                                temp_budgetItem.ItemAmount = (decimal)item.ItemAmount;

                                bool updateSuccessfull = await _budgetDataCRUD.EditBudgetItem(temp_budgetItem);

                                if (!updateSuccessfull)
                                {
                                    return $"Unsuccessful";
                                }
                                return $"Success: Item:{editBudgetItem.ItemId}, {temp_budgetItem.ItemAmount} was updated.";
                            }

                        }

                        break;

                    case EditBudgetItem item when item.PurchaseDate != null:
                        //Get budget Item before update
                        temp_budgetItem = _budgetDataCRUD.GetBudgetItem(editBudgetItem.ItemId);

                        if (temp_budgetItem != null)
                        {
                            temp_budgetItem.PurchaseDate = (DateTime)editBudgetItem.PurchaseDate;

                            bool updateSuccessfull = await _budgetDataCRUD.EditBudgetItem(temp_budgetItem);

                            if (!updateSuccessfull)
                            {
                                return $"Unsuccessful";
                            }
                            return $"Success: Item:{temp_budgetItem.ItemId}, {temp_budgetItem.ItemName}, {temp_budgetItem.PurchaseDate} was changed.";
                        }

                        break;

                    case EditBudgetItem item when item.ItemName != null:
                        //Get budget Item before update
                        temp_budgetItem = _budgetDataCRUD.GetBudgetItem(editBudgetItem.ItemId);

                        if (temp_budgetItem != null)
                        {
                            //Update name
                            temp_budgetItem.ItemName = editBudgetItem.ItemName;

                            bool updateSuccessfull = await _budgetDataCRUD.EditBudgetItem(temp_budgetItem);

                            if (!updateSuccessfull)
                            {
                                return $"Unsuccessful";
                            }
                            return $"Success: Item:{temp_budgetItem.ItemId}, {temp_budgetItem.ItemName}, {temp_budgetItem.PurchaseDate} was changed.";
                        }

                        break;

                    default:
                        return null;
                        break;
                }

                return null;
                
            }
            catch { throw; }
        }

        public bool UpdateBudgetAmountItem(string p_budgetItem_Id, decimal p_new_value)
        {
            //Get budget item that is needed
            BudgetItem temp_budgetItem = _budgetDataCRUD.GetBudgetItem(p_budgetItem_Id);

            if(temp_budgetItem != null)
            {
                //Get budget its assiocated with
                Budget temp_budget = _budgetDataCRUD.GetBudget(temp_budgetItem.BudgetId);

                if (temp_budget != null)
                {
                    //Add the budgetItem back to total budget amount
                    decimal deductionValue = (decimal)temp_budgetItem.ItemAmount - p_new_value;
                    decimal updatedBudgetAmount = temp_budget.BudgetAmount + deductionValue;

                    if (_budgetDataCRUD.EditBudgetAmount(temp_budgetItem.BudgetId, updatedBudgetAmount))
                    {
                        //Reverted back to orignal state
                        return true;
                    }
                }
            }
            return false;
        }

        public async Task<string> GetAllBudgets(string p_session_Id)
        {
            try
            {
                List<Budget> budgets = await _budgetDataCRUD.GetAllBudgets(p_session_Id);

                if (budgets.Count > 0)
                {
                    List<BudgetResponse> budgetResponses = new();
                    foreach (Budget temp_budget in budgets)
                    {
                        budgetResponses.Add(new BudgetResponse()
                        {
                            BudgetId = temp_budget.BudgetId,
                            BudgetName = temp_budget.BudgetName,
                            BudgetAmount = temp_budget.BudgetAmount,
                            StartDate = temp_budget.StartDate,
                            EndDate = temp_budget.EndDate,
                            WeeklyAmount = temp_budget.WeeklyAmount,
                        });
                    }
                    return JsonConvert.SerializeObject(budgetResponses);
                }
                return JsonConvert.SerializeObject("No Budgets");

            }
            catch { throw; };
        }

        public async Task<string> GetBudgetString(string p_budget_Id)
        {
            Budget budget = _budgetDataCRUD.GetBudget(p_budget_Id);

            if(budget != null)
            {
                BudgetResponse budgetResponse = new BudgetResponse { BudgetName = budget.BudgetName, WeeklyAmount = budget.WeeklyAmount };

                return JsonConvert.SerializeObject(budgetResponse);
            }

            return "budget_id does not exist";
        }

        public async Task<string> GetBudgetItems(string p_budget_Id)
        {
            try
            {
                //Get budget items using budget id
                List<BudgetItem> Budgetresponse = await _budgetDataCRUD.GetBudgetItems(p_budget_Id);

                if (Budgetresponse != null)
                {
                    if (Budgetresponse.Count > 0)
                    {
                        List<BudgetItemResponse> budgetItemResponse = new();
                        foreach (BudgetItem budget_item in Budgetresponse)
                        {
                            budgetItemResponse.Add(new BudgetItemResponse()
                            {
                                ItemId = budget_item.ItemId,
                                ItemAmount = budget_item.ItemAmount,
                                ItemName = budget_item.ItemName,
                                PurchaseDate = budget_item.PurchaseDate,
                                BudgetId = budget_item.BudgetId,
                            });
                        }
                        return JsonConvert.SerializeObject(budgetItemResponse);

                    }
                    return JsonConvert.SerializeObject("No Budget Items");
                }
                return JsonConvert.SerializeObject("No Budget Items");
            }
            catch { throw; }
        }

        public async Task<bool> UpdateBudgetAmount(string p_budget_id, DirectDebit p_direct_debit)
        {
            //Get budget object
            Budget budget = await GetBudget(p_budget_id);

            DateTime debitDate = p_direct_debit.DebitDate;
            int count = 0;
            while(debitDate.CompareTo(budget.EndDate) < 0)
            {
                debitDate = debitDate.AddDays(p_direct_debit.Frequency);
                count++;
            }

            decimal deducation_value = count * p_direct_debit.DebitAmount;

            bool updateSuccessful = await _budgetDataCRUD.UpdateBudgetAmount(p_budget_id, deducation_value, p_direct_debit);
            
            return updateSuccessful;
        }

        public async Task<Budget> GetBudget(string p_budget_Id)
        {
            try
            {
                Budget budget = _budgetDataCRUD.GetBudget(p_budget_Id);

                return budget;
            }
            catch { throw; }
        }

        public async Task<bool> CalculateWeekly(string p_budget_Id)
        {
            return await _budgetDataCRUD.CalculateWeekly(p_budget_Id);
        }

        public async Task<bool> DeleteBudget(string p_budget_Id)
        {
            try
            {
                bool isDeleted = await _budgetDataCRUD.DeleteBudget(p_budget_Id);

                if (isDeleted)
                {
                    return true;
                }

                return false;
            }
            catch
            {
                throw;
            }
        }

        public bool DeleteBudgetItem(string p_budgetItem_Id)
        {
            try
            {
                bool isDeleted = _budgetDataCRUD.DeleteBudgetItem(p_budgetItem_Id);

                if (isDeleted)
                {
                    return true;
                }

                return false;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> DeductBudgetAmount(string p_budget_id, decimal p_amount)
        {
            if(p_budget_id != null)
            {
                //GetBudget
                Budget budget = await GetBudget(p_budget_id);

                if(p_amount > 0)
                {
                    budget.BudgetAmount = decimal.Add(budget.BudgetAmount, p_amount);
                }
                if(p_amount < 0)
                {
                    budget.BudgetAmount = decimal.Subtract(budget.BudgetAmount, -p_amount);
                }

                if (_budgetDataCRUD.UpdateBudget(budget))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
