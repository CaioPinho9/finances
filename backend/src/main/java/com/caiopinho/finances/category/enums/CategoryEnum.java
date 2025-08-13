package com.caiopinho.finances.category.enums;

import java.util.List;

import lombok.Getter;

@Getter
public enum CategoryEnum {
	OTHER_EXPENSE(9L, true),
	OTHER_INCOME(14L, false),
	;

	private final Long id;
	private final Boolean isExpense;

	CategoryEnum(Long id, Boolean isExpense) {
		this.id = id;
		this.isExpense = isExpense;
	}

	public static final List<CategoryEnum> OTHER_CATEGORIES = List.of(OTHER_EXPENSE, OTHER_INCOME);
}
