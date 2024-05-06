using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class AddLINQ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BudgetId",
                table: "DirectDebits",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_DirectDebits_BudgetId",
                table: "DirectDebits",
                column: "BudgetId");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectDebits_Budgets_BudgetId",
                table: "DirectDebits",
                column: "BudgetId",
                principalTable: "Budgets",
                principalColumn: "BudgetId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DirectDebits_Budgets_BudgetId",
                table: "DirectDebits");

            migrationBuilder.DropIndex(
                name: "IX_DirectDebits_BudgetId",
                table: "DirectDebits");

            migrationBuilder.AlterColumn<string>(
                name: "BudgetId",
                table: "DirectDebits",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
