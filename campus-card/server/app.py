from flask import Flask, jsonify, request
from flask_cors import CORS
from db import SessionLocal
from models import Transaction

import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

@app.get("/api/transactions")
def list_transactions():
    session = SessionLocal()
    try:
        txs = (
            session.query(Transaction)
            .order_by(Transaction.date.desc())
            .limit(1000)  # safety cap
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


@app.post("/api/transactions/summary")
def transactions_summary():
    """
    Expects JSON:
    {
      "transactions": [
        {"merchant": "...", "category": "...", "amount": 12.34, "date": "..."},
        ...
      ]
    }
    """
    body = request.get_json() or {}
    txs = body.get("transactions", [])

    if not txs:
        return jsonify({"summary": "No transactions selected."})

    # Build text block
    lines = []
    for t in txs:
        lines.append(
            f"{t.get('date','')}: {t.get('merchant','')} "
            f"({t.get('category','')}) {t.get('amount',0)}"
        )
    tx_block = "\n".join(lines)

    prompt = (
        "You are a financial assistant for a college student. "
        "You are given a list of campus card transactions and should return "
        "a short, clear summary (3–5 bullet points) describing:\n"
        "- spending patterns\n"
        "- unusual items\n"
        "- helpful money-saving suggestions\n"
        "Transactions:\n"
        f"{tx_block}\n\n"
        "Return only bullet points."
    )

    # Use ChatCompletion API since gpt-3.5-turbo
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful financial assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
    )

    summary = response.choices[0].message["content"]

    return jsonify({"summary": summary})

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
