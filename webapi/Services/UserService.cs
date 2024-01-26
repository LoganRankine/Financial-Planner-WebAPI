using BCrypt.Net;
using Microsoft.AspNetCore.Identity;
using webapi.DataCRUD;
using webapi.Models;

namespace webapi.Services
{
    public class UserService
    {
        private readonly UserDataCRUD _userDataCRUD;

        public UserService(UserDataCRUD userDataCRUD) { _userDataCRUD = userDataCRUD; }

        public async Task<string> CreateUser(string p_username, string p_email, string p_password, string p_confirm_password)
        {
            //Hash password
            string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(p_password, 13);

            if (p_password == p_confirm_password)
            {
                string response = await _userDataCRUD.CreateUser(p_username, p_email, hashedPassword);
                return response;
            }

            return "No Match";
        }

        public async Task<UserSessionResponse> AuthenticateUser(User user)
        {
            try
            {
                //Check the user object
                if (user != null)
                {

                    //Ensure there is a password included and isn't empty
                    if (user.Password != null && user.Password != "")
                    {

                        //Ensure password or name included and isn't empty
                        if (user.Name != null && user.Name != "")
                        {
                            if (user.Name.Contains('@'))
                            {
                                //Authenticate email
                                string response = await _userDataCRUD.AuthenticateUserEmail(user.Name, user.Password);

                                //Ensure that session is returned
                                if (response != "")
                                {
                                    return new UserSessionResponse
                                    {
                                        Success = true,
                                        SessionID = response,
                                        Description = "Authenticated User"
                                    };
                                }

                            }
                        }
                        else if (user.Name != null && user.Name != "")
                        {
                            //Authenticate name
                            string response = await _userDataCRUD.AuthenticateUserName(user.Name, user.Password);

                            //Ensure that session is returned
                            if (response != "")
                            {
                                return new UserSessionResponse
                                {
                                    Success = true,
                                    SessionID = response,
                                    Description = "Authenticated User"
                                };
                            }

                        }

                        return new UserSessionResponse
                        {
                            Success = false,
                            Description = "Username and Password incorrect"
                        };
                    }
                }

                return new UserSessionResponse
                {
                    Success = false,
                    Description = "Username and Password incorrect"
                };
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> CheckAuthStatus(string p_sessionID)
        {
            if(await _userDataCRUD.CheckAuthStatus(p_sessionID) != null)
            {
                return true;
            }

            return false; ;
        }
        public async Task<string> UserName(string p_sessionID)
        {
            string response = await _userDataCRUD.UserName(p_sessionID);

            return response;
        }

        public async Task<bool> ComparePasswords(string p_hashedPassword, string p_recievedPassword)
        {
            //Hash password
            bool isPasswordCorrect = BCrypt.Net.BCrypt.EnhancedVerify(p_recievedPassword, p_hashedPassword);

            return isPasswordCorrect;
        }

    }
}
