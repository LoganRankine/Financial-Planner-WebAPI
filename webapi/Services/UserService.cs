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

        public async Task<string> CreateUser(string p_username, string p_email, string p_password)
        {
            //Hash password
            string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(p_password, 13);
            string response = await _userDataCRUD.CreateUser(p_username, p_email, hashedPassword);

            return response;
        }

        public async Task<string> AuthenticateUser(string p_username, string p_password)
        {
            string response = await _userDataCRUD.AuthenticateUser(p_username, p_password);

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
