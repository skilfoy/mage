import { AdminClient } from "@/components/AdminClient";
export default function Admin(){ return <div className="space-y-5"><h1 className="text-4xl font-black">Facilitator Dashboard</h1><p className="text-slate-300">Protected admin mode for challenge authoring, import/export, aggregate analytics, guard counts, and privacy settings.</p><AdminClient/></div>; }
