# hillcity_backend
The hillcity mentorship app is a mobile version of hillcity online module. This repo contains the backend .

The goal of this application is to facilitate seemless interaction and Engagement between mentors & protegees. This is the backend for the application with the various API endpoints

#### users endpoints

| Action | Endpoint                   | Functionality     |
| ------ | -------------------------- | ----------------- |
| POST   | `/api/v1/auth/signin`      | Login User        |

User login schema:

Sample request:
```json
{
  "email": "example@example.com",
  "password": "password"
}
```