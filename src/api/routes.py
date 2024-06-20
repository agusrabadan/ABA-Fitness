"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import (
    db,
    Users,
    Exercises,
    Workouts,
    WorkoutDetails,
    Favorites,
    ActivityLogs,
)
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

api = Blueprint("api", __name__)
CORS(api)  # Allow CORS requests to this API


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Lógica de validación de usuario y contraseña
    user = db.session.execute(
        db.select(Users).where(
            Users.email == email, Users.password == password, Users.is_active == True
        )
    ).scalar()
    if user:
        access_token = create_access_token(identity={"user_id": user.id})
        response_body["message"] = "Usuario logueado"
        response_body["access_token"] = access_token
        response_body["results"] = user.serialize()
        return response_body, 200
    
    response_body["message"] = "Usuario y/o contraseña incorrecta"
    return response_body, 401

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    response_body["message"] = f"User logueado: {current_user}"
    return response_body, 200

@api.route("/signup", methods=["POST"])
def signup():
    response_body = {}
    email = request.json.get("email", None).lower()
    password = request.json.get("password", None)
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    weight = request.json.get("weight", None)
    height = request.json.get("height", None)
    profile_picture = request.json.get("profile_picture", None)
    birth_date = request.json.get("birth_date", None)
    gender = request.json.get("gender", None)
    registration_date = request.json.get("registration_date", None)
    existing_user = Users.query.filter_by(email=email).first()
    if existing_user:
        response_body["message"] = "El usuario ya existe"
        return response_body, 409

    # Lógica de verificación de email y password válidos
    user = Users(
        email=email,
        password=password,
        is_active=True,
        first_name=first_name,
        last_name=last_name,
        weight=weight,
        height=height,
        profile_picture=profile_picture,
        birth_date=birth_date,
        gender=gender,
        registration_date=registration_date
    )
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity={"user_id": user.id})
    response_body["message"] = "Usuario registrado y logueado"
    response_body["access_token"] = access_token
    response_body["results"] = user.serialize()
    return response_body, 200

@api.route("/users", methods=["GET", "POST"])
def users():
    response_body = {}
    if request.method == "GET":
        users = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in users]
        response_body["results"] = results
        response_body["message"] = "Listado de usuarios"
        return response_body, 200
    
    if request.method == "POST":
        response_body["message"] = "Este endpoint no es válido, primero haz un signup"
        return response_body, 200

@api.route("/users/<int:id>", methods=["GET", "PUT", "DELETE"])
def user(id):
    response_body = {}
    if request.method == "GET":
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            response_body["results"] = user.serialize()
            response_body["message"] = "Usuario encontrado"
            return response_body, 200
        response_body["message"] = "Usuario no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            user.email = data["email"]
            user.is_active = data["is_active"]
            user.first_name = data["first_name"]
            user.last_name = data["last_name"]
            db.session.commit()
            response_body["message"] = "Datos del usuario actualizados"
            response_body["results"] = user.serialize()
            return response_body, 200
        response_body["message"] = "Usuario no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            db.session.delete(user)
            db.session.commit()
            response_body["message"] = "Usuario eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Usuario no existe"
        response_body["results"] = {}
        return response_body, 404

@api.route("/exercises", methods=["GET", "POST"])
def exercises():
    response_body = {}
    if request.method == "GET":
        exercises = db.session.execute(db.select(Exercises)).scalars()
        results = [row.serialize() for row in exercises]
        response_body["results"] = results
        response_body["message"] = "Listado de ejercicios"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_exercise = Exercises(
            name=data.get("name"),
            target=data.get("target"),  
            body_part=data.get("body_part"),  
            equipment=data.get("equipment"),
            secondary_muscles=data.get("secondary_muscles"),
            instructions=data.get("instructions"),
            gif_url=data.get("gif_url"),
        )
        db.session.add(new_exercise)
        db.session.commit()
        response_body["message"] = "Ejercicio creado"
        response_body["results"] = new_exercise.serialize()
        return response_body, 201

