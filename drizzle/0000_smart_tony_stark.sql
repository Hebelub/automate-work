CREATE TABLE `automate-work_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `automate-work_post` (`name`);--> statement-breakpoint
CREATE TABLE `automate-work_task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256) NOT NULL,
	`description` text(1000),
	`jiraTask` text(500),
	`githubPr` text(500),
	`branchName` text(200),
	`qaTested` integer DEFAULT false,
	`codeReviewDone` integer DEFAULT false,
	`implementationDone` integer DEFAULT false,
	`mergedToMain` integer DEFAULT false,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `title_idx` ON `automate-work_task` (`title`);