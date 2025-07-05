package com.caiopinho.finances.transaction.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.transaction.model.Transaction;
import com.caiopinho.finances.transaction.repository.TransactionRepository;

import jakarta.transaction.Transactional;

@Service
public class TransactionService {
	private final TransactionRepository transactionRepository;

	private final TransactionTemplateService templateService;

	@Autowired
	public TransactionService(TransactionRepository transactionRepository, TransactionTemplateService templateService) {
		this.transactionRepository = transactionRepository;
		this.templateService = templateService;
	}

	public Transaction create(Transaction transaction) {
		return transactionRepository.save(transaction);
	}

	@Transactional
	public List<Transaction> saveAll(List<Transaction> transactions) {
		List<Transaction> existingTransaction = transactions.stream()
				.filter(tx -> !transactionRepository.existsById(tx.getId()))
				.toList();

		templateService.updateTemplatesForTransactions(transactions);

		transactionRepository.saveAll(existingTransaction);

		return transactions;
	}

	public Transaction update(UUID id, Transaction transactionDetails) {
		return transactionRepository.findById(id)
				.map(transaction -> {
					transaction.overrideWith(transactionDetails);
					return transactionRepository.save(transaction);
				}).orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
	}

	public void delete(UUID id) {
		if (!transactionRepository.existsById(id)) {
			throw new RuntimeException("Transaction not found with id " + id);
		}
		transactionRepository.deleteById(id);
	}

	/**
	 * Retrieves transactions for a specific month and year.
	 *
	 * @param year The year (e.g., 2023).
	 * @param month The month (1-12).
	 * @return A list of transactions for the specified month.
	 */
	public List<Transaction> getTransactionsByMonth(int year, int month) {
		// Using the custom query defined in the repository
		return transactionRepository.findByMonthAndYear(year, month);

        /*
        // Alternative: Using findByDateBetween for a more robust date range query
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return transactionRepository.findByDateBetween(startDate, endDate);
        */
	}

}
