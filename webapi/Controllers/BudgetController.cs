using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using webapi.Models;
using webapi.Services;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors]
    public class BudgetController : Controller
    {
        private readonly BudgetService _budgetService;


        public BudgetController(BudgetService budgetService) { _budgetService = budgetService; }

        /// <summary>
        /// Gets all budgets- Request must contain sessionID
        /// </summary>
        /// <returns>Successful- All budgets as JSON object stringified. </returns>
        [HttpGet("AllBudgets")]
        async public Task<string> GetAllBudgets()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                Task<string> getBody = reader.ReadToEndAsync();
                if (getBody.IsCompleted)
                {
                    CreateBudget createBudget = JsonConvert.DeserializeObject<CreateBudget>(getBody.Result);
                    string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                    if (createBudget != null)
                    {
                        if (sessionID != null || sessionID != "")
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            string response = await _budgetService.GetAllBudgets(sessionID);

                            if (response.Contains("BudgetName"))
                            {
                                HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                                return JsonConvert.SerializeObject(response);

                            }
                            else if(response.Contains("No Budgets"))
                            {
                                HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                                return JsonConvert.SerializeObject(response);
                            }
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                            return JsonConvert.SerializeObject(response);
                        }
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

        /// <summary>
        /// Creates a budget- Request must contain JSON body with BudgetName(string), BudgetAmount(decimal),
        /// StartDate(DateTime) EndDate(DateTime). Must include SessionId as header.
        /// </summary>
        /// <returns> Successful- Created Budget in JSON with BudgetId. Unsuccessful- Reason why it failed</returns>
        [HttpPost("CreateBudget")]
        async public Task<string> CreateBudget()
        {
            //HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                Task<string> getBody = reader.ReadToEndAsync();
                if (getBody.IsCompleted)
                {
                    CreateBudget createBudget = JsonConvert.DeserializeObject<CreateBudget>(getBody.Result);
                    string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                    if (createBudget != null)
                    {
                        if (sessionID != null || sessionID != "")
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            string response = await _budgetService.CreateBudget(sessionID, createBudget.BudgetName, createBudget.BudgetAmount, createBudget.StartDate, createBudget.EndDate);

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
