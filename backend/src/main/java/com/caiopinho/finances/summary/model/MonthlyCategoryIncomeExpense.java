package com.caiopinho.finances.summary.model;

import java.math.BigDecimal;

import com.caiopinho.finances.category.model.Category;

public interface MonthlyCategoryIncomeExpense {
	Integer getYear();

	Integer getMonth();

	Category getCategory();

	BigDecimal getIncome();

	BigDecimal getExpense();
}
