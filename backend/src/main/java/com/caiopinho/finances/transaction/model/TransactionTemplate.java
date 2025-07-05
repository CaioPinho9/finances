package com.caiopinho.finances.transaction.model;

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
@Table(name = "tb_transaction_template")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTemplate {
	@Id
	@Column(name = "co_seq_transaction_template", nullable = false)
	private String title;

	@Column(name = "ds_description")
	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "co_category")
	private Category category;
}
