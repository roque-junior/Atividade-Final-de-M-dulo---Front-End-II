
let currentpage = 1;
 


function loadCharacters(page) {
    axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)
      .then(response => {
        
        const characters = response.data.results;
        fetchLastEpisodeForCharacters(characters);
      })
     .catch(error => {
        console.error('Erro ao obter os personagens:', error);
      });
   }
  
   function fetchLastEpisodeForCharacters(characters) {
    const episodePromises = characters.map(character => {
      const lastEpisodeUrl = character.episode[character.episode.length - 1];
      return axios.get(lastEpisodeUrl);
    });
  
    Promise.all(episodePromises)
      .then(episodesResponses => {
        episodesResponses.forEach((response, index) => {
          const episodeName = response.data.name; 
                const episodeNumber = response.data.episode; 

                characters[index].lastEpisode = {
                    name: episodeName,
                    episode: episodeNumber
                };
            });

            renderCharacters(characters);
           
        })
        .catch(error => {
            console.error('Erro ao obter informações de episódio:', error);
        });
}

function proximo() {
    currentpage++
    loadCharacters(currentpage);
}


function retornar(){
    if (currentpage > 1) {
        currentpage--
        loadCharacters(currentpage);
    }
}


// Função para renderizar os personagens
function renderCharacters(characters) {
    const characterList = document.querySelector('#character-list');
    console.log(characterList)
    characterList.innerHTML = "";
    
    characters.forEach(character => {
      const characterCard = document.createElement('div');
      characterCard.classList.add('character-card'); // Adicione classes para estilização
  
      const characterImage = document.createElement('img');
      characterImage.src = character.image;
  
      const characterInfo = document.createElement('div');

      

      characterInfo.innerHTML = `
      <h2 class=nome>${character.name ? character.name : 'Nome Desconhecido'}</h2>
    <p> <span class="status-dot ${character.status.toLowerCase()}"></span>
    ${character.status} - ${character.species}</p>
    <p>Last Known Location: </p>
    ${character.location.name}
    <p>Last seen on:</p>
    ${character.lastEpisode.name} 
    `;
  
      characterCard.appendChild(characterImage);
      characterCard.appendChild(characterInfo);
  
      characterList.appendChild(characterCard);
    });
  }
  


// Função para pesquisar personagens pelo nome
function ProcurarPerso() {
  const input = document.getElementById("input");
  const ProcurarPers = input.value;

  if (ProcurarPers !== "") {
      axios.get(`https://rickandmortyapi.com/api/character/?name=${ProcurarPers}`)
      .then(response => {
          const character = response.data.results;
          renderCharacters(character);
          console.log(response)
      })
       .catch(error => {
          console.error('Erro ao buscar personagens:', error);
      });
  }
}



  loadCharacters(currentpage);
 
  