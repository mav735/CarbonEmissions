from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import jwt
import datetime
from database import SessionLocal, engine
from models import User, Base, FuelDataDB
import calendar

app = FastAPI()
Base.metadata.create_all(bind=engine)

SECRET_KEY = "GENNAPP123124124GENN"  # Change this to a secure random key
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class FuelData(BaseModel):
    fuelType: str
    amount: float
    taxRate: float
    total: float


class SubmitData(BaseModel):
    fuels: List[FuelData]
    user_id: int


class RegisterData(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    password_repeat: str


class LoginData(BaseModel):
    email: str
    password: str


class ChartDataRequest(BaseModel):
    user_id: int
    fuel_type: str
    start_date: str
    end_date: str


# Initialize the FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Submit fuel data endpoint
@app.post("/submit")
async def submit_fuel_data(data: SubmitData, db: Session = Depends(get_db)):
    created = datetime.datetime.now()
    for fuel_data in data.fuels:
        new_fuel_data = FuelDataDB(
            user_id=int(data.user_id),
            fuel_type=fuel_data.fuelType,
            amount=fuel_data.amount,
            tax_rate=fuel_data.taxRate,
            total=fuel_data.total,
            created_at=created
        )
        db.add(new_fuel_data)

    db.commit()

    return {"message": "Data received and saved successfully", "data": data}


def create_jwt_token(data: dict):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data["exp"] = expiration
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


@app.post("/register")
async def register_user(data: RegisterData, db: Session = Depends(get_db)):
    if data.password != data.password_repeat:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    hashed_password = data.password

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_jwt_token({"sub": new_user.email})

    return {"message": "User registered successfully", "token": token, 'user_id': new_user.id}


# User login endpoint (as before)
@app.post("/token")
async def login(form_data: LoginData):
    db: Session = next(get_db())
    user = db.query(User).filter(User.email == form_data.email).first()

    if not user or user.hashed_password != form_data.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Create a JWT token
    token = create_jwt_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}


@app.post("/chart-data")
async def get_chart_data(data: ChartDataRequest, db: Session = Depends(get_db)):

    if data.start_date == data.end_date and data.start_date == '':
        first_day = datetime.datetime.now().replace(day=1)
        data.start_date = first_day.isoformat()
        now = datetime.datetime.now()
        last_day = datetime.datetime(now.year, now.month, calendar.monthrange(now.year, now.month)[1]) - datetime.timedelta(days=1)
        data.end_date = last_day.isoformat()


    query = db.query(FuelDataDB).filter(
        FuelDataDB.user_id == data.user_id,
        FuelDataDB.fuel_type == data.fuel_type
    )

    # Filter by date range if provided
    if data.start_date and data.end_date:
        query = query.filter(FuelDataDB.created_at.between(data.start_date, data.end_date))

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No data found for the given filters")

    # Format the response for the chart
    chart_data = [
        {
            "Type": result.fuel_type,
            "amount": result.amount,
            "tax": result.tax_rate,
            "total": result.total,
            "timestamp": result.created_at
        }
        for result in results
    ]

    start_date_dt = datetime.datetime.fromisoformat(data.start_date)
    end_date_dt = datetime.datetime.fromisoformat(data.end_date)

    new_chart_data = {}
    result_chart = chart_data.copy()

    if end_date_dt - start_date_dt > datetime.timedelta(days=32):
        for element in chart_data:
            month_ = element['timestamp'].month
            year_ = element['timestamp'].year
            new_time = f'01.{month_}.{year_}'
            new_time_stamp = datetime.datetime.strptime(new_time, '%d.%m.%Y')
            iso_format = new_time_stamp.isoformat()

            if new_time in new_chart_data:
                new_chart_data[new_time]['amount'] += element['amount']
                new_chart_data[new_time]['tax'] += element['tax']
                new_chart_data[new_time]['total'] += element['total']
                new_chart_data[new_time]['days'] += 1
            else:
                new_chart_data[new_time] = {'amount': element['amount'],
                                            'Type': element['Type'],
                                            'tax': element['tax'],
                                            'total': element['total'],
                                            'timestamp': iso_format,
                                            'days': 1, }
        result_chart = []
        for element in new_chart_data:
            days = new_chart_data[element]['days']
            result_chart.append({'Type': new_chart_data[element]['Type'],
                                 'amount': new_chart_data[element]['amount'] / days,
                                 'tax': new_chart_data[element]['tax'] / days,
                                 'total': new_chart_data[element]['total'] / days,
                                 'timestamp': new_chart_data[element]['timestamp']})

    result_chart.sort(key=lambda x: x["timestamp"])
    return {"chart_data": result_chart}

class WasteRequest(BaseModel):
    user_id: str

@app.post("/wastes")
async def wastes(data:WasteRequest, db: Session = Depends(get_db)):
    user_id = data.user_id
    now = datetime.datetime.now()
    first_day = datetime.datetime.now().replace(day=1)
    last_day = datetime.datetime(now.year, now.month, calendar.monthrange(now.year, now.month)[1]) - datetime.timedelta(
        days=1)

    last_month_wastes = db.query(FuelDataDB).filter(
        FuelDataDB.user_id == user_id,
        FuelDataDB.created_at >= first_day,
        FuelDataDB.created_at <= last_day
    ).all()

    total_last_month = sum(waste.total for waste in last_month_wastes)
    days_in_month = (last_day - first_day).days + 1

    daily_average = total_last_month / days_in_month if days_in_month > 0 else 0

    annual_average = daily_average * 365

    return {
        "daily": round(daily_average),
        "monthly": round(daily_average * 30),
        "annually": round(annual_average)
    }