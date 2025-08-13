package com.caiopinho.finances.transaction.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.category.model.Category;
import com.caiopinho.finances.category.service.CategoryService;
import com.caiopinho.finances.transaction.model.Transaction;
import com.caiopinho.finances.transaction.repository.TransactionRepository;
import com.caiopinho.finances.transactiontemplates.services.TransactionTemplateService;

import jakarta.transaction.Transactional;

@Service
public class TransactionService {
	private final TransactionRepository transactionRepository;

	private final CategoryService categoryService;
	private final TransactionTemplateService templateService;

	@Autowired
	public TransactionService(TransactionRepository transactionRepository, CategoryService categoryService, TransactionTemplateService templateService) {
		this.transactionRepository = transactionRepository;
		this.categoryService = categoryService;
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

	public List<Transaction> getTransactionsByMonth(int year, int month) {
		// Using the custom query defined in the repository
		return transactionRepository.findByMonthAndYear(year, month);
	}

	public Transaction updateCategory(UUID id, Long categoryId) {
		Optional<Category> category = categoryService.getById(categoryId);

		if (category.isEmpty()) {
			throw new RuntimeException("Category not found with id " + categoryId);
		}

		Transaction transaction = transactionRepository.findById(id)
				.map(tx -> {
					tx.setCategory(category.get());
					return transactionRepository.save(tx);
				}).orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

		return transactionRepository.save(transaction);
	}
}
