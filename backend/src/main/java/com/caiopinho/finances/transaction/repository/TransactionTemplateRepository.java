package com.caiopinho.finances.transaction.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.transaction.model.TransactionTemplate;

@Repository
public interface TransactionTemplateRepository extends JpaRepository<TransactionTemplate, String> {
	Optional<TransactionTemplate> findByTitle(String title);
}
