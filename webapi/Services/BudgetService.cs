using Newtonsoft.Json;
using webapi.DataCRUD;
using webapi.Models;
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
            //Check that request information
            Budget budget = await _budgetDataCRUD.CreateBudget(p_session_Id, p_budget_name, p_budget_amount, p_start_date, p_end_date);

            if(budget != null)
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

        public async Task<bool> UserAccess(string p_session_Id, string p_budget_Id)
        {
            bool response = await _budgetDataCRUD.UserAccess(p_session_Id, p_budget_Id);

            return response;
        }


        public async Task<string> CreateBudgetItem(string p_session_Id, string p_budget_id, string p_item_name, decimal p_item_amount, DateTime p_purchase_date)
        {
            BudgetItem budgetItem = await _budgetDataCRUD.CreateBudgetItem(p_session_Id, p_budget_id, p_item_name, p_item_amount, p_purchase_date);

            if(budgetItem != null)
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

        public async Task<string> GetAllBudgets(string p_session_Id)
        {
            List<Budget> budgets = await _budgetDataCRUD.GetAllBudgets(p_session_Id);

            if(budgets.Count > 0)
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

        public async Task<string> GetBudgetString(string p_budget_Id)
        {
            Budget budget = await _budgetDataCRUD.GetBudget(p_budget_Id);

            if(budget != null)
            {
                BudgetResponse budgetResponse = new BudgetResponse { BudgetName = budget.BudgetName, WeeklyAmount = budget.WeeklyAmount };

                return JsonConvert.SerializeObject(budgetResponse);
            }

            return "budget_id does not exist";
        }

        public async Task<string> GetBudgetItems(string p_budget_Id)
        {
            //Get budget items using budget id
            List<BudgetItem> Budgetresponse = await _budgetDataCRUD.GetBudgetItems(p_budget_Id);

            if (Budgetresponse != null)
            {
                if(Budgetresponse.Count > 0)
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
                        });
                    }
                    return JsonConvert.SerializeObject(budgetItemResponse);

                }
                return JsonConvert.SerializeObject("No Budget Items");
            }
            return JsonConvert.SerializeObject("No Budget Items");
        }

        public async Task<bool> UpdateBudgetAmount(string p_budget_id, DirectDebitResponse p_direct_debit)
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
            Budget budget = await _budgetDataCRUD.GetBudget(p_budget_Id);

            return budget;
        }

        public async Task<bool> CalculateWeekly(string p_budget_Id)
        {
            return await _budgetDataCRUD.CalculateWeekly(p_budget_Id);
        }

        public async Task<bool> DeleteBudget(string p_budget_Id)
        {
            bool isDeleted = await _budgetDataCRUD.DeleteBudget(p_budget_Id);

            if(isDeleted)
            {
                return true;
            }

            return false;
        }
    }
}
