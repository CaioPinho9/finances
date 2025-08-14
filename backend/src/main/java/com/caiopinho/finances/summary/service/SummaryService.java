package com.caiopinho.finances.summary.service;

import static com.caiopinho.finances.category.enums.CategoryEnum.OTHER_CATEGORIES;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.category.enums.CategoryEnum;
import com.caiopinho.finances.category.model.Category;
import com.caiopinho.finances.category.service.CategoryService;
import com.caiopinho.finances.summary.model.MonthSummary;
import com.caiopinho.finances.transaction.repository.TransactionRepository;

@Service
public class SummaryService {

	private final TransactionRepository transactionRepository;

	private final List<Category> categories;

	@Autowired
	public SummaryService(TransactionRepository transactionRepository, CategoryService categoryService) {
		this.transactionRepository = transactionRepository;

		this.categories = categoryService.getAll();
	}

	public List<MonthSummary> getMonthlySummariesInRange(LocalDate start, LocalDate end) {
		if (start.isAfter(end)) {
			var t = start;
			start = end;
			end = t;
		}

		// 1) Base buckets from totals
		Map<String, MonthSummary> byKey = new LinkedHashMap<>();
		for (var monthlyTotal : transactionRepository.findMonthlyTotalsInRange(start, end)) {
			String key = key(monthlyTotal.getYear(), monthlyTotal.getMonth());
			MonthSummary monthSummary = new MonthSummary();
			monthSummary.setYear(String.valueOf(monthlyTotal.getYear()));
			monthSummary.setMonth(String.valueOf(monthlyTotal.getMonth()));
			monthSummary.setTotalIncome(toD(monthlyTotal.getIncome()));
			monthSummary.setTotalExpense(toD(monthlyTotal.getExpense()));
			monthSummary.setIncomeByCategory(new LinkedHashMap<>());
			monthSummary.setExpenseByCategory(new LinkedHashMap<>());
			byKey.put(key, monthSummary);
		}

		// 2) Fill income-by-category
		for (var row : transactionRepository.findMonthlyIncomeExpenseByCategoryInRange(start, end)) {
			String key = key(row.getYear(), row.getMonth());
			MonthSummary monthSummary = byKey.computeIfAbsent(key, k -> empty(row.getYear(), row.getMonth()));
			Long categoryId = row.getCategoryId();
			if (categoryId == null) {
				categoryId = OTHER_CATEGORIES.stream()
						.filter(c -> c.getIsExpense() == row.getExpense().signum() > 0)
						.map(CategoryEnum::getId)
						.findFirst()
						.orElseThrow(() -> new RuntimeException("No category found for income/expense type"));
			}

			Long finalCategoryId = categoryId;
			String categoryName = categories.stream()
					.filter(c -> c.getId().equals(finalCategoryId))
					.map(Category::getName)
					.findFirst()
					.orElse("Desconhecido");

			if (row.getIncome().signum() > 0) {
				monthSummary.getIncomeByCategory().merge(categoryName, toD(row.getIncome()), Double::sum);
			} else {
				monthSummary.getExpenseByCategory().merge(categoryName, toD(row.getExpense()), Double::sum);
			}
		}

		// 3) Return sorted by (year, month)
		return byKey.values().stream()
				.sorted(Comparator
						.comparingInt((MonthSummary m) -> Integer.parseInt(m.getYear()))
						.thenComparingInt(m -> Integer.parseInt(m.getMonth())))
				.toList();
	}

	// Helpers
	private static String key(Integer y, Integer m) {
		return y + "-" + m;
	}

	private static MonthSummary empty(Integer y, Integer m) {
		MonthSummary ms = new MonthSummary();
		ms.setYear(String.valueOf(y));
		ms.setMonth(String.valueOf(m));
		ms.setTotalIncome(0d);
		ms.setTotalExpense(0d);
		ms.setIncomeByCategory(new LinkedHashMap<>());
		ms.setExpenseByCategory(new LinkedHashMap<>());
		return ms;
	}

	private static Double toD(BigDecimal v) {
		return v == null ? 0d : v.doubleValue();
	}
}
