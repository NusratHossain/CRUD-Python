from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pymongo import MongoClient

conn = MongoClient()

app = FastAPI()

origins = [
    "http://localhost:8080",
    "localhost:8080",
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def userEntiy(item) -> dict:
    return {
        "id": str(item["_id"]),
        "name": item["name"],
        "rank": item["rank"],
        "email": item["email"]
    }

def usersEntity(entity) ->list:
    return [userEntiy(item) for item in entity]


#root
@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to Employee Management System."}

#Get Employee List
@app.get("/employee", tags=["employee list"])
async def get_employee() -> dict:
    print(conn.local.user.find( ))
    employees = usersEntity(conn.local.user.find( ))
    return { "data": employees }

#Get one Employee
@app.get('/employee/{id}', tags=["employee list"])
async def find_one_employee(id):
    return userEntiy(conn.local.user.find_one({"_id": ObjectId(id)}))

#Create New Employee Entity
@app.post("/employee", tags=["employee list"])
async def add_employee(employee: dict) -> list:
    conn.local.user.insert_one(employee)
    return usersEntity(conn.local.user.find())

#Delete One Employee Entity
@app.delete("/employee/{id}", tags=["employee list"])
async def delete_employee(id) -> dict:
    return userEntiy(conn.local.user.find_one_and_delete({"_id": ObjectId(id)}))

#Update Employee Entity
@app.put("/employee/{id}", tags=["employee list"])
async def update_employee(id, body: dict) -> dict:
    conn.local.user.find_one_and_update({"_id": ObjectId(id)}, {
        "$set": dict(body)
    })
    return userEntiy(conn.local.user.find_one({"_id": ObjectId(id)}))