import { useState, useContext, createContext, useMemo, useEffect, useRef } from "react";

const CATEGORIES = ["Food & Dining","Transport","Shopping","Entertainment","Healthcare","Utilities","Salary","Freelance","Investment","Rent"];
const CAT_COLORS = {"Food & Dining":"#E24B4A","Transport":"#378ADD","Shopping":"#D4537E","Entertainment":"#7F77DD","Healthcare":"#1D9E75","Utilities":"#BA7517","Salary":"#639922","Freelance":"#3B6D11","Investment":"#185FA5","Rent":"#993C1D"};

const RAW_TX = [
  {id:1,date:"2026-04-01",description:"Monthly Salary",category:"Salary",amount:85000,type:"income"},
  {id:2,date:"2026-04-02",description:"Swiggy Order",category:"Food & Dining",amount:-840,type:"expense"},
  {id:3,date:"2026-04-03",description:"Uber Ride",category:"Transport",amount:-320,type:"expense"},
  {id:4,date:"2026-04-04",description:"Amazon Purchase",category:"Shopping",amount:-2150,type:"expense"},
  {id:5,date:"2026-04-05",description:"Freelance Project",category:"Freelance",amount:18000,type:"income"},
  {id:6,date:"2026-04-05",description:"Netflix",category:"Entertainment",amount:-649,type:"expense"},
  {id:7,date:"2026-04-06",description:"Electricity Bill",category:"Utilities",amount:-1800,type:"expense"},
  {id:8,date:"2026-04-07",description:"Pharmacy",category:"Healthcare",amount:-560,type:"expense"},
  {id:9,date:"2026-04-08",description:"Rent Payment",category:"Rent",amount:-22000,type:"expense"},
  {id:10,date:"2026-04-09",description:"Zomato Order",category:"Food & Dining",amount:-1120,type:"expense"},
  {id:11,date:"2026-03-01",description:"Monthly Salary",category:"Salary",amount:85000,type:"income"},
  {id:12,date:"2026-03-03",description:"Grocery Store",category:"Food & Dining",amount:-3200,type:"expense"},
  {id:13,date:"2026-03-05",description:"Mutual Fund SIP",category:"Investment",amount:-10000,type:"expense"},
  {id:14,date:"2026-03-08",description:"Petrol",category:"Transport",amount:-2200,type:"expense"},
  {id:15,date:"2026-03-10",description:"Freelance Design",category:"Freelance",amount:12000,type:"income"},
  {id:16,date:"2026-03-12",description:"Movie Tickets",category:"Entertainment",amount:-800,type:"expense"},
  {id:17,date:"2026-03-15",description:"Doctor Visit",category:"Healthcare",amount:-1500,type:"expense"},
  {id:18,date:"2026-03-18",description:"Internet Bill",category:"Utilities",amount:-999,type:"expense"},
  {id:19,date:"2026-03-20",description:"Rent Payment",category:"Rent",amount:-22000,type:"expense"},
  {id:20,date:"2026-03-25",description:"Online Shopping",category:"Shopping",amount:-4500,type:"expense"},
  {id:21,date:"2026-02-01",description:"Monthly Salary",category:"Salary",amount:85000,type:"income"},
  {id:22,date:"2026-02-04",description:"Restaurant",category:"Food & Dining",amount:-2100,type:"expense"},
  {id:23,date:"2026-02-06",description:"Flight Ticket",category:"Transport",amount:-8500,type:"expense"},
  {id:24,date:"2026-02-10",description:"Clothing",category:"Shopping",amount:-3800,type:"expense"},
  {id:25,date:"2026-02-12",description:"Freelance Content",category:"Freelance",amount:9500,type:"income"},
  {id:26,date:"2026-02-14",description:"Spotify",category:"Entertainment",amount:-119,type:"expense"},
  {id:27,date:"2026-02-18",description:"Water Bill",category:"Utilities",amount:-600,type:"expense"},
  {id:28,date:"2026-02-20",description:"Lab Tests",category:"Healthcare",amount:-2200,type:"expense"},
  {id:29,date:"2026-02-22",description:"Rent Payment",category:"Rent",amount:-22000,type:"expense"},
  {id:30,date:"2026-02-28",description:"Stock Dividend",category:"Investment",amount:3200,type:"income"},
];

