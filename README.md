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

#### Dashboard endpoints

| Action | Endpoint                             | Functionality                     |
| ------ | ------------------------------------ | --------------------------------- |
| GET    | `/api/v1/auth/mentee/dashboard`      | Mentee dashboard                  |
| GET    | `/api/v1/auth/mentor/dashboard`      | Mentor dashboard                  |

#### Token is required

#### Engagement endpoints

| Action | Endpoint                                          | Functionality                                           |
| ------ | ------------------------------------------------- | ------------------------------------------------------- |
| POST   | `/api/v1/post/engagement/create/new`              | Mentee Creates Engagement                               |
| GET    | `/api/v1/get/mentee/engagements`                  | Mentee gets all their engagements                       |
| GET    | `/api/v1/get/mentor/engagements`                  | Mentor gets all their engagements                       |
| GET    | `/api/v1/get/engagements/:id`                     | Mentors & Mentees get all their engagements given ID    |
| PUT    | `/api/v1/update/accepted/engagements/:id`         | Mentor Accepts engagement given the ID                  |
| PUT    | `/api/v1/update/task-assigned/engagements/:id`    | Mentor Assigns task given the ID                        |
| PUT    | `/api/v1/update/rejected/engagements/:id`         | Mentor Rejects engagement given the ID                  |

Create Engagement
Sample request:
```json
{
  "modeOfEngagement": "Mode of Engagement",
  "proposedDate": "Proposed Date",
  "ProposedTine": "Proposed Time",
  "engagementType": "Type of Tengagement",
  "reasonForEngagement": "Reason For Engagement"
}
```
#### Token is required