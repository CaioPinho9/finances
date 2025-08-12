package com.caiopinho.finances.transaction.model;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.caiopinho.finances.category.model.Category;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthSummary {
	private String month;
	private String year;
	private Double totalIncome;
	private Double totalExpense;

	private Map<Category, Double> incomeByCategory;
	private Map<Category, Double> expenseByCategory;
}
