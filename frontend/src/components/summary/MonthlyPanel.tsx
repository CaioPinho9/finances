import { normalizeCategoryMap, monthYearLabel } from "../../utils/format";
import IncomeExpenseCards from "./IncomeExpenseCards";
import CategoryTable from "./CategoryTable";
import CategoryPie from "./charts/CategoryPie";
import type { MonthSummary } from "../../types/types";

type MonthPanelProps = {
    monthSummary: MonthSummary;
    defaultOpen?: boolean;
};

export default function MonthPanel(props: Readonly<MonthPanelProps>) {
    const { monthSummary, defaultOpen = false } = props;

    const income = monthSummary.totalIncome ?? 0;
    const expense = monthSummary.totalExpense ?? 0;

    const incomeCat = normalizeCategoryMap(monthSummary.incomeByCategory || {});
    const expenseCat = normalizeCategoryMap(monthSummary.expenseByCategory || {});

    const headingId = `hdr-${monthSummary.year}-${monthSummary.month}`;
    const collapseId = `col-${monthSummary.year}-${monthSummary.month}`;

    return (
        <div className="accordion-item mb-2">
            <h2 className="accordion-header" id={headingId}>
                <button
                    className={`accordion-button ${defaultOpen ? "" : "collapsed"}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded={defaultOpen}
                    aria-controls={collapseId}
                >
                    <div className="d-flex justify-content-between w-100 align-items-center">
                        <span className="fw-semibold">{monthYearLabel(monthSummary)}</span>
                        <div className="d-flex gap-3 small">
                            <span className="text-success">Receitas: {income.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                            <span className="text-danger">Despesas: {expense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                            <span className={(income - expense) >= 0 ? "text-success" : "text-danger"}>
                                Saldo: {(income - expense).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>
                    </div>
                </button>
            </h2>
            <div id={collapseId} className={`accordion-collapse collapse ${defaultOpen ? "show" : ""}`} aria-labelledby={headingId}>
                <div className="accordion-body">
                    <IncomeExpenseCards income={income} expense={expense} />

                    <div className="row g-3">
                        <div className="col-12 col-lg-6">
                            <h6 className="mb-2">Receitas por categoria</h6>
                            <CategoryPie data={incomeCat} />
                            <CategoryTable entries={incomeCat} total={income} variant="success" />
                        </div>
                        <div className="col-12 col-lg-6">
                            <h6 className="mb-2">Despesas por categoria</h6>
                            <CategoryPie data={expenseCat} />
                            <CategoryTable entries={expenseCat} total={expense} variant="danger" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
