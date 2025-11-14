CREATE TABLE `social_media_account_managers` (
	`social_media_account_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`social_media_account_id`) REFERENCES `social_media_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `entity_details` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`details` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `social_media_accounts` ADD `entity_detail_id` text REFERENCES entity_details(id);