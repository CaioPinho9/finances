package com.caiopinho.finances.transactiontemplates.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.transactiontemplates.model.TransactionTemplate;

@Repository
public interface TransactionTemplateRepository extends JpaRepository<TransactionTemplate, String> {
	Optional<TransactionTemplate> findByTitle(String title);
}
