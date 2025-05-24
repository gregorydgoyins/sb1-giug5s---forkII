import { Dashboard } from '@/components/Dashboard';
import { LeadNavigation } from '@/components/navigation/LeadNavigation';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="hero-card p-8 rounded-xl mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Turn Comic Book Knowledge Into Investment Success
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Join the premier platform where comic expertise meets market analytics. Access real-time valuations, 
            expert insights, and advanced trading tools to build a profitable collection backed by data-driven decisions.
          </p>
          <LeadNavigation />
        </div>
      </div>
      <Dashboard />
    </div>
  );
}