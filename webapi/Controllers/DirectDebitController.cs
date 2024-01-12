using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Security.Claims;
using System.Text;
using webapi.Models;
using webapi.Models.BudgetItemObjects;
using webapi.Models.DirectDebitObjects;
using webapi.Services;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors]
    public class DirectDebitController : Controller
    {
        private readonly DirectDebitService _directDebitService;

        private readonly BudgetService _budgetService;

        public DirectDebitController(DirectDebitService directDebitService, BudgetService budgetService) { _directDebitService = directDebitService; _budgetService = budgetService; }

        /// <summary>
        /// Gets all budgets- Request must contain sessionID
        /// </summary>
        /// <returns>Successful- All budgets as JSON object stringified. </returns>
        [Authorize]
        [HttpGet("AllDirectDebits")]
        async public Task<string> GetAllDirectDebits()
        {
            try
            {
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                //Get budgetId
                string budgetId = HttpContext.Request.Query["budget_Id"].ToString();

                if(await _budgetService.UserAccess(sessionID, budgetId))
                {
                    string response = await _directDebitService.GetAllDebits(budgetId, sessionID);

                    if (response.Contains("DebitName"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(response);
                    }
                    if (response.Contains("No DirectDebits"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.NoContent;
                        return JsonConvert.SerializeObject("");
                    }
                }
                HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Unauthourised debit",
                    ErrorDescription = "This user does not own the direct debits. Check the sessionId is for correct user."
                });
            }
            catch
            {
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured parsing body",
                    ErrorDescription = "The object could not be parsed from the body. Check the debit creation object is correct."
                });
            }
        }

        /// <summary>
        /// Creates a budget- Request must contain JSON body with BudgetName(string), AvailableAmount(decimal),
        /// StartDate(DateTime) EndDate(DateTime). Must include SessionId as header.
        /// </summary>
        /// <returns> Successful- Created Budget in JSON with BudgetId. Unsuccessful- Reason why it failed</returns>
        [Authorize]
        [HttpPost("CreateDebit")]
        async public Task<string> CreateDebit()
        {
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                CreateDirectDebit createDebit = JsonConvert.DeserializeObject<CreateDirectDebit>(getBody);
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                if (createDebit != null)
                {
                    string response = await _directDebitService.CreateDirectDebit(createDebit.BudgetId, createDebit.DebitName, createDebit.DebitAmount, createDebit.DebitDate, createDebit.Frequency);

                    if (response.Contains("DebitName"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
                        return JsonConvert.SerializeObject(response);
                    }
                    if(response.Contains("Creation Failure"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Error occured creating direct debit",
                            ErrorDescription = "There was a error in the server that prevented the direct debit from been saved."
                        });
                    }
                }
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured parsing body",
                    ErrorDescription = "The object could not be parsed from the body. Check the debit creation object is correct."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured decoding the body",
                    ErrorDescription = "The body could not be decoded. Check if the body is correct."
                });
            }
        }

        [Authorize]
        [HttpDelete("DeleteDirectDebit")]
        async public Task<string> DeleteDirectDebit(string budget_Id, string debit_Id)
        {
            try
            {
                string sessionId = HttpContext.Request.Headers["x-api-key"].ToString();

                if (budget_Id == "" || debit_Id == "")
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Delete debit request paramaters missing",
                        ErrorDescription = "budget_Id or debit_Id was not provided in the request. Include them and try the request again."
                    });
                }

                //Ensure user is authourised to modify budget
                if (await _budgetService.UserAccess(sessionId, budget_Id))
                {
                    bool deleteComplete = _directDebitService.DeleteDebit(debit_Id);

                    if (deleteComplete)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(new Models.Success
                        {
                            SuccessTitle = "Delete Successful",
                            SuccessDescription = $"DirectDebit: {debit_Id} was deleted"
                        });
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Failed to delete",
                        ErrorDescription = "DirectDebit was not deleted. Ensure DirectDebit exists."
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "DirectDebit Unauthourized",
                    ErrorDescription = "User does not have access to this DirectDebit. Check x-api-key if its for correct user."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured with request",
                    ErrorDescription = "An error occured when deleting the DirectDebit."
                });
            }
        }

        [Authorize]
        [HttpPut("EditDirectDebit")]
        async public Task<string> EditDirectDebit()
        {
            try
            {
                //Get userId
                string userId = User.Claims.Where(claim => claim.Type == "UserId").Select(c => c.Value).SingleOrDefault();

                //Get request body into a string
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                //Parse request string into budgetitem object
                EditDirectDebit editDirectDebit = JsonConvert.DeserializeObject<EditDirectDebit>(getBody);

                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                //Ensure the DebitId is included
                if (editDirectDebit.DebitId == null)
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Error updating direct debit",
                        ErrorDescription = "Missing DebitId, include and try again"
                    });
                }

                //Ensure object has been parsed
                if (editDirectDebit != null && editDirectDebit.BudgetId != null)
                {
                    //Does the user have access to the budget?
                    if (_directDebitService.DebitAuthourised(userId, editDirectDebit.DebitId))
                    {
                        bool response = await _directDebitService.EditDirectDebit(editDirectDebit);

                        if (response)
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
                            return JsonConvert.SerializeObject(new Models.Success
                            {
                                SuccessTitle = "Update was successful",
                                SuccessDescription = "Change to direct debit was successful"
                            });
                        }
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Error updating direct debit",
                            ErrorDescription = "Changes to direct debit was not made"
                        });
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "BudgetItem forbidden",
                        ErrorDescription = "User does not have access to this BudgetItem. Check you have included the correct SessionID."
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error parsing BudgetItem",
                    ErrorDescription = "The budgetItem object sent in request could not be parsed. Check whether budget item is created correctly."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error decoding body",
                    ErrorDescription = "Error occured getting request body "
                });
            }
        }


    }
}
