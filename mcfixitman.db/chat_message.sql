CREATE TABLE `mcfixitman`.`chat_message`
(`id` INT NOT NULL AUTO_INCREMENT, `chat_id` INT NOT NULL, `message_content` LONGTEXT NOT NULL, `role` NVARCHAR
(50) NOT NULL, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NULL, PRIMARY KEY
(`id`), UNIQUE INDEX `id_UNIQUE`
(`id` ASC) VISIBLE);