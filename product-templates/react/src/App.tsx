import { Sidebar, StatCard, RevenueChart, ChannelBars } from "./components";
import { stats, orders } from "./data";

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <h1>Overview</h1>
          <div className="actions">
            <button className="btn">Last 30 days</button>
            <button className="btn primary">+ New report</button>
          </div>
        </div>

        <div className="grid-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid-main">
          <div className="card">
            <h3>Revenue — last 30 days</h3>
            <RevenueChart />
          </div>
          <div className="card">
            <h3>Traffic channels</h3>
            <ChannelBars />
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h3>Recent orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.amount}</td>
                  <td>
                    <span className={`pill ${o.status}`}>{o.status}</span>
                  </td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
