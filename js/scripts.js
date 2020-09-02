var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function add(pokemon) {
    repository.push(pokemon);
  }
  function getAll() {
    return repository;
  }
  function addListItem(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      var $row = $(".row");
      var $card = $('<div class="card" style="width:400px"></div>');
      var $image = $(
        '<img class="card-img-top" alt="Card image" style="width:20%" />'
      );
      $image.attr("src", pokemon.imageUrl);
      var $cardBody = $('<div class="card-body"></div>');
      var $cardTitle = $("<h4 class='card-title' >" + pokemon.name + "</h4>");
      var $seeProfile = $(
        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#Modal">See Profile</button>'
      );
      $row.append($card);
      $card.append($image);
      $card.append($cardBody);
      $cardBody.append($cardTitle);
      $cardBody.append($seeProfile);
      $seeProfile.on("click", function (event) {
        showDetails(pokemon);
      });
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
    var modalBody = $(".modal-body");
    var modalTitle = $(".modal-title");
    var modalHeader = $(".modal-header");
    modalTitle.empty();
    modalBody.empty();
    var nameElement = $("<h1>" + item.name + "</h1>");
    var imageElement = $('<img class="modal-img" style="width:50%">');
    imageElement.attr("src", item.imageUrl);
    var imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr("src", item.imageUrlBack);
    var heightElement = $("<p>" + "height : " + item.height + "</p>");
    var typesElement = $("<p>" + "types : " + item.types + "</p>");
    var abilitiesElement = $("<p>" + "abilities : " + item.abilities + "</p>");
    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(typesElement);
    modalBody.append(abilitiesElement);
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
  $("body").click(function () {
    if ($(".modal-container").is(":visible")) {
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
