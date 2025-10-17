// app.js

const API_BASE_URL = 'http://localhost:8080/api';

// Utility to show a simple message box instead of alert/confirm
function showMessage(message, isError = false) {
    const modal = document.getElementById('message-modal');
    const modalText = document.getElementById('message-text');
    
    if (modal && modalText) {
        modalText.textContent = message;
        modalText.style.color = isError ? '#e53935' : '#4CAF50';
        modal.classList.add('active');

        // Automatically hide after 3 seconds
        setTimeout(() => modal.classList.remove('active'), 3000);
    } else {
        console.warn('Modal structure not found. Using console/alert fallback.', message);
        if (isError) {
            console.error(message);
        } else {
            console.log(message);
        }
    }
}

// --- Generic API Helpers ---

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        showMessage(`Failed to fetch data from ${endpoint}.`, true);
        console.error("Fetch error:", error);
        return null;
    }
}

async function sendData(endpoint, method, data = null) {
    try {
        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method !== 'GET' && method !== 'DELETE') {
            fetchOptions.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

        if (response.status === 204) { // No Content, typical for successful DELETE
             return { success: true };
        }
        
        // Try to parse JSON, even on errors, if response is not 204
        const responseData = await response.json();

        if (!response.ok) {
            // Throw API error response details (e.g., from Spring Validation/Error Handler)
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
        }
        
        return responseData; // Return the parsed JSON body
    } catch (error) {
        showMessage(`Operation Failed. Check console for details.`, true);
        console.error("API call error:", error);
        return null;
    }
}

// --- Form/Modal Helpers ---

function showModal(id) {
    document.getElementById(id).classList.add('active');
}

function hideModal(id) {
    document.getElementById(id).classList.remove('active');
    // Optionally reset form state
}

// --- TEAM CRUD Logic (Used in teams.html) ---

function createTeamRowHTML(team) {
    return `
        <tr>
            <td data-label="ID">${team.id}</td>
            <td data-label="Team Name">${team.teamName}</td>
            <td data-label="Institute Name">${team.instituteName || 'N/A'}</td>
            <td data-label="Captain">${team.captain}</td>
            <td data-label="Vice Captain">${team.viceCaptain || 'N/A'}</td>
            <td data-label="Actions" class="action-cell">
                <button onclick="prepareTeamFormForEdit(${team.id})" class="btn btn-info btn-sm">Edit</button>
                <button onclick="handleDeleteTeam(${team.id})" class="btn btn-danger btn-sm">Delete</button>
            </td>
        </tr>
    `;
}

function renderTeamsTable(teams) {
    const tableBody = document.getElementById('teams-table-body');
    if (!tableBody || !teams) return;
    
    // Crucial: Clear the table before re-rendering
    tableBody.innerHTML = teams.map(createTeamRowHTML).join('');
}

async function loadTeams() {
    const teams = await fetchData('/teams'); // GET /api/teams
    renderTeamsTable(teams);
}

function prepareTeamFormForNew() {
    document.getElementById('team-form-title').textContent = 'Add New Team';
    document.getElementById('team-id').value = '';
    document.getElementById('team-form').reset();
    showModal('team-modal');
}

async function prepareTeamFormForEdit(id) {
    const team = await fetchData(`/teams/${id}`); // GET /api/teams/{id}
    if (team) {
        document.getElementById('team-form-title').textContent = 'Edit Team';
        document.getElementById('team-id').value = team.id;
        document.getElementById('teamName').value = team.teamName;
        document.getElementById('instituteName').value = team.instituteName;
        document.getElementById('captain').value = team.captain;
        document.getElementById('viceCaptain').value = team.viceCaptain;
        showModal('team-modal');
    }
}

async function handleTeamFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('team-id').value;
    
    const teamData = {
        teamName: document.getElementById('teamName').value,
        instituteName: document.getElementById('instituteName').value,
        captain: document.getElementById('captain').value,
        viceCaptain: document.getElementById('viceCaptain').value,
    };

    let result;
    if (id) {
        // PUT /api/teams/{id}
        result = await sendData(`/teams/${id}`, 'PUT', teamData);
    } else {
        // POST /api/teams
        result = await sendData('/teams', 'POST', teamData);
    }

    if (result) {
        hideModal('team-modal');
        showMessage(`Team ${id ? 'updated' : 'created'} successfully!`);
        // FIX: Always reload the list after creation/edit
        loadTeams(); 
    }
}

