package com.caiopinho.finances.transaction.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.transaction.model.Transaction;
import com.caiopinho.finances.transaction.repository.TransactionRepository;

@Service
public class TransactionService {

	private final TransactionRepository transactionRepository;

	@Autowired
	public TransactionService(TransactionRepository transactionRepository) {
		this.transactionRepository = transactionRepository;
	}

	public List<Transaction> getAllTransactions() {
		return transactionRepository.findAll();
	}

	public Optional<Transaction> getTransactionById(UUID id) {
		return transactionRepository.findById(id);
	}

	public Transaction createTransaction(Transaction transaction) {
		return transactionRepository.save(transaction);
	}

	public Transaction updateTransaction(UUID id, Transaction transactionDetails) {
		return transactionRepository.findById(id)
				.map(transaction -> {
					transaction.setAmount(transactionDetails.getAmount());
					transaction.setDate(transactionDetails.getDate());
					transaction.setTitle(transactionDetails.getTitle());
					transaction.setDescription(transactionDetails.getDescription());
					transaction.setIsDefault(transactionDetails.getIsDefault());
					transaction.setCategory(transactionDetails.getCategory());
					transaction.setUserId(transactionDetails.getUserId());
					return transactionRepository.save(transaction);
				}).orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
	}

	public void deleteTransaction(UUID id) {
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
