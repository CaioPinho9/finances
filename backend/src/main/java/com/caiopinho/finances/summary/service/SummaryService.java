package com.caiopinho.finances.summary.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.summary.model.MonthSummary;
import com.caiopinho.finances.transaction.repository.TransactionRepository;

@Service
public class SummaryService {

	private final TransactionRepository transactionRepository;

	@Autowired
	public SummaryService(TransactionRepository transactionRepository) {
		this.transactionRepository = transactionRepository;
	}

	public List<MonthSummary> getMonthlySummariesInRange(LocalDate start, LocalDate end) {
		if (start.isAfter(end)) {
			var t = start;
			start = end;
			end = t;
		}

		// 1) Base buckets from totals
		Map<String, MonthSummary> byKey = new LinkedHashMap<>();
		for (var mt : transactionRepository.findMonthlyTotalsInRange(start, end)) {
			String key = key(mt.getYear(), mt.getMonth());
			MonthSummary ms = new MonthSummary();
			ms.setYear(String.valueOf(mt.getYear()));
			ms.setMonth(String.valueOf(mt.getMonth()));
			ms.setTotalIncome(toD(mt.getIncome()));
			ms.setTotalExpense(toD(mt.getExpense()));
			ms.setIncomeByCategory(new LinkedHashMap<>());
			ms.setExpenseByCategory(new LinkedHashMap<>());
			byKey.put(key, ms);
		}

		// 2) Fill income-by-category
		for (var row : transactionRepository.findMonthlyIncomeExpenseByCategoryInRange(start, end)) {
			String key = key(row.getYear(), row.getMonth());
			MonthSummary ms = byKey.computeIfAbsent(key, k -> empty(row.getYear(), row.getMonth()));
			ms.getIncomeByCategory().put(row.getCategory(), toD(row.getIncome()));
			ms.getExpenseByCategory().put(row.getCategory(), toD(row.getExpense()));
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
