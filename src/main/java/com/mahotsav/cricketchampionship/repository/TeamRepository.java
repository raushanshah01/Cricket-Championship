package com.mahotsav.cricketchampionship.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mahotsav.cricketchampionship.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
    
    // Custom query method to find teams by institute name
    List<Team> findByInstituteName(String instituteName);
}