import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Crosshair,
  Layers3,
  LocateFixed,
  MapPin,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Route as RouteIcon,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapping Operations | Civic Response" },
      {
        name: "description",
        content: "Operational mapping for household geotags, evacuation capacity, and rescue routes.",
      },
      { property: "og:title", content: "Mapping Operations | Civic Response" },
      {
        property: "og:description",
        content: "Operational mapping for household geotags, evacuation capacity, and rescue routes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MappingPage,
});

const households = [
  { id: 1, name: "HH-0217 · Dela Cruz", purok: "Purok 2", status: "Needs assistance", tone: "alert", accuracy: "4 m", x: 34, y: 41 },
  { id: 2, name: "HH-0189 · Santos", purok: "Purok 1", status: "Evacuated", tone: "safe", accuracy: "7 m", x: 47, y: 60 },
  { id: 3, name: "HH-0304 · Reyes", purok: "Purok 3", status: "Monitoring", tone: "warn", accuracy: "5 m", x: 65, y: 34 },
  { id: 4, name: "HH-0112 · Garcia", purok: "Purok 2", status: "Safe", tone: "safe", accuracy: "9 m", x: 72, y: 69 },
  { id: 5, name: "HH-0251 · Mendoza", purok: "Purok 4", status: "Unverified", tone: "muted", accuracy: "12 m", x: 24, y: 71 },
];

const sites = [
  { id: 1, pin: "E1", name: "Barangay Covered Court", type: "Primary center", vacant: 186, capacity: 300, x: 58, y: 49 },
  { id: 2, pin: "E2", name: "San Isidro Elementary", type: "Public school", vacant: 74, capacity: 180, x: 78, y: 28 },
  { id: 3, pin: "E3", name: "Community Hall", type: "Satellite center", vacant: 42, capacity: 80, x: 40, y: 25 },
];

const routes = [
  { id: 1, name: "Route to Covered Court", team: "Rescue Team Alpha", area: "Purok 2", distance: "2.4 km" },
  { id: 2, name: "Route to San Isidro", team: "Rescue Team Bravo", area: "Purok 3", distance: "3.1 km" },
];

const statusOptions = ["All statuses", "Needs assistance", "Evacuated", "Monitoring", "Safe", "Unverified"];

