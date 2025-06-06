import { useEffect, useState, useCallback } from "react";
import TableView from "../components/TableView";
import DateSelector from "../components/DateSelector";
import UploadModal from "../components/UploadModal";
import { getHistoricByDate, HistoricDto } from "../api/historic";

export default function Dashboard() {
  const now = new Date();
  const [selectedDate, setSelectedDateState] = useState(() => {
    const cached = localStorage.getItem("dashboard-selected-date");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch { }
    }
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });

  const setSelectedDate = (date: { month: number; year: number }) => {
    setSelectedDateState(date);
    localStorage.setItem("dashboard-selected-date", JSON.stringify(date));
  };
  const [historicData, setHistoricData] = useState<HistoricDto[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [incomeData, setIncomeData] = useState<HistoricDto[]>([]);
  const [expenseData, setExpenseData] = useState<HistoricDto[]>([]);

  const fetchData = useCallback(async () => {
    const monthStr = `${selectedDate.month}`.padStart(2, "0");
    const dateParam = `${monthStr}-${selectedDate.year}`;
    const data = await getHistoricByDate(dateParam);
    setHistoricData(data);

    setIncomeData((data || []).filter(entry => entry.amount > 0));
    setExpenseData((data || []).filter(entry => entry.amount <= 0));
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container py-4">
      <h2>Dashboard</h2>

      <div className="d-flex align-items-center gap-3 mb-3">
        <DateSelector date={selectedDate} onChange={setSelectedDate} />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Upload CSV
        </button>
      </div>

      <UploadModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onUploadSuccess={fetchData}
      />

      {incomeData.length > 0 && (
        <div className="my-4">
          <h4>Ganhos</h4>
          <TableView data={incomeData} setData={setIncomeData} />
        </div>
      )}

      {expenseData.length > 0 && (
        <div className="my-4">
          <h4>Despesas</h4>
          <TableView data={expenseData} setData={setExpenseData} />
        </div>
      )}

      {historicData.length === 0 && (
        <div className="alert alert-info">
          Nenhum dado para {`${selectedDate.month}`.padStart(2, "0")}/{selectedDate.year}.
        </div>
      )}
    </div>
  );
}
