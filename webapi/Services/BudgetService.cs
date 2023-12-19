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
            string response = await _budgetDataCRUD.CreateBudget(p_session_Id, p_budget_name, p_budget_amount, p_start_date, p_end_date);

            return response;
        }

        public async Task<bool> UserAccess(string p_session_Id, string p_budget_Id)
        {
            bool response = await _budgetDataCRUD.UserAccess(p_session_Id, p_budget_Id);

            return response;
        }


        public async Task<string> CreateBudgetItem(string p_session_Id, string p_budget_id, string p_item_name, decimal p_item_amount, DateTime p_purchase_date)
        {
            string response = await _budgetDataCRUD.CreateBudgetItem(p_session_Id, p_budget_id, p_item_name, p_item_amount, p_purchase_date);

            return response;
        }

        public async Task<string> GetAllBudgets(string p_session_Id)
        {
            string response = await _budgetDataCRUD.GetAllBudgets(p_session_Id);

            return response;
        }

        public async Task<string> GetBudgetString(string p_budget_Id)
        {
            Budget response = await _budgetDataCRUD.GetBudget(p_budget_Id);

            BudgetResponse temp = new BudgetResponse { BudgetName = response.BudgetName, WeeklyAmount = response.WeeklyAmount };

            return JsonConvert.SerializeObject(temp);
        }


        public async Task<string> GetBudgetItems(string p_budget_Id)
        {
            string response = await _budgetDataCRUD.GetBudgetItems(p_budget_Id);

            return response;
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
    }
}
