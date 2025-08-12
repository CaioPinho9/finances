package com.caiopinho.finances.summary.model;

import java.math.BigDecimal;

public interface MonthlyTotal {
		Integer getYear();

		Integer getMonth();

		BigDecimal getIncome();

		BigDecimal getExpense();
	}
