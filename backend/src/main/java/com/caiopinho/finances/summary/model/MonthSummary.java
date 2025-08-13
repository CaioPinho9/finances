package com.caiopinho.finances.summary.model;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthSummary {
	private String month;
	private String year;
	private Double totalIncome;
	private Double totalExpense;
	private Map<String, Double> incomeByCategory;
	private Map<String, Double> expenseByCategory;
}
