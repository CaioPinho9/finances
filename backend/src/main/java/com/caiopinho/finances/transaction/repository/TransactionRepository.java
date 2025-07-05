package com.caiopinho.finances.transaction.repository;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.transaction.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

	/**
	 * Custom query to find transactions by month and year.
	 *
	 * @param year The year to filter by.
	 * @param month The month (1-12) to filter by.
	 * @return A list of transactions within the specified month and year.
	 */
	@Query("SELECT t FROM Transaction t WHERE FUNCTION('YEAR', t.date) = :year AND FUNCTION('MONTH', t.date) = :month")
	List<Transaction> findByMonthAndYear(@Param("year") int year, @Param("month") int month);

	// You can also achieve this by passing a date range, which is often more flexible:
	List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
