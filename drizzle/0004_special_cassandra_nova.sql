ALTER TABLE `websites` ADD `editCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `websites` ADD `editHistory` json;--> statement-breakpoint
ALTER TABLE `websites` ADD `generationCount` int DEFAULT 0 NOT NULL;