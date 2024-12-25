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

-- Migration 2.1.0

ALTER TABLE chart_score
    ADD COLUMN clear_mark clear_mark    NOT NULL DEFAULT 'NONE',
    ADD COLUMN full_chain NUMERIC(1, 0) NOT NULL DEFAULT 0;

ALTER TABLE chart_score
    DROP CONSTRAINT chart_score_title_difficulty_score_fc_aj_key;

ALTER TABLE chart_score
    ADD CONSTRAINT chart_score_title_difficulty_score_fc_aj_key
        UNIQUE (title, difficulty, score, fc, aj, clear_mark, full_chain);
