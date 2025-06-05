package com.caiopinho.finances.historic.service;

import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.caiopinho.finances.historic.model.Historic;
import com.caiopinho.finances.historic.repository.HistoricRepository;

@Service
public class HistoricService {

	private final HistoricRepository repository;

	public HistoricService(HistoricRepository repository) {
		this.repository = repository;
	}

	public List<Historic> getByMonthYear(String monthYear) {
		YearMonth ym = YearMonth.parse(monthYear);
		return repository.findAll().stream()
				.filter(h -> YearMonth.from(h.getDate()).equals(ym))
				.collect(Collectors.toList());
	}

	public Historic save(Historic historic) {
		return repository.save(historic);
	}

	public Optional<Historic> update(Historic updated) {
		return repository.findById(updated.getUuid())
				.map(existing -> {
					existing.setDate(updated.getDate());
					existing.setAmount(updated.getAmount());
					existing.setDescriptionBank(updated.getDescriptionBank());
					existing.setDescriptionCustom(updated.getDescriptionCustom());
					return repository.save(existing);
				});
	}
}