const AppContext = createContext(null);

const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");
const fmtShort = (n) => {
  const abs = Math.abs(n);
  if (abs >= 100000) return "₹" + (abs/100000).toFixed(1) + "L";
  if (abs >= 1000) return "₹" + (abs/1000).toFixed(1) + "K";
  return "₹" + abs;
};

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

export default function App() {
  const [transactions, setTransactions] = useLocalStorage("fin_tx", RAW_TX);
  const [role, setRole] = useLocalStorage("fin_role", "viewer");
  const [darkMode, setDarkMode] = useLocalStorage("fin_dark", false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterCat, setFilterCat] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [nextId, setNextId] = useState(31);

  const addOrEdit = (tx) => {
    if (tx.id) {
      setTransactions(transactions.map(t => t.id === tx.id ? tx : t));
    } else {
      const newTx = {...tx, id: nextId};
      setNextId(nextId + 1);
      setTransactions([newTx, ...transactions]);
    }
    setShowModal(false);
    setEditTx(null);
  };
  const deleteTx = (id) => setTransactions(transactions.filter(t => t.id !== id));

  const ctx = { transactions, role, darkMode, setDarkMode, setRole, filterCat, setFilterCat, filterType, setFilterType, search, setSearch, sortBy, setSortBy, sortDir, setSortDir, addOrEdit, deleteTx, showModal, setShowModal, editTx, setEditTx };

  const bg = darkMode ? "#0f1117" : "#f4f3ef";
  const surface = darkMode ? "#1a1d27" : "#ffffff";
  const text = darkMode ? "#e8e6e1" : "#1a1917";
  const muted = darkMode ? "#6b6a66" : "#888780";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const accent = "#378ADD";

  return (
    <AppContext.Provider value={ctx}>
      <div style={{minHeight:"100vh",background:bg,color:text,fontFamily:"'DM Sans',system-ui,sans-serif",transition:"background 0.3s,color 0.3s"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          input,select,textarea{background:${darkMode?"#252836":"#f8f7f4"};color:${text};border:1px solid ${border};border-radius:8px;padding:8px 12px;font-size:14px;font-family:inherit;outline:none;transition:border 0.2s}
          input:focus,select:focus{border-color:${accent}}
          button{cursor:pointer;font-family:inherit;transition:all 0.15s}
          ::-webkit-scrollbar{width:4px;height:4px}
          ::-webkit-scrollbar-track{background:transparent}
          ::-webkit-scrollbar-thumb{background:${muted};border-radius:4px}
          .tab-btn{background:none;border:none;padding:10px 18px;font-size:14px;font-weight:500;color:${muted};border-radius:8px;transition:all 0.15s}
          .tab-btn.active{background:${accent}18;color:${accent}}
          .tab-btn:hover:not(.active){background:${darkMode?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)"};color:${text}}
          .card{background:${surface};border:1px solid ${border};border-radius:16px;padding:20px}
          .tx-row:hover{background:${darkMode?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"}}
          .icon-btn{background:none;border:none;padding:6px;border-radius:6px;color:${muted};display:flex;align-items:center}
          .icon-btn:hover{background:${darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"};color:${text}}
          .pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:0.3px}
          .btn-primary{background:${accent};color:#fff;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:500}
          .btn-primary:hover{background:#1e6fbe;transform:translateY(-1px)}
          .btn-secondary{background:none;color:${text};border:1px solid ${border};border-radius:10px;padding:9px 18px;font-size:14px;font-weight:400}
          .btn-secondary:hover{background:${darkMode?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)"}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          .fade-in{animation:fadeIn 0.3s ease}
          @media(max-width:640px){.hide-sm{display:none!important}}
          @media(max-width:768px){.hide-md{display:none!important};.grid-2{grid-template-columns:1fr!important};.grid-4{grid-template-columns:1fr 1fr!important}}
        `}</style>

        <Sidebar bg={surface} text={text} muted={muted} border={border} accent={accent} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
        
        <div style={{marginLeft:220,padding:"0 32px 32px",transition:"margin 0.3s"}} className="main-content">
          <Header text={text} muted={muted} border={border} surface={surface} accent={accent} darkMode={darkMode} />
          
          <div className="fade-in" key={activeTab}>
            {activeTab === "dashboard" && <DashboardView text={text} muted={muted} border={border} surface={surface} accent={accent} darkMode={darkMode} />}
            {activeTab === "transactions" && <TransactionsView text={text} muted={muted} border={border} surface={surface} accent={accent} darkMode={darkMode} />}
            {activeTab === "insights" && <InsightsView text={text} muted={muted} border={border} surface={surface} accent={accent} darkMode={darkMode} />}
          </div>
        </div>

        {showModal && <TxModal text={text} muted={muted} border={border} surface={surface} accent={accent} darkMode={darkMode} bg={bg} />}

        <style>{`@media(max-width:768px){.main-content{margin-left:0!important;padding:0 16px 32px!important}}`}</style>
      </div>
    </AppContext.Provider>
  );
}

function Sidebar({bg,text,muted,border,accent,activeTab,setActiveTab,darkMode}) {
  const {role, setRole, setDarkMode} = useContext(AppContext);
  const tabs = [
    {id:"dashboard",label:"Overview",icon:"◈"},
    {id:"transactions",label:"Transactions",icon:"⇌"},
    {id:"insights",label:"Insights",icon:"◎"},
  ];
  return (
    <div style={{position:"fixed",top:0,left:0,height:"100vh",width:220,background:bg,borderRight:`1px solid ${border}`,display:"flex",flexDirection:"column",padding:"24px 16px",zIndex:100}} className="hide-sm">
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <div style={{width:32,height:32,borderRadius:8,background:accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",fontWeight:600}}>₹</div>
          <span style={{fontSize:15,fontWeight:600,color:text,letterSpacing:-0.3}}>FinFlow</span>
        </div>
        <p style={{fontSize:11,color:muted,marginLeft:42}}>Personal Finance</p>
      </div>

      <div style={{marginBottom:8}}>
        <p style={{fontSize:10,color:muted,letterSpacing:1,textTransform:"uppercase",fontWeight:500,marginBottom:8,paddingLeft:8}}>Menu</p>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn${activeTab===t.id?" active":""}`} style={{display:"flex",alignItems:"center",gap:10,width:"100%",marginBottom:2}} onClick={()=>setActiveTab(t.id)}>
            <span style={{fontSize:14}}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{marginTop:"auto"}}>
        <div style={{background:darkMode?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)",borderRadius:12,padding:14,marginBottom:12}}>
          <p style={{fontSize:11,color:muted,marginBottom:8,fontWeight:500}}>Role</p>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{width:"100%",fontSize:13}}>
            <option value="viewer">👁 Viewer</option>
            <option value="admin">⚡ Admin</option>
          </select>
          <p style={{fontSize:10,color:muted,marginTop:6}}>{role==="admin"?"Can add & edit data":"Read-only access"}</p>
        </div>

        <button onClick={()=>setDarkMode(!darkMode)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:`1px solid ${border}`,borderRadius:10,padding:"8px 14px",width:"100%",color:muted,fontSize:13}}>
          <span>{darkMode?"☀":"⏾"}</span>
          <span>{darkMode?"Light mode":"Dark mode"}</span>
        </button>
      </div>
    </div>
  );
}

function Header({text,muted,border,surface,accent,darkMode}) {
  const {role, setRole, setDarkMode, setShowModal, setEditTx} = useContext(AppContext);
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0",marginBottom:8,borderBottom:`1px solid ${border}`,position:"sticky",top:0,background:darkMode?"#0f1117":"#f4f3ef",zIndex:50}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:600,color:text,letterSpacing:-0.5}}>Financial Dashboard</h1>
        <p style={{fontSize:13,color:muted}}>April 2026 · {role === "admin" ? "Admin View" : "Read Only"}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {role === "admin" && (
          <button className="btn-primary" onClick={()=>{setEditTx(null);setShowModal(true)}} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,padding:"8px 16px"}}>
            <span style={{fontSize:16}}>+</span> Add Transaction
          </button>
        )}
        <div style={{display:"flex",alignItems:"center",gap:6,background:role==="admin"?"#378ADD18":"rgba(100,153,34,0.12)",borderRadius:8,padding:"6px 12px"}}>
          <span style={{fontSize:11,fontWeight:500,color:role==="admin"?accent:"#639922"}}>{role==="admin"?"⚡ Admin":"👁 Viewer"}</span>
        </div>
        <div className="hide-md">
          <select value={role} onChange={e=>setRole(e.target.value)} style={{fontSize:13,padding:"6px 10px"}}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button onClick={()=>setDarkMode(!darkMode)} className="icon-btn hide-md" style={{fontSize:16}}>{darkMode?"☀":"⏾"}</button>
      </div>
    </div>
  );
}

function SummaryCard({label,value,change,color,bg,text,muted,border,surface}) {
  const isPos = change >= 0;
  return (
    <div className="card" style={{background:surface,border:`1px solid ${border}`}}>
      <p style={{fontSize:12,color:muted,fontWeight:500,marginBottom:8,letterSpacing:0.3}}>{label}</p>
      <p style={{fontSize:24,fontWeight:600,color:color||text,letterSpacing:-0.5,marginBottom:6}}>{value}</p>
      {change !== undefined && (
        <span style={{fontSize:12,color:isPos?"#639922":"#E24B4A",fontWeight:500}}>
          {isPos?"▲":"▼"} {Math.abs(change).toFixed(1)}% vs last month
        </span>
      )}
    </div>
  );
}

function BarChart({data, darkMode, accent}) {
  const max = Math.max(...data.map(d=>d.value));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120,padding:"0 4px"}}>
      {data.map((d,i) => (
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:10,color:darkMode?"#aaa":"#666"}}>{fmtShort(d.value)}</span>
          <div style={{width:"100%",background:i===data.length-1?accent:`${accent}50`,borderRadius:"4px 4px 0 0",height:`${Math.max(4,(d.value/max)*80)}px`,transition:"height 0.5s ease"}}/>
          <span style={{fontSize:10,color:darkMode?"#888":"#999",whiteSpace:"nowrap"}}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({segments, size=120}) {
  const total = segments.reduce((a,s)=>a+s.value,0);
  let cumulative = 0;
  const paths = segments.map((seg) => {
    const pct = seg.value / total;
    const start = cumulative * Math.PI * 2 - Math.PI/2;
    cumulative += pct;
    const end = cumulative * Math.PI * 2 - Math.PI/2;
    const r = 44, cx = 60, cy = 60;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: seg.color, label: seg.label, pct: (pct*100).toFixed(0) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="30" fill="transparent"/>
      {paths.map((p,i) => <path key={i} d={p.path} fill={p.color} opacity="0.85"/>)}
      <circle cx="60" cy="60" r="28" fill="white" opacity="0" style={{pointerEvents:"none"}}/>
    </svg>
  );
}

function DashboardView({text,muted,border,surface,accent,darkMode}) {
  const {transactions} = useContext(AppContext);

  const now = new Date("2026-04-09");
  const curMonth = transactions.filter(t=>t.date.startsWith("2026-04"));
  const prevMonth = transactions.filter(t=>t.date.startsWith("2026-03"));

  const calcSummary = (txs) => ({
    income: txs.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0),
    expenses: Math.abs(txs.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0)),
  });

  const cur = calcSummary(curMonth);
  const prev = calcSummary(prevMonth);
  const balance = transactions.reduce((a,t)=>a+t.amount,0);
  const changeInc = prev.income ? ((cur.income - prev.income)/prev.income*100) : 0;
  const changeExp = prev.expenses ? ((cur.expenses - prev.expenses)/prev.expenses*100) : 0;

  const monthlyData = [
    {label:"Feb",value:calcSummary(transactions.filter(t=>t.date.startsWith("2026-02"))).expenses},
    {label:"Mar",value:calcSummary(transactions.filter(t=>t.date.startsWith("2026-03"))).expenses},
    {label:"Apr",value:cur.expenses},
  ];

  const expensesByCat = {};
  transactions.filter(t=>t.type==="expense"&&t.date.startsWith("2026-0")).forEach(t=>{
    expensesByCat[t.category] = (expensesByCat[t.category]||0) + Math.abs(t.amount);
  });
  const catSegments = Object.entries(expensesByCat).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>({label:k,value:v,color:CAT_COLORS[k]}));
  const topCat = catSegments[0];

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}} className="grid-4">
        <SummaryCard label="Total Balance" value={fmt(balance)} color="#378ADD" change={5.2} surface={surface} border={border} text={text} muted={muted}/>
        <SummaryCard label="Monthly Income" value={fmt(cur.income)} color="#639922" change={changeInc} surface={surface} border={border} text={text} muted={muted}/>
        <SummaryCard label="Monthly Expenses" value={fmt(cur.expenses)} color="#E24B4A" change={changeExp} surface={surface} border={border} text={text} muted={muted}/>
        <SummaryCard label="Net Savings" value={fmt(cur.income-cur.expenses)} color="#7F77DD" change={12.1} surface={surface} border={border} text={text} muted={muted}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}} className="grid-2">
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <p style={{fontSize:13,fontWeight:500,color:text}}>Monthly Expense Trend</p>
              <p style={{fontSize:11,color:muted}}>Feb – Apr 2026</p>
            </div>
          </div>
          <BarChart data={monthlyData} darkMode={darkMode} accent={accent}/>
        </div>

        <div className="card">
          <div style={{marginBottom:16}}>
            <p style={{fontSize:13,fontWeight:500,color:text}}>Spending Breakdown</p>
            <p style={{fontSize:11,color:muted}}>By category (current quarter)</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <DonutChart segments={catSegments}/>
            <div style={{flex:1}}>
              {catSegments.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                    <span style={{fontSize:11,color:muted}}>{s.label}</span>
                  </div>
                  <span style={{fontSize:11,fontWeight:500,color:text}}>{fmtShort(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:500,color:text}}>Recent Transactions</p>
          <span style={{fontSize:12,color:accent,cursor:"pointer"}}>View all →</span>
        </div>
        {transactions.slice(0,5).map(tx=>(
          <TxRow key={tx.id} tx={tx} text={text} muted={muted} border={border} compact />
        ))}
      </div>
    </div>
  );
}

