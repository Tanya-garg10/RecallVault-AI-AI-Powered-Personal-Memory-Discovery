import { motion } from 'framer-motion';
import { ArrowRight, Database, Eye, FileSearch, Images, Lock, Search, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const pipeline = [
  { icon: Search, title: 'Understand', text: 'Your natural-language query is parsed into intent, media type, dates, and places.' },
  { icon: Database, title: 'Discover', text: 'Registered UGREEN experts search only your authorized NAS scope.' },
  { icon: Eye, title: 'Analyze', text: 'Metadata, OCR, and visual understanding run on real result paths — nothing is assumed.' },
  { icon: Sparkles, title: 'Rank', text: 'Every result carries evidence and a confidence tier: strong, possible, or related.' },
  { icon: Waypoints, title: 'Organize', text: 'Memories group into timelines and smart collections you can preview before saving.' },
  { icon: ShieldCheck, title: 'Approve', text: 'Albums and file changes happen only after explicit confirmation and platform approval.' },
];

const guarantees = [
  { icon: Lock, title: 'Read-only by default', text: 'Searches never modify your library.' },
  { icon: ShieldCheck, title: 'No credential storage', text: 'The interface never sees or stores NAS passwords.' },
  { icon: Eye, title: 'Evidence, not guesses', text: 'Missing metadata is disclosed, never invented.' },
  { icon: FileSearch, title: 'Documented capabilities only', text: 'Every operation maps to an official Uliya catalog Action.' },
];

export function AboutPage() {
  return (
    <div className="space-y-20">
      <section className="mx-auto max-w-3xl pt-8 text-center">
        <Badge className="mb-5 border-primary/15 bg-primary-soft px-4 py-1.5 text-primary-dark"><Sparkles className="h-3 w-3" /> How RecallVault works</Badge>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">Your NAS already knows your memories.<br />We help you ask for them.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
          RecallVault AI is a UGREEN AI NAS Skill. It turns natural language into authorized, evidence-backed discovery across your photos, videos, and documents — then helps you gather moments into albums, safely.
        </p>
      </section>

      <section>
        <div className="mb-10 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">The pipeline</div>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight">From question to memory</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pipeline.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="rounded-[24px] border border-line bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary"><step.icon className="h-5 w-5" /></div>
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-muted">Step {index + 1}</div>
              <h3 className="mt-1 font-heading text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {guarantees.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="rounded-[22px] border border-primary/10 bg-white/80 p-5"
          >
            <item.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-heading text-base font-extrabold">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-muted">{item.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="rounded-[32px] border border-line bg-white p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
        <Images className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Ready to rediscover?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">Start with a sentence — RecallVault will do the rest, within your authorized NAS scope.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/explore"><Button size="lg">Start discovering <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/settings"><Button size="lg" variant="secondary">Check NAS status</Button></Link>
        </div>
      </section>
    </div>
  );
}
