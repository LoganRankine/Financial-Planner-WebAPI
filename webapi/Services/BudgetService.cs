using webapi.DataCRUD;

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

        public async Task<string> GetAllBudgets(string p_session_Id)
        {
            string response = await _budgetDataCRUD.GetAllBudgets(p_session_Id);

            return response;
        }

    }
}
