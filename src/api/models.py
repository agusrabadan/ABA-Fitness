from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    profile_picture = db.Column(db.String(250))
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(10))
    registration_date = db.Column(db.Date)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "weight": self.weight,
            "height": self.height,
            "profile_picture": self.profile_picture,
            "birth_date": self.birth_date,
            "gender": self.gender,
            "registration_date": self.registration_date,
        }


class Exercises(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    description = db.Column(db.String(), unique=True, nullable=False)
    category = db.Column(db.String(), unique=False, nullable=True)
    group = db.Column(db.String(), unique=False, nullable=False)
    calories = db.Column(db.Integer(), unique=False, nullable=False)
    difficulty_level = db.Column(db.String(), unique=False, nullable=False)
    duration = db.Column(db.Integer(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Exercise: {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'calories': self.calories,
            'group': self.group,
            'difficulty_level': self.difficulty_level,
            'duration': self.duration
        }

class Workouts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    difficulty_level = db.Column(db.String(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id])
    start_date = db.Column(db.Date(), unique=False, nullable=True)
    ending_date = db.Column(db.Date(), unique=False, nullable=True)

    def __repr__(self):
        return f'<Workout: {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'is_active': self.is_active,
            'difficulty_level': self.difficulty_level,
            'user_id': self.user_id,
            'start_date': self.start_date,
            'ending_date': self.ending_date
        }

class WorkoutDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))
    workout_to = db.relationship('Workouts', foreign_keys=[workout_id])
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'))
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id])

    def __repr__(self):
        return f'<Workout_Details: {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'workout_id': self.workout_id,
            'exercise_id': self.exercise_id
        }


class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id])
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'))
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id])

    def __repr__(self):
        return f'<Favorites: {self.id}>'

    def serialize(self):
        return {

            'id': self.id,
            'user_id': self.user_id,
            'exercise_id': self.exercise_id
        }

class ActivityLogs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))
    workout_to = db.relationship('Workouts', foreign_keys=[workout_id])
    date = db.Column(db.Date(), unique=False, nullable=True)
    duration = db.Column(db.Integer(), unique=False, nullable=False)
    calories = db.Column(db.Integer(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Activity_Logs: {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'workout_id': self.workout_id,
            'date': self.date,
            'duration': self.duration,
            'calories': self.calories
        }

class WorkoutDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))
    workout_to = db.relationship('Workouts', foreign_keys=[workout_id])
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'))
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id])
    workout_order = db.Column(db.Integer(), unique=False, nullable=False)
    def __repr__(self):
        return f'<Workout_Details: {self.id}>'
    def serialize(self):
        return {
            'id': self.id,
            'workout_id': self.workout_id,
            'exercise_id': self.exercise_id,
            'workout_order': self.workout_order
        }