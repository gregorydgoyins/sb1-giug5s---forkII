-- Comic Universe Schema

-- Publishers
CREATE TABLE publishers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  founded_date DATE,
  description TEXT,
  market_cap DECIMAL(15,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Characters
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID REFERENCES publishers(id),
  name VARCHAR(255) NOT NULL,
  alias VARCHAR(255),
  first_appearance VARCHAR(255),
  debut_date DATE,
  origin_story TEXT,
  alignment VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Powers and Abilities
CREATE TABLE powers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  power_level INTEGER CHECK (power_level BETWEEN 1 AND 10),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE character_powers (
  character_id UUID REFERENCES characters(id),
  power_id UUID REFERENCES powers(id),
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
  PRIMARY KEY (character_id, power_id)
);

-- Teams and Affiliations
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID REFERENCES publishers(id),
  name VARCHAR(255) NOT NULL,
  founded_date DATE,
  headquarters VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id),
  character_id UUID REFERENCES characters(id),
  join_date DATE,
  leave_date DATE,
  role VARCHAR(100),
  PRIMARY KEY (team_id, character_id, join_date)
);

-- Creators
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  death_date DATE,
  nationality VARCHAR(100),
  primary_role VARCHAR(100),
  active_since DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creator_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id),
  publisher_id UUID REFERENCES publishers(id),
  title VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  start_date DATE,
  end_date DATE,
  significance INTEGER CHECK (significance BETWEEN 1 AND 10),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Story Arcs and Events
CREATE TABLE story_arcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID REFERENCES publishers(id),
  title VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  significance INTEGER CHECK (significance BETWEEN 1 AND 10),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE arc_appearances (
  story_arc_id UUID REFERENCES story_arcs(id),
  character_id UUID REFERENCES characters(id),
  significance INTEGER CHECK (significance BETWEEN 1 AND 10),
  role VARCHAR(100),
  PRIMARY KEY (story_arc_id, character_id)
);

-- Market Performance
CREATE TABLE character_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id),
  valuation_date DATE NOT NULL,
  market_value DECIMAL(15,2) NOT NULL,
  popularity_score INTEGER CHECK (popularity_score BETWEEN 1 AND 100),
  media_presence_score INTEGER CHECK (media_presence_score BETWEEN 1 AND 100),
  merchandise_value DECIMAL(15,2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_characters_publisher ON characters(publisher_id);
CREATE INDEX idx_team_members_character ON team_members(character_id);
CREATE INDEX idx_creator_works_creator ON creator_works(creator_id);
CREATE INDEX idx_story_arcs_publisher ON story_arcs(publisher_id);
CREATE INDEX idx_character_valuations_date ON character_valuations(valuation_date);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_publishers_updated_at
    BEFORE UPDATE ON publishers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();