from datetime import date
class Transactions:
    def __init__(self , username , amount , transactionType):
        self.username = username
        self.amount = amount
        self.transactionType = transactionType
        self.date = str(date.today())