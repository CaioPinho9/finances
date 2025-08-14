package com.caiopinho.finances.transaction.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.summary.model.MonthlyCategoryIncomeExpense;
import com.caiopinho.finances.summary.model.MonthlyTotal;
import com.caiopinho.finances.transaction.model.Transaction;

import jakarta.transaction.Transactional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

	@Query("""
			    SELECT t FROM Transaction t
			    WHERE EXTRACT(YEAR FROM t.date) = :year
			    AND EXTRACT(MONTH FROM t.date) = :month
			    ORDER BY t.date ASC, t.id ASC
			""")
	List<Transaction> findByMonthAndYear(@Param("year") int year, @Param("month") int month);

	List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT EXTRACT(YEAR FROM t.date) AS year,
			           EXTRACT(MONTH FROM t.date) AS month,
			           COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) AS income,
			           COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) AS expense
			    FROM Transaction t
			    WHERE t.date BETWEEN :start AND :end
			    GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date)
			    ORDER BY EXTRACT(YEAR FROM t.date) DESC, EXTRACT(MONTH FROM t.date) DESC
			""")
	List<MonthlyTotal> findMonthlyTotalsInRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

	@Query("""
			SELECT EXTRACT(YEAR FROM t.date) AS year,
			  EXTRACT(MONTH FROM t.date) AS month,
			  c.id AS categoryId,
			  COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) AS income,
			  COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) AS expense
			FROM Transaction t
			LEFT JOIN t.category c
			WHERE t.date BETWEEN :start AND :end
			GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date), c
			ORDER BY EXTRACT(YEAR FROM t.date) DESC, EXTRACT(MONTH FROM t.date) DESC, c.id DESC
			""")
	List<MonthlyCategoryIncomeExpense> findMonthlyIncomeExpenseByCategoryInRange(
			@Param("start") LocalDate start,
			@Param("end") LocalDate end
	);

	@Transactional
	@Modifying
	@Query("""
			UPDATE Transaction t
			SET t.description = :description, t.category.id = :categoryId
			WHERE t.title = :title
			AND t.description IS NULL
			AND t.category IS NULL
			""")
	void updateDescriptionCategoryByTemplateTitle(String title, String description, Long categoryId);
}
