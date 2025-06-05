package com.caiopinho.finances.historic.model;

import java.util.Date;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Data
@Table(name = "tb_historic")
public class Historic {

	@Id
	private String uuid;
	private Date date;
	private Integer user;
	private Double amount;

	@Column(name = "description_bank")
	private String descriptionBank;

	@Column(name = "description_custom")
	private String descriptionCustom;
}
