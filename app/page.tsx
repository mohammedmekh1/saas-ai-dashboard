'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import {
  Users, TrendingUp, Flame, Zap, BarChart2, Globe,
  MessageSquare, BookOpen, CheckCircle, AlertTriangle,
  Target, Clock, RefreshCw, Moon, Star, Activity,
  Cpu, Palette, Video, Search, GraduationCap, Heart, ShoppingBag
} from 'lucide-react'

// ── SaaSAI Brand ──────────────────────────────────────────────────────────
const BRAND = {
  gold:   '#D4A843', gold2: '#E8C46A', goldDk: '#A07C2A',
  teal:   '#14B8A6', blue:  '#3B82F6', purple: '#8B5CF6',
  ember:  '#EF4444', amber: '#F59E0B', green:  '#10B981',
  pearl:  '#F8F4EF', ink:   '#0F0D0B',
}

const SERVICES = [
  { id:'automation',  label:'أتمتة',     icon:Cpu,          color:'#14B8A6' },
  { id:'ai',          label:'ذكاء AI',   icon:Zap,          color:'#8B5CF6' },
  { id:'web',         label:'مواقع',     icon:Globe,        color:'#3B82F6' },
  { id:'seo',         label:'SEO',       icon:Search,       color:'#10B981' },
  { id:'design',      label:'جرافيك',   icon:Palette,      color:'#F59E0B' },
  { id:'video',       label:'فيديو',     icon:Video,        color:'#EF4444' },
  { id:'marketing',   label:'تسويق',     icon:TrendingUp,   color:'#EC4899' },
  { id:'content',     label:'محتوى',     icon:BookOpen,     color:'#F97316' },
  { id:'training',    label:'تدريب',     icon:GraduationCap,color:'#06B6D4' },
  { id:'wedding',     label:'زفاف رقمي',icon:Heart,        color:'#E91E63' },
]

function getMockData() {
  const days = Array.from({length:14},(_,i)=>{
    const d = new Date(Date.now()-(13-i)*86400000)
    return {
      report_date: d.toISOString().split('T')[0],
      total_leads: 25+Math.floor(Math.random()*35),
      hot_leads: 3+Math.floor(Math.random()*15),
      warm_leads: 8+Math.floor(Math.random()*18),
      bookings: 1+Math.floor(Math.random()*5),
      posts_published: 2+Math.floor(Math.random()*4),
    }
  })
  return {
    totalLeads:847, todayLeads:31, hotLeads:72, warmLeads:198,
    avgScore:63, openTasks:9, urgentTasks:2,
    publishedPosts:184, publishedArticles:51,
    bookings:38, conversionRate:4.5, deliveryRate:95.8,
    weekLeads:156, weddingOrders:12, trainingSessions:7,
    lastInsights:'أداء قوي اليوم – 31 عميل جديد. خدمة الأتمتة تستحوذ على 42% من الطلبات. نوصي بزيادة محتوى دعوات الزفاف الرقمية بنسبة 30% لارتفاع الطلب في موسم الأعراس.',
    recentReports: days,
    serviceBreakdown: [
      {name:'أتمتة',value:185,color:'#14B8A6'},{name:'ذكاء AI',value:143,color:'#8B5CF6'},
      {name:'مواقع',value:127,color:'#3B82F6'},{name:'SEO',value:98,color:'#10B981'},
      {name:'جرافيك',value:87,color:'#F59E0B'},{name:'فيديو',value:76,color:'#EF4444'},
      {name:'تسويق',value:65,color:'#EC4899'},{name:'محتوى',value:54,color:'#F97316'},
      {name:'تدريب',value:43,color:'#06B6D4'},{name:'زفاف رقمي',value:62,color:'#E91E63'},
    ],
    platformBreakdown:[
      {name:'Facebook',value:287},{name:'Instagram',value:198},{name:'TikTok',value:156},
      {name:'X/Twitter',value:98},{name:'LinkedIn',value:67},{name:'WhatsApp',value:41},
    ],
    intentBreakdown:[
      {name:'ready_to_buy',value:145},{name:'service_inquiry',value:234},
      {name:'research',value:198},{name:'complaint',value:67},{name:'other',value:203},
    ],
  }
}

