import { useEffect, useMemo, useState } from "react";
import { factualAnswer, retrieve, type PolicyChunk } from "./askNourish";
import { portfolioFor, type District } from "./scenarioEngine";
import { useExperience } from "./ExperienceContext";

type Turn = { question: string; answer: string; sources: PolicyChunk[] };
export function AskWorkspace({
  districts,
  navigate,
}: {
  districts: District[];
  navigate: (path: string) => void;
}) {
  const { state } = useExperience(),
    [corpus, setCorpus] = useState<PolicyChunk[]>([]),
    [corpusStatus, setCorpusStatus] = useState<
      "loading" | "ready" | "error"
    >("loading"),
    [question, setQuestion] = useState(""),
    [turns, setTurns] = useState<Turn[]>([]);
  const portfolio = useMemo(
    () => portfolioFor(districts, state.severityWeight, state.capacity),
    [districts, state.severityWeight, state.capacity],
  );
  const selected = districts.find((d) => d.id === state.selectedDistrictId);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/policy-index.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Policy index could not be loaded");
        return response.json();
      })
      .then((data) => {
        setCorpus(data);
        setCorpusStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCorpusStatus("error");
      });
    return () => controller.abort();
  }, []);
  const ask = (text = question) => {
    const clean = text.trim();
    if (!clean) return;
    const context = {
      page: "scenario" as const,
      activeLens: state.activeLens,
      selectedDistrict: selected,
      portfolio,
    };
    setTurns((current) => [
      ...current,
      {
        question: clean,
        answer: factualAnswer(clean, context),
        sources: retrieve(clean, corpus),
      },
    ]);
    setQuestion("");
  };
  const prompts = selected
    ? [
        `Why does ${selected.name} rank differently?`,
        `Why is ${selected.name} selected?`,
        `What can the data not tell us?`,
      ]
    : [
        "What trade-off am I making?",
        "What changed under this scenario?",
        "What policy evidence is relevant?",
      ];
  return (
    <main className="ask-workspace">
      <section className="ask-conversation">
        <header>
          <div>
            <h1>Ask NOURISH</h1>
            <p>
              Ask about the active district or scenario. Answers use verified
              application facts and curated policy documents.
            </p>
          </div>
          <button className="secondary" onClick={() => navigate("/scenario")}>
            Back to scenario
          </button>
        </header>
        <div className="context-strip">
          <span>
            Lens <b>{state.activeLens === "severity" ? "Severity" : "Reach"}</b>
          </span>
          <span>
            Scenario{" "}
            <b>
              {Math.round(state.severityWeight * 100)}/
              {Math.round((1 - state.severityWeight) * 100)}
            </b>
          </span>
          <span>
            Capacity <b>{state.capacity}</b>
          </span>
          <span>
            District <b>{selected?.name ?? "None selected"}</b>
          </span>
        </div>
        <div className="quick-prompts">
          {prompts.map((prompt) => (
            <button key={prompt} onClick={() => ask(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        <div className="turn-list">
          {turns.length === 0 ? (
            <div className="ask-empty">
              <strong>Start with a decision question</strong>
              <p>
                Select a prompt above or ask why a district entered the current
                portfolio.
              </p>
            </div>
          ) : (
            turns.map((turn, index) => (
              <article key={index}>
                <div className="user-question">
                  <small>Your question</small>
                  <strong>{turn.question}</strong>
                </div>
                <div className="nourish-answer">
                  <small>Verified answer</small>
                  <p>{turn.answer}</p>
                  <span>
                    Verified deterministic response · optional generated
                    synthesis is not active in this static prototype.
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about the current decision…"
            aria-label="Question for Ask NOURISH"
          />
          <button className="primary" disabled={!question.trim()}>
            Ask
          </button>
        </form>
      </section>
      <aside className="evidence-panel">
        <header>
          <h2>Factual basis</h2>
          <p>
            These values are passed automatically; NOURISH does not recalculate
            them.
          </p>
        </header>
        <dl>
          <div>
            <dt>Selected district</dt>
            <dd>{selected?.name ?? "Not selected"}</dd>
          </div>
          <div>
            <dt>Severity / Reach rank</dt>
            <dd>
              {selected
                ? `#${selected.severityRank} / #${selected.scaleRank}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Portfolio</dt>
            <dd>{portfolio.capacity} districts</dd>
          </div>
          <div>
            <dt>Affected population represented</dt>
            <dd>{portfolio.affectedPopulation.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Average / median PoU</dt>
            <dd>
              {portfolio.averagePou.toFixed(1)}% /{" "}
              {portfolio.medianPou.toFixed(1)}%
            </dd>
          </div>
        </dl>
        <section>
          <h2>Retrieved sources</h2>
          {turns.at(-1)?.sources.length ? (
            turns.at(-1)!.sources.map((source) => (
              <details key={source.id}>
                <summary>
                  <strong>{source.sourceTitle}</strong>
                  <span>Page {source.page ?? "not available"}</span>
                </summary>
                <p>{source.text}</p>
              </details>
            ))
          ) : turns.length === 0 ? (
            <p className="source-empty">
              {corpusStatus === "loading"
                ? "Loading the curated policy index…"
                : corpusStatus === "error"
                  ? "The curated policy index could not be loaded. Verified application facts remain available."
                  : "Sources appear after a question is asked."}
            </p>
          ) : (
            <p className="source-empty">
              No directly matching passage was found in the curated policy
              index for this question.
            </p>
          )}
        </section>
        <small className="evidence-limit">
          Policy evidence supports interpretation; it does not determine
          priority or prove causality.
        </small>
      </aside>
    </main>
  );
}
