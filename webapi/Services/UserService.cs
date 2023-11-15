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
            string response = await _userDataCRUD.CreateUser(p_username, p_email, p_password);

            return response;
        }

    }
}
