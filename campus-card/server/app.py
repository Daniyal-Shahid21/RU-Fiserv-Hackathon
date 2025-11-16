from flask import Flask, jsonify
from flask_cors import CORS
from db import SessionLocal
from models import Transaction

app = Flask(__name__)
CORS(app)


@app.get("/api/transactions/recent")
def recent_transactions():
    session = SessionLocal()
    try:
        txs = (
            session.query(Transaction)
            .order_by(Transaction.date.desc())
            .limit(20)
            .all()
        )
        data = [
            {
                "id": t.id,
                "merchant": t.merchant,
                "category": t.category,
                "amount": float(t.amount),
                "location": t.location,
                "date": t.date.isoformat(),
            }
            for t in txs
        ]
        return jsonify(data)
    finally:
        session.close()


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
