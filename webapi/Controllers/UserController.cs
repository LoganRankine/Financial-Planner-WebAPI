﻿using Microsoft.AspNetCore.Http;
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
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                Task<string> getBody = reader.ReadToEndAsync();
                if (getBody.IsCompleted)
                {
                    CreateUser requestUser = JsonConvert.DeserializeObject<CreateUser>(getBody.Result);

                    if(requestUser != null)
                    {
                        if(requestUser.Password == requestUser.Confirm_Password)
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            string response = await _userService.CreateUser(requestUser.Name, requestUser.Email, requestUser.Password);

                            if (response.Contains("SessionID"))
                            {
                                HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                                var session = JsonConvert.DeserializeObject<UserSessionResponse>(response);
                                HttpContext.Response.Cookies.Append("SessionID", session.SessionID);

                            }
                            return JsonConvert.SerializeObject(response);
                        }
                        return JsonConvert.SerializeObject("Passwords do not match");
                    }
                }
                return JsonConvert.SerializeObject("Error occured decoding body");
            }
            catch 
            {
                return JsonConvert.SerializeObject("Error processing request");
            }
        }

        [HttpPost("AuthenticateUser")]
        async public Task<string> AuthenticateUser()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            try
            {
                StreamReader reader = new StreamReader(Request.Body, Encoding.ASCII);
                Task<string> getBody = reader.ReadToEndAsync();
                if (getBody.IsCompleted)
                {
                    User requestUser = JsonConvert.DeserializeObject<User>(getBody.Result);

                    if (requestUser != null)
                    {
                        string response = await _userService.AuthenticateUser(requestUser.Name, requestUser.Password);
                        HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;


                        if (response.Contains("SessionID"))
                        {
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            var session = JsonConvert.DeserializeObject<UserSessionResponse>(response);
                            HttpContext.Response.Cookies.Append("SessionID", session.SessionID);
                        }
                        return JsonConvert.SerializeObject(response);
                    }
                }
                return JsonConvert.SerializeObject("Error occured decoding body");
            }
            catch
            {
                return JsonConvert.SerializeObject("Error processing request");
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

                if(sessionID == null)
                {
                    return "No x-api-key provided in header";
                }

                bool response = await _userService.CheckAuthStatus(sessionID);

                if(response)
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                    return "Authorised";
                }
                else if (!response)
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return "Not Authorised";
                }
                return "beans";
            }
            catch
            {
                return JsonConvert.SerializeObject("Error processing request");
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

                if (response != "Not Found")
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                    return JsonConvert.SerializeObject(response);
                }
                else
                {
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return JsonConvert.SerializeObject(response);
                }
            }
            catch
            {
                return JsonConvert.SerializeObject("Error processing request");
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
