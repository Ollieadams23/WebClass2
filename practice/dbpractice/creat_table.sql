DELIMITER //
CREATE PROCEDURE insert_random_members()
BEGIN
  DECLARE i INT DEFAULT 0;
  WHILE i < 50 DO
    INSERT INTO members (memberid, firstname, lastname, email, age, raceclass, password, role, membership)
    VALUES
      (FLOOR(RAND() * 1000) + 30, CONCAT('First', FLOOR(RAND() * 100)), CONCAT('Last', FLOOR(RAND() * 100)), CONCAT(FLOOR(RAND() * 100), '@example.com'), FLOOR(RAND() * 100), 
       ELT(FLOOR(RAND() * 10), 'SnrA', 'SnrB', 'SnrC', 'SnrD', 'Vets', 'JnrA', 'JnrB', 'JnrC', 'JnrD', 'MiniA', 'MiniB'), 
       FLOOR(RAND() * 10000), 'member', IF(RAND() < 0.5, 'current', 'not current'));
    SET i = i + 1;
  END WHILE;
END//
DELIMITER ;

CALL insert_random_members();