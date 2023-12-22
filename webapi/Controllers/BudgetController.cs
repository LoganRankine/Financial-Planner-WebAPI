using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using webapi.Models.BudgetObjects;
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

        [Authorize]
        [HttpGet("AllBudgets")]
        async public Task<string> GetAllBudgets()
        {
            try
            {
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                string response = await _budgetService.GetAllBudgets(sessionID);

                if (response.Contains("BudgetName"))
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                    return JsonConvert.SerializeObject(response);

                }
                if (response.Contains("No Budgets"))
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.NoContent;
                    return JsonConvert.SerializeObject("");
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured getting budgets",
                    ErrorDescription = response
                });

            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured getting budgets",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [Authorize]
        [HttpGet("CalculateWeekly")]
        async public Task<bool> CalculateWeekly()
        {
            string budget_id = HttpContext.Request.Query["budget_id"].ToString();
            await _budgetService.CalculateWeekly(budget_id);
            return await _budgetService.CalculateWeekly(budget_id);
        }

        [Authorize]
        [HttpGet("BudgetItems")]
        async public Task<string> GetBudgetItems()
        {
            try
            {
                string budget_id = HttpContext.Request.Query["budget_Id"].ToString();
                string session_id = HttpContext.Request.Headers["x-api-key"].ToString();

                if (await _budgetService.UserAccess(session_id, budget_id))
                {
                    string response = await _budgetService.GetBudgetItems(budget_id);

                    if (response.Contains("ItemName"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(response);
                    }

                    if(response.Contains("No Budget Items"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.NoContent;
                        return JsonConvert.SerializeObject("");
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Error occured getting budget items",
                        ErrorDescription = response
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "BudgetItem forbidden",
                    ErrorDescription = "User does not have access to this budget. Check you have included the correct SessionID."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured getting budget items",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [Authorize]
        [HttpPost("CreateBudget")]
        async public Task<string> CreateBudget()
        {
            //HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                CreateBudget createBudget = JsonConvert.DeserializeObject<CreateBudget>(getBody);
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                if (createBudget != null)
                {
                    string response = await _budgetService.CreateBudget(sessionID, createBudget.BudgetName, createBudget.BudgetAmount, createBudget.StartDate, createBudget.EndDate);
                    
                    if (response.Contains("BudgetName"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(response);
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Error occured creating budget",
                        ErrorDescription = response
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured parsing body",
                    ErrorDescription = "Could not parse string to budget object. Check the budget object made correctly."
                });
            }
            catch
            {

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured creating budget error",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [Authorize]
        [HttpGet("GetBudget")]
        async public Task<string> Budget()
        {
            try
            {
                string session_id = HttpContext.Request.Headers["x-api-key"].ToString();

                string budget_id = HttpContext.Request.Query["budget_id"].ToString();
                
                //Ensure budget id was included in request
                if(budget_id != "")
                {
                    string response = await _budgetService.GetBudgetString(budget_id);

                    if (response.Contains("BudgetName"))
                    {
                        return response;
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "budget_id error",
                        ErrorDescription = response
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "budget_id error",
                    ErrorDescription = "budget_id was not sent in query or incorrectly included. Include '?budget_id={BudgetId}' in query of request."
                });
            }
            catch
            {
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured getting budget error",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [Authorize]
        [HttpPost("CreateBudgetItem")]
        async public Task<string> CreateBudgetItem()
        {
            try
            {
                //Get request body into a string
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                //Parse request string into budgetitem object
                CreateBudgetItem createBudgetItem = JsonConvert.DeserializeObject<CreateBudgetItem>(getBody);

                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                //Ensure object has been parsed
                if (createBudgetItem != null)
                {
                    //Does the user have access to the budget?
                    if (await _budgetService.UserAccess(sessionID, createBudgetItem.BudgetId))
                    {
                        string response = await _budgetService.CreateBudgetItem(sessionID, createBudgetItem.BudgetId, createBudgetItem.ItemName, createBudgetItem.ItemAmount, createBudgetItem.PurchaseDate);

                        if (response.Contains("ItemName"))
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            return JsonConvert.SerializeObject(response);
                        }

                        HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Error decoding body",
                            ErrorDescription = response
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
                    ErrorTitle= "Error parsing BudgetItem",
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
