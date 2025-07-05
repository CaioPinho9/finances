package com.caiopinho.finances.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.category.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
