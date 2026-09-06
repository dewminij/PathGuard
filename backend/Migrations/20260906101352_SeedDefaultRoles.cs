using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "CreatedAt", "Description", "RoleName" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 9, 6, 10, 13, 51, 976, DateTimeKind.Utc).AddTicks(915), "Full access to the PathGuard platform.", "Administrator" },
                    { 2, new DateTime(2026, 9, 6, 10, 13, 51, 976, DateTimeKind.Utc).AddTicks(921), "Can monitor alerts, investigate incidents, and manage security operations.", "Security Analyst" },
                    { 3, new DateTime(2026, 9, 6, 10, 13, 51, 976, DateTimeKind.Utc).AddTicks(922), "Read-only access to PathGuard security information.", "Viewer" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: 3);
        }
    }
}
