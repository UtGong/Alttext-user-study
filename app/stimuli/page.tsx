import Link from "next/link";
import { StimulusCatalogImage } from "@/components/StimulusCatalogImage";
import { CONDITION_LABELS, STUDY_CONDITIONS } from "@/lib/config";
import { stimuli } from "@/lib/stimuli";
import stimulusReview from "@/data/stimulusReview.json";

const complexityLevels = ["low", "medium", "high"] as const;

export default function StimulusCatalogPage() {
  const totals = Object.fromEntries(
    complexityLevels.map((level) => [level, stimuli.filter((stimulus) => stimulus.complexityLevel === level).length])
  );

  return (
    <main id="main-content" className="container catalog-page">
      <section className="panel">
        <p><Link href="/">Return to study</Link></p>
        <h1>Study Stimulus Catalog</h1>
        <p className="warning">Researcher reference. Do not share condition descriptions with participants.</p>
        <p>
          The active catalog contains {stimuli.length} unique images: {totals.low} low, {totals.medium} medium,
          and {totals.high} high complexity. Complexity values are matched by UUID and item set to the
          “All Stimuli Scores” tab in the study complexity spreadsheet.
        </p>
        <p>
          The participant study contains 21 comprehension trials and 3 preference trials. Every active
          description uses 3–7 spatial expressions; non-baseline descriptions have Kendall&apos;s τ above 0.3.
        </p>
        <dl className="catalog-summary">
          {complexityLevels.map((level) => <div key={level}><dt>{level}</dt><dd>{totals[level]}</dd></div>)}
        </dl>
      </section>

      {stimuli.map((stimulus, index) => (
        <article className="panel catalog-stimulus" key={stimulus.uuid}>
          <h2>{index + 1}. {stimulus.uuid}</h2>
          <p><strong>Stage:</strong> {stimulus.role}</p>
          <p><strong>Complexity:</strong> {stimulus.complexityLevel} ({stimulus.complexityScore?.toFixed(4)})</p>
          <StimulusCatalogImage filename={stimulus.imageFilename} uuid={stimulus.uuid} />

          <h3>Item set</h3>
          <ol>{stimulus.targetElements.map((item) => <li key={item}>{item}</li>)}</ol>

          <h3>Descriptions</h3>
          <div className="catalog-descriptions">
            {STUDY_CONDITIONS.map((condition) => (
              <section className="question-card" key={condition}>
                <h4>{CONDITION_LABELS[condition]}</h4>
                <p className="help-text">
                  Spatial expressions: {stimulus.descriptionMetrics?.[condition]?.spatialExpressionCount ?? "Unavailable"};
                  {" "}Kendall&apos;s τ: {stimulus.descriptionMetrics?.[condition]?.kendallTau?.toFixed(3) ?? "Unavailable"}
                </p>
                <p>{stimulus.descriptions[condition]}</p>
              </section>
            ))}
          </div>
        </article>
      ))}

      <section className="panel catalog-section-heading">
        <h2>Rejected images</h2>
        <p>These images are excluded from the active participant study.</p>
      </section>

      {stimulusReview.rejected.map((stimulus, index) => (
        <article className="panel catalog-stimulus catalog-rejected" key={stimulus.uuid}>
          <h2>{index + 1}. {stimulus.uuid}</h2>
          <p><strong>Status:</strong> <span className="review-label">{stimulus.label}</span></p>
          <p><strong>Reason:</strong> {stimulus.reason}</p>
          <StimulusCatalogImage filename={stimulus.imageFilename} uuid={stimulus.uuid} />
        </article>
      ))}

      <section className="panel catalog-section-heading">
        <h2>Potential replacement images</h2>
        <p>
          Ranked near-matches from the unused, non-excluded pool. These remain outside the active study
          because of the eligibility problem or qualitative tradeoff listed for each image.
        </p>
      </section>

      {stimulusReview.potential.map((stimulus, index) => (
        <article className="panel catalog-stimulus catalog-potential" key={stimulus.uuid}>
          <h2>{index + 1}. {stimulus.uuid}</h2>
          <p><strong>Subject:</strong> {stimulus.subject}</p>
          <p><strong>Complexity:</strong> {stimulus.complexityLevel} ({stimulus.complexityScore.toFixed(4)})</p>
          <p><strong>Spreadsheet source row:</strong> {stimulus.sourceRow}</p>
          <StimulusCatalogImage filename={stimulus.imageFilename} uuid={stimulus.uuid} />

          <h3>Item set</h3>
          <ol>{stimulus.targetElements.map((item) => <li key={item}>{item}</li>)}</ol>

          <h3>Cons</h3>
          <ul>{stimulus.cons.map((con) => <li key={con}>{con}</li>)}</ul>
          <p><strong>Conditions that pass:</strong> {stimulus.passingConditions.join(", ")}</p>
        </article>
      ))}
    </main>
  );
}
