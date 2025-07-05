package com.caiopinho.finances.transactiontemplates.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.category.model.Category;
import com.caiopinho.finances.category.service.CategoryService;
import com.caiopinho.finances.transaction.model.Transaction;
import com.caiopinho.finances.transactiontemplates.model.TransactionTemplate;
import com.caiopinho.finances.transactiontemplates.repository.TransactionTemplateRepository;

@Service
public class TransactionTemplateService {

	private final TransactionTemplateRepository transactionTemplateRepository;
	private final CategoryService categoryService;

	@Autowired
	public TransactionTemplateService(TransactionTemplateRepository transactionTemplateRepository, CategoryService categoryService) {
		this.transactionTemplateRepository = transactionTemplateRepository;
		this.categoryService = categoryService;
	}

	public List<TransactionTemplate> getAll() {
		return transactionTemplateRepository.findAll();
	}

	public Optional<TransactionTemplate> getByTitle(String title) {
		return transactionTemplateRepository.findById(title);
	}

	public TransactionTemplate create(TransactionTemplate transactionTemplate) {
		Long categoryId = transactionTemplate.getCategoryId();
		if (categoryId != null){
			Optional<Category> category = categoryService.getById(categoryId);

			if (!category.isPresent()) {
				throw new RuntimeException("Category not found with id " + categoryId);
			}

			transactionTemplate.setCategory(category.get());
		}
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

	public void updateTemplatesForTransactions(List<Transaction> savedTransactions) {
		for (Transaction transaction : savedTransactions) {
			Optional<TransactionTemplate> template = transactionTemplateRepository.findByTitle(transaction.getTitle());
			if (template.isPresent()) {
				TransactionTemplate transactionTemplate = template.get();
				transaction.setDescription(transactionTemplate.getDescription());
				transaction.setCategory(transactionTemplate.getCategory());
			}
		}
	}
}
