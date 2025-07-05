package com.caiopinho.finances.transaction.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.caiopinho.finances.transaction.enums.CsvType;
import com.caiopinho.finances.transaction.model.Transaction;

import org.apache.commons.csv.CSVFormat;

@Slf4j
@Service
public class CsvParserService {

	public List<Transaction> parseCsv(MultipartFile file, Long userId, CsvType csvType) throws IOException {
		List<Transaction> transactions = new ArrayList<>();

		try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.builder()
					.setHeader(csvType.getHeaders())
					.setSkipHeaderRecord(true)
					.setDelimiter(',')
					.build());

			int rowIndex = 0;
			for (CSVRecord csvRecord : csvParser) {
				transactions.add(parseRow(csvRecord, csvType, userId, rowIndex));
				rowIndex++;
			}
			transactions.removeIf(Objects::isNull);
		}

		return transactions;
	}

	private Transaction parseRow(CSVRecord csvRecord, CsvType csvType, Long userId, int rowIndex) {
		Map<String, String> mapping = csvType.getColumnMapping();

		LocalDate date = LocalDate.parse(csvRecord.get(getKeyForModel("date", mapping)), csvType.getDateFormatter());
		BigDecimal amount = new BigDecimal(csvRecord.get(getKeyForModel("amount", mapping)));
		String title = safeGet(csvRecord, getKeyForModel("title", mapping));
		String idRaw = safeGet(csvRecord, getKeyForModel("id", mapping));

		if (csvType.getBlacklistedTitles() != null && title != null && Arrays.asList(csvType.getBlacklistedTitles()).contains(title)) {
			return null;
		}

		UUID id;
		if (idRaw != null) {
			try {
				id = UUID.fromString(idRaw);
			} catch (IllegalArgumentException e) {
				id = generateUUIDFromString(csvRecord.toString() + rowIndex);
			}
		} else {
			id = generateUUIDFromString(csvRecord.toString() + rowIndex);
		}

		if (title != null && title.length() > 255)
			title = title.substring(0, 255);

		return new Transaction(
				id,
				amount,
				date,
				title,
				null,
				false,
				null,
				userId
		);
	}

	private String getKeyForModel(String modelField, Map<String, String> mapping) {
		return mapping.entrySet().stream()
				.filter(entry -> entry.getValue().equals(modelField))
				.map(Map.Entry::getKey)
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Missing mapping for field: " + modelField));
	}

	private String safeGet(CSVRecord csvRecord, String column) {
		return csvRecord.isMapped(column) && !csvRecord.get(column).isEmpty() ? csvRecord.get(column) : null;
	}

	private UUID generateUUIDFromString(String input) {
		try {
			MessageDigest salt = MessageDigest.getInstance("SHA-256");
			salt.update(input.getBytes(StandardCharsets.UTF_8));
			byte[] hash = salt.digest();
			return UUID.nameUUIDFromBytes(hash);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("SHA-256 algorithm not found", e);
		}
	}
}
