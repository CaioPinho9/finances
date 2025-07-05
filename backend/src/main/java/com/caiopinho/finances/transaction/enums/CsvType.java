package com.caiopinho.finances.transaction.enums;

import static com.caiopinho.finances.transaction.model.Transaction.FIELD_AMOUNT;
import static com.caiopinho.finances.transaction.model.Transaction.FIELD_DATE;
import static com.caiopinho.finances.transaction.model.Transaction.FIELD_ID;
import static com.caiopinho.finances.transaction.model.Transaction.FIELD_TITLE;

import java.time.format.DateTimeFormatter;
import java.util.Map;

import lombok.Getter;

@Getter
public enum CsvType {
	NUBANK_EXTRACT(
			new String[]{"Data", "Valor", "Identificador", "Descrição"},
			DateTimeFormatter.ofPattern("dd/MM/yyyy"),
			Map.of(
					"Data", FIELD_DATE,
					"Valor", FIELD_AMOUNT,
					"Identificador", FIELD_ID,
					"Descrição", FIELD_TITLE
			),
			new String[]{"Pagamento de fatura"}
	),
	NUBANK_CREDIT_EXTRACT(
			new String[]{"date", "amount", "title"},
			DateTimeFormatter.ofPattern("yyyy-MM-dd"),
			Map.of(
					"date", FIELD_DATE,
					"amount", FIELD_AMOUNT,
					"title", FIELD_TITLE
			),
			new String[]{"Pagamento recebido"}
	);

	private final String[] headers;
	private final DateTimeFormatter dateFormatter;
	private final Map<String, String> columnMapping;
	private final String[] blacklistedTitles;

	CsvType(String[] headers, DateTimeFormatter dateFormatter, Map<String, String> columnMapping, String[] blacklistedTitles) {
		this.headers = headers;
		this.dateFormatter = dateFormatter;
		this.columnMapping = columnMapping;
		this.blacklistedTitles = blacklistedTitles;
	}
}
