package com.caiopinho.finances.historic.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import lombok.AllArgsConstructor;

import com.caiopinho.finances.historic.commands.HistoricMonthQuery;
import com.caiopinho.finances.historic.model.Historic;
import com.caiopinho.finances.historic.repository.HistoricRepository;

@Service
@AllArgsConstructor
public class HistoricService {

	private final HistoricRepository repository;
	private final HistoricMonthQuery historicMonthQuery;

	public Historic save(Historic historic) {
		return repository.save(historic);
	}

	public List<Historic> getByMonthYear(String monthYear) {
		return historicMonthQuery.findByMonthYear(monthYear);
	}

	public Optional<Historic> findById(String uuid) {
		return repository.findById(uuid);
	}

	public Optional<Historic> update(Historic updated) {
		return findById(updated.getUuid())
				.map(existing -> {
					existing.setDate(updated.getDate());
					existing.setAmount(updated.getAmount());
					existing.setDescriptionBank(updated.getDescriptionBank());
					existing.setDescriptionCustom(updated.getDescriptionCustom());
					return repository.save(existing);
				});
	}
}