async function handleDeleteTeam(id) {
    if (!confirm(`Are you sure you want to delete Team ID ${id}? This will also remove associated players.`)) {
        return;
    }
    const result = await sendData(`/teams/${id}`, 'DELETE'); 
    if (result && result.success) {
        // FIX: Rely on reloading the list to refresh the UI
        loadTeams(); 
        showMessage(`Team ID ${id} deleted successfully.`);
    }
}

// --- PLAYER CRUD Logic (Used in players.html) ---

// Storage for team data to populate dropdown without re-fetching
let allTeams = []; 

function createPlayerRowHTML(player) {
    // Handling the nested Team object
    const teamName = player.team ? player.team.teamName : 'Unassigned';

    return `
        <tr>
            <td data-label="ID">${player.id}</td>
            <td data-label="Name">${player.name}</td>
            <td data-label="Reg. No.">${player.registrationNumber}</td>
            <td data-label="Branch / Year">${player.branch} / ${player.year}</td>
            <td data-label="Mobile">${player.mobileNumber}</td>
            <td data-label="Team">${teamName}</td>
            <td data-label="Actions" class="action-cell">
                <button onclick="preparePlayerFormForEdit(${player.id})" class="btn btn-info btn-sm">Edit</button>
                <button onclick="handleDeletePlayer(${player.id})" class="btn btn-danger btn-sm">Delete</button>
            </td>
        </tr>
    `;
}

function renderPlayersTable(players) {
    const tableBody = document.getElementById('players-table-body');
    if (!tableBody || !players) return;
    
    // Crucial: Clear the table before re-rendering
    tableBody.innerHTML = players.map(createPlayerRowHTML).join('');
}

function populateTeamDropdown(teams, selectedTeamId = null) {
    allTeams = teams; // Store globally
    const dropdown = document.getElementById('teamId');
    dropdown.innerHTML = '<option value="">-- Select Team --</option>';

    if (teams) {
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.teamName;
            if (selectedTeamId && team.id == selectedTeamId) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    }
}

async function loadPlayers() {
    // Load teams first for the dropdown, then load players
    const teams = await fetchData('/teams');
    populateTeamDropdown(teams); // Populate team list in background

    const players = await fetchData('/players'); // GET /api/players
    renderPlayersTable(players);
}

function preparePlayerFormForNew() {
    document.getElementById('player-form-title').textContent = 'Add New Player';
    document.getElementById('player-id').value = '';
    document.getElementById('player-form').reset();
    populateTeamDropdown(allTeams); // Repopulate dropdown with no selection
    showModal('player-modal');
}

async function preparePlayerFormForEdit(id) {
    const player = await fetchData(`/players/${id}`); // GET /api/players/{id}
    if (player) {
        document.getElementById('player-form-title').textContent = 'Edit Player';
        document.getElementById('player-id').value = player.id;
        document.getElementById('playerName').value = player.name;
        document.getElementById('registrationNumber').value = player.registrationNumber;
        document.getElementById('branch').value = player.branch;
        document.getElementById('section').value = player.section;
        document.getElementById('year').value = player.year;
        document.getElementById('mobileNumber').value = player.mobileNumber;
        
        // Repopulate dropdown with the current team selected
        const selectedTeamId = player.team ? player.team.id : null;
        populateTeamDropdown(allTeams, selectedTeamId);

        showModal('player-modal');
    }
}

async function handlePlayerFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('player-id').value;
    const teamId = document.getElementById('teamId').value;
    
    const playerData = {
        name: document.getElementById('playerName').value,
        registrationNumber: document.getElementById('registrationNumber').value,
        branch: document.getElementById('branch').value,
        section: document.getElementById('section').value,
        year: document.getElementById('year').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        // CRUCIAL: Send only the Team ID to link the player
        team: teamId ? { id: teamId } : null
    };

    let result;
    if (id) {
        // PUT /api/players/{id}
        result = await sendData(`/players/${id}`, 'PUT', playerData);
    } else {
        // POST /api/players
        result = await sendData('/players', 'POST', playerData);
    }

    if (result) {
        hideModal('player-modal');
        showMessage(`Player ${id ? 'updated' : 'created'} successfully!`);
        // FIX: Always reload the list after creation/edit
        loadPlayers(); 
    }
}

async function handleDeletePlayer(id) {
    if (!confirm(`Are you sure you want to delete Player ID ${id}?`)) {
        return;
    }
    const result = await sendData(`/players/${id}`, 'DELETE');
    if (result && result.success) {
        // FIX: Rely on reloading the list to refresh the UI
        loadPlayers(); 
        showMessage(`Player ID ${id} deleted successfully.`);
    }
}