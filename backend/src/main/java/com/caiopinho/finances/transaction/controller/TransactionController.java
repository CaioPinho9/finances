package com.caiopinho.finances.transaction.controller;

import static java.lang.System.*;

import java.io.IOException;
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
import org.springframework.web.multipart.MultipartFile;

import com.caiopinho.finances.transaction.enums.CsvType;
import com.caiopinho.finances.transaction.model.Transaction;
import com.caiopinho.finances.transaction.service.CsvParserService;
import com.caiopinho.finances.transaction.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

	private final TransactionService transactionService;
	private final CsvParserService csvParserService;

	@Autowired
	public TransactionController(TransactionService transactionService, CsvParserService csvParserService) {
		this.transactionService = transactionService;
		this.csvParserService = csvParserService;
	}

	@PostMapping
	public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
		Transaction createdTransaction = transactionService.create(transaction);
		return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Transaction> update(@PathVariable UUID id, @RequestBody Transaction transactionDetails) {
		try {
			Transaction updatedTransaction = transactionService.update(id, transactionDetails);
			return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable UUID id) {
		try {
			transactionService.delete(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/by-month/{year}/{month}")
	public ResponseEntity<List<Transaction>> getByMonth(
			@PathVariable int year,
			@PathVariable int month) {
		List<Transaction> transactions = transactionService.getTransactionsByMonth(year, month);
		return new ResponseEntity<>(transactions, HttpStatus.OK);
	}

	@PostMapping("/upload")
	public ResponseEntity<List<Transaction>> upload(
			@RequestParam("file") MultipartFile file,
			@RequestParam("userId") Long userId,
			@RequestParam("csvType") CsvType csvType) {
		if (file.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		try {
			List<Transaction> transactions = csvParserService.parseCsv(file, userId, csvType);
			List<Transaction> savedTransactions = transactionService.saveAll(transactions);
			return new ResponseEntity<>(savedTransactions, HttpStatus.CREATED);
		} catch (IOException | IllegalArgumentException e) {
			err.println("Error during CSV upload: " + e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
