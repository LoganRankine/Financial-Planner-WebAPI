using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using webapi.Models;
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

        public DirectDebitController(DirectDebitService directDebitService) { _directDebitService = directDebitService; }

        /// <summary>
        /// Gets all budgets- Request must contain sessionID
        /// </summary>
        /// <returns>Successful- All budgets as JSON object stringified. </returns>
        [Authorize]
        [HttpGet("AllDirectDebits")]
        async public Task<string> GetAllDirectDebits()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                //Get budgetId
                string budgetId = HttpContext.Request.Query["budget_Id"].ToString();

                if(await _directDebitService.UserAccess(sessionID, budgetId))
                {
                    string response = await _directDebitService.GetAllDebits(budgetId, sessionID);

                    if (response.Contains("DebitName"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(response);
                    }
                    else if (response.Contains("No Budgets"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(response);
                    }
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                    return JsonConvert.SerializeObject(response);

                }

                return JsonConvert.SerializeObject("Error occured");
            }
            catch
            {
                return JsonConvert.SerializeObject("Error processing request");
            }
        }

        /// <summary>
        /// Creates a budget- Request must contain JSON body with BudgetName(string), BudgetAmount(decimal),
        /// StartDate(DateTime) EndDate(DateTime). Must include SessionId as header.
        /// </summary>
        /// <returns> Successful- Created Budget in JSON with BudgetId. Unsuccessful- Reason why it failed</returns>
        [Authorize]
        [HttpPost("CreateDebit")]
        async public Task<string> CreateDebit()
        {
            //HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                Task<string> getBody = reader.ReadToEndAsync();
                if (getBody.IsCompleted)
                {
                    CreateDirectDebit createDebit = JsonConvert.DeserializeObject<CreateDirectDebit>(getBody.Result);
                    string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                    if (createDebit != null)
                    {
                        if (sessionID != null || sessionID != "")
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            string response = await _directDebitService.CreateDirectDebit(createDebit.BudgetId, createDebit.DebitName, createDebit.DebitAmount, createDebit.DebitDate, createDebit.Frequency);

                            return JsonConvert.SerializeObject(response);
                        }
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

                        return JsonConvert.SerializeObject("SessionId not included in header");
                    }
                }
                return JsonConvert.SerializeObject("Error occured decoding body");
            }
            catch
            {
                return JsonConvert.SerializeObject("Error processing request");
            }
        }
    }
}
