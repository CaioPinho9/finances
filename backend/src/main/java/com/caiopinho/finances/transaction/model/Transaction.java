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
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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

	@Id
	@Column(name = "co_seq_transaction", nullable = false)
	@GeneratedValue(strategy = GenerationType.UUID)
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
}