function TxRow({tx,text,muted,border,compact}) {
  const {role,setEditTx,setShowModal,deleteTx} = useContext(AppContext);
  const color = CAT_COLORS[tx.category] || "#888";
  return (
    <div className="tx-row" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 4px",borderBottom:`1px solid ${border}`,transition:"background 0.1s"}}>
      <div style={{width:36,height:36,borderRadius:10,background:`${color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontSize:14,color}}>{getCatIcon(tx.category)}</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:13,fontWeight:500,color:text,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.description}</p>
        <p style={{fontSize:11,color:muted}}>{tx.category} · {tx.date}</p>
      </div>
      {!compact && <span className="pill hide-sm" style={{background:`${color}18`,color}}>{tx.type}</span>}
      <span style={{fontSize:14,fontWeight:600,color:tx.amount>0?"#639922":"#E24B4A",fontFamily:"'DM Mono',monospace",minWidth:80,textAlign:"right"}}>
        {tx.amount > 0 ? "+" : ""}{fmt(tx.amount)}
      </span>
      {role === "admin" && !compact && (
        <div style={{display:"flex",gap:4}}>
          <button className="icon-btn" onClick={()=>{setEditTx(tx);setShowModal(true)}} title="Edit">✏</button>
          <button className="icon-btn" onClick={()=>deleteTx(tx.id)} title="Delete" style={{color:"#E24B4A"}}>✕</button>
        </div>
      )}
    </div>
  );
}

function getCatIcon(cat) {
  const icons = {"Food & Dining":"🍽","Transport":"🚌","Shopping":"🛍","Entertainment":"🎬","Healthcare":"💊","Utilities":"⚡","Salary":"💼","Freelance":"💻","Investment":"📈","Rent":"🏠"};
  return icons[cat] || "💳";
}

function TransactionsView({text,muted,border,surface,accent,darkMode}) {
  const {transactions,filterCat,setFilterCat,filterType,setFilterType,search,setSearch,sortBy,setSortBy,sortDir,setSortDir,role,setShowModal,setEditTx,deleteTx} = useContext(AppContext);

  const filtered = useMemo(()=>{
    let tx = [...transactions];
    if(filterCat !== "all") tx = tx.filter(t=>t.category===filterCat);
    if(filterType !== "all") tx = tx.filter(t=>t.type===filterType);
    if(search) tx = tx.filter(t=>t.description.toLowerCase().includes(search.toLowerCase())||t.category.toLowerCase().includes(search.toLowerCase()));
    tx.sort((a,b)=>{
      let cmp = 0;
      if(sortBy==="date") cmp = a.date.localeCompare(b.date);
      if(sortBy==="amount") cmp = Math.abs(a.amount)-Math.abs(b.amount);
      if(sortBy==="category") cmp = a.category.localeCompare(b.category);
      return sortDir==="desc" ? -cmp : cmp;
    });
    return tx;
  },[transactions,filterCat,filterType,search,sortBy,sortDir]);

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = filtered.map(t=>`${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header+rows], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="transactions.csv"; a.click();
  };

  const SortBtn = ({field,label}) => (
    <button onClick={()=>{if(sortBy===field){setSortDir(d=>d==="asc"?"desc":"asc")}else{setSortBy(field);setSortDir("desc")}}}
      style={{background:"none",border:"none",color:sortBy===field?accent:muted,fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
      {label} {sortBy===field?(sortDir==="asc"?"↑":"↓"):""}
    </button>
  );

  return (
    <div>
      <div className="card" style={{marginBottom:20}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <input placeholder="Search transactions..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:"1 1 200px",minWidth:140}}/>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{flex:"0 0 auto"}}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{flex:"0 0 auto"}}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button className="btn-secondary" onClick={exportCSV} style={{fontSize:13,padding:"8px 14px",display:"flex",gap:6,alignItems:"center"}}>
            <span>↓</span> Export CSV
          </button>
          {role==="admin" && (
            <button className="btn-primary" onClick={()=>{setEditTx(null);setShowModal(true)}} style={{fontSize:13,padding:"8px 14px",display:"flex",gap:4,alignItems:"center"}}>
              + Add
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <p style={{fontSize:13,color:muted}}>{filtered.length} transactions</p>
          <div style={{display:"flex",gap:16}}>
            <SortBtn field="date" label="Date"/>
            <SortBtn field="amount" label="Amount"/>
            <SortBtn field="category" label="Category"/>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <p style={{fontSize:32,marginBottom:8}}>🔍</p>
            <p style={{color:muted,fontSize:14}}>No transactions found</p>
            <p style={{color:muted,fontSize:12,marginTop:4}}>Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map(tx=><TxRow key={tx.id} tx={tx} text={text} muted={muted} border={border}/>)
        )}
      </div>
    </div>
  );
}

function InsightsView({text,muted,border,surface,accent,darkMode}) {
  const {transactions} = useContext(AppContext);

  const expensesByCat = {};
  const monthlyExp = {};
  transactions.filter(t=>t.type==="expense").forEach(t=>{
    expensesByCat[t.category] = (expensesByCat[t.category]||0)+Math.abs(t.amount);
    const m = t.date.substring(0,7);
    monthlyExp[m] = (monthlyExp[m]||0)+Math.abs(t.amount);
  });

  const catSorted = Object.entries(expensesByCat).sort((a,b)=>b[1]-a[1]);
  const topCat = catSorted[0];
  const totalExp = Object.values(expensesByCat).reduce((a,v)=>a+v,0);

  const months = Object.keys(monthlyExp).sort();
  const lastTwo = months.slice(-2);
  const monthDiff = lastTwo.length===2 ? ((monthlyExp[lastTwo[1]]-monthlyExp[lastTwo[0]])/monthlyExp[lastTwo[0]]*100) : 0;

  const savingsRate = (() => {
    const inc = transactions.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
    const exp = transactions.filter(t=>t.type==="expense").reduce((a,t)=>a+Math.abs(t.amount),0);
    return inc > 0 ? ((inc-exp)/inc*100) : 0;
  })();

  const InsightCard = ({icon,title,value,sub,color}) => (
    <div className="card" style={{borderLeft:`3px solid ${color}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <p style={{fontSize:11,color:muted,marginBottom:6,fontWeight:500}}>{title}</p>
          <p style={{fontSize:22,fontWeight:600,color:text,marginBottom:4,letterSpacing:-0.5}}>{value}</p>
          <p style={{fontSize:12,color:muted}}>{sub}</p>
        </div>
        <span style={{fontSize:24,opacity:0.7}}>{icon}</span>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}} className="grid-2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
        <InsightCard icon="🏆" title="Top Spending Category" value={topCat?topCat[0]:"—"} sub={topCat?`${fmt(topCat[1])} total (${((topCat[1]/totalExp)*100).toFixed(0)}% of expenses)`:"No data"} color="#E24B4A"/>
        <InsightCard icon="📊" title="Month-over-Month Change" value={`${monthDiff>0?"+":""}${monthDiff.toFixed(1)}%`} sub={monthDiff>0?"Expenses increased vs prev month":"Expenses decreased vs prev month"} color={monthDiff>0?"#E24B4A":"#639922"}/>
        <InsightCard icon="💰" title="Savings Rate" value={`${savingsRate.toFixed(1)}%`} sub={savingsRate>20?"Healthy savings rate":"Room to improve"} color={savingsRate>20?"#639922":"#BA7517"}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}} className="grid-2">
        <div className="card">
          <p style={{fontSize:13,fontWeight:500,color:text,marginBottom:4}}>Category Breakdown</p>
          <p style={{fontSize:11,color:muted,marginBottom:16}}>All time expense distribution</p>
          {catSorted.slice(0,7).map(([cat,val],i)=>{
            const pct = (val/totalExp*100);
            return (
              <div key={cat} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:text,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:CAT_COLORS[cat],display:"inline-block"}}/>
                    {cat}
                  </span>
                  <span style={{fontSize:12,color:muted,fontFamily:"'DM Mono',monospace"}}>{fmtShort(val)} · {pct.toFixed(0)}%</span>
                </div>
                <div style={{height:4,background:darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:CAT_COLORS[cat],borderRadius:4,transition:"width 0.6s ease"}}/>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <p style={{fontSize:13,fontWeight:500,color:text,marginBottom:4}}>Monthly Comparison</p>
          <p style={{fontSize:11,color:muted,marginBottom:16}}>Income vs Expenses per month</p>
          {months.map(m=>{
            const inc = transactions.filter(t=>t.type==="income"&&t.date.startsWith(m)).reduce((a,t)=>a+t.amount,0);
            const exp = Math.abs(transactions.filter(t=>t.type==="expense"&&t.date.startsWith(m)).reduce((a,t)=>a+t.amount,0));
            const maxVal = Math.max(inc,exp);
            const label = new Date(m+"-01").toLocaleDateString("en",{month:"short",year:"2-digit"});
            return (
              <div key={m} style={{marginBottom:16}}>
                <p style={{fontSize:12,fontWeight:500,color:text,marginBottom:6}}>{label}</p>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:10,color:muted,width:60}}>Income</span>
                  <div style={{flex:1,height:8,background:darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)",borderRadius:4}}>
                    <div style={{width:`${(inc/maxVal)*100}%`,height:"100%",background:"#639922",borderRadius:4,transition:"width 0.6s"}}/>
                  </div>
                  <span style={{fontSize:10,color:"#639922",minWidth:50,textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{fmtShort(inc)}</span>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:10,color:muted,width:60}}>Expense</span>
                  <div style={{flex:1,height:8,background:darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)",borderRadius:4}}>
                    <div style={{width:`${(exp/maxVal)*100}%`,height:"100%",background:"#E24B4A",borderRadius:4,transition:"width 0.6s"}}/>
                  </div>
                  <span style={{fontSize:10,color:"#E24B4A",minWidth:50,textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{fmtShort(exp)}</span>
                </div>
              </div>
            );
          })}

          <div style={{borderTop:`1px solid`,borderColor:"rgba(128,128,128,0.15)",paddingTop:16,marginTop:8}}>
            <p style={{fontSize:12,color:muted,marginBottom:8}}>💡 Quick takeaways</p>
            <ul style={{fontSize:12,color:muted,lineHeight:1.8,listStyle:"none"}}>
              <li>• Rent is your largest fixed expense</li>
              <li>• Freelance income adds meaningful supplemental revenue</li>
              <li>• {savingsRate > 20 ? "Savings rate is healthy above 20%" : "Consider reducing discretionary spend"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TxModal({text,muted,border,surface,accent,darkMode,bg}) {
  const {editTx,setShowModal,setEditTx,addOrEdit} = useContext(AppContext);
  const [form, setForm] = useState(editTx || {description:"",amount:"",category:"Salary",type:"income",date:new Date().toISOString().split("T")[0]});

  const handleSubmit = () => {
    if(!form.description||!form.amount||!form.date) return;
    const amount = parseFloat(form.amount) * (form.type==="expense"?-1:1);
    addOrEdit({...form,amount:isNaN(amount)?0:amount});
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(2px)"}} onClick={()=>{setShowModal(false);setEditTx(null)}}>
      <div style={{background:surface,borderRadius:20,padding:28,width:"min(460px,95vw)",border:`1px solid ${border}`}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{fontSize:16,fontWeight:600,color:text}}>{editTx?"Edit Transaction":"New Transaction"}</h2>
          <button className="icon-btn" onClick={()=>{setShowModal(false);setEditTx(null)}} style={{fontSize:16}}>✕</button>
        </div>

        <div style={{display:"grid",gap:14}}>
          <div>
            <label style={{fontSize:12,color:muted,marginBottom:6,display:"block"}}>Description</label>
            <input style={{width:"100%"}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="e.g. Monthly Salary"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:12,color:muted,marginBottom:6,display:"block"}}>Amount (₹)</label>
              <input type="number" style={{width:"100%"}} value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0"/>
            </div>
            <div>
              <label style={{fontSize:12,color:muted,marginBottom:6,display:"block"}}>Date</label>
              <input type="date" style={{width:"100%"}} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:12,color:muted,marginBottom:6,display:"block"}}>Category</label>
              <select style={{width:"100%"}} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,color:muted,marginBottom:6,display:"block"}}>Type</label>
              <select style={{width:"100%"}} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:10,marginTop:24}}>
          <button className="btn-secondary" style={{flex:1}} onClick={()=>{setShowModal(false);setEditTx(null)}}>Cancel</button>
          <button className="btn-primary" style={{flex:1}} onClick={handleSubmit}>{editTx?"Save Changes":"Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}
