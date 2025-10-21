package com.mahotsav.cricketchampionship.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mahotsav.cricketchampionship.entity.Team;
import com.mahotsav.cricketchampionship.repository.TeamRepository;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        // This implicitly includes the List<Player> due to the entity mapping
        return teamRepository.findById(id).orElse(null);
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, Team teamDetails) {
        Team team = teamRepository.findById(id).orElse(null);
        if (team != null) {
            team.setTeamName(teamDetails.getTeamName());
            team.setInstituteName(teamDetails.getInstituteName());
            team.setCaptain(teamDetails.getCaptain());
            team.setViceCaptain(teamDetails.getViceCaptain());
            return teamRepository.save(team);
        }
        return null;
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    // --- NEW EXTENSIONS ---

    // 1. Get Teams by Institute Name
    public List<Team> getTeamsByInstituteName(String instituteName) {
        return teamRepository.findByInstituteName(instituteName);
    }

    // 2. Generate Draw Sheets (Pools of 8)
    public List<List<Team>> generateDrawSheets() {
        // Fetch all registered teams
        List<Team> allTeams = teamRepository.findAll();

        final int POOL_SIZE = 8;
        List<List<Team>> pools = new ArrayList<>();
        
        // Simple batching logic
        for (int i = 0; i < allTeams.size(); i += POOL_SIZE) {
            int end = Math.min(i + POOL_SIZE, allTeams.size());
            List<Team> pool = allTeams.subList(i, end);
            pools.add(pool);
        }

        return pools;
    }

    // 3. Get Top Teams for Promotion
    public List<Team> getTopTeamsForPromotion(int count) {
        // Fetch all teams (sorted by ID, acting as a placeholder ranking)
        List<Team> allTeams = teamRepository.findAll();

        // Ensure we don't try to get more teams than exist
        if (allTeams.size() <= count) {
            return allTeams;
        }
        
        // Return the sublist of the top 'count' teams
        return allTeams.subList(0, count);
    }
}