using System;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Reflection.PortableExecutable;
using System.Net.Http.Headers;
using webapi.DataCRUD;
using Newtonsoft.Json;

namespace webapi.Auth
{
    public class CustomAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>, IAuthenticationHandler
    {
        private Models.UserContext DbContext { get; set; }
        readonly UserDataCRUD _dbAccess;
        private IHttpContextAccessor HttpContextAccessor { get; set; }

        public CustomAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            Models.UserContext dbContext,
            UserDataCRUD dbAccess,
            IHttpContextAccessor httpContextAccessor)
            : base(options, logger, encoder, clock)
        {
            DbContext = dbContext;
            _dbAccess = dbAccess;
            HttpContextAccessor = httpContextAccessor;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            #region Task5
            // TODO:  Find if a header ‘ApiKey’ exists, and if it does, check the database to determine if the given API Key is valid
            //        Then create the correct Claims, add these to a ClaimsIdentity, create a ClaimsPrincipal from the identity 
            //        Then use the Principal to generate a new AuthenticationTicket to return a Success AuthenticateResult
            #endregion
            //APIKEY exists
            var ApiKey = Request.Headers["x-api-key"];

            if (ApiKey.Count == 0 || ApiKey.Count == null)
            {
                return Task.FromResult(AuthenticateResult.Fail("Unauthorized.Check ApiKey in Header is correct."));
            }

            Models.User user = _dbAccess.CheckAuthStatus(ApiKey).Result;
            if (user != null)
            {
                Claim[] claims = new Claim[]
                {
                    new Claim(ClaimTypes.Name, ApiKey),
                    new Claim(type: "UserId", value: user.Id)
                };
                ClaimsIdentity Identity = new ClaimsIdentity(claims, "ApiKey");

                ClaimsPrincipal principal = new ClaimsPrincipal(Identity);

                var ticket = new AuthenticationTicket(principal, this.Scheme.Name);

                return Task.FromResult(AuthenticateResult.Success(ticket));
            }

            return Task.FromResult(AuthenticateResult.Fail("Unauthorized.Check ApiKey in Header is correct."));
        }

        protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            byte[] messagebytes = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(new Models.Error { ErrorTitle = "Unauthorized", ErrorDescription = "Check ApiKey in Header is correct." }));
            Context.Response.StatusCode = (int)HttpStatusCode.Unauthorized; ;
            Context.Response.ContentType = "application/json";
            await Context.Response.Body.WriteAsync(messagebytes, 0, messagebytes.Length);
            await HttpContextAccessor.HttpContext.Response.CompleteAsync();
        } 
    }
}
