package com.caiopinho.finances.historic.converter;

import static com.caiopinho.finances.historic.enums.BankMessages.MSG_FATURA;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.caiopinho.finances.historic.enums.NubankCsvHeaderEnum;
import com.caiopinho.finances.historic.model.Historic;
import com.opencsv.CSVReaderBuilder;

@Service
public class CsvConverter {

	private List<Historic> convertNubankCsv(MultipartFile file) throws IOException {
		try (
				var reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
				var csvReader = new CSVReaderBuilder(reader).build()
		) {
			if (file.isEmpty()) {
				throw new IOException("Uploaded file is empty.");
			}

			String[] headers = csvReader.readNext();
			if (headers == null) {
				throw new IOException("CSV file is empty or malformed.");
			}

			Map<Integer, NubankCsvHeaderEnum> columnMapping = new HashMap<>();
			for (int i = 0; i < headers.length; i++) {
				NubankCsvHeaderEnum headerEnum = NubankCsvHeaderEnum.HEADER_MAP.get(headers[i].trim());
				if (headerEnum != null && NubankCsvHeaderEnum.FIELD_SETTERS.containsKey(headerEnum)) {
					columnMapping.put(i, headerEnum);
				}
			}

			List<Historic> entries = new ArrayList<>();
			String[] row;
			int line = 1; // already read headers
			while ((row = csvReader.readNext()) != null) {
				line++;
				if (row.length == 0 || Arrays.stream(row).allMatch(String::isBlank)) continue;

				Historic historic = new Historic();
				for (int i = 0; i < row.length; i++) {
					NubankCsvHeaderEnum header = columnMapping.get(i);
					if (header != null) {
						try {
							String cell = row[i].trim();
							NubankCsvHeaderEnum.FIELD_SETTERS.get(header).set(historic, cell);
						} catch (Exception ex) {
							throw new IOException("Error parsing value at line " + line + ", column " + i + ": " + ex.getMessage(), ex);
						}
					}
				}
				entries.add(historic);
			}

			return entries;
		} catch (IOException e) {
			throw e; // rethrow if it's already an IOException
		} catch (Exception e) {
			throw new IOException("Failed to parse CSV: " + e.getMessage(), e);
		}
	}

	public List<Historic> convertCsvToHistoric(MultipartFile file) throws IOException {
		List<Historic> entries = convertNubankCsv(file);

		entries = entries.stream()
				.filter(entry -> entry.getUuid() != null && !entry.getUuid().isBlank())
				.filter(entry -> !Objects.equals(entry.getDescriptionBank(), MSG_FATURA.getMessage()))
				.toList();

		return entries;
	}
}
