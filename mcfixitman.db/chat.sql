CREATE TABLE `mcfixitman`.`chat`
(`id` INT NOT NULL AUTO_INCREMENT, `member_id` INT NOT NULL, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NULL, PRIMARY KEY
(`id`), UNIQUE INDEX `id_UNIQUE`
(`id` ASC) VISIBLE);