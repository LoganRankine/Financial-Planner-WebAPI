using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class AddDebitTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DirectDebits",
                columns: table => new
                {
                    DebitId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BudgetId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DebitName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DebitAmount = table.Column<decimal>(type: "decimal(19,4)", nullable: false),
                    DebitDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Frequency = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectDebits", x => x.DebitId);
                    table.ForeignKey(
                        name: "FK_BudgetItems_Budgets_BudgetId",
                        column: x => x.BudgetId,
                        principalTable: "Budgets",
                        principalColumn: "BudgetId",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DirectDebits");
        }
    }
}
