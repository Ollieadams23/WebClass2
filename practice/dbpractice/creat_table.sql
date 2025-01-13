CREATE TABLE Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    difficulty_level VARCHAR(255) NOT NULL,
    seasonality VARCHAR(255) NOT NULL
);

CREATE TABLE Attraction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    photo_gallery VARCHAR(255) NOT NULL,
    reviews INT NOT NULL,
    practical_info TEXT NOT NULL,
    location_map_view VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Category(id)
);

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    preferences TEXT NOT NULL
);

CREATE TABLE User_Attraction (
    user_id INT NOT NULL,
    attraction_id INT NOT NULL,
    PRIMARY KEY (user_id, attraction_id),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (attraction_id) REFERENCES Attraction(id)
);
