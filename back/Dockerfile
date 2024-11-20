
FROM python:3.10-slim

# Set working directory for backend
WORKDIR /app

# Copy and install backend dependencies
COPY back/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend codebase
COPY back /app

# Expose the backend port
EXPOSE 8000

# Command to run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
