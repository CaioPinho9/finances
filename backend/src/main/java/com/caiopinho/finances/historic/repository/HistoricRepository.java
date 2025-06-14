package com.caiopinho.finances.historic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.caiopinho.finances.historic.model.Historic;

@Repository
public interface HistoricRepository extends JpaRepository<Historic, String> {
}
