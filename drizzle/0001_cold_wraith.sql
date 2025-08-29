CREATE TABLE `automate-work_link` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text(1000) NOT NULL,
	`description` text(1000),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `url_idx` ON `automate-work_link` (`url`);--> statement-breakpoint
DROP TABLE `automate-work_task`;