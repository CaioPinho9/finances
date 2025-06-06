package com.caiopinho.finances.historic.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import lombok.AllArgsConstructor;

import com.caiopinho.finances.historic.model.Historic;
import com.caiopinho.finances.parser.CsvParser;
import com.caiopinho.finances.historic.service.HistoricService;

@RestController
@RequestMapping("/api/historic")
@AllArgsConstructor
public class HistoricController {

	private final HistoricService service;
	private final CsvParser csvParser;


	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> save(@RequestParam("file") MultipartFile file) {
		try {
			List<Historic> entries = csvParser.parseNubank(file);

			List<Historic> saved = entries.stream().map(service::save).toList();
			return ResponseEntity.ok(saved);
		} catch (IOException e) {
			return ResponseEntity.badRequest().body("Error reading file");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
		}
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
