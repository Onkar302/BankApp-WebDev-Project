from database import *
from Transactions import Transactions
class User:

    def __init__(self, username, password, balance, isAdmin):
        self.username = username
        self.password = password
        self.balance = balance
        self.isAdmin = isAdmin
        self.transactions = []

    @staticmethod
    def createUser(username, password, balance, isAdmin):
        userObj = User(username, password, balance, isAdmin)
        print(userObj.__dict__)
        user = DB.createUserDB(userObj)
        return user

    @staticmethod
    def createUserByJSON(user):
        username = user['username']
        password = user['password']
        balance = user['balance']
        isAdmin = user['isAdmin']
        userNew = User(username, password, balance, isAdmin)
        return userNew

    @staticmethod
    def findUser(username):
        user , isFound = DB.findUserByUsername(username)
        if not isFound :
            return None , False 
        #print(user , type(user) , "dataBase") 
        userObj = User.createUserByJSON(json.loads(user))
        #print(type(userObj))
        return userObj , True

    @staticmethod
    def getAllUsers():
        listOfUSerObjects = []
        listOfUsers = DB.getAllUsers()
        print()
        print()
        for user in listOfUsers:
            print(user)
            user['_id'] = str(user['_id'])
            listOfUSerObjects.append(user)
        print(listOfUSerObjects)
        return listOfUSerObjects
        
    @staticmethod
    def getRichUsers():
        listOfUSerObjects = []
        listOfUsers = DB.getAllUsers()
        print()
        print()
        for user in listOfUsers:
            if user['balance'] > 1000 :
                user['_id'] = str(user['_id'])
                listOfUSerObjects.append(user)
        print(listOfUSerObjects)
        return listOfUSerObjects
    
    @staticmethod
    def getPassBook(username):
        user, isFound = DB.findUserByUsername(username)
        if not isFound :
            return None , False
        userObj = json.loads(user)
        return userObj , True
        
    @staticmethod
    def deleteUser(username):
        return DB.deleteUser(username)
        
    def addTransaction(self , transaction):
        self.transactions.append(transaction)
        if transaction.transactionType == "D":
            return self.deposit(transaction)
        else:
            return self.withdraw(transaction)

    def transfer(self , amount , to_username):
        to_user, isFound = User.findUser(to_username)
        withdrawTrans = Transactions(to_username, amount, "TW")
        depositTrans = Transactions(self.username, amount, "TD")
        if isFound:
            isWithdrawn = self.withdraw(withdrawTrans)
            if isWithdrawn:
                isDeposited = to_user.deposit(depositTrans)
                if isDeposited:
                    return True
        return False


        
    def deposit(self , transaction):
        self.balance += transaction.amount
        return DB.doTransaction(self , transaction)
        
    def withdraw(self , transaction):
        if transaction.amount > self.balance:
            print("Insufficient Funds")
            return False
        self.balance -= transaction.amount
        # Update collection with current object
        return DB.doTransaction(self , transaction)