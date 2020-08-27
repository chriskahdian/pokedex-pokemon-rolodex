var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function add(pokemon) {
    repository.push(pokemon);
  }
  function getAll() {
    return repository;
  }
  function addListItem(pokemon = {}) {
    var $pokemonList = $(".pokemon-list");
    var $listItem = $("<li>");
    var $button = $(
      "<button class='poke-button'>" + pokemon.name + "</button>"
    );
    $listItem.append($button);
    $pokemonList.append($listItem);
    $button.on("click", function (event) {
      showDetails(pokemon);
    });
  }
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      console.log(item);
      showModal(item);
    });
  }
  function loadList() {
    return $.ajax(apiUrl)
      .then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function (event) {
        console.error(event);
      });
  }
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
        item.height = details.height;
        item.types = [];
        details.types.forEach(function (i) {
          item.types.push(i.type.name);
        });
        item.abilities = [];
        details.abilities.forEach(function (i) {
          item.abilities.push(i.ability.name);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  function showModal(item) {
    var $modalContainer = $(".modal-container");
    var modal = $('<div class="modal"></div>');
    var closeButtonElement = $('<button class="modal-close">close</button>');
    closeButtonElement.on("click", hideModal);
    var nameElement = $("<h1>" + item.name + "</h1>");
    var imageElement = $("<img class='modal-img'>");
    imageElement.attr("src", item.imageUrl);
    var heightElement = $("<p>" + "height: " + item.height + "</p>");
    modal.append(closeButtonElement);
    modal.append(nameElement);
    modal.append(heightElement);
    modal.append(imageElement);
    $modalContainer.append(modal);
    $modalContainer.addClass("is-visible");
  }
  function hideModal() {
    var $modalContainer = $(".modal-container");
    $modalContainer.removeClass("is-visible");
    $modalContainer.empty();
  }
  $(window).on("keydown", (event) => {
    if (event.key === "Escape") {
      hideModal();
    }
  });
  var $modalContainer = document.querySelector(".modal-container");
  $modalContainer.addEventListener("click", (event) => {
    var target = event.target;
    if (target === $modalContainer) {
      hideModal();
    }
  });
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
