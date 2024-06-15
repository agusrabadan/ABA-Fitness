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
    user = Users()
    user.email = email
    user.password = password
    user.is_active = True
    user.first_name = first_name
    user.last_name = last_name
    user.weight = weight
    user.height = height
    user.profile_picture = profile_picture
    user.birth_date = birth_date
    user.gender = gender
    user.registration_date = registration_date
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity={"user_id": user.id})
    response_body["message"] = "Usuario registrado y logueado"
    response_body["access_token"] = access_token
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
            description=data.get("description"),
            category=data.get("category"),
            group=data.get("group"),
            calories=data.get("calories"),
            difficulty_level=data.get("difficulty_level"),
            duration=data.get("duration"),
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
            exercise.description = data.get("description", exercise.description)
            exercise.category = data.get("category", exercise.category)
            exercise.group = data.get("group", exercise.group)
            exercise.calories = data.get("calories", exercise.calories)
            exercise.difficulty_level = data.get(
                "difficulty_level", exercise.difficulty_level
            )
            exercise.duration = data.get("duration", exercise.duration)
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
            difficulty_level=data.get("difficulty_level"),
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
            workout.difficulty_level = data.get("difficulty_level", workout.difficulty_level)
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


@api.route("/workout_details", methods=["GET", "POST"])
def workout_details():
    response_body = {}
    if request.method == "GET":
        workout_details = db.session.execute(db.select(WorkoutDetails)).scalars()
        results = [row.serialize() for row in workout_details]
        response_body["results"] = results
        response_body["message"] = "Listado de rutinas detalladas"
        return response_body, 200
    if request.method == "POST":
        data = request.json
        new_workout_detail = WorkoutDetails(
            workout_id = data.get("workout_id"),
            exercise_id = data.get("exercise_id"),
            workout_order = data.get("workout_order")
    )
    db.session.add(new_workout_detail)
    db.session.commit()
    response_body["message"] = "Rutina detallada creada"
    response_body["results"] = new_workout_detail.serialize()
    return response_body, 201


@api.route("workout_details/<int:id>", methods=["GET", "PUT", "DELETE"])
def workout_detail(id):
    response_body = {}
    if request.method == "GET":
        workout_detail = db.session.execute(db.select(WorkoutDetails).where(WorkoutDetails.id == id)).scalar()
        if workout_detail:
            response_body["results"] = workout_detail.serialize()
            response_body["message"] = "Rutina detallada encontrada"
            return response_body, 200
        response_body["message"] = "Detalle de rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    if request.method == "PUT":
        data = request.json
        workout_detail = db.session.execute(db.select(WorkoutDetails).where(WorkoutDetails.id == id)).scalar()
        if workout_detail:
            workout_detail.workout_id = data.get("workout_id", workout_detail.workout_id)
            workout_detail.exercise_id = data.get("exercise_id", workout_detail.exercise_id)
            workout_detail.workout_order = data.get("workout_order", workout_detail.workout_order)
            db.session.commit()
            response_body["message"] = "Rutina detallada actualizada"
            response_body["results"] = {}
            return response_body, 404
    if request.method == "DELETE":
        workout_detail = db.session.execute(db.select(WorkoutDetails).where(WorkoutDetails.id == id)).scalar()
        if workout_detail:
            db.session.delete(workout_detail)
            db.session.commit()
            response_body["message"] = "Rutina detallada eliminada"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Rutina detallada no existe"
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
        return (response_body), 200
    if request.method == "POST":
        data = request.json
        new_favorite = Favorites(
        user_id = data.get("user_id"),
        exercise_id = data.get("exercise_id")
        )
        db.session.add(new_favorite)
        db.session.commit()
        response_body["message"] = "Favorito agregado"
        response_body["results"] = new_favorite.serialize()
        return response_body, 201
    

@api.route("/favorites/<int:id>", methods=["GET","PUT","DELETE"])
def favorite(id):
    response_body = {}
    if request.method == "GET":
        favorite = db.session.execute(db.select(Favorites).where(Favorites.id == id)).scalar()
        if favorite:
            response_body["results"] = favorite.serialize()
            response_body["message"] = "Favorito encontrado"
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404
    if request.method == "PUT":
        data = request.json
        favorite = db.session.execute(db.select(Favorites).where(Favorites.id == id)).scalar()
        if favorite:
            favorite.user_id = data.get("user_id", favorite.user_id)
            favorite.exercise_id = data.get("exercise_id", favorite.exercise_id)
            db.session.commit()
            response_body["message"] = "Favorito actualizado"
            response_body["results"] = favorite.serialize()
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404
    if request.method == "DELETE":
        favorite = db.session.execute(db.select(Favorites).where(Favorites.id == id)).scalar()
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            response_body["message"] = "Favorito eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404
    

@api.route("/activity_logs", methods=["GET", "POST"])
def activity_logs():
    response_body = {}  # Se inicializa response_body como un diccionario vacío
    if request.method == "GET":
        activity_logs = db.session.execute(db.select(ActivityLogs)).scalars()
        results = [row.serialize() for row in activity_logs]  # Corregido: serialize() en lugar de serialize
        response_body["results"] = results
        response_body["message"] = "Listado de registros de actividad"
        return response_body, 200
    if request.method == "POST":
        data = request.json
        new_activity_log = ActivityLogs(
            workout_id=data.get("workout_id"),
            date=data.get("date"),
            duration=data.get("duration"),
            calories=data.get("calories")
        )
        db.session.add(new_activity_log)
        db.session.commit()
        response_body["message"] = "Registro de actividad creado"
        response_body["results"] = new_activity_log.serialize()  # Corregido: new_activity_log en lugar de mew_activity_log
        return response_body, 201
    
    
@api.route("/activity_logs/<int:id>", methods=["GET", "PUT", "DELETE"])
def activity_log(id):
    response_body = {}
    if request.method == "GET":
        activity_log = db.session.execute(db.select(ActivityLogs).where(ActivityLogs.id == id)).scalar()
        if activity_log:
            response_body["message"] = "Registro de actividad encontrado"
            response_body["results"] = activity_log.serialize()
            return response_body, 200
        response_body["message"] = "Registro de actividad no existe"
        response_body["results"] = {}
        return response_body, 404
    if request.method == "PUT":
        data = request.json
        activity_log = db.session.execute(db.select(ActivityLogs).where(ActivityLogs.id == id)).scalar()
        if activity_log:
            activity_log.workout_id = data.get("workout_id", activity_log.workout_id)
            activity_log.date = data.get("date", activity_log.date)
            activity_log.duration = data.get("duration", activity_log.duration)
            activity_log.calories = data.get("calories", activity_log.calories)
            db.session.commit()
            response_body["message"] = "Registro de actividad actualizado"
            response_body["results"] = activity_log.serialize()
            return response_body, 200
        response_body["message"] = "Registro de actividad no existe"
        response_body["results"] = {}
        return response_body, 404
    if request.method == "DELETE":
        activity_log = db.session.execute(db.select(ActivityLogs).where(ActivityLogs.id == id)).scalar()
        if activity_log:
            db.session.delete(activity_log)
            db.session.commit()
            response_body["message"] = "Registro de actividad eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Registro de actividad no existe"
        response_body["results"] = {}
        return response_body, 404