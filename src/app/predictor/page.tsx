import { Hero } from "@/components/Hero";
import { EmptyState } from "@/components/EmptyState";
import { PredictorExperience } from "@/components/PredictorExperience";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";

export const metadata = {
  title: "World Cup Predictor",
};

export default function PredictorPage() {
  return (
    <div className="page">
      <Hero
        title="World Cup Predictor"
        subtitle="Build your World Cup picks and choose your champion."
        compact
      />
      <section className="section">
        <div className="container">
          {USE_PROTOTYPE_DATA ? (
            <PredictorExperience />
          ) : (
            <EmptyState
              title="Predictor uses prototype data"
              message="Enable USE_PROTOTYPE_DATA in src/config/dataSource.ts to preview polls and bracket picks. Match, team, and stadium pages show live API data."
              actionLabel="View matches"
              actionHref="/matches"
            />
          )}
        </div>
      </section>
    </div>
  );
}
