using Newtonsoft.Json;
using webapi.Models;
using webapi.Models.BudgetObjects;
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
        
        //NO LONGER IN USE
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
                        SessionId = sessionID.ToString(),
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

        public bool CreateUser(User p_create_user)
        {
            try
            {
                if(p_create_user != null && p_create_user.Email != null && p_create_user.Name != null && p_create_user.Password != null)
                {
                    p_create_user.Id = Guid.NewGuid().ToString();
                    p_create_user.SessionId = Guid.NewGuid().ToString();

                    _userContext.Users.Add(p_create_user);
                    _userContext.SaveChanges();
                    return true;
                }

                return false;
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> AuthenticateUserEmail(string p_email, string p_password)
        {
            try
            {
                //Get the p_create_user by email
                var User = _userContext.Users.ToList().FirstOrDefault(username => username.Email == p_email);

                if (User != null)
                {
                    //Compare password
                    UserService userService = new UserService(new UserDataCRUD(_userContext));

                    if (await userService.ComparePasswords(User.Password, p_password))
                    {
                        return User.SessionId;
                    }

                    return "";
                }
                return "";
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> AuthenticateUserName(string p_username, string p_password)
        {
            try
            {
                //Ensure username does exists
                var User = _userContext.Users.ToList().FirstOrDefault(username => username.Name == p_username);

                if (User != null)
                {
                    //Compare password
                    UserService userService = new UserService(new UserDataCRUD(_userContext));

                    if (await userService.ComparePasswords(User.Password, p_password))
                    {
                        return  User.SessionId;
                    }

                    return "";
                }
                return "";
            }
            catch
            {
                throw;
            }
        }

        public async Task<User> CheckAuthStatus(string p_sessionID)
        {
            if (p_sessionID == "null") //nothing to authenticate
            {
                return null;
            }
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

        public async Task<bool> UsernameExist(string p_username)
        {
            try
            {
                User user = _userContext.Users.Where(username => username.Name == p_username).FirstOrDefault();

                if (user != null)
                {
                    return true;
                }

                return false;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> EmailExist(string p_email)
        {
            try
            {
                User user = _userContext.Users.Where(email => email.Email == p_email).FirstOrDefault();

                if (user != null)
                {
                    return true;
                }

                return false;
            }
            catch
            {
                throw;
            }
        }

    }
}
