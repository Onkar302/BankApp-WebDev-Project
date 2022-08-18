
from Transactions import Transactions
from User import User
from flask import Flask, Response, request, jsonify
from flask_jwt_extended import (create_access_token, set_access_cookies, unset_jwt_cookies, JWTManager, jwt_required, get_jwt_identity)
import json
from database import *
from flask_cors import cross_origin, CORS

app = Flask(__name__)
db = DB.createDB()

CORS(app, origins='*', 
     headers=['Content-Type', 'Authorization'], 
     expose_headers='Authorization')

app.config['JWT_SECRET_KEY'] = 'strob3ehb6gs'  
jwt = JWTManager(app)

@app.route("/api/v1/admin/createUser", methods=["POST"])
@app.route("/api/v1/register", methods=["POST"])
@jwt_required()
@cross_origin()
def createUser():
    try:
        # access_token = request.cookies.get('access_token_cookie')
        # print(access_token)
        # print("*"*20)

        newUserFromClient = request.json
        
        user , isFound = User.findUser(newUserFromClient['username'])

        if isFound :
            return Response(
            response = "user exist",
            status=201,
            mimetype="application/json"
        )

        print(newUserFromClient)
        #validation 

        userFromDB = User.createUser(newUserFromClient['username'], newUserFromClient['password'],
                            int(newUserFromClient['balance']), newUserFromClient['isAdmin'])

        print("***********************")
        return Response(
            response = "User registered successfully",
            status=200,
            mimetype="application/json"
        )
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message": "Error Occured"}),
            status=500,
            mimetype="application/json"
        )


@app.route("/api/v1/doTransaction/<username>", methods=["PUT"])
@jwt_required()
@cross_origin()
def doTransaction(username):
    try:
        newTransaction = request.json
        transaction = Transactions(username ,  int(newTransaction['amount']),newTransaction['transactionType'])
        user , isFound = User.findUser(username)

        if isFound == False:
            return Response(
                response="User not found",
                status=500,
                mimetype="application/json"
            )
        isSuccessful = user.addTransaction(transaction)
        if not isSuccessful:
            return Response(
                response="Transaction failed",
                status=500,
                mimetype="application/json"
            )
        return Response(
            response= "Transaction Success",
            status=201,
            mimetype="application/json"
        )
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message": "Error Occured"}),
            status=500,
            mimetype="application/json"
        )


@app.route("/api/v1/admin/getAllUsers", methods=["GET"])
@jwt_required()
@cross_origin()
def getAllUsers():
    try:
        allUsers = User.getAllUsers()
        return Response(
            response={json.dumps(allUsers)},
            status=201,
            mimetype="application/json"
        )
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message": "Error Occured"}),
            status=500,
            mimetype="application/json"
        )


@app.route("/api/v1/admin/getRichUsers", methods=["GET"])
@jwt_required()
@cross_origin()
def getRichUsers():
    try:
        richUsers = User.getRichUsers()
        return Response(
            response={json.dumps(richUsers)},
            status=201,
            mimetype="application/json"
        )
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message": "Error Occured"}),
            status=500,
            mimetype="application/json"
        )

@app.route("/api/v1/admin/getPassbook/<username>", methods=["GET"]) 
@app.route("/api/v1/getPassbook/<username>", methods=["GET"])
@jwt_required()
@cross_origin() 
def getPassbook(username): 
    try: 
        userFromDb, isFound = User.getPassBook(username)
        if isFound == False :
            return Response( 
            response="user not found", 
            status=200, 
            mimetype="application/json" 
        ) 

        userTransactions = userFromDb.get("transactions")
 
        print(userTransactions)

        return Response( 
            response=json.dumps(userTransactions), 
            status=200, 
            mimetype="application/json" 
        ) 
 
    except Exception as ex: 
        print(ex) 
        return Response( 
            response=json.dumps({"message":"Error Occured"}), 
            status=500, 
            mimetype="application/json" 
        )

@app.route("/api/v1/admin/delete", methods=["DELETE"])
@jwt_required()
@cross_origin()
def deleteUser():
    try:
        username = request.json['username']
        if not username:
            return Response(
                response="username missing",
                status=500,
                mimetype="application/json"
            )
        user, isPresent  =  User.findUser(username)
        
        if not user:
            return Response(
                response= "User not found",
                status=500,
                mimetype="application/json"
            )
        isDeleted = User.deleteUser(username)
        if isDeleted  :
            return Response(
                    response= "User deleted successfully",
                    status=200,
                    mimetype="application/json"
                )
        else :
            return Response(
            response="Error Occured",
            status=500,
            mimetype="application/json"
        )

        
    except Exception as ex:
        
        return Response(
            response= "Error Occured",
            status=500,
            mimetype="application/json"
        )

@app.route("/api/v1/numberOfAccounts", methods=["GET"])
@jwt_required()
@cross_origin()
def getNumberOfAccounts():
    return str(db.BankUser.count_documents({}))
    
@app.route("/api/v1/findUser/<username>", methods=["GET"])
@jwt_required()
@cross_origin()
def findUser(username):
    try:
        # cookie = request.cookies.get('access_token_cookie')
        # print(cookie)
        userFromDb, isFound = User.findUser(username)
        if isFound == False :
            return Response( 
            response="user not found", 
            status=200, 
            mimetype="application/json" 
        ) 
        
        return Response( 
            response=json.dumps(userFromDb.__dict__), 
            status=200, 
            mimetype="application/json" 
        ) 
 
    except Exception as ex: 
        print(ex) 
        return Response( 
            response=json.dumps({"message":"Error Occured"}), 
            status=500, 
            mimetype="application/json" 
        )

@app.route('/api/v1/transfer/<username>', methods=['POST'])
@jwt_required()
@cross_origin()
def transfer(username):
    try:
        user, isFound = User.findUser(username)
        if isFound:
            to_username = request.json['to_username']
            amount = int(request.json['amount'])
            #validation
           
            isSuccessful = user.transfer(amount, to_username)
            print(isSuccessful)
            if isSuccessful:
                return Response(
                    response="Transaction successfull",
                    status=200,
                    mimetype="application/json"
                )
            return Response(
                    response= "Transaction Failed",
                    status=500,
                    mimetype="application/json"
                )

    except Exception as ex:
        print(ex)
        return Response(
            response="Error Occured",
            status=500,
            mimetype="application/json"
        )
        
@app.route('/api/v1/login', methods=['POST', 'GET'])
@cross_origin()
def login():
    try:
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        
        print(username , password)

        if not username:
            return 'Missing email', 400
        if not password:
            return 'Missing password', 400
        user , isFound = User.findUser(username)
        if not isFound:
            return 'User Not Found!', 404
        
        if  str(user.password) == str(password):
            access_token = create_access_token(identity={"username": username, "isAdmin": user.isAdmin})
            resp = jsonify(access_token)
            return resp
        else:
            return 'Invalid Login Info!', 400
    except AttributeError:
        return 'Provide an Username and Password in JSON format in the request body', 400


@app.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200

@app.route('/jwtInfo', methods=['POST'])
@jwt_required()
@cross_origin()
def jwtInfo():
   return get_jwt_identity()
   


    
if __name__ == "__main__":
    app.run(port=5555, debug=True)