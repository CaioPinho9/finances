package com.caiopinho.finances.transaction.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.caiopinho.finances.category.model.Category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

	public static final String FIELD_ID = "id";
	public static final String FIELD_AMOUNT = "amount";
	public static final String FIELD_DATE = "date";
	public static final String FIELD_TITLE = "title";
	public static final String FIELD_DESCRIPTION = "description";
	public static final String FIELD_IS_DEFAULT = "isDefault";
	public static final String FIELD_CATEGORY = "category";
	public static final String FIELD_USER_ID = "userId";

	@Id
	@Column(name = "co_seq_transaction", nullable = false)
	private UUID id;

	@Column(name = "nu_amount", nullable = false)
	private BigDecimal amount;

	@Column(name = "dt_date", nullable = false)
	private LocalDate date;

	@Column(name = "no_title", nullable = false)
	private String title;

	@Column(name = "ds_description")
	private String description;

	@Column(name = "st_default", nullable = false)
	private Boolean isDefault;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "co_category")
	private Category category;

	@Column(name = "co_user", nullable = false)
	private Long userId;

	public void overrideWith(Transaction transactionDetails) {
		this.amount = transactionDetails.getAmount();
		this.date = transactionDetails.getDate();
		this.title = transactionDetails.getTitle();
		this.description = transactionDetails.getDescription();
		this.isDefault = transactionDetails.getIsDefault();
		this.category = transactionDetails.getCategory();
		this.userId = transactionDetails.getUserId();
	}
}
