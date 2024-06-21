from flask_sqlalchemy import SQLAlchemy
from enum import Enum


class BodyPart(Enum):
    Back = "Back"
    Cardio = "Cardio"
    Chest = "Chest"
    Lower_arms = "Lower_arms"
    Lower_legs = "Lower_legs"
    Neck = "Neck"
    Shoulders = "Shoulders" 
    Upper_arms = "Upper_arms"
    Upper_legs = "Upper_legs"
    Waist = "Waist"


class Target(Enum):
    Abductors = "Abductors"
    Abs = "Abs"
    Adductors = "Adductors"
    Biceps = "Biceps"
    Calves = "Calves"
    Cardiovascular_system = "Cardiovascular_system"
    Delts = "Delts"
    Forearms = "Forearms"
    Glutes = "Glutes"
    Hamstrings = "Hamstrings"
    Lats = "Lats"
    Levator_scapulae = "Levator_scapulae"
    Pectorals = "Pectorals"
    Quads = "Quads"
    Serratus_anterior = "Serratus_anterior"
    Spine = "Spine"
    Traps = "Traps"
    Triceps = "Triceps"
    Upper_back = "Upper_back"


class Equipment(Enum): 
    Assisted = "Assisted"
    Band = "Band"
    Barbell = "Barbell"
    BodyWeight = "Body Weight"
    BosuBall = "Bosu Ball"
    Cable = "Cable"
    Dumbbell = "Dumbbell"
    EllipticalMachine = "Elliptical Machine"
    EzBarbell = "Ez Barbell"
    Hammer = "Hammer"
    Kettlebell = "Kettlebell"
    LeverageMachine = "Leverage Machine"
    MedicineBall = "Medicine Ball"
    OlympicBarbell = "Olympic Barbell"
    ResistanceBand = "Resistance Band"
    Roller = "Roller"
    Rope = "Rope"
    SkiergMachine = "Skierg Machine"
    SledMachine = "Sled Machine"
    SmithMachine = "Smith Machine"
    StabilityBall = "Stability Ball"
    StationaryBike = "Stationary Bike"
    StepmillMachine = "Stepmill Machine"
    Tire = "Tire"
    TrapBar = "Trap Bar"
    UpperBodyErgometer = "Upper Body Ergometer"
    Weighted = "Weighted"
    WheelRoller = "Wheel Roller"


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)
    weight = db.Column(db.Float(), unique=False, nullable=True)
    height = db.Column(db.Float(), unique=False, nullable=True)
    profile_picture = db.Column(db.String(), unique=True, nullable=True)
    birth_date = db.Column(db.Date(), unique=False, nullable=True)
    gender = db.Column(db.String(), unique=False, nullable=True)
    registration_date = db.Column(db.Date(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'is_active': self.is_active,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'weight': self.weight,
            'height': self.height,
            'gender': self.gender,
            'birth_date': self.birth_date,
            'profile_picture': self.profile_picture
        }


class Exercises(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    target = db.Column(db.Enum(Target), unique=False, nullable=False)  
    body_part = db.Column(db.Enum(BodyPart), unique=False, nullable=False)  
    equipment = db.Column(db.Enum(Equipment), unique=False, nullable=False)
    secondary_muscles = db.Column(db.String(), unique=False, nullable=False)
    instructions = db.Column(db.String(), unique=False, nullable=False)
    gif_url = db.Column(db.String(), unique=True, nullable=False)

    def __repr__(self):
        return f'<Exercise: {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'target': self.target.value,  
            'body_part': self.body_part.value,  
            'equipment': self.equipment.value,
            'secondary_muscles': self.secondary_muscles,
            'instructions': self.instructions,
            "gif_url": self.gif_url
        }


class Workouts(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(), unique=True, nullable=False)
     is_active = db.Column(db.Boolean(), unique=False, nullable=False)
     user_id = db.Column(db.Integer, db.ForeignKey('users.id')) 
     user_to = db.relationship('Users', foreign_keys = [user_id])    
     start_date = db.Column(db.Date(), unique=False, nullable=True)
     ending_date = db.Column(db.Date(), unique=False, nullable=True)
     

     def __repr__(self):
        return f'<Workout: {self.name}>'

     def serialize(self):
        return {
                'id': self.id,
                'name': self.name,
                'description': self.description,
                'calories': self.calories,
                'group': self.group,
                'duration': self.duration
                }


class Favorites(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     user_id = db.Column(db.Integer, db.ForeignKey('users.id')) 
     user_to = db.relationship('Users', foreign_keys = [user_id])
     exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'))
     exercise_to = db.relationship('Exercises', foreign_keys = [exercise_id]) 
     
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
     workout_to = db.relationship('Workouts', foreign_keys = [workout_id])
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
     workout_to = db.relationship('Workouts', foreign_keys = [workout_id])
     exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'))
     exercise_to = db.relationship('Exercises', foreign_keys = [exercise_id])
     reps_num = db.Column(db.Integer(), unique=False, nullable=False)
     series_num = db.Column(db.Integer(), unique=False, nullable=False)
     rest_seconds = db.Column(db.Integer(), unique=False, nullable=True)
     
     def __repr__(self):
        return f'<Workout_Details: {self.id}>'

     def serialize(self):
        return {
                'id': self.id,
                'workout_id': self.workout_id,
                'exercise_id': self.exercise_id,
                'reps_num' : self.reps_num,
                'series_num' : self.series_num,
                'rest_seconds' : self.rest_seconds
                }
