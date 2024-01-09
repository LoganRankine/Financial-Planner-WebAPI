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

            //Find the due date
            DateTime debit_date_due = p_debit_date;
            debit_date_due = debit_date_due.AddDays(p_frequency);

            //Ensure it has been successfully added
            DirectDebitResponse response = await _directDebitDataCRUD.CreateDebit(p_budget_Id, p_debit_name, p_debit_amount, p_debit_date, p_frequency, debit_date_due);

            bool updateSuccessfull = await _budgetService.UpdateBudgetAmount(p_budget_Id, response);

            if(updateSuccessfull)
            {
                return JsonConvert.SerializeObject(response);
            }

            return "Creation Failure";

            //If added successfully
            //Update budget amount

        }

        public async Task<string> GetAllDebits(string p_budget_Id, string p_session_Id)
        {
            List<DirectDebit> response = await _directDebitDataCRUD.GetAllDebits(p_budget_Id, p_session_Id);

            if(response.Count != 0)
            {
                List<DirectDebitResponse> directDebitResponses = new List<DirectDebitResponse>();

                foreach (DirectDebit debit in response)
                {
                    directDebitResponses.Add(new DirectDebitResponse
                    {
                        DebitId = debit.DebitId,
                        DebitName = debit.DebitName,
                        DebitAmount = debit.DebitAmount,
                        DebitDate = debit.DebitDate,
                        Frequency = debit.Frequency,
                        DebitDueDate = debit.DebitDueDate,
                        DebitTotalAmount = debit.DebitTotalAmount,
                        BudgetId = debit.BudgetId,
                    });
                }
                return JsonConvert.SerializeObject(directDebitResponses);
            }

            return "No DirectDebits";
        }

        public bool DeleteDebit(string p_debit_Id)
        {
            try
            {
                bool isDeleted = _directDebitDataCRUD.DeleteDebit(p_debit_Id);

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

    }
}
