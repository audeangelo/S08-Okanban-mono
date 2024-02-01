-- 1. on démarre une transaction afin de s'assurer de la cohérence globale de la BDD
BEGIN;

-- 2. on supprime les tables si elles existent
DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";

--3. on (re)crée les tables

/* List */
-- on utilise `IDENTITY` qui est une contrainte standard SQL
-- alors que `SERIAL` est un pseudo-type de PostgreSQL
-- https://www.enterprisedb.com/blog/postgresql-10-identity-columns-explained
CREATE TABLE "list" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

/* Card */
-- si la liste est supprimée, on veut que les cartes associées le soient aussi
-- `ON DELETE CASCADE`
CREATE TABLE "card" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "list_id" INTEGER NOT NULL REFERENCES list("id") ON DELETE CASCADE,
  "content" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "color" VARCHAR(7),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

/* Tag */
-- le nom d'un label doit être unique
CREATE TABLE "tag" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "color" VARCHAR(7),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

/* On n'oublie pas la table de liaison ! */
-- clé primaire COMPOSITE (composée par plusieurs champs de la table)
-- ici pas d'`updated_at` car cette association ne se met pas à jour :
--   * soit on l'ajoute,
--   * soit on la supprime
-- si on supprime une carte ou un label, on supprime la liaison → ON DELETE CASCADE
CREATE TABLE "card_has_tag" (
  "card_id" INTEGER NOT NULL REFERENCES card("id") ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES tag("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  PRIMARY KEY ("card_id", "tag_id")
);

-- 4. on rend permanentes les modifications débutées par la transaction
COMMIT;