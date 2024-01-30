using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using webapi.Services;
using Newtonsoft.Json;
using webapi.Models;
using System.Net;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cors;
using Microsoft.Net.Http.Headers;
using Azure;
using Microsoft.AspNetCore.Authorization;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors]
    public class UserController : Controller
    {
        private readonly UserService _userService;

        public UserController(UserService userService) { _userService = userService; }

        [HttpPost("CreateUser")]
        async public Task<string> CreateUser()
        {
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                CreateUser requestUser = JsonConvert.DeserializeObject<CreateUser>(getBody);

                if (requestUser != null)
                {
                    CreateUserResponse createUserResponse = await _userService.CreateUser(requestUser);

                    if (createUserResponse.Success)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.Created;
                        return JsonConvert.SerializeObject(createUserResponse);
                    }

                    if(createUserResponse.UserNameExists)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Username exists",
                            ErrorDescription = createUserResponse.Desciption
                        });
                    }

                    if (createUserResponse.EmailExists)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Email exists",
                            ErrorDescription = createUserResponse.Desciption
                        });
                    }

                    if (!createUserResponse.PasswordsMatch)
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Passwords don't match",
                            ErrorDescription = createUserResponse.Desciption
                        });
                    }
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured parsing user object",
                    ErrorDescription = "Check the object is constructed correct. Check request."
                });
            }
            catch 
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured creating user",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [HttpPost("AuthenticateUser")]
        async public Task<string> AuthenticateUser()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                //Decode request body
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                string getBody = await reader.ReadToEndAsync();

                User requestUser = JsonConvert.DeserializeObject<User>(getBody);

                if (requestUser != null)
                {
                    UserSessionResponse response = await _userService.AuthenticateUser(requestUser);

                    if (response.Success)
                    {
                        if(response.SessionID != null)
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            string sessionId = response.SessionID;
                            HttpContext.Response.Cookies.Append("SessionID", sessionId);
                            return JsonConvert.SerializeObject(response);
                        }
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        return JsonConvert.SerializeObject(new Models.Error 
                        { 
                            ErrorTitle = "Error occured",
                            ErrorDescription = "Error occured getting SessionID"
                        });
                    }
                    else
                    {
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "User authentication error",
                            ErrorDescription = "Password or username was incorrect. Try again."
                        });

                    }
                }

                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured parsing Authentification object",
                    ErrorDescription = "Check request. Check the object is constructed correct."
                });
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured authenticating user",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [Authorize]
        [HttpGet("CheckAuthStatus")]
        async public Task<string> AuthStatus()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                bool response = await _userService.CheckAuthStatus(sessionID);

                if(response)
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                    return JsonConvert.SerializeObject(sessionID);
                }
                else
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return JsonConvert.SerializeObject(new Models.Error
                    {
                        ErrorTitle = "User not authenticated",
                        ErrorDescription = "The sessionId provided in header is not authenicated"
                    });

                }
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured authenticating user",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [Authorize]
        [HttpGet("GetUsername")]
        async public Task<string> Username()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                string sessionID = HttpContext.Request.Headers["x-api-key"].ToString();

                string response = await _userService.UserName(sessionID);

                switch (response)
                {
                    case "Not Found":
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "User not found",
                            ErrorDescription = "User could not be found. Check request."
                        });

                    case "Error":
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        return JsonConvert.SerializeObject(new Models.Error
                        {
                            ErrorTitle = "Error occured getting user informatiom",
                            ErrorDescription = "Error occured getting user information. Check request."
                        });

                    default:
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                        return response;
                }
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return JsonConvert.SerializeObject(new Models.Error
                {
                    ErrorTitle = "Error occured authenticating user",
                    ErrorDescription = "An unexpected error occured. Check request."
                });
            }
        }

        [HttpPost("GetPublicKey")]
        async public Task<string> GetPublicKey()
        {
            //Get private key
            var key = new CspParameters
            {
                KeyContainerName = "MachineKeyStore"
            };

            using var rsa = new RSACryptoServiceProvider(key);

            string publickey = rsa.ToXmlString(false);


            return publickey;
        }
    }
}
