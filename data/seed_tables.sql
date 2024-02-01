-- 1. on démarre une transaction afin de s'assurer de la cohérence globale de la BDD
BEGIN;

-- 2. on invente des données afin de pouvoir facilement tester notre API
INSERT INTO "list" ("name", "position")
VALUES
  ('Backlog', 1),
  ('To do', 2),
  ('WIP', 3),
  ('To test', 4),
  ('Done', 5);

INSERT INTO "card" ("list_id", "content", "color", "position")
VALUES
  (5, 'Faire les User Stories', '#fab', 1),
  (5, 'Faire le MCD', '#fab', 2),

  (4, 'Créer la BDD', '#bfa', 1),
  (4, 'Créer un script pour les tables', '#bfa', 2),

  (3, 'Créer un script pour le seeding', '#bfa', 1),

  (2, 'Faire le DDS', '#fab', 1),
  (2, 'Mettre en place API', '#abf', 2),
  (2, 'Créer les models', '#abf', 3),

  (1, 'Créer les routes', '#abf', 1),
  (1, 'Sécuriser notre API', '#b0b', 2);

INSERT INTO "tag" ("name", "color")
VALUES
  ('Urgent', '#b00'),
  ('Retard', '#f0f'),
  ('Idée', '#fb0');

-- et on oublie pas la table de liaison !
INSERT INTO "card_has_tag" ("card_id", "tag_id")
VALUES
  (3, 1),
  (4, 1),
  (5, 1),
  (6, 2),
  (10, 3);

-- 5. on rend permanentes les modifications débutées par la transaction
COMMIT;
