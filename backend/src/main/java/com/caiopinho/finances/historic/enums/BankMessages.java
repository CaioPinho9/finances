package com.caiopinho.finances.historic.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BankMessages {
	MSG_FATURA("Pagamento de fatura"),
	;

	private final String message;
}
