package com.caiopinho.finances.historic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.caiopinho.finances.historic.model.Historic;
import com.caiopinho.finances.historic.service.HistoricService;

@RestController
@RequestMapping("/api/historic")
public class HistoricController {

	private final HistoricService service;

	public HistoricController(HistoricService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<?> save(@RequestBody List<Historic> entries) {
		entries.forEach(service::save);
		return ResponseEntity.ok("Saved successfully");
	}

	@GetMapping("/date/{date}")
	public ResponseEntity<List<Historic>> getByDate(@PathVariable String date) {
		return ResponseEntity.ok(service.getByMonthYear(date));
	}

	@PutMapping
	public ResponseEntity<?> update(@RequestBody Historic historic) {
		return service.update(historic)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
