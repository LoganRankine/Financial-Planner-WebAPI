using Newtonsoft.Json;
using webapi.DataAccess;
using webapi.DataCRUD;
using webapi.Models.DirectDebitObjects;

namespace webapi.Services
{
    public class DirectDebitService
    {
        private readonly DirectDebitCRUD _directDebitDataCRUD;
        private readonly BudgetService _budgetService;

        public DirectDebitService(DirectDebitCRUD directDebitDataCRUD, BudgetService budgetService)
        {
            _directDebitDataCRUD = directDebitDataCRUD; _budgetService = budgetService;
        }

        public async Task<string> CreateDirectDebit(string p_budget_Id, string p_debit_name, decimal p_debit_amount, DateTime p_debit_date, int p_frequency)
        {
            //Ensure it has been successfully added
            DirectDebitResponse response = await _directDebitDataCRUD.CreateDebit(p_budget_Id, p_debit_name, p_debit_amount, p_debit_date, p_frequency);

            bool updateSuccessfull = await _budgetService.UpdateBudgetAmount(p_budget_Id, response);

            if(updateSuccessfull)
            {
                return JsonConvert.SerializeObject(response);
            }

            return "unsuccessful";

            //If added successfully
            //Update budget amount

        }

        public async Task<string> GetAllDebits(string p_budget_Id, string p_session_Id)
        {
            string response = await _directDebitDataCRUD.GetAllDebits(p_budget_Id, p_session_Id);



            return response;
        }

    }
}
