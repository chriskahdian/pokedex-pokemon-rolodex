// -things to change when re-writing as jQuery:
// 	-document.querySelector
// 	-add/remove class
// 	-chaining functions
// 	-forEach => each()
// 	-document.createElement
// 	-appendChild
// 	-event handling
// 	-fetch

var pokemonRepository = function () {
  var pokemonList = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      function showModal(title, text, image) {
        var modalContainer = $(".modal-container");

        var modal = $('<div class="modal"></div>');

        var closeButtonElement = $(
          '<button class="modal-close">close</button>'
        );
        $(modal).append(closeButtonElement);
        //NOTE - can I chain the below event listener to the above element?
        $(".modal-close").on("click", function (event) {
          hideModal();
        });

        var titleElement = $("<h1>title</h1>");
        $(modal).append(titleElement);

        var contentElement = $("<p>text</p>");
        $(modal).append(contentElement);

        //NOTE - not sure if I did the image one right
        var imageElement = $("<img src=image></img>");
        $(modal).append(imageElement);

        modalContainer.addClass("is-visible");

        $('window').on("keydown", (event) => {
            console.log(modalContainer.classList);
            if (e.key === "Escape" && modalContainer.classList.contains('is-visible')) {
                hideModal();
            };
        });

        $(modalContainer).on('click', (event) => {
            var target = event.target;
            if (target === modalContainer) {
                hideModal();
            };
        });

         function hideModal() {
             var modalContainer = $('.modal-container');
             $(modalContainer).removeClass('.is-visible')
             $('modal').remove()
         };
      };
      showModal(pokemon.name, "height: " + pokemon.height, pokemon.imageUrl);
    });
  };
  function addListItem(pokemon){
      var ul = $('.pokemon-list');

      var listItem = $(<li></li>);
      $(ul).append(listItem)

      var button = $(<button class="poke-button">pokemon.name</button>);
      $(listItem).append(button)

      $(button).on('click', function (event){
          showDetails(pokemon);
      });
  };
  function loadList() {
      $.ajax(apiUrl, { dataType: 'json' }).then(function(response) {
          console.log(responseJSON);
      })
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
      return $.ajax(url, { dataType: 'json' }).then(function(responseJSON){
          console.log(responseJSON);
      })
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

    return {
        add:add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
    };
      };
  }
};

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });