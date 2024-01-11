using Newtonsoft.Json;
using webapi.Models;
using webapi.Services;

namespace webapi.DataCRUD
{
    public class UserDataCRUD
    {
        private readonly UserContext _userContext;

        public UserDataCRUD(UserContext userContext) 
        { 
            _userContext = userContext; 
        }

        public async Task<string> CreateUser(string p_username, string p_email, string p_password)
        {
            try
            {
                var User = _userContext.Users.ToList().Where(username => username.Name == p_username).ToList();
                //Ensure username does not exist
                if (User.Count == 0)
                {
                    //Create User
                    Guid id = Guid.NewGuid();
                    Guid sessionID = Guid.NewGuid();

                    User user = new User()
                    {
                        Id = id.ToString(),
                        Name = p_username,
                        Password = p_password,
                        Email = p_email,
                        SessionId = sessionID.ToString()
                    };

                    _userContext.Users.Add(user);
                    _userContext.SaveChanges();

                    return JsonConvert.SerializeObject(new UserSessionResponse() { SessionID = user.SessionId });
                }

                return "Username exists";
            }
            catch
            {
                return "Creation error";
            }
        }

        public async Task<string> AuthenticateUser(string p_email, string p_password)
        {
            try
            {
                var User = _userContext.Users.ToList().FirstOrDefault(username => username.Email == p_email);
                //Ensure username does exists
                if (User != null)
                {
                    //Compare password
                    UserService userService = new UserService(new UserDataCRUD(_userContext));

                    if (await userService.ComparePasswords(User.Password, p_password))
                    {
                        return JsonConvert.SerializeObject(new UserSessionResponse() { SessionID = User.SessionId});
                    }

                    return "Incorrect Password";
                }
                return "Username does not exist";
            }
            catch
            {
                return "";
            }
        }

        public async Task<User> CheckAuthStatus(string p_sessionID)
        {
            try
            {
                var User = _userContext.Users.ToList().FirstOrDefault(user => user.SessionId == p_sessionID);
                //Ensure sessionID exists
                if (User != null)
                {
                    return User;
                }
                return null;
            }
            catch
            {
                throw;
            }
        }
        public async Task<string> UserName(string p_sessionID)
        {
            try
            {
                var User = _userContext.Users.ToList().FirstOrDefault(user => user.SessionId == p_sessionID);
                //Ensure sessionID exists
                if (User != null)
                {
                    return JsonConvert.SerializeObject(User.Name);
                }
                return "Not Found";
            }
            catch
            {
                return "Error";
            }
        }
    }
}
