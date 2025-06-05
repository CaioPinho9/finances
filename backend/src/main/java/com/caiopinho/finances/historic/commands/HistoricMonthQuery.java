package com.caiopinho.finances.historic.commands;

import static com.caiopinho.finances.historic.model.QHistoric.historic;

import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Component;

import com.caiopinho.finances.historic.model.Historic;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

@Component
@AllArgsConstructor
public class HistoricMonthQuery {
	private EntityManager entityManager;

	public List<Historic> findByMonthYear(String monthYear) {
		YearMonth ym = YearMonth.parse(monthYear); // e.g., "2025-06"

		Date startDate = java.sql.Date.valueOf(ym.atDay(1));
		Date endDate = java.sql.Date.valueOf(ym.plusMonths(1).atDay(1));

		JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);

		return queryFactory
				.selectFrom(historic)
				.where(historic.date.goe(startDate).and(historic.date.lt(endDate)))
				.fetch();
	}

}
