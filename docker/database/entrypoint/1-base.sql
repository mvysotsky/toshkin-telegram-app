CREATE TABLE `toshkin`.`users`
(
    `id`         INT(11)     NOT NULL AUTO_INCREMENT,
    `username`   VARCHAR(50) NOT NULL COMMENT 'Telegram username',
    `wallet`     VARCHAR(44) NULL COMMENT 'SOL wallet address',
    `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `username` (`username`)
);

CREATE TABLE `toshkin`.`leadeboard`
(
    `id`         INT(11)   NOT NULL AUTO_INCREMENT,
    `user_id`    INT(11)   NOT NULL,
    `score`      INT(11)   NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);