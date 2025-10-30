CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`category` text NOT NULL,
	`action` text NOT NULL,
	`target_type` text,
	`target_id` text,
	`ip_address` text,
	`user_agent` text,
	`status` text DEFAULT 'success' NOT NULL,
	`details` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