// ── Small Components ──────────────────────────────────────────────────────
function MetricCard({title,value,sub,icon:Icon,color=BRAND.gold,delta,suffix=''}:{
  title:string;value:string|number;sub?:string;icon:any;color?:string;delta?:number;suffix?:string
}) {
  return (
    <div className="glass-card relative overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02]"
      style={{borderTop:`2px solid ${color}40`}}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg" style={{background:`${color}18`}}>
          <Icon size={18} style={{color}} />
        </div>
        {delta!==undefined&&(
          <span className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{background:delta>=0?'#10b98122':'#ef444422',color:delta>=0?'#34d399':'#f87171'}}>
            {delta>=0?'↑':'↓'} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-0.5 font-mono" style={{color:BRAND.pearl}}>
        {value}{suffix}
      </div>
      <div className="text-xs ar" style={{color:'#f8f4ef80'}}>{title}</div>
      {sub&&<div className="text-[10px] mt-1" style={{color:`${color}99`}}>{sub}</div>}
    </div>
  )
}

const CTooltip=({active,payload,label}:any)=>{
  if(!active||!payload?.length)return null
  return(
    <div className="glass-card p-3 text-xs" style={{minWidth:130}}>
      <p className="mb-2 ar" style={{color:'#f8f4ef60'}}>{label}</p>
      {payload.map((p:any,i:number)=>(
        <p key={i} className="font-mono" style={{color:p.color||BRAND.gold}}>
          {p.name}: <strong>{typeof p.value==='number'?p.value.toLocaleString('ar-SA'):p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function FlowRow({name,wh,active,lastRun}:{name:string;wh:string;active:boolean;lastRun:string}) {
  return(
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{borderColor:'rgba(255,255,255,0.05)'}}>
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full ${active?'animate-pulse':''}`}
          style={{background:active?BRAND.green:'#ef4444'}} />
        <div>
          <div className="text-xs font-semibold ar" style={{color:BRAND.pearl}}>{name}</div>
          <div className="text-[10px] font-mono" style={{color:'#f8f4ef40'}}>{wh}</div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[10px] px-2 py-0.5 rounded-full"
          style={{background:active?'#10b98112':'#ef444412',color:active?'#34d399':'#f87171',border:`1px solid ${active?'#10b98130':'#ef444430'}`}}>
          {active?'نشط':'متوقف'}
        </span>
        <div className="text-[10px] font-mono mt-0.5" style={{color:'#f8f4ef40'}}>{lastRun}</div>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data,setData]=useState<ReturnType<typeof getMockData>|null>(null)
  const [loading,setLoading]=useState(true)
  const [tab,setTab]=useState<'overview'|'services'|'content'|'flows'>('overview')
  const [lastRefresh,setLastRefresh]=useState(new Date())

  const load=useCallback(async()=>{
    setLoading(true)
    try{
      const r=await fetch('/api/kpis',{cache:'no-store'})
      setData(r.ok?await r.json():getMockData())
    }catch{setData(getMockData())}
    setLoading(false);setLastRefresh(new Date())
  },[])

  useEffect(()=>{load();const t=setInterval(load,300000);return()=>clearInterval(t)},[load])

  if(loading||!data)return(
    <div className="min-h-screen flex items-center justify-center" style={{background:BRAND.ink}}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center animate-pulse"
          style={{background:`${BRAND.gold}20`,border:`1px solid ${BRAND.gold}40`}}>
          <Cpu size={28} style={{color:BRAND.gold}} />
        </div>
        <p className="text-sm ar" style={{color:`${BRAND.pearl}60`}}>جاري تحميل لوحة SaaSAI...</p>
      </div>
    </div>
  )

  const d=data

  return(
    <div className="min-h-screen" style={{background:BRAND.ink}}>
      <div className="fixed inset-0 bg-geometric opacity-40 pointer-events-none"/>
      <div className="fixed inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 70% 50% at 50% -5%,rgba(212,168,67,0.07) 0%,transparent 70%)'}}/>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-40 px-6 py-3"
          style={{background:'rgba(15,13,11,0.90)',backdropFilter:'blur(16px)',
                  borderBottom:'1px solid rgba(212,168,67,0.12)'}}>
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{background:`${BRAND.gold}18`,border:`1px solid ${BRAND.gold}30`}}>
                <Cpu size={20} style={{color:BRAND.gold}}/>
              </div>
              <div>
                <h1 className="text-sm font-bold gold-shimmer">SaaSAI – منصة الأتمتة الذكية</h1>
                <p className="text-[10px] font-mono" style={{color:'#f8f4ef40'}}>
                  لوحة التحكم الشاملة • {lastRefresh.toLocaleTimeString('ar-SA',{timeZone:'Asia/Riyadh'})}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full"
                style={{background:'#10b98112',border:'1px solid #10b98130'}}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-[10px] font-mono" style={{color:'#34d399'}}>LIVE</span>
              </div>
              <button onClick={load} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <RefreshCw size={14} style={{color:`${BRAND.pearl}60`}}/>
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 pt-4 max-w-[1600px] mx-auto">
          <div className="flex gap-1 p-1 rounded-xl w-fit"
            style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}}>
            {[
              {id:'overview',label:'📊 نظرة عامة'},
              {id:'services',label:'💼 الخدمات'},
              {id:'content',label:'📱 المحتوى'},
              {id:'flows',label:'⚙️ الأنظمة'},
            ].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all ar"
                style={{
                  background:tab===t.id?`${BRAND.gold}18`:'transparent',
                  color:tab===t.id?BRAND.gold2:`${BRAND.pearl}60`,
                  border:tab===t.id?`1px solid ${BRAND.gold}30`:'1px solid transparent',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="px-6 py-6 max-w-[1600px] mx-auto space-y-6">

          {/* ── Overview Tab ── */}
          {tab==='overview'&&<>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard title="إجمالي Leads" value={d.totalLeads.toLocaleString('ar-SA')} icon={Users} color={BRAND.gold} delta={12}/>
              <MetricCard title="اليوم" value={d.todayLeads} icon={Activity} color={BRAND.teal} delta={8}/>
              <MetricCard title="🔥 HOT Leads" value={d.hotLeads} icon={Flame} color={BRAND.ember} delta={15}/>
              <MetricCard title="متوسط الدرجة" value={d.avgScore} suffix="/100" icon={Target} color={BRAND.blue}/>
              <MetricCard title="حجوزات/عقود" value={d.bookings} icon={CheckCircle} color={BRAND.green} delta={18}/>
              <MetricCard title="معدل التحويل" value={`${d.conversionRate}%`} icon={TrendingUp} color={BRAND.purple} delta={5}/>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard title="مهام عاجلة" value={d.urgentTasks} icon={AlertTriangle} color={BRAND.ember}/>
              <MetricCard title="منشورات نُشرت" value={d.publishedPosts} icon={Globe} color={BRAND.teal}/>
              <MetricCard title="طلبات زفاف" value={d.weddingOrders} icon={Heart} color='#E91E63'/>
              <MetricCard title="جلسات تدريب" value={d.trainingSessions} icon={GraduationCap} color='#06B6D4'/>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 glass-card p-5">
                <div className="flex items-end justify-between mb-4">
                  <div><h2 className="text-sm font-bold ar" style={{color:BRAND.pearl}}>Leads اليومية – آخر 14 يوم</h2></div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={d.recentReports} margin={{top:5,right:5,left:-20,bottom:0}}>
                    <defs>
                      <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND.ember} stopOpacity={0.3}/><stop offset="95%" stopColor={BRAND.ember} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND.amber} stopOpacity={0.3}/><stop offset="95%" stopColor={BRAND.amber} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="report_date" tick={{fontSize:9,fill:'#f8f4ef40'}} tickFormatter={v=>v?.slice(5)}/>
                    <YAxis tick={{fontSize:9,fill:'#f8f4ef40'}}/>
                    <Tooltip content={<CTooltip/>}/>
                    <Area type="monotone" dataKey="hot_leads" name="HOT" stroke={BRAND.ember} fill="url(#gH)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="warm_leads" name="WARM" stroke={BRAND.amber} fill="url(#gW)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-5">
                <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>توزيع المنصات</h2>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={d.platformBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3}>
                      {d.platformBreakdown.map((_,i)=>(
                        <Cell key={i} fill={[BRAND.blue,'#E1306C','#FF0050','#1DA1F2',BRAND.blue,BRAND.teal][i]||BRAND.gold} opacity={0.85}/>
                      ))}
                    </Pie>
                    <Tooltip content={<CTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {d.platformBreakdown.map((p,i)=>(
                    <div key={i} className="flex items-center gap-1.5 text-[10px]" style={{color:`${BRAND.pearl}80`}}>
                      <div className="w-2 h-2 rounded-full" style={{background:[BRAND.blue,'#E1306C','#FF0050','#1DA1F2',BRAND.blue,BRAND.teal][i]||BRAND.gold}}/>
                      <span className="truncate">{p.name}</span>
                      <span className="font-mono ml-auto" style={{color:BRAND.gold}}>{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-5">
              <h2 className="text-sm font-bold ar mb-2" style={{color:BRAND.pearl}}>🤖 رؤى الذكاء الاصطناعي اليومية</h2>
              <p className="text-sm leading-relaxed ar" style={{color:`${BRAND.pearl}90`}}>{d.lastInsights}</p>
            </div>
          </>}

          {/* ── Services Tab ── */}
          {tab==='services'&&<>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SERVICES.map(svc=>{
                const SvcIcon=svc.icon
                const svcData=d.serviceBreakdown.find(s=>s.name===svc.label)||{value:0}
                return(
                  <div key={svc.id} className="glass-card p-4 text-center transition-all hover:scale-105 cursor-default"
                    style={{borderTop:`2px solid ${svc.color}40`}}>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                      style={{background:`${svc.color}18`}}>
                      <SvcIcon size={20} style={{color:svc.color}}/>
                    </div>
                    <div className="text-lg font-bold font-mono" style={{color:BRAND.pearl}}>{svcData.value}</div>
                    <div className="text-[10px] ar mt-0.5" style={{color:`${BRAND.pearl}70`}}>{svc.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>Leads حسب الخدمة</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={d.serviceBreakdown} margin={{top:5,right:5,left:-20,bottom:30}}>
                    <XAxis dataKey="name" tick={{fontSize:9,fill:'#f8f4ef60'}} angle={-30} textAnchor="end"/>
                    <YAxis tick={{fontSize:9,fill:'#f8f4ef40'}}/>
                    <Tooltip content={<CTooltip/>}/>
                    <Bar dataKey="value" name="Leads" radius={[4,4,0,0]}>
                      {d.serviceBreakdown.map((e,i)=><Cell key={i} fill={e.color} opacity={0.8}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-5">
                <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>💍 دعوات الزفاف الرقمية</h2>
                <div className="space-y-3">
                  {[
                    {name:'أحمد & فاطمة',pkg:'premium',date:'2026-05-15',status:'page_created',price:999},
                    {name:'خالد & نورة',pkg:'vip',date:'2026-06-01',status:'new',price:1499},
                    {name:'سلطان & ريم',pkg:'standard',date:'2026-04-28',status:'delivered',price:599},
                    {name:'فيصل & لمياء',pkg:'basic',date:'2026-05-30',status:'payment_pending',price:299},
                  ].map((w,i)=>(
                    <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0"
                      style={{borderColor:'rgba(255,255,255,0.05)'}}>
                      <div>
                        <div className="text-xs font-semibold ar" style={{color:BRAND.pearl}}>💍 {w.name}</div>
                        <div className="text-[10px] font-mono mt-0.5" style={{color:'#f8f4ef50'}}>{w.date} • {w.pkg}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono" style={{color:BRAND.gold}}>{w.price} ريال</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{background:w.status==='delivered'?'#10b98112':w.status==='page_created'?'#3b82f612':'#f59e0b12',
                                  color:w.status==='delivered'?'#34d399':w.status==='page_created'?'#60a5fa':'#fbbf24'}}>
                          {w.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* ── Content Tab ── */}
          {tab==='content'&&<>
            <div className="grid sm:grid-cols-4 gap-3">
              <MetricCard title="منشورات نُشرت" value={d.publishedPosts} icon={Globe} color={BRAND.teal}/>
              <MetricCard title="مقالات WordPress" value={d.publishedArticles} icon={BookOpen} color={BRAND.blue}/>
              <MetricCard title="اليوم" value={d.recentReports[d.recentReports.length-1]?.posts_published||0} icon={Zap} color={BRAND.gold}/>
              <MetricCard title="معدل النجاح" value="95.8" suffix="%" icon={CheckCircle} color={BRAND.green}/>
            </div>
            <div className="glass-card p-5">
              <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>أداء المحتوى – آخر أسبوع</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={d.recentReports.slice(-7)} margin={{top:5,right:5,left:-20,bottom:0}}>
                  <XAxis dataKey="report_date" tick={{fontSize:9,fill:'#f8f4ef40'}} tickFormatter={v=>v?.slice(5)}/>
                  <YAxis tick={{fontSize:9,fill:'#f8f4ef40'}}/>
                  <Tooltip content={<CTooltip/>}/>
                  <Bar dataKey="posts_published" name="منشورات" fill={BRAND.teal} opacity={0.8} radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>}

          {/* ── Flows Tab ── */}
          {tab==='flows'&&<>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard title="الأنظمة النشطة" value="12" suffix="/12" icon={Activity} color={BRAND.green}/>
              <MetricCard title="مهام مفتوحة" value={d.openTasks} icon={Clock} color={BRAND.amber}/>
              <MetricCard title="مهام عاجلة" value={d.urgentTasks} icon={AlertTriangle} color={BRAND.ember}/>
              <MetricCard title="معدل التسليم" value={`${d.deliveryRate}%`} icon={MessageSquare} color={BRAND.teal}/>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>أنظمة اصطياد العملاء</h2>
                {[
                  {name:'F1 – Radar اصطياد Lead',wh:'/webhook/saasai-radar',active:true,lastRun:'منذ 6 ساعات'},
                  {name:'F2 – Lead Capture الاستقبال',wh:'/webhook/lead-from-radar',active:true,lastRun:'منذ 3 دقائق'},
                  {name:'F3 – Lead Scoring التقييم',wh:'/webhook/saasai-scoring-entry',active:true,lastRun:'منذ 3 دقائق'},
                  {name:'F4 – Marketing Journeys',wh:'/webhook/marketing-journey',active:true,lastRun:'منذ 18 دقيقة'},
                  {name:'F5 – Delivery Engine',wh:'/webhook/makkah-delivery-engine',active:true,lastRun:'منذ 4 دقائق'},
                  {name:'F6 – Sales Handoff',wh:'/webhook/makkah-sales-handoff',active:true,lastRun:'منذ ساعة'},
                ].map((f,i)=><FlowRow key={i} {...f}/>)}
              </div>
              <div className="glass-card p-5">
                <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>أنظمة المحتوى والخدمات</h2>
                {[
                  {name:'F7 – AI Content Factory',wh:'/webhook/generate-content',active:true,lastRun:'منذ 7 ساعات'},
                  {name:'F8 – Publisher النشر',wh:'يومي 9 صباحاً',active:true,lastRun:'منذ 9 ساعات'},
                  {name:'F9 – Performance Dashboard',wh:'يومي 8 صباحاً',active:true,lastRun:'منذ 8 ساعات'},
                  {name:'F10 – WordPress Pipeline',wh:'/webhook/wp-pipeline',active:true,lastRun:'منذ 6 ساعات'},
                  {name:'F11 – WordPress Publisher',wh:'/webhook/wp-publish-now',active:true,lastRun:'منذ 10 ساعات'},
                  {name:'F12 – Wedding Invitations 💍',wh:'/webhook/saasai-wedding-order',active:true,lastRun:'منذ 45 دقيقة'},
                ].map((f,i)=><FlowRow key={i} {...f}/>)}
              </div>
            </div>

            <div className="glass-card p-5">
              <h2 className="text-sm font-bold ar mb-4" style={{color:BRAND.pearl}}>خريطة تكامل أنظمة SaaSAI</h2>
              <div className="overflow-x-auto pb-2">
                <div className="flex items-center gap-2 min-w-[900px] py-4">
                  {[
                    {label:'F1\nRadar',color:BRAND.ember,icon:'📡'},
                    {label:'→',color:'',icon:''},
                    {label:'F2\nCapture',color:BRAND.amber,icon:'📥'},
                    {label:'→',color:'',icon:''},
                    {label:'F3\nScoring',color:BRAND.blue,icon:'🎯'},
                    {label:'→',color:'',icon:''},
                    {label:'F4→F6\nJourney/Sales',color:BRAND.green,icon:'🛤️'},
                    {label:'→',color:'',icon:''},
                    {label:'F5\nDelivery',color:BRAND.purple,icon:'📨'},
                  ].map((n,i)=>n.label==='→'?(
                    <div key={i} className="text-xl" style={{color:`${BRAND.gold}40`}}>→</div>
                  ):(
                    <div key={i} className="flex-1 text-center p-3 rounded-xl text-xs"
                      style={{background:`${n.color}12`,border:`1px solid ${n.color}30`,minWidth:80}}>
                      <div className="text-xl mb-1">{n.icon}</div>
                      <div className="font-mono whitespace-pre-line font-bold" style={{color:n.color,fontSize:9}}>{n.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 min-w-[900px]">
                  {[
                    {label:'F7 Content',color:BRAND.gold,icon:'✍️'},
                    {label:'F8 Publisher',color:BRAND.teal,icon:'📱'},
                    {label:'F9 Dashboard',color:'#6366f1',icon:'📊'},
                    {label:'F10/F11 WordPress',color:'#ec4899',icon:'📝'},
                    {label:'F12 Wedding 💍',color:'#E91E63',icon:'🎊'},
                  ].map((f,i)=>(
                    <div key={i} className="flex-1 text-center p-2 rounded-lg text-[10px]"
                      style={{background:`${f.color}10`,border:`1px solid ${f.color}25`}}>
                      <span className="mr-1">{f.icon}</span>
                      <span style={{color:`${f.color}cc`}}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}
        </main>

        <footer className="px-6 py-4 mt-8 text-center" style={{borderTop:'1px solid rgba(212,168,67,0.08)'}}>
          <p className="text-xs font-mono" style={{color:'#f8f4ef30'}}>
            SaaSAI Dashboard v2.0 • {new Date().getFullYear()} •{' '}
            <span style={{color:BRAND.gold}}>منصة الأتمتة الذكية الشاملة</span> •{' '}
            آخر تحديث: {lastRefresh.toLocaleString('ar-SA',{timeZone:'Asia/Riyadh'})}
          </p>
        </footer>
      </div>
    </div>
  )
}
