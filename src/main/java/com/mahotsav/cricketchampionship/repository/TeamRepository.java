package com.mahotsav.cricketchampionship.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mahotsav.cricketchampionship.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
