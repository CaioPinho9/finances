package com.caiopinho.finances.historic.enums;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.caiopinho.finances.historic.model.Historic;

@Getter
@AllArgsConstructor
public enum NubankCsvHeaderEnum {
	UUID("Identificador"),
	DATE("Data"),
	AMOUNT("Valor"),
	DESCRIPTION("Descrição");

	private final String csvColumn;

	public static final Map<String, NubankCsvHeaderEnum> HEADER_MAP = Arrays.stream(values())
			.collect(Collectors.toMap(NubankCsvHeaderEnum::getCsvColumn, Function.identity()));

	private static final ThreadLocal<SimpleDateFormat> DATE_FORMAT = ThreadLocal.withInitial(() ->
			new SimpleDateFormat("yyyy-MM-dd"));

	public static final Map<NubankCsvHeaderEnum, FieldSetter> FIELD_SETTERS = Map.of(
			UUID, Historic::setUuid,
			DATE, (historic, value) -> historic.setDate(DATE_FORMAT.get().parse(value)),
			AMOUNT, (historic, value) -> historic.setAmount(Double.parseDouble(value)),
			DESCRIPTION, Historic::setDescriptionBank
	);

	@FunctionalInterface
	public interface FieldSetter {
		void set(Historic historic, String value) throws Exception;
	}
}
