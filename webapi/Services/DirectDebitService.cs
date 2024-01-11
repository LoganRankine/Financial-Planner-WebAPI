using Newtonsoft.Json;
using System.Diagnostics;
using webapi.DataAccess;
using webapi.DataCRUD;
using webapi.Models;
using webapi.Models.BudgetObjects;
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
            DirectDebit directDebit = await _directDebitDataCRUD.CreateDebit(p_budget_Id, p_debit_name, p_debit_amount, p_debit_date, p_frequency, debit_date_due);

            bool updateSuccessfull = await _budgetService.UpdateBudgetAmount(p_budget_Id, directDebit);

            if(updateSuccessfull)
            {
                return JsonConvert.SerializeObject(new DirectDebitResponse()
                {
                    DebitId = directDebit.DebitId,
                    DebitName = directDebit.DebitName,
                    DebitDate = directDebit.DebitDate,
                    DebitAmount = directDebit.DebitAmount,
                    Frequency = directDebit.Frequency,
                    DebitDueDate = directDebit.DebitDueDate
                });
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

        /// <summary>
        /// Finds how much the direct debit will cost in total
        /// </summary>
        /// <param name="p_direct_debit"></param>
        /// <returns></returns>
        public async Task<decimal> CalculateDirectDebit(DirectDebit p_direct_debit)
        {
            Budget budget = await _budgetService.GetBudget(p_direct_debit.BudgetId);

            DateTime debitDate = p_direct_debit.DebitDate;
            int count = 0;
            while (debitDate.CompareTo(budget.EndDate) < 0)
            {
                debitDate = debitDate.AddDays(p_direct_debit.Frequency);
                count++;
            }

            decimal deducation_value = count * p_direct_debit.DebitAmount;

            return deducation_value;
            ////Get budget object
            //Budget budget = await GetBudget(p_budget_id);

            ////DateTime debitDate = p_direct_debit.DebitDate;
            ////int count = 0;
            ////while (debitDate.CompareTo(budget.EndDate) < 0)
            ////{
            ////    debitDate = debitDate.AddDays(p_direct_debit.Frequency);
            ////    count++;
            ////}

            ////decimal deducation_value = count * p_direct_debit.DebitAmount;

            //bool updateSuccessful = await _budgetDataCRUD.UpdateBudgetAmount(p_budget_id, deducation_value, p_direct_debit);

            //return updateSuccessful;
        }

        public async Task<bool> EditDirectDebit(EditDirectDebit p_edit_direct_debit)
        {
            try
            {
                bool recalculateCost = false;
                if (p_edit_direct_debit != null)
                {
                    //Get direct debit that is being updated
                    DirectDebit temp_directDebit = _directDebitDataCRUD.GetDirecDebit(p_edit_direct_debit.DebitId);

                    //Update debit name
                    if (p_edit_direct_debit.DebitName != null)
                    {
                        temp_directDebit.DebitName = p_edit_direct_debit.DebitName;
                    }

                    //Update debit frequency
                    if (p_edit_direct_debit.Frequency != null)
                    {
                        temp_directDebit.Frequency = (int)p_edit_direct_debit.Frequency;

                        recalculateCost = true;
                    }

                    //Update debit date
                    if (p_edit_direct_debit.DebitDate != null)
                    {
                        temp_directDebit.DebitDate = (DateTime)p_edit_direct_debit.DebitDate;

                        //Calculate the due date
                        DateTime newDebitDueDate = temp_directDebit.DebitDate;
                        newDebitDueDate = newDebitDueDate.AddDays(temp_directDebit.Frequency);

                        //Update directDebit with new due date
                        temp_directDebit.DebitDueDate = newDebitDueDate;

                        recalculateCost = true;
                    }

                    //Update debit amount
                    if (p_edit_direct_debit.DebitAmount != null)
                    {
                        temp_directDebit.DebitAmount = (decimal)p_edit_direct_debit.DebitAmount;

                        recalculateCost = true;
                    }

                    if (recalculateCost)
                    {
                        //Recalculate the cost of direct debit
                        decimal newDebitTotal = await CalculateDirectDebit(temp_directDebit);

                        decimal deductionValue = decimal.Subtract(temp_directDebit.DebitTotalAmount, newDebitTotal);

                        //Update Total Debit Amount
                        temp_directDebit.DebitTotalAmount = newDebitTotal;

                        if (!await _budgetService.DeductBudgetAmount(temp_directDebit.BudgetId, deductionValue))
                        {
                            return false;
                        }
                    }

                    //Update Direct Debit with new values
                    DirectDebit UpdateDirectDebit = new()
                    {
                        DebitAmount = temp_directDebit.DebitAmount,
                        DebitDate = temp_directDebit.DebitDate,
                        DebitName = temp_directDebit.DebitName,
                        Frequency = temp_directDebit.Frequency,

                        BudgetId = temp_directDebit.BudgetId,
                        DebitId = temp_directDebit.DebitId,
                        DebitDueDate = temp_directDebit.DebitDueDate,
                        DebitTotalAmount = temp_directDebit.DebitTotalAmount,
                    };

                    if (_directDebitDataCRUD.UpdateDirectDebit(UpdateDirectDebit) != null)
                    {
                        return true;
                    }
                }
                return false;
            }
            catch
            {
                throw;
            }
        }

        public bool DebitAuthourised(string p_user_id, string p_debit_id)
        {
            try
            {
                if(p_user_id != null && p_debit_id != null)
                {
                    _directDebitDataCRUD.DebitAuthourised(p_user_id, p_debit_id); 
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
