const apiUrl = 'https://api.fda.gov/drug/enforcement.json?search=product_description:ibuprofen&limit=5';
const tableBody = document.getElementById('resultado');

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    populateTable(data);
  })
  .catch(error => {
    console.error('Erro:', error);
    alert('Ocorreu um erro ao buscar os dados. Por favor, tente novamente mais tarde.');
  });

function populateTable(data) {
  tableBody.innerHTML = '';

  data.results.forEach(result => {
    const newRow = tableBody.insertRow();
    const dateCell = newRow.insertCell();
    const reasonCell = newRow.insertCell();
    const productCell = newRow.insertCell();

    dateCell.textContent = new Date(result.recall_initiation_date).toLocaleDateString();
    reasonCell.textContent = result.reason_for_recall;
    productCell.textContent = result.product_description;
  });
}