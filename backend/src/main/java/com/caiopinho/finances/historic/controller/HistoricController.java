package com.caiopinho.finances.historic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import com.caiopinho.finances.historic.model.Historic;
import com.caiopinho.finances.historic.converter.CsvConverter;
import com.caiopinho.finances.historic.service.HistoricService;

@RestController
@RequestMapping("/api/historic")
public class HistoricController {
	private final HistoricService service;
	private final CsvConverter csvConverter;

	@Autowired
	public HistoricController(HistoricService service, CsvConverter csvConverter) {
		this.service = service;
		this.csvConverter = csvConverter;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> save(@RequestParam("file") MultipartFile file) throws IOException {
		List<Historic> entries = csvConverter.convertCsvToHistoric(file);
		List<Historic> saved = entries.stream().map(service::save).toList();
		return ResponseEntity.ok(saved);
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
