package com.mahotsav.cricketchampionship.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mahotsav.cricketchampionship.entity.Player;
import com.mahotsav.cricketchampionship.repository.PlayerRepository;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id).orElse(null);
    }

    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player updatePlayer(Long id, Player playerDetails) {
        Player player = playerRepository.findById(id).orElse(null);
        if (player != null) {
            player.setName(playerDetails.getName());
            player.setRegistrationNumber(playerDetails.getRegistrationNumber());
            player.setBranch(playerDetails.getBranch());
            player.setSection(playerDetails.getSection());
            player.setYear(playerDetails.getYear());
            player.setMobileNumber(playerDetails.getMobileNumber());
            player.setTeam(playerDetails.getTeam());
            return playerRepository.save(player);
        }
        return null;
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }
}
