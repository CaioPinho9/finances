package com.caiopinho.finances.historic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.caiopinho.finances.historic.model.Historic;

public interface HistoricRepository extends JpaRepository<Historic, String> {
}
