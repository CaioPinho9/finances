package com.caiopinho.finances.transaction.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.transaction.model.TransactionTemplate;
import com.caiopinho.finances.transaction.repository.TransactionTemplateRepository;

@Service
public class TransactionTemplateService {

	private final TransactionTemplateRepository transactionTemplateRepository;

	@Autowired
	public TransactionTemplateService(TransactionTemplateRepository transactionTemplateRepository) {
		this.transactionTemplateRepository = transactionTemplateRepository;
	}

	public List<TransactionTemplate> getAll() {
		return transactionTemplateRepository.findAll();
	}

	public Optional<TransactionTemplate> getByTitle(String title) {
		return transactionTemplateRepository.findById(title);
	}

	public TransactionTemplate create(TransactionTemplate transactionTemplate) {
		return transactionTemplateRepository.save(transactionTemplate);
	}

	public TransactionTemplate update(String title, TransactionTemplate transactionTemplateDetails) {
		return transactionTemplateRepository.findById(title)
				.map(transactionTemplate -> {
					transactionTemplate.setDescription(transactionTemplateDetails.getDescription());
					transactionTemplate.setCategory(transactionTemplateDetails.getCategory());
					return transactionTemplateRepository.save(transactionTemplate);
				}).orElseThrow(() -> new RuntimeException("TransactionTemplate not found with title " + title));
	}

	public void delete(String title) {
		if (!transactionTemplateRepository.existsById(title)) {
			throw new RuntimeException("TransactionTemplate not found with title " + title);
		}
		transactionTemplateRepository.deleteById(title);
	}
}
