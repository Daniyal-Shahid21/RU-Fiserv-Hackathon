from flask import Flask, jsonify, request
from flask_cors import CORS
from db import SessionLocal
from models import Transaction, User, Wallet  # ★ added User, Wallet

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
  """
  Optional query param: ?email=someone@example.com

  If email is provided and matches a User, only that user's transactions
  (by user_id) are returned. If no user is found, returns [].

  If email is omitted, returns up to 1000 transactions (original behavior).
  """
  session = SessionLocal()
  try:
    email = request.args.get("email")
    q = session.query(Transaction).order_by(Transaction.date.desc())

    if email:
      user = session.query(User).filter(User.email == email).first()
      if not user:
        return jsonify([])
      q = q.filter(Transaction.user_id == user.id)

    txs = q.limit(1000).all()
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


@app.get("/api/transactions/metrics")
def transaction_metrics():
  """
  Returns metrics for the current user, based on their email.

  Query param:
    ?email=someone@example.com

  Response:
    {
      "credit_limit": number | null,
      "school_over_1000": number | null
    }
  """
  session = SessionLocal()
  try:
    email = request.args.get("email")
    if not email:
      return jsonify({"credit_limit": None, "school_over_1000": None})

    user = session.query(User).filter(User.email == email).first()
    if not user:
      # As you specified: if the email is not associated with a user_id,
      # then there is no user_id in the transactions table.
      return jsonify({"credit_limit": None, "school_over_1000": None})

    wallet = (
      session.query(Wallet).get(user.wallet_id)
      if user.wallet_id is not None
      else None
    )
    credit_limit = (
      float(wallet.credit_limit) if wallet and wallet.credit_limit is not None else None
    )

    txs = session.query(Transaction).filter(Transaction.user_id == user.id).all()

    school_over_1000 = sum(
      float(t.amount)
      for t in txs
      if (t.category or "").lower() == "school" and float(t.amount) > 1000
    )

    return jsonify(
      {
        "credit_limit": credit_limit,
        "school_over_1000": school_over_1000,
      }
    )
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

  response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a helpful financial assistant."},
      {"role": "user", "content": prompt},
    ],
    temperature=0.4,
  )

  # IMPORTANT: new SDK returns message as object, not dict
  summary = response.choices[0].message.content

  return jsonify({"summary": summary})


@app.get("/api/health")
def health():
  return jsonify({"status": "ok"})


if __name__ == "__main__":
  app.run(debug=True)
