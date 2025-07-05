package com.caiopinho.finances.category.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caiopinho.finances.category.model.Category;
import com.caiopinho.finances.category.repository.CategoryRepository;

@Service
public class CategoryService {

	private final CategoryRepository categoryRepository;

	@Autowired
	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public List<Category> getAll() {
		return categoryRepository.findAll();
	}

	public Optional<Category> getById(Long id) {
		return categoryRepository.findById(id);
	}

	public Category create(Category category) {
		return categoryRepository.save(category);
	}

	public Category update(Long id, Category categoryDetails) {
		return categoryRepository.findById(id)
				.map(category -> {
					category.setName(categoryDetails.getName());
					category.setDescription(categoryDetails.getDescription());
					return categoryRepository.save(category);
				}).orElseThrow(() -> new RuntimeException("Category not found with id " + id));
	}

	public void delete(Long id) {
		if (!categoryRepository.existsById(id)) {
			throw new RuntimeException("Category not found with id " + id);
		}
		categoryRepository.deleteById(id);
	}
}
