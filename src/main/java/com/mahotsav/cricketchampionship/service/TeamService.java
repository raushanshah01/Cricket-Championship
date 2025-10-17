package com.mahotsav.cricketchampionship.service;

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
}
