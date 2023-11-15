using webapi.Models;

namespace webapi.DataCRUD
{
    public class UserDataCRUD
    {
        private readonly UserContext _userContext;
        public UserDataCRUD(UserContext userContext) { _userContext = userContext; }

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
                    return sessionID.ToString();
                }

                return "Username already exists";
            }
            catch
            {
                return "Error occured during user creation";
            }
        }
    }
}
