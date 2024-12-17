CREATE TABLE chart_score
(
    job_id     INTEGER              NOT NULL,
    title      TEXT                 NOT NULL,
    difficulty std_chart_difficulty NOT NULL,
    score      INTEGER              NOT NULL,
    fc         BOOLEAN              NOT NULL,
    aj         BOOLEAN              NOT NULL,
    updated_at TIMESTAMP            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (title, difficulty, score, fc, aj)
);
