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
      '<button type="button"' +
        'class="btn btn-primary"' +
        'data-toggle="modal"' +
        'data-target="#exampleModal">' +
        pokemon.name +
        "</button>"
    );
    $listItem.append($button);
    $pokemonList.append($listItem);
    // $button.on("click", function (event) {
    //   showDetails(pokemon);
    // });
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
    // var $modalContainer = $("#modal-container");
    //clear existing content of the model
    // modalHeader.empty();
    modalTitle.empty();
    modalBody.empty();

    //creating element for name in modal content
    var nameElement = $("<h1>" + item.name + "</h1>");
    // // creating img in modal content
    var imageElement = $('<img class="modal-img" style="width:50%">');
    imageElement.attr("src", item.imageUrl);
    var imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr("src", item.imageUrlBack);
    // //creating element for height in modal content
    var heightElement = $("<p>" + "height : " + item.height + "</p>");
    // //creating element for type in modal content
    var typesElement = $("<p>" + "types : " + item.types + "</p>");
    // //creating element for abilities in modal content
    var abilitiesElement = $("<p>" + "abilities : " + item.abilities + "</p>");

    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(typesElement);
    modalBody.append(abilitiesElement);
  }

  // function showModal(item) {
  //   var $modalContainer = $(".modal-container");
  //   var modal =
  //     '<div class="modal-dialog" role="document">' +
  //     '<div class="modal-content">' +
  //     '<div class="modal-header">' +
  //     '<h1 class="modal-title">' +
  //     item.name +
  //     "</h1>" +
  //     '<button class="btn close modal-close" data-dismiss="modal">close</button>' +
  //     "</div>" +
  //     '<div class="modal-body">' +
  //     '<img class="modal-img" src=item.imageUrl>' +
  //     "<p>" +
  //     "height: " +
  //     item.height +
  //     "</p>" +
  //     "</div>" +
  //     "</div>" +
  //     "</div>";
  //   // closeButtonElement.on("click", hideModal);
  //   // var nameElement = $("<h1>" + item.name + "</h1>");
  //   // var imageElement = $("<img class='modal-img'>");
  //   // imageElement.attr("src", item.imageUrl);
  //   // var heightElement = $("<p>" + "height: " + item.height + "</p>");
  //   // modal.append(closeButtonElement);
  //   // modal.append(nameElement);
  //   // modal.append(heightElement);
  //   // modal.append(imageElement);
  //   $modalContainer.append(modal);
  //   $modalContainer.addClass("is-visible");
  // }
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
