import pymongo
from datetime import date
import json


class DB:
    db = None
    @staticmethod
    def createDB():
        try:
            mongo = pymongo.MongoClient(host="localhost", port=27017)
            mongo.server_info()
            print("DB connected")
            DB.db = mongo.Bank
            return DB.db
        except Exception as ex:
            print(ex)
    @staticmethod
    def createUserDB(user):
        dbResponse = DB.db.BankUser.insert_one(user.__dict__)
        user = DB.findUserByID(dbResponse.inserted_id)
        print("User" , user)
        return user
    
    @staticmethod
    def findUserByID(id):
        dbResponse = DB.db.BankUser.find_one({"_id": id})
        dbResponse['_id'] = str(dbResponse['_id'])
        return json.dumps(dbResponse)

    @staticmethod
    def findUserByUsername(username):
        dbResponse = DB.db.BankUser.find_one({"username": username})
        
        if dbResponse is None:
            return None , False 
        dbResponse['_id'] = str(dbResponse['_id'])
        return json.dumps(dbResponse) , True

    @staticmethod
    def getAllUsers():
        dbResponse = list(DB.db.BankUser.find())
        print(dbResponse)
        return dbResponse

    
    @staticmethod
    def deleteUser(username):
        dbResponse = (DB.db.BankUser.delete_one({"username" : username}))
        return dbResponse.acknowledged


    @staticmethod
    def doTransaction(user , transaction):
        dbResponse = DB.db.BankUser.update_one({"username": user.username},
                                           {
            '$set': {
                "balance": user.balance
            },
            '$push': {
                'transactions': transaction.__dict__
            }
        }
        )  
        print("here")
        return dbResponse.acknowledged 

        




