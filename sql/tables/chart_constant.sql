CREATE TABLE chart_constant
(
    title      TEXT                 NOT NULL,
    difficulty std_chart_difficulty NOT NULL,
    version    TEXT                 NOT NULL,
    level      DECIMAL(3, 1)        NOT NULL,
    UNIQUE (title, difficulty, version)
);
