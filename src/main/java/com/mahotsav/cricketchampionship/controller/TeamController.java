package com.mahotsav.cricketchampionship.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mahotsav.cricketchampionship.entity.Team;
import com.mahotsav.cricketchampionship.service.TeamService;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // GET /api/teams
    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    // GET /api/teams/{id} - Also views the team's players (part of existing structure)
    @GetMapping("/{id}")
    public Team getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    // POST /api/teams
    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    // PUT /api/teams/{id}
    @PutMapping("/{id}")
    public Team updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return teamService.updateTeam(id, team);
    }

    // DELETE /api/teams/{id}
    @DeleteMapping("/{id}")
    public void deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }
    
    // --- NEW EXTENSION ENDPOINTS ---

    // GET /api/teams/by-institute?instituteName=YourInstitute
    @GetMapping("/by-institute")
    public List<Team> getTeamsByInstituteName(@RequestParam String instituteName) {
        return teamService.getTeamsByInstituteName(instituteName);
    }
    
    // GET /api/teams/draw-sheets
    @GetMapping("/draw-sheets")
    public List<List<Team>> generateDrawSheets() {
        return teamService.generateDrawSheets();
    }
    
    // GET /api/teams/promotion-results?topN=4
    @GetMapping("/promotion-results")
    public List<Team> getPromotionResults(@RequestParam(defaultValue = "4") int topN) {
        return teamService.getTopTeamsForPromotion(topN);
    }
}