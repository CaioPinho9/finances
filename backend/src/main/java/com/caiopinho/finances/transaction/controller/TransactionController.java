package com.caiopinho.finances.transaction.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.caiopinho.finances.transaction.model.Transaction;
import com.caiopinho.finances.transaction.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

	private final TransactionService transactionService;

	@Autowired
	public TransactionController(TransactionService transactionService) {
		this.transactionService = transactionService;
	}

	@GetMapping
	public ResponseEntity<List<Transaction>> getAll() {
		List<Transaction> transactions = transactionService.getAllTransactions();
		return new ResponseEntity<>(transactions, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Transaction> getById(@PathVariable UUID id) {
		return transactionService.getTransactionById(id)
				.map(transaction -> new ResponseEntity<>(transaction, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
		Transaction createdTransaction = transactionService.createTransaction(transaction);
		return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Transaction> update(@PathVariable UUID id, @RequestBody Transaction transactionDetails) {
		try {
			Transaction updatedTransaction = transactionService.updateTransaction(id, transactionDetails);
			return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable UUID id) {
		try {
			transactionService.deleteTransaction(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/by-month")
	public ResponseEntity<List<Transaction>> getByMonth(
			@RequestParam int year,
			@RequestParam int month) {
		List<Transaction> transactions = transactionService.getTransactionsByMonth(year, month);
		return new ResponseEntity<>(transactions, HttpStatus.OK);
	}
}
