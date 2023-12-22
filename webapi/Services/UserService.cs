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

        public async Task<string> AuthenticateUser(string p_username, string p_password)
        {
            string response = await _userDataCRUD.AuthenticateUser(p_username, p_password);

            return response;
        }

        public async Task<bool> CheckAuthStatus(string p_sessionID)
        {
            bool response = await _userDataCRUD.CheckAuthStatus(p_sessionID);

            return response;
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
