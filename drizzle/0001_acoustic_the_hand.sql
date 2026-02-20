CREATE TABLE `gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uploadId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('imagem','video','avatar') NOT NULL,
	`fileUrl` text NOT NULL,
	`aiTools` text,
	`inspirationSource` text,
	`views` int DEFAULT 0,
	`featured` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderation_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uploadId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('imagem','video','avatar') NOT NULL,
	`fileUrl` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`githubIssueId` varchar(64),
	`moderatorNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moderation_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('imagem','video','avatar') NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`aiTools` text,
	`inspirationSource` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`moderationNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `uploads_id` PRIMARY KEY(`id`)
);
