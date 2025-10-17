package com.mahotsav.cricketchampionship.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mahotsav.cricketchampionship.entity.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {
}
