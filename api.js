const BASE_URL = "https://rickandmortyapi.com/api";

async function getCharacteresFromApi(id_list) {
  try {
    const data = await fetch(`${BASE_URL}/character/${id_list}`);

    const json_list = await data.json();

    return json_list;
  } catch (error) {
    console.log(error);
  }
}

let dataFacil = [];
let dataIntermediario = [];
let dataDificil = [];

function getCharacters() {
  let id_list = [];

  while (id_list.length < 12) {
    id_list.push(id_list.length + 1);

    if (id_list.length === 6) {
      getCharacteresFromApi(id_list).then((resp) => (dataFacil = [...resp]));
    } else if (id_list.length === 9) {
      getCharacteresFromApi(id_list).then(
        (resp) => (dataIntermediario = [...resp])
      );
    } else if (id_list.length === 12) {
      getCharacteresFromApi(id_list).then((resp) => (dataDificil = [...resp]));
    }
  }
}

getCharacters();
