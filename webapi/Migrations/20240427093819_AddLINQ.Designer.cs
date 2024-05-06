﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using webapi.Models;

#nullable disable

namespace webapi.Migrations
{
    [DbContext(typeof(UserContext))]
    [Migration("20240427093819_AddLINQ")]
    partial class AddLINQ
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("webapi.Models.BudgetItemObjects.BudgetItem", b =>
                {
                    b.Property<string>("ItemId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("BudgetId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<decimal>("ItemAmount")
                        .HasColumnType("decimal(19,4)");

                    b.Property<string>("ItemName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("PurchaseDate")
                        .HasColumnType("datetime2");

                    b.HasKey("ItemId");

                    b.HasIndex("BudgetId");

                    b.ToTable("BudgetItems");
                });

            modelBuilder.Entity("webapi.Models.BudgetObjects.Budget", b =>
                {
                    b.Property<string>("BudgetId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<decimal>("AvailableAmount")
                        .HasColumnType("decimal(19,4)");

                    b.Property<decimal>("BudgetAmount")
                        .HasColumnType("decimal(19,4)");

                    b.Property<string>("BudgetName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Id")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("WeeklyAmount")
                        .HasColumnType("decimal(19,4)");

                    b.HasKey("BudgetId");

                    b.HasIndex("Id");

                    b.ToTable("Budgets");
                });

            modelBuilder.Entity("webapi.Models.DirectDebitObjects.DirectDebit", b =>
                {
                    b.Property<string>("DebitId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("BudgetId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<decimal>("DebitAmount")
                        .HasColumnType("decimal(19,4)");

                    b.Property<DateTime>("DebitDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DebitDueDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("DebitName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("DebitTotalAmount")
                        .HasColumnType("decimal(19,4)");

                    b.Property<int>("Frequency")
                        .HasColumnType("int");

                    b.HasKey("DebitId");

                    b.HasIndex("BudgetId");

                    b.ToTable("DirectDebits");
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SessionId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("webapi.Models.BudgetItemObjects.BudgetItem", b =>
                {
                    b.HasOne("webapi.Models.BudgetObjects.Budget", "Budget")
                        .WithMany("BudgetItems")
                        .HasForeignKey("BudgetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Budget");
                });

            modelBuilder.Entity("webapi.Models.BudgetObjects.Budget", b =>
                {
                    b.HasOne("webapi.Models.User", "User")
                        .WithMany("Budgets")
                        .HasForeignKey("Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("webapi.Models.DirectDebitObjects.DirectDebit", b =>
                {
                    b.HasOne("webapi.Models.BudgetObjects.Budget", null)
                        .WithMany("DirectDebits")
                        .HasForeignKey("BudgetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("webapi.Models.BudgetObjects.Budget", b =>
                {
                    b.Navigation("BudgetItems");

                    b.Navigation("DirectDebits");
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.Navigation("Budgets");
                });
#pragma warning restore 612, 618
        }
    }
}