function MappingPage() {
  const [purok, setPurok] = useState("All puroks");
  const [status, setStatus] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [layers, setLayers] = useState({ households: true, sites: true, teams: true, routes: true });

  const visibleHouseholds = useMemo(() => households.filter((item) => {
    const byPurok = purok === "All puroks" || item.purok === purok;
    const byStatus = status === "All statuses" || item.status === status;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byPurok && byStatus && bySearch;
  }), [purok, search, status]);

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 650);
  };

  return (
    <main className="mapping-app">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">CR</span>
          <div><strong>Civic Response</strong><span>Mapping operations</span></div>
        </div>
        <div className="topbar-title">
          <h1>Barangay Mapping</h1>
          <span>San Isidro · Operational overview</span>
        </div>
        <button className="icon-action" type="button" onClick={refresh} aria-label="Refresh map" title="Refresh map">
          <RefreshCcw size={15} className={refreshing ? "spin" : ""} />
        </button>
      </header>

      <section className="workspace">
        <div className="summary-row" aria-label="Mapping summary">
          <Metric icon={LocateFixed} label="GPS-tagged" value="248" tone="safe" />
          <Metric icon={Crosshair} label="Unverified" value="31" tone="muted" />
          <Metric icon={CheckCircle2} label="GPS accuracy" value="6.8 m" tone="civic" />
          <Metric icon={Building2} label="Evacuation sites" value="3" tone="warn" />
        </div>

        <section className="filter-bar" aria-label="Map filters">
          <div className="filter-heading"><span>View</span><strong>Map filters</strong></div>
          <label className="search-field">
            <Search size={14} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search household" aria-label="Search household" />
          </label>
          <SelectField label="Area" value={purok} onChange={setPurok} options={["All puroks", "Purok 1", "Purok 2", "Purok 3", "Purok 4"]} />
          <SelectField label="Status" value={status} onChange={setStatus} options={statusOptions} />
          <span className="result-count">{visibleHouseholds.length} results</span>
        </section>

        <div className="mapping-grid">
          <section className={`map-shell ${fullscreen ? "is-fullscreen" : ""}`} aria-label="Barangay operational map">
            <div className="map-canvas">
              <div className="map-water" />
              <div className="road road-one" />
              <div className="road road-two" />
              <div className="road road-three" />
              <div className="boundary" />
              {layers.routes && <><div className="route-line route-one" /><div className="route-line route-two" /></>}
              {layers.households && visibleHouseholds.map((item) => (
                <button key={item.id} type="button" className={`map-dot ${item.tone}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={`${item.name}, ${item.status}`} title={item.name} />
              ))}
              {layers.sites && sites.map((site) => (
                <button key={site.id} type="button" className="site-pin" style={{ left: `${site.x}%`, top: `${site.y}%` }} aria-label={site.name}>{site.pin}</button>
              ))}
              {layers.teams && <div className="team-pin" aria-label="Rescue Team Alpha"><Users size={13} /></div>}
              <div className="map-place-label label-one">Purok 1</div>
              <div className="map-place-label label-two">Purok 3</div>
            </div>

            <div className="map-tools">
              <button type="button" onClick={() => setFullscreen(!fullscreen)} aria-label={fullscreen ? "Exit full screen" : "Full screen"} title={fullscreen ? "Exit full screen" : "Full screen"}>
                {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>

            <div className="layers-panel">
              <div className="overlay-title"><Layers3 size={14} /><strong>Map layers</strong></div>
              <LayerToggle label="Households" checked={layers.households} onChange={() => setLayers({ ...layers, households: !layers.households })} />
              <LayerToggle label="Evacuation sites" checked={layers.sites} onChange={() => setLayers({ ...layers, sites: !layers.sites })} />
              <LayerToggle label="Rescue teams" checked={layers.teams} onChange={() => setLayers({ ...layers, teams: !layers.teams })} />
              <LayerToggle label="Routes" checked={layers.routes} onChange={() => setLayers({ ...layers, routes: !layers.routes })} />
            </div>

            <div className="legend-panel">
              <div className="overlay-title"><MapPin size={14} /><strong>Status</strong></div>
              <span><i className="legend-dot alert" />Needs assistance</span>
              <span><i className="legend-dot warn" />Monitoring</span>
              <span><i className="legend-dot safe" />Safe / evacuated</span>
              <span><i className="legend-route" />Rescue route</span>
            </div>
          </section>

          <aside className="data-rail">
            <Panel title="Household registry" count={visibleHouseholds.length} grow>
              <div className="registry-list">
                {visibleHouseholds.map((item) => (
                  <article className="registry-row" key={item.id}>
                    <i className={`legend-dot ${item.tone}`} />
                    <div><strong>{item.name}</strong><span>{item.purok} · {item.status}</span></div>
                    <b>{item.accuracy}</b>
                  </article>
                ))}
                {visibleHouseholds.length === 0 && <div className="empty-state">No households match these filters.</div>}
              </div>
            </Panel>

            <Panel title="Evacuation vacancy" count={sites.length}>
              <div className="site-list">
                {sites.map((site) => {
                  const used = Math.round(((site.capacity - site.vacant) / site.capacity) * 100);
                  return <article className="site-row" key={site.id}>
                    <span className="site-badge">{site.pin}</span>
                    <div><strong>{site.name}</strong><span>{site.vacant} vacant · {used}% occupied</span><i><em style={{ width: `${used}%` }} /></i></div>
                    <button type="button" aria-label={`Route to ${site.name}`} title="Show route"><RouteIcon size={14} /></button>
                  </article>;
                })}
              </div>
            </Panel>

            <Panel title="Dispatched routes" count={routes.length}>
              <div className="route-list">
                {routes.map((route) => <button className={selectedRoute === route.id ? "selected" : ""} type="button" key={route.id} onClick={() => setSelectedRoute(route.id)}>
                  <i /><div><strong>{route.name}</strong><span>{route.team} · {route.area}</span></div><b>{route.distance}</b>
                </button>)}
              </div>
            </Panel>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof LocateFixed; label: string; value: string; tone: string }) {
  return <article className="metric"><span className={`metric-icon ${tone}`}><Icon size={17} /></span><div><span>{label}</span><strong>{value}</strong></div></article>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="select-field"><span>{label}</span><div><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={13} /></div></label>;
}

function LayerToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <button type="button" className="layer-toggle" onClick={onChange} aria-pressed={checked}><span>{label}</span><i className={checked ? "on" : ""} /></button>;
}

function Panel({ title, count, grow = false, children }: { title: string; count: number; grow?: boolean; children: React.ReactNode }) {
  return <section className={`data-panel ${grow ? "grow" : ""}`}><header><strong>{title}</strong><span>{count}</span></header>{children}</section>;
}