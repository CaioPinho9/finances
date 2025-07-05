package com.caiopinho.finances.transaction.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.caiopinho.finances.transaction.model.TransactionTemplate;
import com.caiopinho.finances.transaction.service.TransactionTemplateService;


@RestController
@RequestMapping("/api/transaction-templates")
public class TransactionTemplateController {

	private final TransactionTemplateService transactionTemplateService;

	@Autowired
	public TransactionTemplateController(TransactionTemplateService transactionTemplateService) {
		this.transactionTemplateService = transactionTemplateService;
	}

	@GetMapping
	public ResponseEntity<List<TransactionTemplate>> getAllTransactionTemplates() {
		List<TransactionTemplate> transactionTemplates = transactionTemplateService.getAll();
		return new ResponseEntity<>(transactionTemplates, HttpStatus.OK);
	}

	@GetMapping("/{title}")
	public ResponseEntity<TransactionTemplate> getTransactionTemplateByTitle(@PathVariable String title) {
		return transactionTemplateService.getByTitle(title)
				.map(transactionTemplate -> new ResponseEntity<>(transactionTemplate, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	public ResponseEntity<TransactionTemplate> create(@RequestBody TransactionTemplate transactionTemplate) {
		TransactionTemplate createdTransactionTemplate = transactionTemplateService.create(transactionTemplate);
		return new ResponseEntity<>(createdTransactionTemplate, HttpStatus.CREATED);
	}

	@PutMapping("/{title}")
	public ResponseEntity<TransactionTemplate> update(@PathVariable String title, @RequestBody TransactionTemplate transactionTemplateDetails) {
		try {
			TransactionTemplate updatedTransactionTemplate = transactionTemplateService.update(title, transactionTemplateDetails);
			return new ResponseEntity<>(updatedTransactionTemplate, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{title}")
	public ResponseEntity<Void> delete(@PathVariable String title) {
		try {
			transactionTemplateService.delete(title);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
