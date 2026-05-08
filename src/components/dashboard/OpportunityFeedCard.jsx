import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import CardWrapper from './CardWrapper'

const DATA = {
  'Tech/Software': [{ title: 'Senior React Developer', company: 'Stripe', location: 'Remote' }, { title: 'Backend Engineer', company: 'Vercel', location: 'Remote' }, { title: 'DevOps Lead', company: 'GitHub', location: 'Hybrid' }],
  'Business/Finance': [{ title: 'Financial Analyst', company: 'Goldman Sachs', location: 'On-site' }, { title: 'Strategy Consultant', company: 'McKinsey', location: 'Hybrid' }, { title: 'VC Analyst', company: 'Sequoia', location: 'Remote' }],
  'Creative/Design': [{ title: 'Brand Designer', company: 'Figma', location: 'Remote' }, { title: 'Product Illustrator', company: 'Canva', location: 'Hybrid' }, { title: 'Art Director', company: 'Notion', location: 'On-site' }],
  Healthcare: [{ title: 'Clinical Data Coordinator', company: 'Mayo Clinic', location: 'On-site' }, { title: 'Telehealth Program Manager', company: 'Teladoc', location: 'Remote' }, { title: 'Health Ops Analyst', company: 'Kaiser Permanente', location: 'Hybrid' }],
  Marketing: [{ title: 'Growth Marketer', company: 'HubSpot', location: 'Remote' }, { title: 'Performance Marketing Lead', company: 'Shopify', location: 'Hybrid' }, { title: 'Content Strategist', company: 'Adobe', location: 'On-site' }],
  Education: [{ title: 'Curriculum Designer', company: 'Coursera', location: 'Remote' }, { title: 'Instructional Coach', company: 'Khan Academy', location: 'Hybrid' }, { title: 'Program Instructor', company: 'General Assembly', location: 'On-site' }],
  Engineering: [{ title: 'Mechanical Engineer II', company: 'Tesla', location: 'On-site' }, { title: 'Civil Project Engineer', company: 'AECOM', location: 'Hybrid' }, { title: 'Systems Engineer', company: 'Siemens', location: 'Remote' }],
  Legal: [{ title: 'Associate Counsel', company: 'Meta', location: 'Hybrid' }, { title: 'Compliance Analyst', company: 'Coinbase', location: 'Remote' }, { title: 'Litigation Paralegal', company: 'Latham & Watkins', location: 'On-site' }],
  Sales: [{ title: 'Account Executive', company: 'Datadog', location: 'Remote' }, { title: 'Sales Manager', company: 'Salesforce', location: 'Hybrid' }, { title: 'Partnership Lead', company: 'Airbnb', location: 'On-site' }],
  Entrepreneurship: [{ title: 'Founder Associate', company: 'Antler', location: 'Hybrid' }, { title: 'Venture Builder', company: 'EF', location: 'Remote' }, { title: 'Startup Program Lead', company: 'Techstars', location: 'On-site' }],
}

export default function OpportunityFeedCard() {
  const [fields, setFields] = useState([])
  const [active, setActive] = useState([])
  useEffect(() => { 
    const load = () => {
      const selected = JSON.parse(localStorage.getItem('lifeosJobFields') || '[]'); 
      setFields(selected); 
      setActive(selected);
    };
    load();
    window.addEventListener('jobFieldsUpdated', load);
    return () => window.removeEventListener('jobFieldsUpdated', load);
  }, [])
  const list = useMemo(() => active.flatMap((field) => (DATA[field] || []).map((item, idx) => ({ ...item, id: `${field}-${idx}` }))), [active])
  return (
    <CardWrapper icon={<Search className="w-4 h-4 text-[#059669]" />} title="Latest Opportunities" badge={`${list.length}`}>
      <div className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">{fields.map((field) => <button key={field} onClick={() => setActive((prev) => prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field])} className={`px-2 py-1 rounded text-xs ${active.includes(field) ? 'bg-[#052e16] text-[#059669]' : 'bg-[#111827] text-gray-400'}`}>{field}</button>)}</div>
        {list.map((job) => <div key={job.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg p-3 min-w-0"><div className="text-white font-medium truncate">{job.title}</div><div className="text-gray-400 truncate">{job.company}</div><div className="flex justify-between items-center mt-1"><span className="text-xs px-2 py-0.5 rounded bg-[#052e16] text-[#059669] whitespace-nowrap">{job.location}</span><button className="text-xs text-[#059669] whitespace-nowrap shrink-0">Apply →</button></div></div>)}
      </div>
    </CardWrapper>
  )
}
