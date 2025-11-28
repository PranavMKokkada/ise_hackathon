"""
API Gateway
Routes requests to appropriate microservices (Service B, Mock A, Mock C).
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="BioNexus API Gateway", version="1.0.0")

# Configuration
# Configuration
SERVICE_B_URL = f"http://localhost:{os.getenv('SERVICE_B_PORT', '8002')}"
# Integrated Real Services
SERVICE_A_URL = f"http://localhost:{os.getenv('SERVICE_A_PORT', '8001')}"
SERVICE_C_URL = f"http://localhost:{os.getenv('SERVICE_C_PORT', '8005')}"

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "BioNexus API Gateway",
        "routes": {
            "/api/v1/biological-weather": "Mock Service A",
            "/api/v1/supply-chain": "Service B",
            "/api/v1/nexus": "Mock Service C",
            "/api/v1/auth": "Auth Service"
        }
    }

async def forward_request(url: str, method: str, headers: dict, body: any = None):
    async with httpx.AsyncClient() as client:
        try:
            # Filter headers to avoid conflicts
            headers = {k: v for k, v in headers.items() if k.lower() not in ['host', 'content-length']}
            
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=body,
                timeout=30.0
            )
            return JSONResponse(content=response.json(), status_code=response.status_code)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Service unavailable: {str(exc)}")
        except Exception as exc:
             # Try to return text if json fails
            try:
                return JSONResponse(content={"error": str(exc), "body": response.text}, status_code=response.status_code)
            except:
                raise HTTPException(status_code=500, detail=str(exc))

# --- Route Definitions ---

@app.api_route("/api/v1/biological-weather/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_service_a(path: str, request: Request):
    url = f"{SERVICE_A_URL}/{path}"
    body = await request.json() if request.method in ["POST", "PUT"] else None
    return await forward_request(url, request.method, dict(request.headers), body)

@app.api_route("/api/v1/supply-chain/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_service_b(path: str, request: Request):
    url = f"{SERVICE_B_URL}/{path}"
    body = await request.json() if request.method in ["POST", "PUT"] else None
    return await forward_request(url, request.method, dict(request.headers), body)

@app.api_route("/api/v1/nexus/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_service_c(path: str, request: Request):
    url = f"{SERVICE_C_URL}/{path}"
    body = await request.json() if request.method in ["POST", "PUT"] else None
    return await forward_request(url, request.method, dict(request.headers), body)

# --- Auth Routes (Simple Mock) ---

@app.post("/api/v1/auth/login")
async def login(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")
    
    # Simple mock auth
    if email in ["admin@test.com", "analyst@test.com", "hospital@test.com"] and password == "password123":
        role = email.split("@")[0]
        return {
            "access_token": f"mock-jwt-token-{role}",
            "token_type": "bearer",
            "user": {
                "email": email,
                "role": role,
                "name": role.capitalize()
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/v1/auth/me")
async def get_current_user(request: Request):
    # Mock user info
    return {
        "email": "analyst@test.com",
        "role": "analyst",
        "name": "Analyst User"
    }
