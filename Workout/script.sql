CREATE TABLE workoutType
(
id SERIAL PRIMARY KEY,
type text NOT NULL
);

INSERT INTO workoutType (type) VALUES ('Weight');
INSERT INTO workoutType (type) VALUES ('Resistance');
INSERT INTO workoutType (type) VALUES ('Cardio');
INSERT INTO workoutType (type) VALUES ('Stretch');

CREATE TABLE bodyPart
(
id SERIAL PRIMARY KEY,
part text NOT NULL
);

INSERT INTO bodyPart (part) VALUES ('Arms');
INSERT INTO bodyPart (part) VALUES ('Legs');
INSERT INTO bodyPart (part) VALUES ('Chest');
INSERT INTO bodyPart (part) VALUES ('Back');
INSERT INTO bodyPart (part) VALUES ('Shoulders');
INSERT INTO bodyPart (part) VALUES ('Cardio');

CREATE TABLE workout
(
id SERIAL PRIMARY KEY,
typeId integer REFERENCES workoutType (id),
bodyPartId integer REFERENCES bodyPart (id),
title text NOT NULL,
description text NOT NULL
);

INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (1, 1, 'Bi-cep Curl', 'Keep your elbow locked and slowly bring up your forearm with weight all the way up to your chin, and slowly put it down. Repeat.');
INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (1, 1, 'Skull Crusher', 'Get a bar with appropriate weight. Lay down on a bench holding the bar. With your elbow locked, slowly bring down your forearm close to your forehead until the bar almost touches it. slowly bring it back up.');
INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (1, 2, 'Sumo Squat', 'With your legs spread out a little wider than your shoulder width, slowly bend your knees with your back straight. Make sure your knees are not more forward than your feet.');
INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (1, 3, 'Bench Press', 'With appropriate weight on a bar, grip the bar a little wider than your shoulder width. Slowly bring the bar down until it touches your chest. Slowly bring it back up');
INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (1, 4, 'Pull Up', 'Grip a hanging bar about as wide as your shoulder width, with your arms fully extended, slowly bring up your body all the way up until your chin almost touches the bar. Slowly pull back down to the original position. Repeat.');
INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (1, 5, 'Shoulder Press', 'Put your bench at 80, 90 degree angle. With two dumbbells, hold them up so they are lined up next to your head. Slowly push them up until your arms are fully extended. Bring them back down next to your head. Repeat.');
INSERT INTO workout (typeId, bodyPartId, title, description) VALUES (3, 6, 'Running', 'Set an appropriate pace for yourself. For more accurate data, run on treadmill. Your heart rate should be at about 160 to 180.');

CREATE TABLE todolist
(
id SERIAL PRIMARY KEY,
userId integer REFERENCES users (id),
workoutId integer REFERENCES workout (id),
listItem text NOT NULL
);

GRANT INSERT, SELECT ON todolist TO PUBLIC;

