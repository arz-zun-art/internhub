import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown, CirclePlus, LayoutDashboard, Search, Sparkles, Target, X } from 'lucide-react'
import './App.css'

type Application = { id: number; company: string; role: string; location: string; status: string; appliedDate: string; nextStep: string; accent: string }
type Summary = { total: number; interviews: number; offers: number; responseRate: number }

const API_URL = 'http://localhost:4000/api'

function App() {
  const [applications, setApplications] = useState<Application[]>([])
  const [summary, setSummary] = useState<Summary>({ total: 0, interviews: 0, offers: 0, responseRate: 0 })
  const [activeFilter, setActiveFilter] = useState('All applications')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ company: '', role: '', location: '', status: 'Applied' })

  useEffect(() => {
    Promise.all([fetch(`${API_URL}/applications`).then((res) => res.json()), fetch(`${API_URL}/summary`).then((res) => res.json())]).then(([items, metrics]) => {
      setApplications(items)
      setSummary(metrics)
    }).catch(() => undefined)
  }, [])

  const filteredApplications = applications.filter((application) => {
    const matchesFilter = activeFilter === 'All applications' || application.status === activeFilter
    const matchesSearch = `${application.company} ${application.role}`.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  async function addApplication(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`${API_URL}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!response.ok) return
    const created = await response.json()
    setApplications((current) => [created, ...current])
    setSummary((current) => ({ ...current, total: current.total + 1 }))
    setForm({ company: '', role: '', location: '', status: 'Applied' })
    setShowModal(false)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>intern<span className="brand-accent">hub</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav><button className="nav-item active"><LayoutDashboard size={17} /> Overview</button><button className="nav-item"><BriefcaseBusiness size={17} /> Applications <span className="nav-count">{summary.total}</span></button><button className="nav-item"><Target size={17} /> Goals</button></nav>
        <div className="sidebar-bottom"><div className="progress-label"><span>September goal</span><strong>8 / 12</strong></div><div className="progress-track"><div className="progress-value" /></div><p>Four more applications to hit your monthly target.</p><a href="http://localhost:4000/api-docs" target="_blank" rel="noreferrer" className="api-link">API docs <ArrowUpRight size={14} /></a></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="profile"><div className="avatar">JD</div><span>Jordan Davis</span><ChevronDown size={15} /></div></header>
        <div className="content-wrap">
          <section className="hero-row"><div><p className="eyebrow">MONDAY, SEPTEMBER 22, 2026</p><h1>Your internship search,<br /><em>in motion.</em></h1><p className="hero-copy">A clear view of every opportunity, next step, and small win.</p></div><button className="primary-button" onClick={() => setShowModal(true)}><CirclePlus size={18} /> Add application</button></section>
          <section className="stats-grid"><div className="stat-card"><span className="stat-icon blue"><BriefcaseBusiness size={17} /></span><div><p>Total applications</p><strong>{summary.total}</strong><span className="stat-note up">↑ 2 this month</span></div></div><div className="stat-card"><span className="stat-icon coral"><CalendarDays size={17} /></span><div><p>Interviews ahead</p><strong>{summary.interviews}</strong><span className="stat-note">Next: Sep 26</span></div></div><div className="stat-card"><span className="stat-icon mint"><Check size={17} /></span><div><p>Offers received</p><strong>{summary.offers}</strong><span className="stat-note up">You’re doing great</span></div></div><div className="stat-card highlight"><span className="stat-icon sun"><Target size={17} /></span><div><p>Response rate</p><strong>{summary.responseRate}%</strong><span className="stat-note">Industry avg. 18%</span></div></div></section>
          <section className="section-heading"><div><h2>Application pipeline</h2><p>Keep the momentum going, one thoughtful application at a time.</p></div><div className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications" /></div></section>
          <div className="filter-row">{['All applications', 'Applied', 'Interview', 'Offer', 'Rejected'].map((filter) => <button key={filter} className={activeFilter === filter ? 'filter active-filter' : 'filter'} onClick={() => setActiveFilter(filter)}>{filter}{filter === 'All applications' && <span>{applications.length}</span>}</button>)}</div>
          <section className="applications-list">{filteredApplications.map((application) => <article className="application-row" key={application.id}><div className="company-logo" style={{ background: application.accent }}>{application.company.slice(0, 1)}</div><div className="application-main"><div className="application-title"><h3>{application.company}</h3><span className={`status status-${application.status.toLowerCase()}`}>{application.status}</span></div><p>{application.role} <span>·</span> {application.location}</p></div><div className="next-step"><span>NEXT STEP</span><strong>{application.nextStep}</strong></div><div className="date-applied"><span>APPLIED</span><strong>{new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong></div><button className="more-button" aria-label={`Open ${application.company}`}><ArrowUpRight size={17} /></button></article>)}{filteredApplications.length === 0 && <div className="empty-state">No applications match that search.</div>}</section>
          <div className="footer-note"><span className="online-dot" /> Synced with InternHub API <span>·</span> <a href="http://localhost:4000/api-docs" target="_blank" rel="noreferrer">View Swagger documentation</a></div>
        </div>
      </main>
      {showModal && <div className="modal-backdrop" onClick={() => setShowModal(false)}><form className="modal" onSubmit={addApplication} onClick={(event) => event.stopPropagation()}><button type="button" className="close-button" onClick={() => setShowModal(false)}><X size={18} /></button><p className="eyebrow">NEW OPPORTUNITY</p><h2>Add an application</h2><p className="modal-copy">Keep your pipeline current while the details are fresh.</p><label>Company<input required value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="e.g. Canva" /></label><label>Role<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="e.g. Product Intern" /></label><label>Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Remote" /></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select></label><button className="primary-button full-width" type="submit">Save application <ArrowUpRight size={17} /></button></form></div>}
    </div>
  )
}

export default App
