# Cricket Championship

This is a small Spring Boot application that manages Teams and Players.

## Build

Requires Java 11+ and Maven.

From project root:

```powershell
./mvnw clean package
```

Or with installed Maven:

```powershell
mvn clean package
```

## Run

```powershell
java -jar target/cricketchampionship-0.0.1-SNAPSHOT.jar
```

By default the app starts on port 8080. You can change that in `src/main/resources/application.properties`.

## REST API

Base paths:
- Players: `/api/players`
- Teams: `/api/teams`

Endpoints (HTTP method -> path):

Players
- GET  `/api/players`           — list all players
- GET  `/api/players/{id}`     — get player by id
- POST `/api/players`           — create a player (send JSON body)
- PUT  `/api/players/{id}`     — update a player (send JSON body)
- DELETE `/api/players/{id}`   — delete a player

Teams
- GET  `/api/teams`            — list all teams
- GET  `/api/teams/{id}`       — get team by id
- POST `/api/teams`            — create a team (send JSON body)
- PUT  `/api/teams/{id}`       — update a team (send JSON body)
- DELETE `/api/teams/{id}`     — delete a team

## Static UI

There is a small static UI in `src/main/resources/static` (`index.html`, `players.html`, `teams.html`, `app.js`). When running the app, open `http://localhost:8080/` to view it.

## Notes

- The controllers allow CORS from any origin (`@CrossOrigin(origins = "*")`).
- If you'd like the exact JSON shape for `Player` and `Team`, open `src/main/java/com/mahotsav/cricketchampionship/entity/Player.java` and `Team.java`.

