using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using System.Text.Json.Nodes;
using webapi.Models.BudgetItemObjects;
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
                    string response = await _budgetService.CreateBudget(sessionID, createBudget.BudgetName, createBudget.AvailableAmount, createBudget.StartDate, createBudget.EndDate);
                    
                    if (response.Contains("BudgetName"))
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
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
                        string response = await _budgetService.CreateBudgetItem(sessionID, createBudgetItem.BudgetId, createBudgetItem.ItemName, (decimal)createBudgetItem.ItemAmount, (DateTime)createBudgetItem.PurchaseDate);

                        if (response.Contains("ItemName"))
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
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

        [Authorize]
        [HttpDelete("DeleteBudget")]
        async public Task<string> DeleteBudget()
        {
            try
            {
                string budgetId = HttpContext.Request.Query["budget_Id"].ToString();
                string sessionId = HttpContext.Request.Headers["x-api-key"].ToString();

                if (await _budgetService.UserAccess(sessionId, budgetId))
                {
                    bool deleteComplete = await _budgetService.DeleteBudget(budgetId);

                    if(deleteComplete)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(new Models.Success {
                            SuccessTitle = "Delete Successful",
                            SuccessDescription = $"Budget: {budgetId} was deleted"
                        });
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Failed to delete",
                        ErrorDescription = "Budget was not deleted. Ensure budgetId exists."
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Budget Unauthourized",
                    ErrorDescription = "User does not have access to this budget. Check x-api-key if its for correct user."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured with request",
                    ErrorDescription = ""
                });
            }
        }

        [Authorize]
        [HttpDelete("DeleteBudgetItem")]
        async public Task<string> DeleteBudgetItem(string budget_Id, string budgetItem_Id)
        {
            try
            {
                string sessionId = HttpContext.Request.Headers["x-api-key"].ToString();

                if(budget_Id == ""|| budgetItem_Id == "")
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Budget",
                        ErrorDescription = "budgetItem_Id or budget_Id was not provided in the request. Include them and try the request again."
                    });
                }

                if (await _budgetService.UserAccess(sessionId, budget_Id))
                {
                    bool deleteComplete = _budgetService.DeleteBudgetItem(budgetItem_Id);

                    if (deleteComplete)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return JsonConvert.SerializeObject(new Models.Success
                        {
                            SuccessTitle = "Delete Successful",
                            SuccessDescription = $"BudgetItem: {budgetItem_Id} was deleted"
                        });
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Failed to delete",
                        ErrorDescription = "BudgetItem was not deleted. Ensure budgetItem exists."
                    });
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "BudgetItem Unauthourized",
                    ErrorDescription = "User does not have access to this budgetItem. Check x-api-key if its for correct user."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured with request",
                    ErrorDescription = "An error occured while deleted the budgetItem."
                });
            }
        }

        [Authorize]
        [HttpPut("EditBudgetItem")]
        async public Task<string> EditBudgetItem()
        {
            try
            {
                //Get request body into a string
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                //Parse request string into budgetitem object
                EditBudgetItem editBudgetItem = JsonConvert.DeserializeObject<EditBudgetItem>(getBody);

                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                //Ensure the ItemId is included
                if(editBudgetItem.ItemId == null)
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Error updating budget item",
                        ErrorDescription = "Missing ItemId, include and try again"
                    });
                }

                //Ensure object has been parsed
                if (editBudgetItem != null && editBudgetItem.BudgetId != null)
                {
                    //Does the user have access to the budget?
                    if (await _budgetService.UserAccess(sessionID, editBudgetItem.BudgetId))
                    {
                        string response = await _budgetService.EditBudgetItem(editBudgetItem);

                        if (response.Contains("Success"))
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
                            return JsonConvert.SerializeObject(new Models.Success
                            {
                                SuccessTitle = "Update was successful",
                                SuccessDescription = response
                            });
                        }

                        if (response.Contains("Unsuccessful"))
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                            return JsonConvert.SerializeObject(new Models.Error
                            {
                                ErrorTitle = "Error updating budget item",
                                ErrorDescription = response
                            });
                        }
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

        [Authorize]
        [HttpPut("EditBudget")]
        async public Task<string> EditBudget()
        {
            try
            {
                //Get request body into a string
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                //Parse request string into budgetitem object
                EditBudget editBudget = JsonConvert.DeserializeObject<EditBudget>(getBody);

                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                //Ensure the BudgetId is included
                if (editBudget.BudgetId == null)
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Error updating budget item",
                        ErrorDescription = "Missing ItemId, include and try again"
                    });
                }

                //Ensure object has been parsed
                if (editBudget != null && editBudget.BudgetId != null)
                {
                    //Does the user have access to the budget?
                    if (await _budgetService.UserAccess(sessionID, editBudget.BudgetId))
                    {
                        UpdateBudgetResponse updateBudgetResponse = await _budgetService.EditBudget(editBudget);

                        if (updateBudgetResponse.Success)
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
                            return JsonConvert.SerializeObject(updateBudgetResponse);
                        }

                        if (!updateBudgetResponse.Success)
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                            return JsonConvert.SerializeObject(new Models.Error
                            {
                                ErrorTitle = "Error updating budget item",
                                ErrorDescription = updateBudgetResponse.Description
                            });
                        }
                    }

                    HttpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "Budget forbidden",
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
