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

	@Query("""
			    SELECT t FROM Transaction t
			    WHERE EXTRACT(YEAR FROM t.date) = :year
			    AND EXTRACT(MONTH FROM t.date) = :month
			""")
	List<Transaction> findByMonthAndYear(@Param("year") int year, @Param("month") int month);

	List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
