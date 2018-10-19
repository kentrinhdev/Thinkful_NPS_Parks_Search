'use strict';

function loadDropdown() {
  for (let i = 1; i <= 50; i++) {
    $('#js-max-limit').append($('<option></option>').val(i).html(i));
  }
  // Set default selection
  $('select option[value="10"]').attr("selected", true);
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

  return queryItems.join("&");
}

function getApiData(searchTerm, apiKey, maxLimit, baseUrl) {
  const params = {
    q: searchTerm,
    fields: "addresses",
    api_key: apiKey,
    limit: maxLimit,
  };
  const queryString = formatQueryParams(params);
  const url = baseUrl + "?" + queryString;

  console.log('url: ', url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      // Empty out the previous results
      $('#results-list').empty();
      // Hide the results section  
      $('#results').addClass('hidden');

      $('#js-error-message').text(`Oh No!: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();

    const searchTerm = $('#js-search-term').val();
    const apiKey = STORE.apiKey;
    const maxLimit = ($('#js-max-limit').val()) - 1;
    const baseUrl = STORE.baseUrl;

    getApiData(searchTerm, apiKey, maxLimit, baseUrl);
  });
}

function displayResults(responseJson) {
  // Empty out the previous results
  $('#results-list').empty();
  $('#js-error-message').empty();
  
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li>
        <h3>${responseJson.data[i].fullName}</h3>
        <p class="address-info">${responseJson.data[i].addresses[0].line1}</p>
        <p class="address-info">${responseJson.data[i].addresses[0].line2}</p>
        <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
        <p>Description: ${responseJson.data[i].description}</p>
        <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
      </li>`
    )};

  // Show the results section  
  $('#results').removeClass('hidden');
};

$(loadDropdown);
$(watchForm);