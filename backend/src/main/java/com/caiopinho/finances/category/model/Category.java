package com.caiopinho.finances.category.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "co_seq_category")
	private Long id;

	@Column(name = "no_name", nullable = false)
	private String name;

	@Column(name = "ds_description")
	private String description;

	@Column(name = "st_expense", nullable = false)
	private Boolean isExpense;

}
