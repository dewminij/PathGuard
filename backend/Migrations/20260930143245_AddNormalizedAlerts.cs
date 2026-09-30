using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNormalizedAlerts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NormalizedAlerts",
                columns: table => new
                {
                    NormalizedAlertId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlertId = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SourceIP = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DestinationIP = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hostname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Event = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MITRETechnique = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IncidentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NormalizedAlerts", x => x.NormalizedAlertId);
                    table.ForeignKey(
                        name: "FK_NormalizedAlerts_Alerts_AlertId",
                        column: x => x.AlertId,
                        principalTable: "Alerts",
                        principalColumn: "AlertId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NormalizedAlerts_Incidents_IncidentId",
                        column: x => x.IncidentId,
                        principalTable: "Incidents",
                        principalColumn: "IncidentId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NormalizedAlerts_AlertId",
                table: "NormalizedAlerts",
                column: "AlertId");

            migrationBuilder.CreateIndex(
                name: "IX_NormalizedAlerts_IncidentId",
                table: "NormalizedAlerts",
                column: "IncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_NormalizedAlerts_Severity",
                table: "NormalizedAlerts",
                column: "Severity");

            migrationBuilder.CreateIndex(
                name: "IX_NormalizedAlerts_Status",
                table: "NormalizedAlerts",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_NormalizedAlerts_Timestamp",
                table: "NormalizedAlerts",
                column: "Timestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NormalizedAlerts");
        }
    }
}
