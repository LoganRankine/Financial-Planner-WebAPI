using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using webapi.Services;
using Newtonsoft.Json;
using webapi.Models;
using System.Net;
using System.Security.Cryptography;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserService _userService;


        public UserController(UserService userService) { _userService = userService; }

        [HttpPost("CreateUser")]
        async public Task<string> CreateUser()
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
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
                            string response = await _userService.CreateUser(requestUser.Name, requestUser.Email, requestUser.Password);
                            HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            return response;
                        }

                        return "Passwords do not match";
                    }
                }
                return "Error occured decoding body";
            }
            catch 
            {
                return "Error processing request";
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
