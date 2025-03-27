fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:"Tylenol"&limit=5')
  .then(response => response.json())
  .then(data => {
    const resultadosDiv = document.getElementById('resultados');

    data.results.forEach(result => {
      const card = document.createElement('div');
      card.classList.add('card', 'mt-3');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      cardBody.innerHTML = `
        <h5 class="card-title">${result.openfda.brand_name}</h5>
        <p class="card-text">${result.purpose}</p>
      `;

      card.appendChild(cardBody);
      resultadosDiv.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erro ao buscar dados:', error);
  });