@api.route("/exercises/<int:id>", methods=["GET", "PUT", "DELETE"])
def exercise(id):
    response_body = {}
    if request.method == "GET":
        exercise = db.session.execute(
            db.select(Exercises).where(Exercises.id == id)
        ).scalar()
        if exercise:
            response_body["results"] = exercise.serialize()
            response_body["message"] = "Ejercicio encontrado"
            return response_body, 200
        response_body["message"] = "Ejercicio no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        exercise = db.session.execute(
            db.select(Exercises).where(Exercises.id == id)
        ).scalar()
        if exercise:
            exercise.name = data.get("name", exercise.name)
            exercise.target = data.get("target", exercise.target)  
            exercise.body_part = data.get("body_part", exercise.body_part)  
            exercise.equipment = data.get("equipment", exercise.equipment)
            exercise.secondary_muscles = data.get("secondary_muscles", exercise.secondary_muscles)
            exercise.instructions = data.get("instructions", exercise.instructions)
            exercise.gif_url = data.get("gif_url", exercise.gif_url)
            db.session.commit()
            response_body["message"] = "Ejercicio actualizado"
            response_body["results"] = exercise.serialize()
            return response_body, 200
        response_body["message"] = "Ejercicio no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        exercise = db.session.execute(
            db.select(Exercises).where(Exercises.id == id)
        ).scalar()
        if exercise:
            db.session.delete(exercise)
            db.session.commit()
            response_body["message"] = "Ejercicio eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Ejercicio no existe"
        response_body["results"] = {}
        return response_body, 404

@api.route("/workouts", methods=["GET", "POST"])
def workouts():
    response_body = {}
    if request.method == "GET":
        workouts = db.session.execute(db.select(Workouts)).scalars()
        results = [row.serialize() for row in workouts]
        response_body["results"] = results
        response_body["message"] = "Listado de rutinas"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_workout = Workouts(
            name=data.get("name"),
            is_active=data.get("is_active"),
            user_id=data.get("user_id"),
            start_date=data.get("start_date"),
            ending_date=data.get("ending_date"),
        )
        db.session.add(new_workout)
        db.session.commit()
        response_body["message"] = "Rutina creada"
        response_body["results"] = new_workout.serialize()
        return response_body, 201

@api.route("/workouts/<int:id>", methods=["GET", "PUT", "DELETE"])
def workout(id):
    response_body = {}
    if request.method == "GET":
        workout = db.session.execute(
            db.select(Workouts).where(Workouts.id == id)
        ).scalar()
        if workout:
            response_body["results"] = workout.serialize()
            response_body["message"] = "Rutina encontrada"
            return response_body, 200
        response_body["message"] = "Rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        workout = db.session.execute(
            db.select(Workouts).where(Workouts.id == id)
        ).scalar()
        if workout:
            workout.name = data.get("name", workout.name)
            workout.is_active = data.get("is_active", workout.is_active)
            workout.user_id = data.get("user_id", workout.user_id)
            workout.start_date = data.get("start_date", workout.start_date)
            workout.ending_date = data.get("ending_date", workout.ending_date)
            db.session.commit()
            response_body["message"] = "Rutina actualizada"
            response_body["results"] = workout.serialize()
            return response_body, 200
        response_body["message"] = "Rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        workout = db.session.execute(
            db.select(Workouts).where(Workouts.id == id)
        ).scalar()
        if workout:
            db.session.delete(workout)
            db.session.commit()
            response_body["message"] = "Rutina eliminada"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Rutina no existe"
        response_body["results"] = {}
        return response_body, 404


@api.route("/workoutdetails", methods=["GET", "POST"])
def workoutdetails():
    response_body = {}
    if request.method == "GET":
        workoutdetails = db.session.execute(db.select(WorkoutDetails)).scalars()
        results = [row.serialize() for row in workoutdetails]
        response_body["results"] = results
        response_body["message"] = "Listado de detalles de rutina"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_workoutdetail = WorkoutDetails(
            workout_id=data.get("workout_id"),
            exercise_id=data.get("exercise_id"),
            repetitions=data.get("repetitions"),
            series=data.get("series"),
            duration=data.get("duration"),
            status=data.get("status"),
        )
        db.session.add(new_workoutdetail)
        db.session.commit()
        response_body["message"] = "Detalle de rutina creado"
        response_body["results"] = new_workoutdetail.serialize()
        return response_body, 201

