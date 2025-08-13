package com.caiopinho.finances.summary.model;

import java.math.BigDecimal;

public interface MonthlyCategoryIncomeExpense {
	Integer getYear();

	Integer getMonth();

	Long getCategoryId();

	BigDecimal getIncome();

	BigDecimal getExpense();
}
