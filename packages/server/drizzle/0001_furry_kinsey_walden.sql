CREATE TABLE "campaign_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"save_id" uuid,
	"difficulty" text NOT NULL,
	"victory" boolean NOT NULL,
	"cleared_level" integer NOT NULL,
	"total_battles" integer DEFAULT 0 NOT NULL,
	"total_wins" integer DEFAULT 0 NOT NULL,
	"total_losses" integer DEFAULT 0 NOT NULL,
	"total_gold_earned" integer DEFAULT 0 NOT NULL,
	"total_gold_spent" integer DEFAULT 0 NOT NULL,
	"total_damage_dealt" integer DEFAULT 0 NOT NULL,
	"total_damage_taken" integer DEFAULT 0 NOT NULL,
	"total_kills" integer DEFAULT 0 NOT NULL,
	"followers_recruited" integer DEFAULT 0 NOT NULL,
	"equipment_acquired" integer DEFAULT 0 NOT NULL,
	"spells_cast" integer DEFAULT 0 NOT NULL,
	"play_time_seconds" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp NOT NULL,
	"finished_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_saves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"save_name" text NOT NULL,
	"difficulty" text DEFAULT 'normal' NOT NULL,
	"current_level" integer NOT NULL,
	"current_node" integer NOT NULL,
	"hero_id" text NOT NULL,
	"health" integer NOT NULL,
	"max_health" integer NOT NULL,
	"gold" integer DEFAULT 0 NOT NULL,
	"followers" jsonb NOT NULL,
	"equipment" jsonb[] DEFAULT '{}' NOT NULL,
	"spells" jsonb[] DEFAULT '{}' NOT NULL,
	"roadmap_state" jsonb NOT NULL,
	"cleared_nodes" integer[] DEFAULT '{}' NOT NULL,
	"total_battles" integer DEFAULT 0 NOT NULL,
	"total_wins" integer DEFAULT 0 NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"last_save_time" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"victory" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"highest_cleared_level" integer DEFAULT 0 NOT NULL,
	"unlocked_levels" integer[] DEFAULT '{1}' NOT NULL,
	"unlocked_difficulties" text[] DEFAULT '{"normal"}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "player_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "campaign_stats" ADD CONSTRAINT "campaign_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_stats" ADD CONSTRAINT "campaign_stats_save_id_game_saves_id_fk" FOREIGN KEY ("save_id") REFERENCES "public"."game_saves"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_saves" ADD CONSTRAINT "game_saves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_progress" ADD CONSTRAINT "player_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;