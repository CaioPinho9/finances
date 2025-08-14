package com.caiopinho.finances.summary.controller;

import static java.lang.System.err;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.caiopinho.finances.summary.model.MonthSummary;
import com.caiopinho.finances.summary.service.SummaryService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/summary")
public class SummaryController {

	private final SummaryService summaryService;

	@Autowired
	public SummaryController(SummaryService summaryService) {
		this.summaryService = summaryService;
	}

	@GetMapping(params = { "start", "end" })
	public ResponseEntity<List<MonthSummary>> getMonthlySummariesByRange(
			@RequestParam("start") String start,
			@RequestParam("end") String end) {
		return getMonthlySummariesResponse(start, end);
	}

	@GetMapping(params = "date")
	public ResponseEntity<List<MonthSummary>> getMonthlySummaries(@RequestParam("date") String date) {
		return getMonthlySummariesResponse(date, date);
	}

	private ResponseEntity<List<MonthSummary>> getMonthlySummariesResponse(String start, String end) {
		try {
			var startDate = LocalDate.parse(
					start.length() == 7 ? start + "-01" : start
			);

			var endDate = end.length() == 7
					? YearMonth.parse(end).atEndOfMonth()
					: LocalDate.parse(end);

			var summaries = summaryService.getMonthlySummariesInRange(startDate, endDate);
			return new ResponseEntity<>(summaries, HttpStatus.OK);
		} catch (Exception e) {
			err.println("Error fetching monthly summaries: " + e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
