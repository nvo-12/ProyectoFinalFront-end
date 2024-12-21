// URL de la API
const API_URL = 'https://dog.ceo/api/breeds/list/all';

// Categorías de tamaños
const SIZE_CATEGORIES = {
    small: [
        'chihuahua', 'pomeranian', 'yorkshire', 'maltese',  
        'boston terrier', 'miniature pinscher', 'toy poodle'
    ],
    medium: [
        'beagle', 'bulldog', 'corgi', 'shiba inu', 'border collie', 
        'whippet', 'australian shepherd', 'standard schnauzer'
    ],
    large: [
        'german shepherd', 'golden retriever', 'labrador retriever', 
        'rottweiler', 'doberman', 'bernese mountain dog', 'great dane', 'siberian husky'
    ]
}

// Función para obtener la lista de razas
async function fetchDogBreeds() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
        }
        const data = await response.json();
        return Object.keys(data.message);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Función para obtener una imagen de una raza específica
async function fetchDogImage(breed) {
    const imageURL = `https://dog.ceo/api/breed/${breed}/images/random`;
    try {
        const response = await fetch(imageURL);
        if (!response.ok) {
            throw new Error(`Error al obtener la imagen para la raza ${breed}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para clasificar las razas según el tamaño
function classifyBreeds(breeds) {
    const classified = {
        small: [],
        medium: [],
        large: []
    };

    breeds.forEach(breed => {
        if (SIZE_CATEGORIES.small.includes(breed)) {
            classified.small.push(breed);
        } else if (SIZE_CATEGORIES.medium.includes(breed)) {
            classified.medium.push(breed);
        } else if (SIZE_CATEGORIES.large.includes(breed)) {
            classified.large.push(breed);
        }
    });

    return classified;
}

// Renderizar resultados en el DOM
async function renderDogs(filterSize, breedFilter = '') {
    const container = document.getElementById('dog-container');
    container.innerHTML = ''; // Limpia los resultados previos

    // Obtener la lista de razas
    const breeds = await fetchDogBreeds();
    const classifiedBreeds = classifyBreeds(breeds);

    // Obtener razas filtradas
    const filteredBreeds = filterSize ? classifiedBreeds[filterSize] : breeds;
    const displayBreeds = filteredBreeds.slice(0, 8); // Limitar a 8 resultados

    let found = false;

    for (const breed of displayBreeds) {
        // Filtrar por raza específica si aplica
        if (breedFilter && !breed.toLowerCase().includes(breedFilter.toLowerCase())) {
            continue;
        }

        found = true; // Marca que hay resultados

        const image = await fetchDogImage(breed);
        if (image) {
            const card = createDogCard(breed, image);
            container.appendChild(card);
        }
    }

    // Si no se encuentra ninguna raza
    if (!found) {
        container.innerHTML = `<p>No se encontraron perros con los criterios seleccionados.</p>`;
    }
}

// Crear tarjeta de perro
function createDogCard(breed, image) {
    const card = document.createElement('div');
    card.classList.add('dog-card');
    card.innerHTML = `<img src="${image}" alt="${breed}"><h3>${breed}</h3>`;
    return card;
}

// Manejador del formulario de filtros
document.getElementById('filter-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const homeType = document.getElementById('home-type').value;
    const breed = document.getElementById('breed').value.trim();

    // Si no se ingresa raza, busca solo por tipo de domicilio
    renderDogs(homeType, breed || '');
});

// Render inicial (sin filtros)
renderDogs();
