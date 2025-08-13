import { fmtBRL } from "../../utils/format";

type IncomeExpenseCardsProps = {
    income: number;
    expense: number;
};

export default function IncomeExpenseCards(props: Readonly<IncomeExpenseCardsProps>) {
    const { income, expense } = props;

    const net = income - expense;

    return (
        <div className="row row-cols-1 row-cols-lg-3 g-3 mb-3">
            <div className="col">
                <div className="card border-success">
                    <div className="card-body">
                        <div className="fw-semibold text-success mb-1">Receitas</div>
                        <div className="fs-5">{fmtBRL.format(income)}</div>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card border-danger">
                    <div className="card-body">
                        <div className="fw-semibold text-danger mb-1">Despesas</div>
                        <div className="fs-5">{fmtBRL.format(expense)}</div>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className={`card ${net >= 0 ? "border-success" : "border-danger"}`}>
                    <div className="card-body">
                        <div className="fw-semibold mb-1">Saldo</div>
                        <div className="fs-5">{fmtBRL.format(net)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
