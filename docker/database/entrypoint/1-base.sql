CREATE TABLE `toshkin`.`users`
(
    `id`          INT(11)     NOT NULL AUTO_INCREMENT,
    `username`    VARCHAR(50) NOT NULL COMMENT 'Telegram username',
    `wallet`      VARCHAR(44) NULL COMMENT 'SOL wallet address',
    `created_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `referred_by` INT(11)     NULL COMMENT 'User ID of the referrer',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`),
    UNIQUE INDEX `username` (`username`)
);

CREATE TABLE `toshkin`.`leaderboard`
(
    `id`         INT(11)   NOT NULL AUTO_INCREMENT,
    `user_id`    INT(11)   NOT NULL,
    `score`      INT(11)   NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);