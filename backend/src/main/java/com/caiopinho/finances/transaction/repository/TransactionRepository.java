package com.caiopinho.finances.transaction.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.transaction.model.MonthSummary;
import com.caiopinho.finances.transaction.model.Transaction;

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

	@Query(""")
			    SELECT new com.caiopinho.finances.transaction.model.MonthSummary(
			        EXTRACT(MONTH FROM t.date) AS month,
			        EXTRACT(YEAR FROM t.date) AS year,
			        SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS totalIncome,
			        SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS totalExpense
			    )
			    FROM Transaction t
			    WHERE EXTRACT(YEAR FROM t.date) = :year
			    GROUP BY EXTRACT(MONTH FROM t.date), EXTRACT(YEAR FROM t.date)
			""")
	List<Double> findIncomeExpenseByYearAndMonth(int year, int month);
}