@api.route("/workoutdetails/<int:id>", methods=["GET", "PUT", "DELETE"])
def workoutdetail(id):
    response_body = {}
    if request.method == "GET":
        workoutdetail = db.session.execute(
            db.select(WorkoutDetails).where(WorkoutDetails.id == id)
        ).scalar()
        if workoutdetail:
            response_body["results"] = workoutdetail.serialize()
            response_body["message"] = "Detalle de rutina encontrado"
            return response_body, 200
        response_body["message"] = "Detalle de rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        workoutdetail = db.session.execute(
            db.select(WorkoutDetails).where(WorkoutDetails.id == id)
        ).scalar()
        if workoutdetail:
            workoutdetail.workout_id = data.get(
                "workout_id", workoutdetail.workout_id
            )
            workoutdetail.exercise_id = data.get(
                "exercise_id", workoutdetail.exercise_id
            )
            workoutdetail.repetitions = data.get(
                "repetitions", workoutdetail.repetitions
            )
            workoutdetail.series = data.get("series", workoutdetail.series)
            workoutdetail.duration = data.get("duration", workoutdetail.duration)
            workoutdetail.status = data.get("status", workoutdetail.status)
            db.session.commit()
            response_body["message"] = "Detalle de rutina actualizado"
            response_body["results"] = workoutdetail.serialize()
            return response_body, 200
        response_body["message"] = "Detalle de rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        workoutdetail = db.session.execute(
            db.select(WorkoutDetails).where(WorkoutDetails.id == id)
        ).scalar()
        if workoutdetail:
            db.session.delete(workoutdetail)
            db.session.commit()
            response_body["message"] = "Detalle de rutina eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Detalle de rutina no existe"
        response_body["results"] = {}
        return response_body, 404

@api.route("/favorites", methods=["GET", "POST"])
def favorites():
    response_body = {}
    if request.method == "GET":
        favorites = db.session.execute(db.select(Favorites)).scalars()
        results = [row.serialize() for row in favorites]
        response_body["results"] = results
        response_body["message"] = "Listado de favoritos"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_favorite = Favorites(
            user_id=data.get("user_id"),
            exercise_id=data.get("exercise_id"),
        )
        db.session.add(new_favorite)
        db.session.commit()
        response_body["message"] = "Favorito creado"
        response_body["results"] = new_favorite.serialize()
        return response_body, 201

@api.route("/favorites/<int:id>", methods=["GET", "DELETE"])
def favorite(id):
    response_body = {}
    if request.method == "GET":
        favorite = db.session.execute(
            db.select(Favorites).where(Favorites.id == id)
        ).scalar()
        if favorite:
            response_body["results"] = favorite.serialize()
            response_body["message"] = "Favorito encontrado"
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        favorite = db.session.execute(
            db.select(Favorites).where(Favorites.id == id)
        ).scalar()
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            response_body["message"] = "Favorito eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404

@api.route("/activitylogs", methods=["GET", "POST"])
def activitylogs():
    response_body = {}
    if request.method == "GET":
        activitylogs = db.session.execute(db.select(ActivityLogs)).scalars()
        results = [row.serialize() for row in activitylogs]
        response_body["results"] = results
        response_body["message"] = "Listado de logs de actividades"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_activitylog = ActivityLogs(
            user_id=data.get("user_id"),
            workout_id=data.get("workout_id"),
            timestamp=data.get("timestamp"),
            status=data.get("status"),
        )
        db.session.add(new_activitylog)
        db.session.commit()
        response_body["message"] = "Log de actividad creado"
        response_body["results"] = new_activitylog.serialize()
        return response_body, 201

@api.route("/activitylogs/<int:id>", methods=["GET", "PUT", "DELETE"])
def activitylog(id):
    response_body = {}
    if request.method == "GET":
        activitylog = db.session.execute(
            db.select(ActivityLogs).where(ActivityLogs.id == id)
        ).scalar()
        if activitylog:
            response_body["results"] = activitylog.serialize()
            response_body["message"] = "Log de actividad encontrado"
            return response_body, 200
        response_body["message"] = "Log de actividad no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        activitylog = db.session.execute(
            db.select(ActivityLogs).where(ActivityLogs.id == id)
        ).scalar()
        if activitylog:
            activitylog.user_id = data.get("user_id", activitylog.user_id)
            activitylog.workout_id = data.get("workout_id", activitylog.workout_id)
            activitylog.timestamp = data.get("timestamp", activitylog.timestamp)
            activitylog.status = data.get("status", activitylog.status)
            db.session.commit()
            response_body["message"] = "Log de actividad actualizado"
            response_body["results"] = activitylog.serialize()
            return response_body, 200
        response_body["message"] = "Log de actividad no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        activitylog = db.session.execute(
            db.select(ActivityLogs).where(ActivityLogs.id == id)
        ).scalar()
        if activitylog:
            db.session.delete(activitylog)
            db.session.commit()
            response_body["message"] = "Log de actividad eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Log de actividad no existe"
        response_body["results"] = {}
        return response_body, 404